import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Front-Office Import
import { AllTemplateFrontComponent } from './front-office/all-template-front/all-template-front.component';

// Back-Office Imports
import { AdminComponent } from './demo/layout/admin';
import { EmptyComponent } from './demo/layout/empty';
import DashboardComponent from './demo/pages/dashboard/dashboard.component';
import SamplePageComponent from './demo/pages/other/sample-page/sample-page.component';
import { ContratsComponent } from './@theme/pages/contrats/contrats.component';
import { ArticlesComponent } from './@theme/pages/articles/articles.component';
import { AssesementsComponent } from './@theme/pages/assesements/assesements.component';
import { BlogsComponent } from './@theme/pages/blogs/blogs.component';
import { ClaimsComponent } from './front-office/claims/claims.component';
import { IncidentsComponent } from './@theme/pages/incidents/incidents.component';
import { JoboffersComponent } from './@theme/pages/joboffers/joboffers.component';
import { NewsComponent } from './@theme/pages/news/news.component';
import { PropertiesComponent } from './@theme/pages/properties/properties.component';
import { MessageComponent } from './message/message.component';
import { SigninComponent } from './front-office/register/signin/signin.component';
import { SignupComponent } from './front-office/register/signup/signup.component';
import { ServicesComponent } from './front-office/services/services.component';

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
  {
    path: 'claims', // New route for the message component
    component: ClaimsComponent
  },
  {
    path: 'Services', // New route for the message component
    component: ServicesComponent
  },

  // Back-Office Routes
  {
    path: 'admin',
    component: AdminComponent, // Admin Layout with Sidebar
    children: [
      {
        path: 'admin',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
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
  // Authentication Routes
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
  // Wildcard Route (Redirect to Front-Office)
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
