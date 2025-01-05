import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ProductDocument } from '../model/product.schema';
@Injectable()
export class ProductService {
  constructor(
    @InjectModel('Product')
    private readonly productModel: Model<ProductDocument>,
  ) {}

  // add new product
  async add(data: any): Promise<ProductDocument> {
    const newProduct = new this.productModel(data);
    return newProduct.save();
  }

  // get all products through product condition
  async findOne(condition: any): Promise<ProductDocument | null> {
    return this.productModel.findOne(condition).exec();
  }

  async deleteOne(condition: any): Promise<ProductDocument | null> {
    return this.productModel.findOneAndDelete(condition).exec();
  }

  // Get all products
  async findAll(condition: any = {}): Promise<ProductDocument[]> {
    return this.productModel.find(condition).exec();
  }

  // Search products by name, category, or SKU
  async search(query: string) {
    return this.productModel.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } },
        { productId: query },
      ],
    });
  }
  // Filter products by category, stock level, or supplier
  async filter(filters: any) {
    const query: any = {};

    if (filters.category) {
      query.category = { $regex: filters.category, $options: 'i' };
    }

    if (filters.stockLevel) {
      const { min, max } = filters.stockLevel;
      query.quantityInStock = { $gte: min, $lte: max };
    }

    if (filters.supplierId) {
      query.supplierId = filters.supplierId;
    }

    return this.productModel.find(query).exec();
  }
  
  


}
