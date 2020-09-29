import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { HttpClientModule } from '@angular/common/http';
import { ProductService } from './services/product.service';

import {Routes, RouterModule} from '@angular/router';
import { ProductCategoryMenuComponent } from './components/product-category-menu/product-category-menu.component';
import { SearchComponent } from './components/search/search.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component'

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CartStatusComponent } from './components/cart-status/cart-status.component';
import { CartDetailsComponent } from './components/cart-details/cart-details.component';
import { CheckoutComponent } from './components/checkout/checkout.component'; //for pagination add ng-bootstrap
import { ReactiveFormsModule } from '@angular/forms';

//define our routes
//order of routes is important first match wins. Start from most specific to generic
const routes: Routes = [
  {path: 'checkout', component: CheckoutComponent}, //cart details
  {path: 'cart-details', component: CartDetailsComponent}, //cart details
  {path: 'products/:id', component: ProductDetailsComponent}, //product details
  {path: 'search/:keyword', component: ProductListComponent}, //search
  //category/:id --> path to match, component: ProductListComponent --> when path matches, create new instance of component
  {path: 'category/:id', component: ProductListComponent}, 
  {path: 'category', component: ProductListComponent},
  {path: 'products', component: ProductListComponent},
  {path: '', redirectTo: '/products', pathMatch: 'full'}, 
  //** --> this is the generic wildcard. It will match on anything that didn't match above routes
  {path: '**', redirectTo: '/products', pathMatch: 'full'}, 
];

@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    ProductCategoryMenuComponent,
    SearchComponent,
    ProductDetailsComponent,
    CartStatusComponent,
    CartDetailsComponent,
    CheckoutComponent
  ],
  imports: [ 
    RouterModule.forRoot(routes), //define our routes   
    BrowserModule,
    HttpClientModule, //add http
    NgbModule, //ng-bootstrap for pagination
    ReactiveFormsModule //for import reactive forms
  ],
  providers: [ProductService], //add productservice
  bootstrap: [AppComponent]
})
export class AppModule { }
