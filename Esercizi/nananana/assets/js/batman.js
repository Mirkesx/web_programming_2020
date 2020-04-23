var num_na = parseInt(Math.random() * 20 + 1);

/////////////////////////////////////// Alert Troll

alert("SOLUZIONE 0");

let sol0 = "";

for (let i = 0; i < 3; i++) {
    sol0 += "Na";
    alert(sol0);
}
alert(sol0 + ", Batman!");

/////////////////////////////////////// Iterativa

console.log("SOLUZIONE 1");

let sol1 = "";

for (let i = 0; i < num_na; i++) {
    sol1 += "Na";
}
console.log(sol1 + ", Batman!");

/////////////////////////////////////// Ricorsiva

console.log("SOLUZIONE 2");

var bat_orial = (n) => {
    if (n < 1)
        return ", Batman!";
    else
        return "Na" + bat_orial(n - 1);
};
console.log(bat_orial(num_na));

/////////////////////////////////////// Push/Pop

console.log("SOLUZIONE 3");

var sol3 = [];

sol3.push(", Batman!");
for (let i = 0; i < num_na; i++) {
    sol3.push("Na");
}

var true_sol3 = "";

for (let i = 0; i < num_na; i++) {
    true_sol3 += sol3.pop();
}
true_sol3 += sol3.pop();

console.log(true_sol3);

/////////////////////////////////////// Lodash Map/Reduce

console.log("SOLUZIONE 4");

console.log(_.reduce(_.map(_.range(num_na), () => "Na"), (sol, na) => (sol + na)) + ", Batman!");