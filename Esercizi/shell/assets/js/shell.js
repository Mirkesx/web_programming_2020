// GLOBALS

var fS; //fontSize del body

// FUNCTIONS

function create_shell() {
    fS = 30;
    document.body.style.fontSize = document.getElementById("shell_input").style.fontSize = fS+"px";
    document.getElementById("past_commands").innerHTML = "";
    new_command_line();
}

function new_command_line() {
    const $shell = document.getElementById("command_line");
    const today = new Date();
    const hours = today.getHours().toString().lengthlength === 1 ? "0"+today.getHours() : today.getHours();
    const minutes = today.getMinutes().toString().length === 1 ? "0"+today.getMinutes() : today.getMinutes();
    const seconds =  today.getSeconds().toString().length === 1 ? "0"+today.getSeconds() : today.getSeconds();
    //console.log(seconds);
    //console.log(today.getSeconds().toString().length);
    const time = hours + ":" + minutes + ":" + seconds;
    document.getElementById("time").innerHTML = time + " > ";
    document.getElementById("shell_input").value = "";
    document.getElementById("shell_time").value = time;

}

function parse_command() {
    const command = document.getElementById("shell_input").value;
    const time = document.getElementById("shell_time").value;

    console.log(command);
    console.log(time);

    document.getElementById("past_commands").innerHTML += "<font class='past_time'>" + time + "</font> > " + command + "<br>";
    new_command_line();
}

// EVENTS

window.addEventListener('keypress', function (event) {
    if (event.keyCode === 13) { // Riconoscimento Enter per invio del comando
        parse_command();
    }
}, false);

document.addEventListener('keydown', function(event) {
    if (event.ctrlKey && event.key === ',') { // Ingrandire il font
        fS += 2;
        document.body.style.fontSize = document.getElementById("shell_input").style.fontSize = fS+"px";
        //console.log(document.body.style.fontSize);
    }

    if (event.ctrlKey && event.key === '.') { // Diminuire il font
        fS -= 2;
        document.body.style.fontSize = document.getElementById("shell_input").style.fontSize = fS+"px";
        //console.log(document.body.style.fontSize);
      }
  });

// MAIN

create_shell();
