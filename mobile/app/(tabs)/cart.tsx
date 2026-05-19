import AddressSelectionModal from "@/components/AddressSelectionModal";
import OrderSummary from "@/components/OrderSummary";
import PaymentMethodModal, {
  PaymentMethod,
} from "@/components/PaymentMethodModal";
import SafeScreen from "@/components/SafeScreen";
import { useAddresses } from "@/hooks/useAddressess";
import useCart from "@/hooks/useCart";
import { useApi } from "@/lib/api";
import { Address } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { useStripe } from "@stripe/stripe-react-native";
import { Image } from "expo-image";
import * as WebBrowser from "expo-web-browser";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import * as Sentry from "@sentry/react-native";
import axios from "axios";
import { formatPrice } from "@/components/format-price";

const CartScreen = () => {
  const api = useApi();
  const {
    cart,
    cartItemCount,
    cartTotal,
    clearCart,
    isError,
    isLoading,
    isRemoving,
    isUpdating,
    removeFromCart,
    updateQuantity,
  } = useCart();
  const { addresses } = useAddresses();

  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const [paymentLoading, setPaymentLoading] = useState(false);
  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const [paymentMethodModalVisible, setPaymentMethodModalVisible] =
    useState(false);

  // Temporarily hold the address chosen in step 1 until the user picks a method in step 2
  const [pendingAddress, setPendingAddress] = useState<Address | null>(null);

  const cartItems = Array.isArray(cart?.items) ? cart.items : [];
  const subtotal = cartTotal;
  const shipping = 650;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  // ─── Quantity / Remove helpers ────────────────────────────────────────────

  const handleQuantityChange = (
    productId: string,
    currentQuantity: number,
    change: number,
  ) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity < 1) return;
    updateQuantity({ productId, quantity: newQuantity });
  };

  const handleRemoveItem = (productId: string, productName: string) => {
    Alert.alert("Remove Item", `Remove ${productName} from cart?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => removeFromCart(productId),
      },
    ]);
  };

  // ─── Step 1 : Checkout button pressed ────────────────────────────────────

  const handleCheckout = () => {
    if (cartItems.length === 0) return;

    if (!addresses || addresses.length === 0) {
      Alert.alert(
        "No Address",
        "Please add a shipping address in your profile before checking out.",
        [{ text: "OK" }],
      );
      return;
    }

    setAddressModalVisible(true);
  };

  // ─── Step 2 : Address confirmed → open payment method picker ─────────────

  const handleAddressSelected = (selectedAddress: Address) => {
    setAddressModalVisible(false);
    setPendingAddress(selectedAddress);
    setPaymentMethodModalVisible(true);
  };

  // ─── Step 3 : User picked a payment method ────────────────────────────────

  const handlePaymentMethodSelected = async (method: PaymentMethod) => {
    setPaymentMethodModalVisible(false);
    if (!pendingAddress) return;

    switch (method) {
      case "card":
        await handleStripePayment(pendingAddress);
        break;
      case "slickpay":
        await handleSlickPayPayment(pendingAddress);
        break;
      case "delivery":
        await handleCashOnDelivery(pendingAddress);
        break;
    }
  };

  // ─── Cash on Delivery ─────────────────────────────────────────────────────

  const handleCashOnDelivery = async (address: Address) => {
    try {
      setPaymentLoading(true);

      Sentry.logger.info("Cash on delivery initiated", {
        itemCount: cartItemCount,
        total: total,
        city: address.city,
      });

      await api.post("/orders", {
        orderItems: cartItems,
        shippingAddress: buildShippingPayload(address),
        paymentResult: { paymentMethod: "cash_on_delivery", status: "pending" },
        totalPrice: total,
      });

      Sentry.logger.info("Cash on delivery order placed", {
        total: total,
        itemCount: cartItems.length,
      });

      Alert.alert(
        "Order Placed! 🎉",
        "Your order has been placed. You'll pay when it arrives.",
        [{ text: "OK", onPress: () => clearCart() }],
      );
    } catch (error: any) {
      // Extract the most useful message available
      const serverMessage =
        error?.response?.data?.message || // axios-style error body
        error?.message ||
        "Unknown error";

      Sentry.logger.error("Cash on delivery failed", {
        error: serverMessage,
        status: error?.response?.status,
        cartTotal: total,
      });

      // Show the real reason to help with debugging
      Alert.alert(
        "Order Failed",
        __DEV__
          ? `[DEV] ${error?.response?.status ?? ""} ${serverMessage}`
          : "Failed to place your order. Please try again.",
      );
    } finally {
      setPaymentLoading(false);
    }
  };

  // ─── Stripe card payment ──────────────────────────────────────────────────

  const handleStripePayment = async (address: Address) => {
    Sentry.logger.info("Checkout initiated (card)", {
      itemCount: cartItemCount,
      total: total,
      city: address.city,
    });

    try {
      setPaymentLoading(true);

      const { data } = await api.post("/payment/create-intent", {
        cartItems,
        shippingAddress: buildShippingPayload(address),
      });

      const { error: initError } = await initPaymentSheet({
        paymentIntentClientSecret: data.clientSecret,
        merchantDisplayName: "Your Store Name",
      });

      if (initError) {
        Sentry.logger.error("Payment sheet init failed", {
          errorCode: initError.code,
          errorMessage: initError.message,
        });
        Alert.alert("Error", initError.message);
        return;
      }

      const { error: presentError } = await presentPaymentSheet();

      if (presentError) {
        Sentry.logger.error("Payment cancelled", {
          errorCode: presentError.code,
          errorMessage: presentError.message,
        });
        Alert.alert("Payment cancelled", presentError.message);
      } else {
        Sentry.logger.info("Card payment successful", {
          total: total,
          itemCount: cartItems.length,
        });
        Alert.alert(
          "Success",
          "Your payment was successful! Your order is being processed.",
          [{ text: "OK", onPress: () => clearCart() }],
        );
      }
    } catch (error) {
      Sentry.logger.error("Card payment failed", {
        error: error instanceof Error ? error.message : "Unknown error",
        cartTotal: total,
      });
      Alert.alert("Error", "Failed to process payment");
    } finally {
      setPaymentLoading(false);
    }
  };

  // ─── SlickPay ─────────────────────────────────────────────────────────────

  const handleSlickPayPayment = async (address: Address) => {
    const SLICKPAY_KEY = process.env.EXPO_PUBLIC_SLICKPAY_KEY!;
    try {
      setPaymentLoading(true);

      const { data } = await axios.post(
        "https://devapi.slick-pay.com/api/v2/users/invoices",
        {
          amount: Math.round(total),
          url: "https://dabarli.onrender.com/api/health",
          items: cartItems.map((item) => ({
            name: item.product.name,
            price: Math.round(item.product.price),
            quantity: item.quantity,
          })),
          firstname: address.fullName.split(" ")[0] || "Client",
          lastname: address.fullName.split(" ").slice(1).join(" ") || ".",
          phone: address.phoneNumber,
          address: `${address.streetAddress}, ${address.city}`,
        },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${SLICKPAY_KEY}`,
          },
        },
      );

      if (!data.url) throw new Error("No checkout URL returned");

      const invoiceId = data.id;
      const checkoutUrl = data.url;

      await WebBrowser.openBrowserAsync(checkoutUrl, {
        presentationStyle: WebBrowser.WebBrowserPresentationStyle.FULL_SCREEN,
      });

      // Poll status directly from app
      let paid = false;
      for (let attempt = 0; attempt < 10; attempt++) {
        await new Promise((r) => setTimeout(r, 2000));

        const { data: statusData } = await axios.get(
          `https://devapi.slick-pay.com/api/v2/users/invoices/${invoiceId}`,
          {
            headers: {
              Authorization: `Bearer ${SLICKPAY_KEY}`,
              Accept: "application/json",
            },
          },
        );

        if (statusData.completed === 1) {
          paid = true;
          await api.post("/orders", {
            orderItems: cartItems,
            shippingAddress: buildShippingPayload(address),
            paymentResult: { paymentMethod: "cib payment", status: "paid" },
            totalPrice: total,
          });
          clearCart();
          break;
        }
      }

      if (paid) {
        Alert.alert(
          "Payment Successful! 🎉",
          "Your order is being processed.",
          [{ text: "OK", onPress: () => clearCart() }],
        );
      } else {
        Alert.alert("Payment Pending", "Check your orders shortly.");
      }
    } catch (error: any) {
      console.log(
        "SlickPay error details:",
        JSON.stringify(error?.response?.data),
      );
      Alert.alert(
        "Payment Failed",
        __DEV__ ? JSON.stringify(error?.response?.data) : "Please try again.",
      );
    } finally {
      setPaymentLoading(false);
    }
  };

  // ─── Shared helper ────────────────────────────────────────────────────────

  const buildShippingPayload = (address: Address) => ({
    fullName: address.fullName,
    streetAddress: address.streetAddress,
    city: address.city,
    state: address.state,
    zipCode: address.zipCode,
    phoneNumber: address.phoneNumber,
  });

  // ─── Render ───────────────────────────────────────────────────────────────

  if (isLoading) return <LoadingUI />;
  if (isError) return <ErrorUI />;
  if (cartItems.length === 0) return <EmptyUI />;

  return (
    <SafeScreen>
      <Text className="px-6 pb-5 text-text-primary text-3xl font-bold tracking-tight">
        Cart
      </Text>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 240 }}
      >
        <View className="px-6 gap-2">
          {cartItems
            .filter((item) => item?.product)
            .map((item) => (
              <View
                key={item._id}
                className="bg-surface rounded-3xl overflow-hidden"
              >
                <View className="p-4 flex-row">
                  {/* Product image */}
                  <View className="relative">
                    <Image
                      source={item.product.images[0]}
                      className="bg-background-lighter"
                      contentFit="cover"
                      style={{ width: 112, height: 112, borderRadius: 16 }}
                    />
                    <View className="absolute top-2 right-2 bg-primary rounded-full px-2 py-0.5">
                      <Text className="text-background text-xs font-bold">
                        ×{item.quantity}
                      </Text>
                    </View>
                  </View>

                  <View className="flex-1 ml-4 justify-between">
                    <View>
                      <Text
                        className="text-text-primary font-bold text-lg leading-tight"
                        numberOfLines={2}
                      >
                        {item.product.name}
                      </Text>
                      <View className="flex-row items-center mt-2">
                        <Text className="text-primary font-bold text-2xl">
                          {formatPrice(item.product.price * item.quantity)}
                        </Text>
                        <Text className="text-text-secondary text-sm">
                          {formatPrice(item.product.price)}
                        </Text>
                      </View>
                    </View>

                    <View className="flex-row items-center mt-3">
                      {/* Decrease */}
                      <TouchableOpacity
                        className="bg-background-lighter rounded-full w-9 h-9 items-center justify-center"
                        activeOpacity={0.7}
                        onPress={() =>
                          handleQuantityChange(
                            item.product._id,
                            item.quantity,
                            -1,
                          )
                        }
                        disabled={isUpdating}
                      >
                        {isUpdating ? (
                          <ActivityIndicator size="small" color="#FFFFFF" />
                        ) : (
                          <Ionicons name="remove" size={18} color="#FFFFFF" />
                        )}
                      </TouchableOpacity>

                      <View className="mx-4 min-w-[32px] items-center">
                        <Text className="text-text-primary font-bold text-lg">
                          {item.quantity}
                        </Text>
                      </View>

                      {/* Increase */}
                      <TouchableOpacity
                        className="bg-primary rounded-full w-9 h-9 items-center justify-center"
                        activeOpacity={0.7}
                        onPress={() =>
                          handleQuantityChange(
                            item.product._id,
                            item.quantity,
                            1,
                          )
                        }
                        disabled={isUpdating}
                      >
                        {isUpdating ? (
                          <ActivityIndicator size="small" color="#121212" />
                        ) : (
                          <Ionicons name="add" size={18} color="#121212" />
                        )}
                      </TouchableOpacity>

                      {/* Remove */}
                      <TouchableOpacity
                        className="ml-auto bg-red-500/10 rounded-full w-9 h-9 items-center justify-center"
                        activeOpacity={0.7}
                        onPress={() =>
                          handleRemoveItem(item.product._id, item.product.name)
                        }
                        disabled={isRemoving}
                      >
                        <Ionicons
                          name="trash-outline"
                          size={18}
                          color="#EF4444"
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            ))}
        </View>

        <OrderSummary
          subtotal={subtotal}
          shipping={shipping}
          tax={tax}
          total={total}
        />
      </ScrollView>

      {/* Sticky bottom bar */}
      <View
        className="absolute bottom-0 left-0 right-0 bg-background/95 backdrop-blur-xl border-t
       border-surface pt-4 pb-32 px-6"
      >
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center">
            <Ionicons name="cart" size={20} color="#1DB954" />
            <Text className="text-text-secondary ml-2">
              {cartItemCount} {cartItemCount === 1 ? "item" : "items"}
            </Text>
          </View>
          <Text className="text-text-primary font-bold text-xl">
            {formatPrice(total)}
          </Text>
        </View>

        <TouchableOpacity
          className="bg-primary mb-3  rounded-2xl overflow-hidden"
          activeOpacity={0.9}
          onPress={handleCheckout}
          disabled={paymentLoading}
        >
          <View className="py-5 flex-row items-center justify-center">
            {paymentLoading ? (
              <ActivityIndicator size="small" color="#121212" />
            ) : (
              <>
                <Text className="text-background font-bold text-lg mr-2">
                  Checkout
                </Text>
                <Ionicons name="arrow-forward" size={20} color="#121212" />
              </>
            )}
          </View>
        </TouchableOpacity>
      </View>

      {/* Step 1 – Address */}
      <AddressSelectionModal
        visible={addressModalVisible}
        onClose={() => setAddressModalVisible(false)}
        onProceed={handleAddressSelected} // ← changed from handleProceedWithPayment
        isProcessing={paymentLoading}
      />

      {/* Step 2 – Payment method */}
      <PaymentMethodModal
        visible={paymentMethodModalVisible}
        total={total}
        onClose={() => setPaymentMethodModalVisible(false)}
        onSelect={handlePaymentMethodSelected}
        isProcessing={paymentLoading}
      />
    </SafeScreen>
  );
};

export default CartScreen;

// ─── Loading / Error / Empty UI ───────────────────────────────────────────────

function LoadingUI() {
  return (
    <View className="flex-1 bg-background items-center justify-center">
      <ActivityIndicator size="large" color="#00D9FF" />
      <Text className="text-text-secondary mt-4">Loading cart...</Text>
    </View>
  );
}

function ErrorUI() {
  return (
    <View className="flex-1 bg-background items-center justify-center px-6">
      <Ionicons name="alert-circle-outline" size={64} color="#FF6B6B" />
      <Text className="text-text-primary font-semibold text-xl mt-4">
        Failed to load cart
      </Text>
      <Text className="text-text-secondary text-center mt-2">
        Please check your connection and try again
      </Text>
    </View>
  );
}

function EmptyUI() {
  return (
    <View className="flex-1 bg-background">
      <View className="px-6 pt-16 pb-5">
        <Text className="text-text-primary text-3xl font-bold tracking-tight">
          Cart
        </Text>
      </View>
      <View className="flex-1 items-center justify-center px-6">
        <Ionicons name="cart-outline" size={80} color="#666" />
        <Text className="text-text-primary font-semibold text-xl mt-4">
          Your cart is empty
        </Text>
        <Text className="text-text-secondary text-center mt-2">
          Add some products to get started
        </Text>
      </View>
    </View>
  );
}
