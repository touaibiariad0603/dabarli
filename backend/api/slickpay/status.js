import axios from "axios";

export default async function handler(req, res) {
  const { invoiceId } = req.query;

  try {
    const { data } = await axios.get(
      `https://devapi.slick-pay.com/api/v2/users/invoices/${invoiceId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.SLICKPAY_PUBLIC_KEY}`,
        },
      }
    );

    return res.json({
      completed: data.completed === 1,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to get status",
    });
  }
}