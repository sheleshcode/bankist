'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Shelesh Badola',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jasmine Dhillon',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements selectors
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
/***********************Movements Elements*****************************************/

function movement(movements,sort=false){
  containerMovements.innerHTML='';
  const mov = sort?movements.slice().sort((a,b)=>
  {return a-b}):movements;
  let values =mov.map((x,i) =>{
  let type = x>0?'deposit':'withdrawal';
  return  containerMovements.insertAdjacentHTML('afterbegin',`<div class="movements__row">
  <div class="movements__type movements__type--${type}">${i+1} ${type}</div>
  <div class="movements__value">${x}₹</div>
  </div>`);
  });
  }


/**************************************In and Out Values**************************************************/

function InandOut(account){
let positiveArray=[];
let negativeArray=[];
account.movements.forEach((element) => {
  if(element<0){
    negativeArray.push(element);
  }else{
    positiveArray.push(element);
  }
});
let totalPositive =positiveArray.reduce(function(a,b){
      return a+b;
},0); 

labelSumIn.innerHTML=`${totalPositive}₹`;

let totalNegative =negativeArray.reduce(function(a,b){
  return a+b;
},0);
labelSumOut.innerHTML=`${totalNegative}₹`;
//Total Sum
account.balance=account.movements.reduce(function(a,b){
  return a+b;
},0);
labelBalance.innerHTML=`${account.balance}₹`;
//Interest Values
const interest =account.movements
                .filter(x=>x>0)
                .map(deposit=>((deposit*account.interestRate)/100))
                .filter((int,i,arr)=>{
                  return int>=1;
                })
                .reduce((a,b) =>a+b,0);
labelSumInterest.textContent=`${interest}₹`;

};
/*************************************Conversion Dollar to rupee************************************************/
const Dollar =72.5;
let dollarConversion=account2.movements.map(x=>{
  return x*Dollar;
});
/******************************Usernames************************************************/
function createUserName(accs){
  let users=accs.forEach(function(acc){
  acc.username=acc.owner.toLowerCase().split(' ').map(x=>{
    return x[0];
    }).join('');
  });
  };
  createUserName(accounts);
/**********************************Login-Feature*************************************************/
let currentAccount;
btnLogin.addEventListener('click',function(e){
  e.preventDefault();
 currentAccount =accounts.find(
   acc=>acc.username===inputLoginUsername.value
   );
   if (currentAccount?.pin===Number(inputLoginPin.value)){
     /*****clear input fields */
     inputLoginUsername.value=inputLoginPin.value='';
     inputLoginPin.blur();
    /**Welcome message***/
    labelWelcome.textContent=`Welcome ${currentAccount.owner.split(' ')[0]}`
    /***Shows app after login */
    containerApp.style.opacity=100;
    //update UI
    updateUI(currentAccount);
   
   }
   console.log(currentAccount);
});
/****Update UI */
function updateUI(acc){
   //****In and outs function */
   InandOut(acc);
   /******Movements*/
   movement(acc.movements);
}



/*****************Transfer Money from 1 account to another*/
btnTransfer.addEventListener('click',function(account){
  account.preventDefault();
const amountTransfer=Number(inputTransferAmount.value);
const receiverAccount=accounts.find(acc=>
  acc.username===inputTransferTo.value); 
  console.log(amountTransfer,receiverAccount);
  if(amountTransfer>0 && currentAccount.balance>=amountTransfer &&
    receiverAccount &&
     receiverAccount?.username !==currentAccount.username){
       //Doing the transfer
    currentAccount.movements.push(-amountTransfer);
    receiverAccount.movements.push(amountTransfer);
    updateUI(currentAccount);
  }
  inputTransferAmount.blur();
  inputTransferTo.blur();
});
console.log(currentAccount);
/************Request Loan feature ***********/
btnLoan.addEventListener('click',function(e){
    e.preventDefault();
    const amount =Number(inputLoanAmount.value);
if(amount>0 && currentAccount.movements.some(mov =>
  mov>= amount*0.1)){
 currentAccount.movements.push(amount);
 updateUI(currentAccount);
  }
  inputLoanAmount.value='';
});
/**********************Deleting an Account******************/
btnClose.addEventListener('click',function(e){
  e.preventDefault();
//confirming the credentials
  if(inputCloseUsername.value===currentAccount.username 
  && Number(inputClosePin.value)===currentAccount.pin ){
//Deleting the user from accounts
    let index =accounts.findIndex(acc=>
    acc.username===currentAccount.username);
  accounts.splice(index,1);
  //removing the ui
  containerApp.style.opacity=0;
  }
});
/********Updating Dates */
var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();

today = mm + '/' + dd + '/' + yyyy;
document.write(today);
labelDate.textContent=`${today}`;
/*****Button Sort */
let sorted =false;
btnSort.addEventListener('click',function(e){
  e.preventDefault();
  movement(currentAccount.movements,!sorted);
  sorted=!sorted;
  console.log("working");
});

/////////////////////////////////////////////////
