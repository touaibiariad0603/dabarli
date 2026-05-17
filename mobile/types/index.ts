export interface Category {
  _id: string;
  name: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

export interface SubCategory {
  _id: string;
  name: string;
  category: Category;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: Category;
  subcategory: SubCategory;
  images: string[];
  averageRating: number;
  totalReviews: number;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  _id: string;
  clerkId: string;
  email: string;
  name: string;
  imageUrl: string;
  addresses: Address[];
  wishlist: string[];
  createdAt: string;
  updatedAt: string;
}
export interface OrderUser {
  _id: string;
  name: string;
  email: string;
}

export interface Address {
  _id: string;
  label: string;
  fullName: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  phoneNumber: string;
  isDefault: boolean;
}

export interface Order {
    _id: string;
    user:OrderUser;
    clerkId: string;
    orderItems: OrderItem[];
    shippingAddress: {
    fullName: string;
    streetAddress: string;
    city: string;
    state: string;
    zipCode: string;
    phoneNumber: string;
  };
  paymentResult: {
    id: string;
    status: string;
  };
  totalPrice: number;
  status: "pending" | "shipped" | "delivered";
  hasReviewed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  _id: string;
  product: Product;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Review {
  _id: string;
  productId: string;
  userId: string | User;
  orderId: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  _id: string;
  product: Product;
  quantity: number;
}

export interface Cart {
  _id: string;
  user: string;
  clerkId: string;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
}

export interface DiagnosticCode {
  _id: string;
  code: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  createdAt: string;
  updatedAt: string;
}

export interface VehicleInfo {
  brand: string;
  model: string;
  year: number;
  vin: string;
}

export interface DiagnosticScan {
  _id: string;
  user: string;
  vehicleInfo: VehicleInfo;
  diagnosticCodes: DiagnosticCode[];
  recommendedProducts: Product[];
  createdAt: string;
  updatedAt: string;
}