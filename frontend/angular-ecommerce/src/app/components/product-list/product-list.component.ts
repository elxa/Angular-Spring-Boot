import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  // templateUrl: './product-list-table.component.html',
  //  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = []; //initialize default values
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  searchMode: boolean = false;
  //new properies for pagination
  thePageNumber: number = 1;
  // thePageSize: number = 10;
  thePageSize: number = 5; //each page will have 5 element
  theTotalElements: number = 0;

  //for search keyword pagination 
  previousKeyword: string = null;


  constructor(private productService: ProductService,
              private cartService: CartService,
              private route: ActivatedRoute) { }   //ActivatedRoute --> the current activate route that loaded the component. Useful for accesing route parameters

  //similar to @PostConstruct
  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listPrducts();
    });
  }

  listPrducts() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');//the keyword exist in {path: 'search/:keyword', component: ProductListComponent}
    if(this.searchMode){ //if exist keyword
      this.handleSearchProducts();
    }
    else{
      this.handleListProducts();
    }
  }

  //for searching product
  handleListProducts() {
    //check if 'id' parameter is available
    //route(use the activate route).snapshot(state of route at this given moment in time).paramMap(map of all the route parameters).has('id')
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if (hasCategoryId) {
      //get the "id" param string. convert string to a number using the "+" symbol
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id'); //parameter value is returned as string, use the "+" symbol to convert to number
    }
    else {
      //not category id available ..default to category id 1
      this.currentCategoryId = 1;
    }
    //
    //check if we have a different category than previous
    //Note: Angular will reuse a component if its currently being viewed
    //

    //if we have a different category id than previous then set thePageNumber back to 1
    if( this.previousCategoryId != this.currentCategoryId){
      this.thePageNumber = 1;
    }
    this.previousCategoryId = this.currentCategoryId;
    console.log(`currentCategoryId = ${this.currentCategoryId}, thePageNumber=${this.thePageNumber}`);

    //now get the products for the given category id
    // this.productService.getProductList().subscribe(
    this.productService.getProductListPaginate(this.thePageNumber -1,
                                               this.thePageSize,
                                                this.currentCategoryId)
                                                .subscribe(this.processResult());
  }
  processResult(){
    return data => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;  //from json obj
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    }
  }

  // handleSearchProducts(){
  //   const theKeyword: string = this.route.snapshot.paramMap.get('keyword');
  //   //now search for the products using keyword
  //   this.productService.searchProducts(theKeyword).subscribe(
  //     data => {
  //       this.products = data;  //assign results to the product array
  //     }
  //   );
  // }

  handleSearchProducts(){
    const theKeyword: string = this.route.snapshot.paramMap.get('keyword');
    //if we have a different keyword than previous then set thePageNumber to 1 
    if(this.previousKeyword != theKeyword){
      this.thePageNumber = 1;
    }
    this.previousKeyword = theKeyword;
    console.log(`keyword=${theKeyword}, thePageNumber=${this.thePageNumber}`);
    //now search for the products using keyword
    this.productService.searchProductsPaginate(this.thePageNumber-1, 
                                                this.thePageSize,
                                                theKeyword)
                                                .subscribe(this.processResult());
  }

  //if user change the size of products for each page 
  updatePageSize(pageSize: number){
    this.thePageSize = pageSize;
    this.thePageNumber = 1;
    this.listPrducts(); //refresh the page view 
  }

  addToCart(theProduct: Product){
    console.log(`adding to cart: ${theProduct.name}, ${theProduct.unitPrice}`);
    const theCartItem = new CartItem(theProduct);
    
    this.cartService.addToCart(theCartItem);
  }


}
