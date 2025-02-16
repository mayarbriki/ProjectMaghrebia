import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Project imports
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
import DashboardComponent from './demo/pages/dashboard/dashboard.component';
import SamplePageComponent from './demo/pages/other/sample-page/sample-page.component';
import { ContratsComponent } from './@theme/pages/contrats/contrats.component';
import { ArticlesComponent } from './@theme/pages/articles/articles.component';
import { AssesementsComponent } from './@theme/pages/assesements/assesements.component';
import { BlogsComponent } from './@theme/pages/blogs/blogs.component';
import { ClaimsComponent } from './@theme/pages/claims/claims.component';
import { IncidentsComponent } from './@theme/pages/incidents/incidents.component';
import { JoboffersComponent } from './@theme/pages/joboffers/joboffers.component';
import { NewsComponent } from './@theme/pages/news/news.component';
import { PropertiesComponent } from './@theme/pages/properties/properties.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: '',
    component: AdminComponent, // Admin Layout with Sidebar
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./demo/pages/dashboard/dashboard.component').then(m => DashboardComponent)
      },
      {
        path: 'component',
        loadChildren: () => import('./demo/pages/components/component.module').then(m => m.ComponentModule)
      },
      {
        path: 'sample-page',
        loadComponent: () => import('./demo/pages/other/sample-page/sample-page.component').then(m => SamplePageComponent)
      },
      {
        path: 'contracts',  
        component: ContratsComponent
      },
      {
        path: 'articles',  
        component: ArticlesComponent
      },
      {
        path: 'assesements',  
        component: AssesementsComponent
      },
      {
        path: 'blogs',  
        component: BlogsComponent
      },
      {
        path: 'claims',  
        component: ClaimsComponent
      },
      {
        path: 'incidents',  
        component: IncidentsComponent
      },
      {
        path: 'joboffers',  
        component: JoboffersComponent
      },
      {
        path: 'news',  
        component: NewsComponent
      },
      {
        path: 'properties',  
        component: PropertiesComponent
      },
    ]
  },
  {
    path: 'auth',
    component: EmptyComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./demo/pages/auth/auth.module').then(m => m.AuthModule)
      }
    ]
  },
  { path: 'home', component: HomeComponent },
  { path: 'nav-bar', component: NavbarComponent },
  { path: 'app-product', component: ProductComponent },
  { path: 'app-blog', component: BlogComponent },
  { path: 'product-detail/:type', component: ProductDetailComponent },
  { path: 'app-blog-detail', component: BlogDetailComponent },
  { path: 'app-feedback', component: FeedbackComponent },
  { path: 'app-homeadmin', component: HomeadminComponent },
  { path: 'app-sidebar', component: SidebarComponent },
  { path: 'app-productadmin', component: ProductadminComponent },
  { path: 'app-blogadmin', component: BlogadminComponent },
  { path: 'app-login', component: LoginComponent },

  // Wildcard route to handle unknown paths
  { path: '**', redirectTo: 'home' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
