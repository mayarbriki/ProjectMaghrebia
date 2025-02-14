import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// project import
import { AdminComponent } from './demo/layout/admin';
import { EmptyComponent } from './demo/layout/empty';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ProductComponent } from './product/product.component';
import { BlogComponent } from './blog/blog.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { BlogDetailComponent } from './blog-detail/blog-detail.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { HomeadminComponent } from './homeadmin/homeadmin.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ProductadminComponent } from './productadmin/productadmin.component';
import { BlogadminComponent } from './blogadmin/blogadmin.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./demo/pages/dashboard/dashboard.component')
      },
      {
        path: 'component',
        loadChildren: () => import('./demo/pages/components/component.module').then((m) => m.ComponentModule)
      },
      {
        path: 'sample-page',
        loadComponent: () => import('./demo/pages/other/sample-page/sample-page.component')
      }
    ]
  },
  {
    path: '',
    component: EmptyComponent,
    children: [
      {
        path: 'auth',
        loadChildren: () => import('./demo/pages/auth/auth.module').then((m) => m.AuthModule)
      }
    ]
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'nav-bar', component: NavbarComponent },
  { path: 'app-product', component: ProductComponent },
  { path: 'app-blog', component: BlogComponent },
  { path: 'product-detail', component: ProductDetailComponent },
  { path: 'app-blog-detail', component: BlogDetailComponent },
  { path: 'app-feedback', component: FeedbackComponent },
  { path: 'app-homeadmin', component: HomeadminComponent },
  { path: 'app-sidebar', component: SidebarComponent },
  { path: 'app-productadmin', component: ProductadminComponent },
  { path: 'app-blogadmin', component: BlogadminComponent },
  { path: 'app-login', component: LoginComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
