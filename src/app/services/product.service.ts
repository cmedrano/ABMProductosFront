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
  
  // private categorys: Category[] = [
  //   { id: 1, description: 'Electrodomesticos' },
  //   { id: 2, description: 'Informática' },
  //   { id: 3, description: 'Instrumentos Musicales' },
  // ];
  // private products: Product[] = [
  //   { id: 1, name: 'Pava', description: 'Electrica', category: [this.categorys[0]], image: 'assets/image/pava-electrica.jpg' },
  //   { id: 2, name: 'Pendrive', description: 'Kingston', category: [this.categorys[1]], image: 'assets/image/pendriver-kingston.jpg' },
  //   { id: 3, name: 'Piano', description: 'Organo casio', category: [this.categorys[2]], image: 'assets/image/organo-piano-casio.jpg' },
  // ]

  // PRODUCTOS
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

  // CATEGORÍAS
  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/Categories`);
  }








  // getAllProducts() {
  //   return this.products;
  // }

  // getAllCategorys() {
  //   return this.categorys;
  // }
  // getByProductsId(id: number) {
  //   return this.products.find(p => p.id === id);
  // }

  // getByCategorysId(id: number) {
  //   return this.categorys.find(c => c.id === id);
  // }

  // addProducts(product: Product) {
  //   product.id = this.products.length + 1;    
  //   this.products.push(product);
  // }

  // addCategory(category: Category) {
  //   category.id = this.categorys.length + 1;    
  //   this.categorys.push(category);
  // }

  // updateProducts(id: number, product: Product) {
  //   const index = this.products.findIndex(p => p.id === id);
  //   if (index > -1) this.products[index] = { ...product, id };
  // }

  // updateCategorys(id: number, category: Category) {
  //   const index = this.categorys.findIndex(c => c.id === id);
  //   if (index > -1) this.categorys[index] = { ...category, id };
  // }

  // deleteProducts(id: number) {
  //   this.products = this.products.filter(p => p.id !== id);
  // }
  // deleteCategorys(id: number) {
  //   this.categorys = this.categorys.filter(c => c.id !== id);
  // }


}
