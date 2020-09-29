import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = []; //our shopping cart --> an array of cart Items
  totalPrice: Subject<number> = new Subject<number>(); // Subject --> is a subclass of observable. We can use Subject to publish events in our code. The event will be sent to all of the subscribers
  totalQuantity: Subject<number> = new Subject<number>();

  constructor() { }

  addToCart(theCartItem: CartItem) {
    //check if we already have the item in our cart 
    let alreadyExistsInCart: boolean = false;
    let existingCartItem: CartItem = undefined;

    if (this.cartItems.length > 0) {
      //find the item in the cart based on item id
      //**************************** 1st way ********************************* */
      existingCartItem = this.cartItems.find(tempCartItem => tempCartItem.id === theCartItem.id); //returns first element that passes else returns undefined
     
      //**************************** 2nd way ********************************* */
      // for(let tempCartItem of this.cartItems){ //check our shopping cart for a specific id
      //   if(tempCartItem.id === theCartItem.id){
      //     existingCartItem = tempCartItem;
      //     break;
      //   }
      // }


      //check if we found it 
      alreadyExistsInCart = (existingCartItem != undefined); //true
    }
    if(alreadyExistsInCart){
      //increment the quantity
      existingCartItem.quantity++;
    }
    else{
      //just add the item to the array 
      this.cartItems.push(theCartItem);
    }
    //compute cart total price and total quantity 
    this.computeCartTotals();
  }


  computeCartTotals() {
    let totalPriceValue: number = 0; //total price in the cart
    let totalQuantityValue: number = 0; //total elements in the cart

    for(let currentCartItem of this.cartItems){
      totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
      totalQuantityValue += currentCartItem.quantity;
    }
    //publish the new values.... all subscribers will receive the new data 
    //next() --> publish/send event
    this.totalPrice.next(totalPriceValue); //this will publish events to all subscribers, one event for totalPrice
    this.totalQuantity.next(totalQuantityValue); //one event for totalQuantity

    //log cart data just for debugging purposes
    this.logCartData(totalPriceValue, totalQuantityValue);
  }

  logCartData(totalPriceValue: number, totalQuantityValue: number) {
    console.log("contents of the cart");
    for(let temp of this.cartItems){
      const subTotalPrice = temp.quantity * temp.unitPrice;
      console.log(`name: ${temp.name}, quantity: ${temp.quantity}, unitPrice=${temp.unitPrice}, subTotalPrice = ${subTotalPrice}`);
    }
    console.log(`totalPrice: ${totalPriceValue.toFixed(2)}, totalQuantity: ${totalQuantityValue}`); //toFixed(2) --> two digits after decimal 124.98
    console.log('--------');
  }

  decrementQuantity(theCartItem: CartItem){
    theCartItem.quantity--;
    if(theCartItem.quantity ===0){
      this.remove(theCartItem);
    }
    else{
      this.computeCartTotals();
    }
  }

  remove(theCartItem: CartItem) {
    //get index of item in the array
    const itemIndex = this.cartItems.findIndex(tempCartItem => tempCartItem.id === theCartItem.id);
    //if found remove the item from the array at given index
    if(itemIndex > -1){
      this.cartItems.splice(itemIndex, 1);
      this.computeCartTotals();
    }
  }

}
