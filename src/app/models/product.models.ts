import { Category } from "./category.model";

export interface Product {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  categories: Category[];
}

export interface UpdateProduct {
    id: number;
    name: string;
    description: string;
    imageUrl: string;
    categories: number[];
  }

export interface CreateProduct {
  name: string;
  description: string;
  imageUrl: string;
  categories: number[];
}