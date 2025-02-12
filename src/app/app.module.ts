import { NgModule, Injector, Inject } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { createCustomElement } from '@angular/elements'; // Add this import
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { LayoutComponent } from './layout/layout.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { ProductComponent } from './product/product.component';
import { BlogComponent } from './blog/blog.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
@NgModule({
  declarations: [
    AppComponent,
    ProductDetailComponent ,
    NavbarComponent,
    LayoutComponent,
    HomeComponent,
    HeaderComponent,
         ProductComponent,
         BlogComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,

    AppRoutingModule,
    RouterModule
  ],  
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  
 
 }
