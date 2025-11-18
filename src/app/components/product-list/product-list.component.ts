import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Product, ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Category } from '../../models/category.model';

declare var bootstrap: any;

@Component({
  selector: 'app-product-list',
  standalone: true,
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  imports: [CommonModule, FormsModule],
})
export class ProductListComponent implements OnInit, OnDestroy {
  private categoriesSub!: Subscription;

  products: Product[] = [];
  searchTerm: string = '';
  selectedCategory: string = '';
  categories: Category[] = [];
  productToDelete: number | null = null;
  product: Product = {
    id: 0,
    name: '',
    description: '',
    category: '',
    image: '',
  };
  selectedProduct = {
    id: 0,
    name: '',
    description: '',
    category: '',
    image: '',
  };

  constructor(
    private productService: ProductService,
    private router: Router,
    private categoryService: CategoryService
  ) {}

  ngOnInit() {
    this.loadProducts();
    this.loadCategories();
  }

  addProduct(product: Product) {
    this.productService.add(product);
    this.products = this.productService.getAll();
  }

  editProduct(id: number, selectedProduct: Product) {
    this.productService.update(id, selectedProduct);
    this.products = this.productService.getAll();
  }

  deleteProduct(id: number) {
    this.productService.delete(id);
    this.products = this.productService.getAll();
  }

  loadProducts() {
    this.products = this.productService.getAll();
  }

  loadCategories() {
    this.categoriesSub = this.categoryService.getAll().subscribe({
      next: (categorias) => {
        const allCategories = categorias.map((p) => p.name);
        this.categories = allCategories;
      },
      error: (e) => {
        console.error('error:', e);
      },
    });
  }

  filteredProducts() {
    const term = this.searchTerm.toLowerCase().trim();
    return this.products.filter((p) => {
      const matchesSearch =
        !term ||
        p.name.toLowerCase().includes(term) 

      const matchesCategory =
        !this.selectedCategory || p.category === this.selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }

  openDeleteModal(id: number) {
    this.productToDelete = id;
    const modalElement = document.getElementById('confirmDeleteModal');
    const modal = new bootstrap.Modal(modalElement!);
    modal.show();
  }

  confirmDelete() {
    if (this.productToDelete !== null) {
      this.deleteProduct(this.productToDelete);
      this.productToDelete = null;
    }
    const modalElement = document.getElementById('confirmDeleteModal');
    const modal = bootstrap.Modal.getInstance(modalElement!);
    modal.hide();
  }

  openAddModal() {
    const modalElement = document.getElementById('addProductModal');
    const modal = new bootstrap.Modal(modalElement!);
    modal.show();
  }

  saveNewProduct() {
    if (this.product.name.trim() === '') return;
    this.addProduct(this.product);

    this.product = {
      id: 0,
      name: '',
      description: '',
      category: '',
      image: '',
    };

    const modalElement = document.getElementById('addProductModal');
    const modal = bootstrap.Modal.getInstance(modalElement!);
    modal.hide();
  }

  openEditModal(id: number) {
    const product = this.products.find((p) => p.id === id);
    if (!product) return;

    this.selectedProduct = { ...product };

    const modalElement = document.getElementById('editProductModal');
    const modal = new bootstrap.Modal(modalElement!);
    modal.show();
  }

  updateProduct() {
    if (!this.selectedProduct) return;
    this.editProduct(this.selectedProduct.id, this.selectedProduct);
    this.selectedProduct = {
      id: 0,
      name: '',
      description: '',
      category: '',
      image: '',
    };
    const modalElement = document.getElementById('editProductModal');
    const modal = bootstrap.Modal.getInstance(modalElement!);
    modal.hide();
  }
  ngOnDestroy(): void {
    this.categoriesSub.unsubscribe();
  }
}
