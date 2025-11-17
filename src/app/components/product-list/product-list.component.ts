import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Category, Product, ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

declare var bootstrap: any;

@Component({
  selector: 'app-product-list',
  standalone: true,
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  imports: [CommonModule, FormsModule],
})
export class ProductListComponent {
  products: Product[] = [];
  searchTerm: string = '';
  selectedCategory: string = '';
  selectedFile: File | null = null;
  uploadError: string = '';
  maxFileSize = 5 * 1024 * 1024; // 5MB
  productToDelete: number | null = null;
  categorys: Category[] = [];
  product: Product = {
    id: 0,
    name: '',
    description: '',
    category: [],
    image: '',
  };
  selectedProduct: Product = {
    id: 0,
    name: '',
    description: '',
    category: [],
    image: '',
  };

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit() {
    this.products = this.productService.getAllProducts();
    this.loadCategories();
  }

  addProduct(product: Product) {
    this.productService.addProducts(product);
    this.products = this.productService.getAllProducts();
  }

  editProduct(id: number, selectedProduct: Product) {
    this.productService.updateProducts(id, selectedProduct);
    this.products = this.productService.getAllProducts();
  }

  deleteProduct(id: number) {
    this.productService.deleteProducts(id);
    this.products = this.productService.getAllProducts();
  }

  loadCategories() {
    const categoryObjects = this.productService.getAllCategorys();
    this.categorys = categoryObjects;
  }

  // Eliminar categoría del producto
  removeCategory(index: number): void {
    this.product.category.splice(index, 1);
  }

  // Agregar categoría al producto
  addCategory(categoryId: number): void {
    const category = this.categorys.find(cat => cat.id === categoryId);
    if (category && !this.product.category.some(cat => cat.id === categoryId)) {
      this.product.category.push(category);
    }
  }

  // Obtener categorías disponibles
  get availableCategories(): Category[] {
    const selectedIds = this.product.category.map(cat => cat.id);
    return this.categorys.filter(cat => !selectedIds.includes(cat.id));
  }

  filteredProducts() {
    const term = this.searchTerm.toLowerCase().trim();
    return this.products.filter((p) => {
      const matchesSearch =
        !term ||
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term) ||
        p.category.some((cat) =>
          cat.description.toLowerCase().includes(term)
        );

      const matchesCategory =
        !this.selectedCategory || 
        p.category.some(cat => cat.description === this.selectedCategory);
      
      return matchesSearch && matchesCategory;
    });
  }

  // Métodos para el modal de eliminación
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

  // Métodos para el modal de Agregar
  openAddModal() {
    this.selectedFile = null;
    this.uploadError = '';
    this.clearFileInput();
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
      category: [],
      image: '',
    };

    const modalElement = document.getElementById('addProductModal');
    const modal = bootstrap.Modal.getInstance(modalElement!);
    modal.hide();
  }

  // Métodos para el modal de Edición
  openEditModal(id: number) {
    this.clearFileInput();
    const product = this.products.find((p) => p.id === id);
    if (!product) return;

  this.selectedProduct = { ...product};
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
      category: [],
      image: '',
    };
    const modalElement = document.getElementById('editProductModal');
    const modal = bootstrap.Modal.getInstance(modalElement!);
    modal.hide();
  }

  addCategoryToEdit(categoryId: number): void {
    const category = this.categorys.find(cat => cat.id === categoryId);
    if (category && !this.selectedProduct.category.some(cat => cat.id === categoryId)) {
      this.selectedProduct.category.push(category);
    }
  }

  removeCategoryFromEdit(index: number): void {
    this.selectedProduct.category.splice(index, 1);
  }

  get availableCategoriesForEdit(): Category[] {
    const selectedIds = this.selectedProduct.category.map(cat => cat.id);
    return this.categorys.filter(cat => !selectedIds.includes(cat.id));
  }

  onEditFileSelected(event: any): void {
    const file: File = event.target.files[0];
    
    if (file) {
      if (!this.isValidFileType(file)) {
        this.uploadError = 'Formato de archivo no válido. Use JPG, PNG, GIF o WEBP.';
        return;
      }

      if (file.size > this.maxFileSize) {
        this.uploadError = 'El archivo es demasiado grande. Máximo 5MB.';
        return;
      }

      this.uploadError = '';
      
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedProduct.image = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeEditImage(): void {
    this.selectedProduct.image = '';
    this.uploadError = '';
    
    const fileInput = document.querySelector('#editProductModal input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  onCancelEdit(): void {
    this.uploadError = '';
  }

  // Metodos para la carga archivos de imagen

  // Cuando se selecciona un archivo
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    
    if (file) {
      // Validar tipo de archivo
      if (!this.isValidFileType(file)) {
        this.uploadError = 'Formato de archivo no válido. Use JPG, PNG, GIF o WEBP.';
        return;
      }

      // Validar tamaño
      if (file.size > this.maxFileSize) {
        this.uploadError = 'El archivo es demasiado grande. Máximo 5MB.';
        return;
      }

      // Limpiar errores y procesar archivo
      this.uploadError = '';
      this.selectedFile = file;

      // Crear URL para vista previa
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.product.image = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // Validar tipo de archivo
  private isValidFileType(file: File): boolean {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    return allowedTypes.includes(file.type);
  }

  // Obtener fuente de imagen para vista previa
  getImageSource(): string {
    if (this.product.image) {
      return this.product.image;
    }
    return '';
  }

  // Manejar error en carga de imagen
  handleImageError(event: any): void {
    event.target.style.display = 'none';
    this.uploadError = 'Error al cargar la imagen';
  }

  // Remover imagen seleccionada
  removeImage(): void {
    this.product.image = '';
    this.selectedFile = null;
    this.uploadError = '';
    
    // Limpiar input de archivo
    this.clearFileInput();
  }

  private clearFileInput(): void {
    const fileInput = document.querySelector('#addProductModal input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }
  


}
