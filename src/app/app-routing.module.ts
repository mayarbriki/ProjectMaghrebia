import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { ProductComponent } from './product/product.component';
import { BlogComponent } from './blog/blog.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },  // Empty path redirects to home
  { path: 'home', component: HomeComponent },   
  { path: 'nav-bar', component: NavbarComponent },
  { path: 'app-product', component: ProductComponent },
  { path: 'app-blog', component: BlogComponent },
  { path: 'product-detail', component: ProductDetailComponent, pathMatch: 'full' }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
