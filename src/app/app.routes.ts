import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list.component';

export const routes: Routes = [
  { path: '', redirectTo: '/productos', pathMatch: 'full' },
  { path: 'productos', component: ProductListComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
