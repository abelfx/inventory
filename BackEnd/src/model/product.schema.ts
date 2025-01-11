import { Schema, Document } from 'mongoose';

export interface ProductDocument extends Document {
  name: string;
  description: string;
  catagory: string;
  price: number;
  quantityInStock: number;
  createdAt: Date;
  updatedAt: Date;
  supplierId: number;
}

export const ProductSchema = new Schema<ProductDocument>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  catagory: { type: String, required: true },
  price: { type: Number, required: true },
  quantityInStock: { type: Number, required: true },
  createdAt: { type: Date },
  updatedAt: { type: Date },
  supplierId: { type: Number, required: true },
});
