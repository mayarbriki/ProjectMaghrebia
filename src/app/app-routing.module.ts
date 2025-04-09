import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Front-Office Imports
import { AllTemplateFrontComponent } from './front-office/all-template-front/all-template-front.component';
import { BlogsComponent } from '../app/front-office/blogs/blogs.component';
import { MessageComponent } from './message/message.component';
import { SigninComponent } from './front-office/register/signin/signin.component';
import { SignupComponent } from './front-office/register/signup/signup.component';
import { ServicesComponent } from './front-office/services/services.component';
import { ProductsComponent } from './front-office/products/products.component';
import { ProductDisplayComponent } from './product-display/product-display.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { AddClaimComponentFront } from './front-office/claims/add-claim-front/add-claim-front.component';
import { ListClaimComponentFront } from '../app/front-office/claims/list-claim-front/list-claim-front.component';
import { ModifyClaimComponentFront } from '../app/front-office/claims/modify-claim-front/modify-claim-front.component';
import { ViewClaimComponentFront } from '../app/front-office/claims/view-claim-front/view-claim-front.component';
import { ListAssessmentComponentFront } from '../app/front-office/assessments/list-assessment-front/list-assessment-front.component';
import { ViewAssessmentComponentFront } from '../app/front-office/assessments/view-assessment-front/view-assessment-front.component';

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
import { BlogDetailComponent } from './blog-detail/blog-detail.component';
import { FeedbackAdminComponent } from './feedback-admin/feedback-admin.component';

// Assessments Back-Office
import { ListAssessmentComponent } from './@theme/pages/assessments/list-assessment/list-assessment.component';
import { AddAssessmentComponent } from './@theme/pages/assessments/add-assessment/add-assessment.component';
import { ModifyAssessmentComponent } from './@theme/pages/assessments/modify-assessment/modify-assessment.component';
import { ViewAssessmentComponent } from './@theme/pages/assessments/view-assessment/view-assessment.component';
import { BookmarkComponent } from './bookmark/bookmark.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { FeedbackDisplayComponent } from './feedback-display/feedback-display.component';
import { BlogSingleComponent } from './blog-single/blog-single.component';
import { BlogStatisticsComponent } from './blog-statistics/blog-statistics.component';

const routes: Routes = [
  // Front-Office Routes
  {
    path: '',
    component: AllTemplateFrontComponent,
  },
  {
    path: 'app-feedback-display',
    component: FeedbackDisplayComponent,
  },
  {
    path: 'app-header-front',
    component: HeaderFrontComponent,
  },
  {
    path: 'app-feedback',
    component: FeedbackComponent,
  },
  { path: 'product/:id', component: ProductDetailComponent },
  {
    path: 'message',
    component: MessageComponent,
  },
  { path: 'app-blog-detail', component: BlogDetailComponent },
  {
    path: 'app-product-display',
    component: ProductDisplayComponent,
  },
  {
    path: 'signin',
    component: SigninComponent,
  },
  {
    path: 'signup',
    component: SignupComponent,
  },
  {
    path: 'claims',
    component: ListClaimComponentFront,
  },
  {
    path: 'claimsFront/AddClaim',
    component: AddClaimComponentFront,
  },
  {
    path: 'claimsFront/EditClaim/:id',
    component: ModifyClaimComponentFront,
  },
  {
    path: 'claimsFront/DetailsClaim/:id',
    component: ViewClaimComponentFront,
  },
  {
    path: 'assessments',
    component: ListAssessmentComponentFront,
  },
  {
    path: 'assessmentsFront/ViewAssessment/:id',
    component: ViewAssessmentComponentFront,
  },
  {
    path: 'Services',
    component: ServicesComponent,
  },
  {
    path: 'app-bookmark',
    component: BookmarkComponent,
  },
  {
    path: 'blogs/:id',
    component: BlogSingleComponent,
  },
  { path: 'blog-statistics', component: BlogStatisticsComponent },

  // Back-Office Routes
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./demo/pages/dashboard/dashboard.component').then(
            (m) => DashboardComponent
          ),
      },
      {
        path: 'component',
        loadChildren: () =>
          import('./demo/pages/components/component.module').then(
            (m) => m.ComponentModule
          ),
      },
      {
        path: 'sample-page',
        loadComponent: () =>
          import('./demo/pages/other/sample-page/sample-page.component').then(
            (m) => SamplePageComponent
          ),
      },
      { path: 'contracts', component: ContratsComponent },
      { path: 'articles', component: BlogStatisticsComponent }, // Updated to use BlogStatisticsComponent
      { path: 'blogs', component: BlogsComponent },
      {
        path: 'app-statistics',
        component: StatisticsComponent,
      },
      {
        path: 'products',
        component: ProductsComponent,
      },
      {
        path: 'app-feedback-admin',
        component: FeedbackAdminComponent,
      },
      /////// Claim Routes Back-Office
      { path: 'claims', component: ListClaimComponent },
      { path: 'claims/AddClaim', component: AddClaimComponent },
      { path: 'claims/EditClaim/:id', component: ModifyClaimComponent },
      { path: 'claims/DetailsClaim/:id', component: ViewClaimComponent },
      /////// Assessment Routes Back-Office
      { path: 'assessments', component: ListAssessmentComponent },
      { path: 'assessments/AddAssessment', component: AddAssessmentComponent },
      {
        path: 'assessments/EditAssessment/:id',
        component: ModifyAssessmentComponent,
      },
      {
        path: 'assessments/ViewAssessment/:id',
        component: ViewAssessmentComponent,
      },
      { path: 'incidents', component: IncidentsComponent },
      { path: 'joboffers', component: JoboffersComponent },
      { path: 'news', component: NewsComponent },
      { path: 'properties', component: PropertiesComponent },
    ],
  },

  // Authentication Routes
  {
    path: 'auth',
    component: EmptyComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./demo/pages/auth/auth.module').then((m) => m.AuthModule),
      },
    ],
  },

  // Wildcard Route
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}