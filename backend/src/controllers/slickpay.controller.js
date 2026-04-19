import axios from "axios";

const SLICKPAY_BASE =
  process.env.SLICKPAY_SANDBOX === "true"
    ? "https://devapi.slick-pay.com/api/v2"
    : "https://api.slick-pay.com/api/v2";

const headers = () => ({
  Accept: "application/json",
  "Content-Type": "application/json",
  Authorization: `Bearer ${process.env.SLICKPAY_PUBLIC_KEY}`,
});

// POST /payment/slickpay/create-invoice
export async function createSlickPayInvoice(req, res) {
  try {
    const { cartItems, totalPrice, shippingAddress } = req.body;

    if (!cartItems?.length || !totalPrice || !shippingAddress) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Map cart items → SlickPay invoice items
    const items = cartItems.map((item) => ({
      name: item.product.name,
      price: Math.round(item.product.price),  // SlickPay expects integers (DZD)
      quantity: item.quantity,
    }));

    // Split fullName into firstname / lastname
    const nameParts = (shippingAddress.fullName || "").trim().split(" ");
    const firstname = nameParts[0] || "Client";
    const lastname = nameParts.slice(1).join(" ") || ".";

    const payload = {
      amount: Math.round(totalPrice),
      url: process.env.SLICKPAY_RETURN_URL,          // deep-link back to the app
      items,
      firstname,
      lastname,
      phone: shippingAddress.phoneNumber,
      address: `${shippingAddress.streetAddress}, ${shippingAddress.city}, ${shippingAddress.state}`,
      // Optional: webhook to auto-confirm orders
      webhook_url: `${process.env.API_BASE_URL}/payment/slickpay/webhook`,
    };

    const { data } = await axios.post(
      `${SLICKPAY_BASE}/users/invoices`,
      payload,
      { headers: headers() }
    );

    if (data.success !== 1) {
      console.error("SlickPay invoice rejected:", data);
      return res.status(400).json({ error: "SlickPay rejected the invoice" });
    }

    return res.json({
      invoiceId: data.id,
      checkoutUrl: data.url,  // ← send this to the app to open in browser
    });
  } catch (error) {
    console.error("SlickPay create invoice error:", error?.response?.data || error.message);
    return res.status(500).json({ error: "Failed to create SlickPay invoice" });
  }
}

// GET /payment/slickpay/status/:invoiceId
export async function getSlickPayInvoiceStatus(req, res) {
  try {
    const { invoiceId } = req.params;

    const { data } = await axios.get(
      `${SLICKPAY_BASE}/users/invoices/${invoiceId}`,
      { headers: headers() }
    );

    return res.json({
      completed: data.completed === 1,  // 1 = paid, 0 = pending
    });
  } catch (error) {
    console.error("SlickPay status error:", error?.response?.data || error.message);
    return res.status(500).json({ error: "Failed to get invoice status" });
  }
}

// POST /payment/slickpay/webhook  (called by SlickPay server after payment)
export async function slickPayWebhook(req, res) {
  try {
    const { id, status } = req.body;
    console.log("SlickPay webhook received:", req.body);

    // TODO: find the pending order that has slickPayInvoiceId === id
    // and mark it as paid if status indicates success
    // e.g. await Order.findOneAndUpdate({ slickPayInvoiceId: id }, { isPaid: true, status: "processing" })

    return res.json({ success: 1 });
  } catch (error) {
    console.error("SlickPay webhook error:", error.message);
    return res.status(500).json({ error: "Webhook processing failed" });
  }
}
