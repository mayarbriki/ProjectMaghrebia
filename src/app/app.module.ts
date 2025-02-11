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

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LayoutComponent,
    HomeComponent,
    HeaderComponent,
         ProductComponent,
         BlogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],  
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(@Inject(Injector) private injector: Injector) {
    // Convert NavbarComponent to a custom element
    const navbarElement = createCustomElement(NavbarComponent, { injector });
    customElements.define('app-navbar-element', navbarElement);

    // Convert ProductComponent to a custom element
    const productElement = createCustomElement(ProductComponent, { injector });
    customElements.define('app-product', productElement);
    const blogElement = createCustomElement(BlogComponent, { injector });
    customElements.define('app-blog', blogElement);
  }
 }
