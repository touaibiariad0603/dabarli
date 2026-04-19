import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { cartItems, totalPrice, shippingAddress } = req.body;

    const SLICKPAY_BASE = "https://devapi.slick-pay.com/api/v2";

    const payload = {
      amount: Math.round(totalPrice),
      url: process.env.SLICKPAY_RETURN_URL,
      items: cartItems.map((item) => ({
        name: item.product.name,
        price: Math.round(item.product.price),
        quantity: item.quantity,
      })),
      firstname: shippingAddress.fullName.split(" ")[0],
      lastname: shippingAddress.fullName.split(" ").slice(1).join(" ") || ".",
      phone: shippingAddress.phoneNumber,
      address: `${shippingAddress.streetAddress}, ${shippingAddress.city}`,
    };

    const { data } = await axios.post(
      `${SLICKPAY_BASE}/users/invoices`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${process.env.SLICKPAY_PUBLIC_KEY}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    return res.status(200).json({
      invoiceId: data.id,
      checkoutUrl: data.url,
    });
  } catch (error) {
    console.error("SlickPay error:", error?.response?.data || error.message);

    return res.status(500).json({
      error: "Failed to create invoice",
      details: error?.response?.data || error.message,
    });
  }
}