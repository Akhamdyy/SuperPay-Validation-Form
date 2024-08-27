import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'superpay-form';

  reactiveForm: FormGroup= new FormGroup({});
  ngOnInit(): void {  
    this.reactiveForm = new FormGroup({
      email: new FormControl('',[Validators.required, Validators.email]),
      age: new FormControl('',[Validators.required, Validators.min(16), Validators.max(150)]),
      cardnum: new FormControl('',[Validators.required,Validators.minLength(12),Validators.maxLength(16),luhnValidator() ]),
      expnum: new FormControl('',[Validators.required, Validators.maxLength(4),expiredCard]),
      cvc: new FormControl('',[Validators.required, Validators.maxLength(3), Validators.minLength(3)]),
    });
  }
  onFormSubmitted(){
    console.log(this.reactiveForm);
  }

  
}
export function luhnValidator(): ValidatorFn {
  return (control: AbstractControl) => {
    const isValid = luhnCheck(control.value);
    return isValid ? null:  {'luhnCheck': isValid};
  };
}
// export const luhnCheck = (cardNumber: string): boolean => {
//   if(!cardNumber.length){
//     return false;
//   }
  
//   // Remove all whitespaces from card number.
//   cardNumber = cardNumber.replace(/\s/g,'');

//   // 1. Remove last digit;
//   const lastDigit = Number(cardNumber[cardNumber.length - 1]);

//   // 2. Reverse card number
//   const reverseCardNumber = cardNumber
//     .slice(0,cardNumber.length - 1)
//     .split('')
//     .reverse()
//     .map(x => Number(x));
  
//   let sum = 0;

//   // 3. + 4. Multiply by 2 every digit on odd position.
//   // Subtract 9 if digit > 9
//   for(let i = 0; i <= reverseCardNumber.length -1; i += 2){
//     reverseCardNumber[i] = reverseCardNumber[i]*2;
//     if(reverseCardNumber[i] > 9){
//       reverseCardNumber[i] = reverseCardNumber[i] - 9;
//     }
//   }

//   // 5. Make the sum of obtained values from step 4.
//   sum = reverseCardNumber
//     .reduce((acc, currValue) => (acc + currValue), 0);

//   // 6. Calculate modulo 10 of the sum from step 5 and the last digit. 
//   // If it's 0, you have a valid card number :)
//   return ((sum + lastDigit) % 10 === 0);
// };
export function expiredCard(control: AbstractControl): {[key:string]:boolean} | null {
    
  const [month, year] = control.value.split('/').map(Number);
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1; // getMonth() returns 0-11
  const currentYear = currentDate.getFullYear() % 100;

  return ((month < 1 || month > 12 || year < currentYear || (year === currentYear && month < currentMonth)) && month && year)?
    {isExp:true}: null
  
};
const luhnCheck = (num: any) => {
  const arr = `${num}`
    .split('')
    .reverse()
    .map(x => Number.parseInt(x));
  const lastDigit = arr.shift();
  let sum = arr.reduce(
    (acc, val, i) =>
      i % 2 !== 0 ? acc + val : acc + ((val *= 2) > 9 ? val - 9 : val),
    0
  );
  if (lastDigit !== undefined) {
    sum += lastDigit;
  }
  return sum % 10 === 0;
};

//5484460030085286