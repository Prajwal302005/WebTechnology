let superheros=["Ironman","halku","thor"]
let ab=["kirish","spiderman"];

// superheros.push(ab);
// console.log(superheros);
// console.log(superheros[3]);
// console.log(superheros[2][2]);


console.log(superheros.concat(ab));


const anotherArray=[1,2,3,[4,5,6],7,[6,7,[4,5]]];
const realanotherArray= anotherArray.flat(1);// flat:  convert into single array
console.log(realanotherArray);

console.log(Array.isArray("prajwal"));//


//data scripting using this methods

console.log(Array.from("prajwal"))//converts to array
console.log(Array.from({name:"prajwal"}));
let score1=100;
let score2=200;
let score3=300;
console.log(Array.of(score1,score2,score3));


