import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { Luv2ShopFormService } from 'src/app/services/luv2-shop-form.service';
import { Luv2ShopValidators } from 'src/app/validators/luv2-shop-validators';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup: FormGroup;

  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  countries: Country[] = [];
  shippingAdderssStates: State[] = [];
  billingAdderssStates: State[] = [];

  constructor(private formBuilder: FormBuilder,
              private luv2ShopFormService: Luv2ShopFormService  ) { }

  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
         firstName: new FormControl('', [ Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhitespace ]), //add validators (initial value, [validators]) // Luv2ShopValidators.notOnlyWhitespace --> we create this // firstName: [''],  
         lastName: new FormControl('', [ Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhitespace ]),    
        email: new FormControl('', [ Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$') ])
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('', [ Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhitespace ]),
        city: new FormControl('', [ Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhitespace ]),
        state: new FormControl('', [ Validators.required ]),
        country: new FormControl('', [ Validators.required ]),
        zipCode: new FormControl('', [ Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhitespace ]),
      }), 
      billingAddress: this.formBuilder.group({
        street: new FormControl('', [ Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhitespace ]),
        city: new FormControl('', [ Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhitespace ]),
        state: new FormControl('', [ Validators.required ]),
        country: new FormControl('', [ Validators.required ]),
        zipCode: new FormControl('', [ Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhitespace ]),
      }), 
      creditCard: this.formBuilder.group({
        cardType:  new FormControl('', [ Validators.required ]),
        nameOnCard:  new FormControl('', [ Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhitespace ]),
        cardNumber:  new FormControl('', [  Validators.required, Validators.pattern('[0-9]{16}')]), //regx only 16 digits
        securityCode: new FormControl('', [  Validators.required, Validators.pattern('[0-9]{3}')]),//regx only 3 digits
        expirationMonth: [''],
        expirationYear: [''],
      }), 
    });

    //populate credit card months
    const startMonth: number = new Date().getMonth() + 1;
    console.log("startMonth: " + startMonth);
    this.luv2ShopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieveved credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );
    //populate credit card years
    this.luv2ShopFormService.getCreditCardYears().subscribe(
      data => {
        console.log("Retrieveved credit card years: " + JSON.stringify(data));
        this.creditCardYears = data;
      }
    );

    //populate countries, when form is initially displayed, populate the countries
    this.luv2ShopFormService.getCountries().subscribe(
      data => {
        //console.log("Retrieved countries: " + JSON.stringify(data));
        this.countries = data;
      }
    );


  }

  //define getters and setters methods to access form controls
  get firstName(){ return this.checkoutFormGroup.get('customer.firstName'); }
  get lastName(){ return this.checkoutFormGroup.get('customer.lastName'); }
  get email(){ return this.checkoutFormGroup.get('customer.email'); }

  get shippingAddressStreet(){ return this.checkoutFormGroup.get('shippingAddress.street'); }
  get shippingAddressCity(){ return this.checkoutFormGroup.get('shippingAddress.city'); }
  get shippingAddressState(){ return this.checkoutFormGroup.get('shippingAddress.state'); }
  get shippingAddressZipCode(){ return this.checkoutFormGroup.get('shippingAddress.zipCode'); }
  get shippingAddressCountry(){ return this.checkoutFormGroup.get('shippingAddress.country'); }

  get billingAddressStreet(){ return this.checkoutFormGroup.get('billingAddress.street'); }
  get billingAddressCity(){ return this.checkoutFormGroup.get('billingAddress.city'); }
  get billingAddressState(){ return this.checkoutFormGroup.get('billingAddress.state'); }
  get billingAddressZipCode(){ return this.checkoutFormGroup.get('billingAddress.zipCode'); }
  get billingAddressCountry(){ return this.checkoutFormGroup.get('billingAddress.country'); }

  get creditCardType(){ return this.checkoutFormGroup.get('creditCard.cardType'); }
  get creditCardNameOnCard(){ return this.checkoutFormGroup.get('creditCard.nameOnCard'); }
  get creditCardNumber(){ return this.checkoutFormGroup.get('creditCard.cardNumber'); }
  get creditCardSecurityCode(){ return this.checkoutFormGroup.get('creditCard.securityCode'); }
  


  onSubmit(){
    console.log("handling the submit button");
    //check validation before submit
    if(this.checkoutFormGroup.invalid){
      this.checkoutFormGroup.markAllAsTouched(); //markAllAsTouched --> touching all fields triggers the display of the error mesages
    }
    console.log(this.checkoutFormGroup.get('customer').value);
    console.log("the email address is : "+this.checkoutFormGroup.get('customer').value.email);

    console.log("the shipping address country is : " + this.checkoutFormGroup.get('shippingAddress').value.country.name);
    console.log("the shipping address state is : " + this.checkoutFormGroup.get('shippingAddress').value.state.name);
  }

  copyShippingAddressToBillingAndress(event){
    if(event.target.checked){
      this.checkoutFormGroup.controls.billingAddress
      .setValue(this.checkoutFormGroup.controls.shippingAddress.value);

      //bug fix for states
      this.billingAdderssStates = this.shippingAdderssStates;
    }
    else{
      this.checkoutFormGroup.controls.billingAddress.reset();
      //bug fix for states
      this.billingAdderssStates = [];
    }
  }

  //if the current year is selected -> then only show the remaining months for the year 
  //                                -> start ay current month 12
  //if a future year is selected -> then show months: 1-12
  //fields are depended
  handleMonthsAndYears(){
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup.value.expirationYear);
    //if the current year equals the selected year then start with the current month 
    let startMonth: number;

    if(currentYear === selectedYear){
      startMonth = new Date().getMonth() + 1; //get the current month 
    }
    else{
      startMonth = 1;
    }
    //get credit card months
    this.luv2ShopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );
  }

  getStates(formGroupName: string){
    const formGroup = this.checkoutFormGroup.get(formGroupName);
    const countryCode = formGroup.value.country.code;
    const countryName = formGroup.value.country.name;

    console.log(`${formGroupName} country code: ${countryCode}`);
    console.log(`${formGroupName} country name: ${countryName}`);

    this.luv2ShopFormService.getStates(countryCode).subscribe(
      data => {
        if(formGroupName === 'shippingAddress'){
          this.shippingAdderssStates = data;
        }
        else{
          this.billingAdderssStates = data;
        }
        //select first item by default
        formGroup.get('state').setValue(data[0]);
      }
    );
  }

}
