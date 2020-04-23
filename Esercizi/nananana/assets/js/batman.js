var num_na = parseInt(Math.random() * 20 + 1);

///////////////////////////////////////

alert("SOLUZIONE 0");

let sol0 = "";

for (let i = 0; i < 3; i++) {
    sol0 += "Na";
    alert(sol0);
}
alert(sol0 + ", Batman!");

///////////////////////////////////////

console.log("SOLUZIONE 1");

let sol1 = "";

for (let i = 0; i < num_na; i++) {
    sol1 += "Na";
}
console.log(sol1 + ", Batman!");

///////////////////////////////////////

console.log("SOLUZIONE 2");

var batorial = (n) => {
    if (n < 1)
        return ", Batman!";
    else
        return "Na" + batorial(n - 1);
};
console.log(batorial(num_na));

///////////////////////////////////////

console.log("SOLUZIONE 3");

var sol3 = [];

for (let i = 0; i < num_na; i++) {
    sol3.push("Na");
}
sol3.push(", Batman!");

console.log(sol3.reduce((sol, na) => (sol + na)));

///////////////////////////////////////

console.log("SOLUZIONE 4");

var sol4 = [];

sol4.push(", Batman!");
for (let i = 0; i < num_na; i++) {
    sol4.push("Na");
}

var true_sol4 = "";

for (let i = 0; i < num_na; i++) {
    true_sol4 += sol4.pop();
}
true_sol4 += sol4.pop();

console.log(true_sol4);

///////////////////////////////////////

console.log("SOLUZIONE 5");

console.log(_.reduce(_.map(_.range(num_na), () => "Na"), (sol, na) => (sol + na)) + ", Batman!");