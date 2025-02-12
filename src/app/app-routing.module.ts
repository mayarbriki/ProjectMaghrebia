import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { ProductComponent } from './product/product.component';
import { BlogComponent } from './blog/blog.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { BlogDetailComponent } from './blog-detail/blog-detail.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { HomeadminComponent } from './homeadmin/homeadmin.component';
import { SidebarComponent } from './sidebar/sidebar.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },  // Empty path redirects to home
  { path: 'home', component: HomeComponent },   
  { path: 'nav-bar', component: NavbarComponent },
  { path: 'app-product', component: ProductComponent },
  { path: 'app-blog', component: BlogComponent },
  { path: 'product-detail', component: ProductDetailComponent, pathMatch: 'full' },
  { path: 'app-blog-detail', component: BlogDetailComponent },
  { path: 'app-feedback', component: FeedbackComponent },
  { path: 'app-homeadmin', component: HomeadminComponent },

  { path: '  app-sidebar', component: SidebarComponent },



];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
