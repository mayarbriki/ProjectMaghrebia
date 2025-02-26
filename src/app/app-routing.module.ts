import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Front-Office Imports
import { AllTemplateFrontComponent } from './front-office/all-template-front/all-template-front.component';
import { BlogsComponent } from '../app/front-office/blogs/blogs.component';
import { ClaimsComponent } from './front-office/claims/claims.component';
import { MessageComponent } from './message/message.component';
import { SigninComponent } from './front-office/register/signin/signin.component';
import { SignupComponent } from './front-office/register/signup/signup.component';
import { ServicesComponent } from './front-office/services/services.component';
import { ProductsComponent } from './front-office/products/products.component';
import { ProductDisplayComponent } from './product-display/product-display.component';
import { FeedbackComponent } from './feedback/feedback.component';

// Back-Office Imports
import { AdminComponent } from './demo/layout/admin';
import { EmptyComponent } from './demo/layout/empty';
import DashboardComponent from './demo/pages/dashboard/dashboard.component';
import SamplePageComponent from './demo/pages/other/sample-page/sample-page.component';
import { ContratsComponent } from './@theme/pages/contrats/contrats.component';
import { ArticlesComponent } from './@theme/pages/articles/articles.component';
import { IncidentsComponent } from './@theme/pages/incidents/incidents.component';
import { JoboffersComponent } from './@theme/pages/joboffers/joboffers.component';
import { NewsComponent } from './@theme/pages/news/news.component';
import { PropertiesComponent } from './@theme/pages/properties/properties.component';

import { ProductDetailComponent } from './product-detail/product-detail.component';
import { HeaderFrontComponent } from './front-office/header-front/header-front.component';
import { ListClaimComponent } from './@theme/pages/claims/list-claim/list-claim.component';
import { AddClaimComponent } from './@theme/pages/claims/add-claim/add-claim.component';
import { ModifyClaimComponent } from './@theme/pages/claims/modify-claim/modify-claim.component';
import { ViewClaimComponent } from './@theme/pages/claims/view-claim/view-claim.component';

//////Assessments Back-Office

const routes: Routes = [
  // Front-Office Routes
  {
    path: '',
    component: AllTemplateFrontComponent,  // Front-Office as Default Route
  },
  {
    path: 'app-header-front',
    component: HeaderFrontComponent,  // Front-Office as Default Route
  },
  {
    path: 'app-feedback',
    component: FeedbackComponent,  // Front-Office as Default Route
  },
  { path: 'product/:id', component: ProductDetailComponent },  // ✅ Route for product details

  {
    path: 'message', // New route for the message component
    component: MessageComponent
  },
  {
    path: 'app-product-display',
    component: ProductDisplayComponent
  },
  {
    path: 'signin', // New route for the message component
    component: SigninComponent
  },
  {
    path: 'signup', // New route for the message component
    component: SignupComponent
  },
  {
    path: 'claims', // New route for the message component
    component: ClaimsComponent
  },
  {
    path: 'Services', // New route for the message component
    component: ServicesComponent
  },
  {
    path: 'products', // New route for the message component
    component: ProductsComponent
  },
  {
    path:'blogs',
    component:BlogsComponent
  },

  // Back-Office Routes
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      { path: 'dashboard', loadComponent: () => import('./demo/pages/dashboard/dashboard.component').then(m => DashboardComponent) },
      { path: 'component', loadChildren: () => import('./demo/pages/components/component.module').then(m => m.ComponentModule) },
      { path: 'sample-page', loadComponent: () => import('./demo/pages/other/sample-page/sample-page.component').then(m => SamplePageComponent) },
      { path: 'contracts', component: ContratsComponent },
      { path: 'articles', component: ArticlesComponent },
      { path: 'blogs', component: BlogsComponent },
      /////// Claim Routes Back-Office
      { path: 'claims', component: ListClaimComponent },
      { path: 'claims/AddClaim', component: AddClaimComponent },
      { path: 'claims/EditClaim/:id', component: ModifyClaimComponent },
      { path: 'claims/DetailsClaim/:id', component: ViewClaimComponent },
      /////// Assessment Routes Back-Office

      { path: 'incidents', component: IncidentsComponent },
      { path: 'joboffers', component: JoboffersComponent },
      { path: 'news', component: NewsComponent },
      { path: 'properties', component: PropertiesComponent }
    ]
  },

  // Authentication Routes
  {
    path: 'auth',
    component: EmptyComponent,
    children: [{ path: '', loadChildren: () => import('./demo/pages/auth/auth.module').then(m => m.AuthModule) }]
  },

  // Wildcard Route
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
