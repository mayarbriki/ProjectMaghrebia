import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Front-Office Imports
import { AllTemplateFrontComponent } from './front-office/all-template-front/all-template-front.component';
import { BlogsComponent } from './front-office/blogs/blogs.component';
import { MessageComponent } from './message/message.component';
import { SigninComponent } from './front-office/register/signin/signin.component';
import { SignupComponent } from './front-office/register/signup/signup.component';
import { ServicesComponent } from './front-office/services/services.component';
import { ProductsComponent } from './front-office/products/products.component';
import { ProductDisplayComponent } from './product-display/product-display.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { AddClaimComponentFront } from './front-office/claims/add-claim-front/add-claim-front.component';
import { ListClaimComponentFront } from './front-office/claims/list-claim-front/list-claim-front.component';
import { ListClaimComponent } from './@theme/pages/claims/list-claim/list-claim.component';
import { ListAssessmentComponent } from './@theme/pages/assessments/list-assessment/list-assessment.component';
import { ModifyClaimComponentFront } from './front-office/claims/modify-claim-front/modify-claim-front.component';
import { ViewClaimComponentFront } from './front-office/claims/view-claim-front/view-claim-front.component';
import { ListAssessmentComponentFront } from './front-office/assessments/list-assessment-front/list-assessment-front.component';
import { ViewAssessmentComponentFront } from './front-office/assessments/view-assessment-front/view-assessment-front.component';
import { AddAssessmentFrontComponent} from './front-office/assessments/add-assessment-front/add-assessment-front.component';
import { ModifyAssessmentFrontComponent } from './front-office/assessments/modify-assessment-front/modify-assessment-front.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { HeaderFrontComponent } from './front-office/header-front/header-front.component';
import { BlogDetailComponent } from './blog-detail/blog-detail.component';
import { FeedbackDisplayComponent } from './feedback-display/feedback-display.component';
import { BlogSingleComponent } from './blog-single/blog-single.component';
import { BlogStatisticsComponent } from './blog-statistics/blog-statistics.component';
import { ContractsComponent } from './front-office/contracts/contracts.component';
import { TransactionsComponent } from './front-office/transactions/transactions.component';
import { TrainingsComponent } from './front-office/trainings/trainings.component';
import { TrainingGalleryComponent } from './front-office/training-gallery/training-gallery.component';
import { QuizComponent } from './front-office/quiz/quiz.component';
import { EnrollmentComponent } from './enrollment/enrollment.component';
import { BookmarkComponent } from './bookmark/bookmark.component';
import { AddAssessmentComponent } from './@theme/pages/assessments/add-assessment/add-assessment.component';
import { ModifyAssessmentComponent } from './@theme/pages/assessments/modify-assessment/modify-assessment.component';
import { ViewAssessmentComponent } from './@theme/pages/assessments/view-assessment/view-assessment.component';
// Back-Office Imports
import { AdminComponent } from './demo/layout/admin';
import { EmptyComponent } from './demo/layout/empty';
import DashboardComponent from './demo/pages/dashboard/dashboard.component';
import SamplePageComponent from './demo/pages/other/sample-page/sample-page.component';
import { ContratsComponent } from './@theme/pages/contrats/contrats.component';
import { ArticlesComponent } from './@theme/pages/articles/articles.component';

import { JoboffersComponent } from './@theme/pages/joboffers/joboffers.component';
import { NewsComponent } from './@theme/pages/news/news.component';
import { PropertiesComponent } from './@theme/pages/property/properties/properties.component';

import { PropertyListComponent } from './@theme/pages/property/property-list/property-list.component';
import { PropertyMobileDetailComponent } from './@theme/pages/property/property-mobile-detail/property-mobile-detail.component';
import { PropertiessComponent } from './front-office/property/properties/properties.component';
import { PropertiesComponentF } from './front-office/properties/properties.component';
import { PropertyCollageComponent } from './@theme/pages/property/property-collage/property-collage.component';
import { IncidentFormComponent } from './front-office/incidents/incident-form/incident-form.component';
import { IncidentListComponent } from './front-office/incidents/incident-list/incident-list.component';
import { AddClaimComponent } from './@theme/pages/claims/add-claim/add-claim.component';
import { ModifyClaimComponent } from './@theme/pages/claims/modify-claim/modify-claim.component';
import { ViewClaimComponent } from './@theme/pages/claims/view-claim/view-claim.component';
// Combined Routes
const routes: Routes = [
  // Front-Office Routes
  {
    path: '',
    component: AllTemplateFrontComponent,  // Front-Office as Default Route
  },

  {
    path: 'message', // New route for the message component
    component: MessageComponent
  },
  {
    path: 'signin', // New route for the message component
    component: SigninComponent
  },
  {
    path: 'signup', // New route for the message component
    component: SignupComponent
  },
  { path: 'claims', component: ListClaimComponentFront },
  { path: 'claimsFront/AddClaim', component: AddClaimComponentFront },
  { path: 'claimsFront/EditClaim/:id', component: ModifyClaimComponentFront },
  { path: 'claimsFront/DetailsClaim/:id', component: ViewClaimComponentFront },
  { path: 'assessments', component: ListAssessmentComponentFront },
  { path: 'assessmentsFront/ViewAssessment/:id', component: ViewAssessmentComponentFront },
  { path: 'assessmentsFront/AddAssessment', component: AddAssessmentFrontComponent },
  { path: 'assessmentsFront/EditAssessment/:id', component: ModifyAssessmentFrontComponent },
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
  {
    path:'transactions',
    component:TransactionsComponent
  },
  {
    path:'list',
    component:PropertyListComponent
  },
  { path: 'property-mobile-detail/:id', component: PropertyMobileDetailComponent },
  {
    path:'prop',
    component:PropertiessComponent
  },
  {
    path: 'propertiesF',
    component: PropertiesComponentF
  },
  {
    path: 'report-incident/:propertyId',
    component: IncidentFormComponent
  },
  {
    path: 'incidents',
    component: IncidentListComponent
  },
  
  // Back-Office Routes
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./demo/pages/dashboard/dashboard.component').then((m) => DashboardComponent),
      },
      {
        path: 'component',
        loadChildren: () =>
          import('./demo/pages/components/component.module').then((m) => m.ComponentModule),
      },
      {
        path: 'sample-page',
        loadComponent: () =>
          import('./demo/pages/other/sample-page/sample-page.component').then((m) => SamplePageComponent),
      },
      {
        path: 'contracts',
        component: ContratsComponent
      },
      {
        path: 'articles',
        component: ArticlesComponent
      },
      { path: 'assessments', component: ListAssessmentComponent },
      { path: 'assessments/AddAssessment', component: AddAssessmentComponent },
      { path: 'assessments/EditAssessment/:id', component: ModifyAssessmentComponent },
      { path: 'assessments/ViewAssessment/:id', component: ViewAssessmentComponent },
      { path: 'claims/AddClaim', component: AddClaimComponent },
      { path: 'claims/EditClaim/:id', component: ModifyClaimComponent },
      { path: 'claims/DetailsClaim/:id', component: ViewClaimComponent },
      {
        path: 'blogs',
        component: BlogsComponent
      },
      {
        path: 'claims',
        component: ListClaimComponent
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
      {
        path: 'transactions',
        component: TransactionsComponent
      },
      {
        path: 'propertylistB',
        component: PropertyListComponent
      },
    ]
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
