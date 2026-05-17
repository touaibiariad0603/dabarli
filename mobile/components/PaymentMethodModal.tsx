import { Ionicons } from "@expo/vector-icons";
import { Modal, Text, TouchableOpacity, View } from "react-native";

export type PaymentMethod = "card" | "delivery" | "slickpay";

interface Props {
  visible: boolean;
  total: number;
  onClose: () => void;
  onSelect: (method: PaymentMethod) => void;
  isProcessing?: boolean;
}

const METHODS: {
  id: PaymentMethod;
  label: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  badge?: string;
}[] = [
  {
    id: "card",
    label: "Pay by Card",
    description: "Visa, Mastercard via Stripe",
    icon: "card-outline",
    iconColor: "#1DB954",
  },
  {
    id: "slickpay",
    label: "Cib/dahabia",
    description: "Algerian online payment",
    icon: "phone-portrait-outline",
    iconColor: "#00AEEF",
    badge: "DZ",
  },
  {
    id: "delivery",
    label: "Cash on Delivery",
    description: "Pay when your order arrives",
    icon: "cash-outline",
    iconColor: "#F59E0B",
  },
];

const PaymentMethodModal = ({ visible, total, onClose, onSelect, isProcessing }: Props) => {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/60">
        <View className="bg-background rounded-t-3xl px-6 pt-6 pb-12">
          {/* Handle bar */}
          <View className="w-12 h-1 bg-surface rounded-full self-center mb-6" />

          <Text className="text-text-primary text-2xl font-bold mb-1">Payment Method</Text>
          <Text className="text-text-secondary mb-6">
            Total:{" "}
            <Text className="text-primary font-bold">{total.toFixed(2)} dz</Text>
          </Text>

          <View className="gap-3">
            {METHODS.map((method) => (
              <TouchableOpacity
                key={method.id}
                activeOpacity={0.75}
                disabled={isProcessing}
                onPress={() => onSelect(method.id)}
                className="bg-surface rounded-2xl p-4 flex-row items-center"
              >
                {/* Icon */}
                <View
                  className="w-12 h-12 rounded-full items-center justify-center"
                  style={{ backgroundColor: method.iconColor + "1A" }} // 10% opacity tint
                >
                  <Ionicons name={method.icon} size={24} color={method.iconColor} />
                </View>

                {/* Labels */}
                <View className="flex-1 ml-4">
                  <View className="flex-row items-center gap-2">
                    <Text className="text-text-primary font-bold text-base">{method.label}</Text>
                    {method.badge && (
                      <View className="bg-blue-500/20 rounded px-1.5 py-0.5">
                        <Text className="text-blue-400 text-xs font-bold">{method.badge}</Text>
                      </View>
                    )}
                  </View>
                  <Text className="text-text-secondary text-sm mt-0.5">{method.description}</Text>
                </View>

                <Ionicons name="chevron-forward" size={20} color="#555" />
              </TouchableOpacity>
            ))}
          </View>

          {/* Cancel */}
          <TouchableOpacity
            onPress={onClose}
            activeOpacity={0.7}
            className="mt-5 py-3 items-center"
          >
            <Text className="text-text-secondary font-medium">Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default PaymentMethodModal;
