import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import {Review} from "../models/review.model.js"

export async function createOrders(req, res) {
  try {
    const user = req.user;
    const { orderItems, shippingAddress, paymentResult, totalPrice } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ error: "No order items" });
    }

  
    for (const item of orderItems) {
      const product = await Product.findById(item.product._id);
      if (!product) {
        return res.status(404).json({ error: `Product not found` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ error: `Insufficient stock for ${product.name}` });
      }
    }


    const mappedOrderItems = orderItems.map((item) => ({
      Product:  item.product._id,
      name:     item.product.name,
      price:    item.product.price,
      quantity: item.quantity,
      image:    item.product.images[0],
    }));

    const order = await Order.create({
      user:            user._id,
      clerkId:         user.clerkId,
      orderItems:      mappedOrderItems,
      shippingAddress,
      paymentResult,
      totalPrice,
    });

    // update stock
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: -item.quantity },
      });
    }

    res.status(201).json({ message: "Order created successfully", order });

  } catch (error) {
    console.error("Error in createOrder controller", error.message); 
    res.status(500).json({ error: "Internal server error" });
  }
}