//Activity 1
/*
const account_id =100;
account_id =200;
console.log(account_id);
*/

//Activity 2
/*
let a= 10;
var b= 20;
console.log(a,b);
{
    let a= 100;
    var b= 200;
    console.log(a,b);
}
console.log(a,b);
*/

//Activity 3
/*
let id=5;
let accountno=5;
let accname="Prajwal";
let status=true;
let bigint=BigInt(9);
let nullval=null;
let undefined;
let symbol=Symbol(id);

console.log(accountno,accname,status,bigint,nullval,undefined,symbol);
console.log(typeof(id));
console.log(typeof(accountno));
console.log(typeof(accname));
console.log(typeof(status));
console.log(typeof(bigint));
console.log(typeof(nullval));
console.log(typeof(undefined));
console.log(typeof(symbol));
*/

//Activity 5 Student info print
/*
let rollno=94;
let name="Prajwal Patil";
let email="Prajwal@gmail.com"

console.table([rollno,name,email]);
*/

//Activity 6 Even odd
/*
let x=6,y=5;

if(x%2==0)
{console.log("Even No.");}
else
{console.log("Odd No.");}
*/

//Activity 7 loop print 1 to 10
/*
for(i=1;i<=10;i++)
{
    console.log(i);
}
*/

//Activity 8 Pass or Fail
/*
Marks = 56;
if(Marks>=40)
{
    console.log("Pass");
}
else
{
    console.log("Fail");
}
*/


//Acitvity 9 log
/*
let x=10
y=x;
console.log(x,y);
x=100;
console.log(x,y);
*/

//Activity 10 create html file and 
console.log("Prajwal");


//Display Student Information
let studname= "Prajwal Patil";
let email="Prajwal@gmail.com"
let rollno=94;
let age=21;

document.write("Display Student Information")
document.write("<br>")
document.write("Name :",studname)
document.write("<br>Email :",email)
document.write("<br>RollNo :",rollno)
document.write("<br>Age :",age)
document.write("<br>")
document.write("<hr>")


//Odd- Even Number Check
document.write("<br>")
document.write("Odd- Even Number Check")
document.write("<br>")

let num1=99

if(num1%2==0)
{
    document.write(num1," is even Number");
}
else
{
    document.write(num1," is odd number");
}

document.write("<br>")
document.write("<hr>")
document.write("<br>")

//Display number using loop
document.write("Display number using loop")

let arr1=[91,68,53,11,7,34,56,87,9]
for(let i=0;i<arr1.length;i++)
{
    document.write("<br>"+arr1[i]);
}
document.write("<br>")
document.write("<hr>")
document.write("<br>")

//Check student pass or fail
document.write("Check student pass or fail")
document.write("<br>")

let marks=99;
if(marks>40)
{
    document.write("Pass");
}
else{
    document.write("Fail");
}