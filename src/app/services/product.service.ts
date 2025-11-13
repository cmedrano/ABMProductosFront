import { Injectable } from '@angular/core';

export interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  image: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private products: Product[] = [
    { id: 1, name: 'Pava', description: 'Electrica', category: 'Electrodomesticos', image: '' },
    { id: 2, name: 'Pendrive', description: 'Kingston', category: 'Tecnologia', image: '' },
    { id: 3, name: 'Piano', description: 'organo casio', category: 'instrumento', image: '' },
  ]

  getAll() {
    return this.products;
  }

  getById(id: number) {
    return this.products.find(p => p.id === id);
  }

  add(product: Product) {
    product.id = this.products.length + 1;    
    this.products.push(product);
  }

  update(id: number, product: Product) {
    const index = this.products.findIndex(p => p.id === id);
    if (index > -1) this.products[index] = { ...product, id };
  }

  delete(id: number) {
    this.products = this.products.filter(p => p.id !== id);
  }
}
