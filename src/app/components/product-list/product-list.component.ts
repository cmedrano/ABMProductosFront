import { Component } from '@angular/core';
import { Category, CreateProduct, Product, ProductService, UpdateProduct } from '../../services/product.service';
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
    categories: [],
    imageUrl: '',
  };
  selectedProduct: Product = {
    id: 0,
    name: '',
    description: '',
    categories: [],
    imageUrl: '',
  };

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.loadProducts();
    this.loadCategories();
  }

  // Cargar categorías
  loadCategories() {
    this.productService.getAllCategories().subscribe({
      next: (categories) => 
        this.categorys = categories,
      error: (error) => console.error('Error loading categories:', error)
    });
  }

  // Cargar productos
  loadProducts() {
    this.productService.getAllProducts().subscribe({
      next: (result) => 
        this.products = result,
      error: (error) => console.error('Error loading products:', error)
    });
  }

  // Eliminar producto
  deleteProduct(id: number) {
    this.productService.deleteProduct(id).subscribe({
      next: () => {
        console.log('Producto eliminado');
        this.loadProducts();
      },
      error: (error) => {
        console.error('Error eliminando producto:', error);
        alert('Error al eliminar el producto');
      }
    });
  }

  // Agregar categoría al producto
  addCategory(categoryId: number) {
    if (!categoryId) return;
    
    const category = this.availableCategories.find(cat => cat.id === categoryId);
    const alreadyExists = this.product.categories.some(cat => cat.id === categoryId);
    
    if (category && !alreadyExists) {
      this.product.categories.push(category);
      console.log('Categoría agregada:', category);
    }
  }

  // Eliminar categoría del producto
  removeCategory(index: number) {
    this.product.categories.splice(index, 1);
  }

  // Obtener categorías disponibles
  get availableCategories(): Category[] {
    const selectedIds = this.product.categories.map(cat => cat.id);
    return this.categorys.filter(cat => !selectedIds.includes(cat.id));
  }

  // Filtrar productos
  filteredProducts() {
    const term = this.searchTerm.toLowerCase().trim();
    return this.products.filter((p) => {
      const matchesSearch =
        !term ||
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term) ||
        p.categories.some((cat) =>
          cat.name.toLowerCase().includes(term)
        );

      const matchesCategory =
        !this.selectedCategory || 
        p.categories.some(cat => cat.name === this.selectedCategory);
      
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

  closeModal() {
    this.product = {
      id: 0,
      name: '',
      description: '',
      categories: [],
      imageUrl: '',
    };
  }

  saveNewProduct() {
    const newProduct : CreateProduct = {
    name: this.product.name,
    description: this.product.description,
    imageUrl: this.product.imageUrl,  
    categories: this.product.categories.map(cat => cat.id)
    };

    this.productService.createProduct(newProduct).subscribe({
      next: (product) => {
        console.log('Product created:', product);
        this.loadProducts(); // Recargar lista
      },
      error: (error) => console.error('Error creating product:', error)
    });

    const modalElement = document.getElementById('addProductModal');
    const modal = bootstrap.Modal.getInstance(modalElement!);
    modal.hide();
  }

  // Métodos para el modal de Edición

  openEditModal(product: Product) {
    this.clearFileInput();
    // Copiar el producto para editar (no la referencia directa)
    this.selectedProduct = {
      ...product,
      categories: [...product.categories] // Copiar el array de categorías
    };
    
    const modalElement = document.getElementById('editProductModal');
    const modal = new bootstrap.Modal(modalElement!);
    modal.show();
  }

  updateProduct() {
    const updateData: UpdateProduct = {
      id: this.selectedProduct.id,
      name: this.selectedProduct.name,
      description: this.selectedProduct.description,
      imageUrl: this.selectedProduct.imageUrl, 
      categories: this.selectedProduct.categories.map(cat => cat.id)
    };

    this.productService.updateProduct(updateData).subscribe({
      next: (product) => {
        console.log('Product updated:', product);
        this.loadProducts();
      },
      error: (error) => console.error('Error updating product:', error)
    });

    // Limpiar formulario
    this.selectedProduct = {
      id: 0,
      name: '',
      description: '',
      categories: [],
      imageUrl: '',
    };

    const modalElement = document.getElementById('editProductModal');
    const modal = bootstrap.Modal.getInstance(modalElement!);
    modal.hide();
  }
  
  addCategoryToEdit(categoryId: number): void {
    if (!categoryId) return;

    const category = this.categorys.find(cat => cat.id === categoryId);
    if (category && !this.selectedProduct.categories.some(cat => cat.id === categoryId)) {
      this.selectedProduct.categories.push(category);
    }
  }

  removeCategoryFromEdit(index: number): void {
    this.selectedProduct.categories.splice(index, 1);
  }

  get availableCategoriesForEdit(): Category[] {
    const selectedIds = this.selectedProduct.categories.map(cat => cat.id);
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
        this.selectedProduct.imageUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeEditImage(): void {
    this.selectedProduct.imageUrl = '';
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
        this.product.imageUrl = e.target.result;
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
    if (this.product.imageUrl) {
      return this.product.imageUrl;
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
    this.product.imageUrl = '';
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
