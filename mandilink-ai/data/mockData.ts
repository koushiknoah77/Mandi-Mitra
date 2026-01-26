import { Listing } from "../types";

export const MOCK_LISTINGS: Listing[] = [
  {
    id: "1",
    sellerId: "seller_1",
    sellerName: "Ramesh Kumar",
    location: "Nashik, Maharashtra",
    coordinates: { lat: 19.9975, lng: 73.7898 },
    produceName: "Onion (Red)",
    quantity: 50,
    unit: "Quintal",
    pricePerUnit: 1200,
    currency: "INR",
    quality: "High",
    description: "Fresh red onions harvested yesterday. Dry and clean.",
    imageUrl: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400&h=300&fit=crop",
    createdAt: new Date().toISOString()
  },
  {
    id: "2",
    sellerId: "seller_2",
    sellerName: "Suresh Reddy",
    location: "Guntur, Andhra Pradesh",
    coordinates: { lat: 16.3067, lng: 80.4365 },
    produceName: "Chilli (Dry)",
    quantity: 20,
    unit: "Quintal",
    pricePerUnit: 8500,
    currency: "INR",
    quality: "Premium",
    description: "High spice content, sun dried naturally.",
    imageUrl: "https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=400&h=300&fit=crop&q=80",
    createdAt: new Date().toISOString()
  },
  {
    id: "3",
    sellerId: "seller_3",
    sellerName: "Gurpreet Singh",
    location: "Ludhiana, Punjab",
    coordinates: { lat: 30.9010, lng: 75.8573 },
    produceName: "Wheat (Sharbati)",
    quantity: 100,
    unit: "Quintal",
    pricePerUnit: 2200,
    currency: "INR",
    quality: "Medium",
    description: "Golden grains, ready for mill.",
    imageUrl: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop",
    createdAt: new Date().toISOString()
  },
  {
    id: "4",
    sellerId: "seller_4",
    sellerName: "Lakshmi Devi",
    location: "Thanjavur, Tamil Nadu",
    coordinates: { lat: 10.7870, lng: 79.1378 },
    produceName: "Rice (Ponni)",
    quantity: 75,
    unit: "Quintal",
    pricePerUnit: 3500,
    currency: "INR",
    quality: "High",
    description: "Aged Ponni rice, excellent for cooking.",
    imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop",
    createdAt: new Date().toISOString()
  }
];