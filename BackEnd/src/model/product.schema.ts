import { Schema, Document } from 'mongoose';

export interface ProductDocument extends Document {
  productId: number;
  name: string;
  description: string;
  catagory: string;
  price: number;
  quantityInStock: number;
  imageURL: string;
  createdAt: Date;
  updatedAt: Date;
  supplierId: number;
}

export const ProductSchema = new Schema<ProductDocument>({
  productId: { type: Number, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  catagory: { type: String, required: true },
  price: { type: Number, required: true },
  quantityInStock: { type: Number, required: true },
  imageURL: { type: String, required: true },
  createdAt: { type: Date },
  updatedAt: { type: Date },
  supplierId: { type: Number, required: true },
});
