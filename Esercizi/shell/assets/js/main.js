//VARIABILI

let shells = [];

//JQUERY

$("#terminal_icon").dblclick(createShell);
$( "#terminal_icon" ).draggable({ grid: [ 100, 100 ] });

//FUNZIONI

function createShell() {
    let s = new shell();
    shells.push(s);
};