
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { AppRoutingModule } from './app/app-routing.module';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { BlogsComponent } from './app/front-office/blogs/blogs.component';

bootstrapApplication(AppComponent, {
  providers: [BlogsComponent,provideHttpClient(),importProvidersFrom(BrowserModule, AppRoutingModule), provideAnimations()]
}).catch((err) => console.error(err));

