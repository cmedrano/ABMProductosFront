import { Injectable } from '@angular/core';

export interface Product {
  id: number;
  name: string;
  description: string;
  category: Category[];
  image: string;
}

export interface Category{
  id: number;
  description: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private categorys: Category[] = [
    { id: 1, description: 'Electrodomesticos' },
    { id: 2, description: 'Informática' },
    { id: 3, description: 'Instrumentos Musicales' },
  ];
  private products: Product[] = [
    { id: 1, name: 'Pava', description: 'Electrica', category: [this.categorys[0]], image: 'assets/image/pava-electrica.jpg' },
    { id: 2, name: 'Pendrive', description: 'Kingston', category: [this.categorys[1]], image: 'assets/image/pendriver-kingston.jpg' },
    { id: 3, name: 'Piano', description: 'Organo casio', category: [this.categorys[2]], image: 'assets/image/organo-piano-casio.jpg' },
  ]

  getAllProducts() {
    return this.products;
  }

  getAllCategorys() {
    return this.categorys;
  }
  getByProductsId(id: number) {
    return this.products.find(p => p.id === id);
  }

  getByCategorysId(id: number) {
    return this.categorys.find(c => c.id === id);
  }

  addProducts(product: Product) {
    product.id = this.products.length + 1;    
    this.products.push(product);
  }

  addCategory(category: Category) {
    category.id = this.categorys.length + 1;    
    this.categorys.push(category);
  }

  updateProducts(id: number, product: Product) {
    const index = this.products.findIndex(p => p.id === id);
    if (index > -1) this.products[index] = { ...product, id };
  }

  updateCategorys(id: number, category: Category) {
    const index = this.categorys.findIndex(c => c.id === id);
    if (index > -1) this.categorys[index] = { ...category, id };
  }

  deleteProducts(id: number) {
    this.products = this.products.filter(p => p.id !== id);
  }
  deleteCategorys(id: number) {
    this.categorys = this.categorys.filter(c => c.id !== id);
  }


}
