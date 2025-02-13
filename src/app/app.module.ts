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
import { BlogDetailComponent } from './blog-detail/blog-detail.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { FooterComponent } from './footer/footer.component';
import { HomeadminComponent } from './homeadmin/homeadmin.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ProductadminComponent } from './productadmin/productadmin.component';
import { BlogadminComponent } from './blogadmin/blogadmin.component';
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
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
         BlogDetailComponent,
         FeedbackComponent,
        
         FooterComponent,
                   HomeadminComponent,
                   NotificationsComponent,
                   SidebarComponent,
                   ProductadminComponent,
                   BlogadminComponent,
                   LoginComponent,
                   
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    RouterModule,
    ReactiveFormsModule,
  
  ],  
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  
 
 }
