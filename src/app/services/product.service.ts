import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Product {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  categories: Category[];
}

export interface CreateProduct {
  name: string;
  description: string;
  imageUrl: string;
  categories: number[];
}

export interface Category{
  id: number;
  name: string;
}

export interface UpdateProduct {
    id: number;
    name: string;
    description: string;
    imageUrl: string;
    categories: number[];
  }

@Injectable({
  providedIn: 'root',
})
export class ProductService {

  private apiUrl = 'https://localhost:7203/api';

  constructor(private http: HttpClient) {}
  
  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/Products`);
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/Products/${id}`);
  }

  createProduct(product: CreateProduct): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/Products`, product);
  }

  updateProduct(product: UpdateProduct): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/Products`, product);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/Products/${id}`);
  }

  getProductsByCategory(categoryId: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/Products/category/${categoryId}`);
  }

  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/Categories`);
  }
  
}
