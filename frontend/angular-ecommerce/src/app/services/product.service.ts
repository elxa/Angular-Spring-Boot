import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../common/product';
import { map } from 'rxjs/operators';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  //url that mentioned
  // private baseUrl = 'http://localhost:8080/api/products?size=100'; //change page size to 100 items
  private baseUrl = 'http://localhost:8080/api/products';
  private categoryUrl = 'http://localhost:8080/api/product-category';

  constructor(private httpClient: HttpClient) { }


  getProduct(theProductId: number): Observable<Product> {
    //need to build URL based on product id
    const productURL = `${this.baseUrl}/${theProductId}`;

    return this.httpClient.get<Product>(productURL);
  }


  //return an observable map the json data rest to Product array
  getProductList(theCategoryId: number): Observable<Product[]> {

    //need to build URL based on category id
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`;
    return this.getProducts(searchUrl);
  }

  //**********return an observable map the json data rest to Product array ------- USE PAGING **************
  getProductListPaginate(thePage: number,
    thePageSize: number,
    theCategoryId: number): Observable<GetResponseProducts> {

    //need to build URL based on category id, page and size
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`
      + `&page=${thePage}&size=${thePageSize}`;
    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }

  //call categories from the db dynamically
  getProductCategories(): Observable<ProductCategory[]> {
    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    );
  }

  //need to build URL based on the keyword
  searchProducts(theKeyword: string): Observable<Product[]> {
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`;
    return this.getProducts(searchUrl);
  }

  searchProductsPaginate(thePage: number,
                             thePageSize: number,
                             theKeyword: string): Observable<GetResponseProducts> {
    //need to build URL based on keyword, page and size
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`
                      + `&page=${thePage}&size=${thePageSize}`;
    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }

  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }

}

//unwraps the json from spring data rest _embedde entry
interface GetResponseProducts {
  _embedded: {
    products: Product[];
  },
  //for paging 
  page: {
    size: number, //size of this page
    totalElements: number, //grand total of all elemets in the database. But we are not returning all of the elements. just the 'count' for informational purposes only
    totalPages: number, //total pages available
    number: number//current page
  }
}
//create interface to call categories from db
interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  }

}
