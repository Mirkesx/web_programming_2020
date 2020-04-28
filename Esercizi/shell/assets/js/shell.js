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
    window,location.href = "#shell_input";
    document.getElementById("shell_input").focus();

}

function parse_command() {
    const line = document.getElementById("shell_input").value;
    const time = document.getElementById("shell_time").value;

    //console.log(line);
    //console.log(time);

    document.getElementById("past_commands").innerHTML += "<font class='past_time'>" + time + " > </font> : <font class='past_path'>~</font>$ " + line + "<br>";

    let line_splitted = [line.split(" ",1)[0], line.substr(line.split(" ",1)[0].length+1)];
    let com = line_splitted[0];
    let response = "";
    //console.log(line_splitted);

    if(commands[com] !== undefined) {
        response = commands[com](line_splitted[1]);
    }
    else {
        response = 'Comando "'+com+'" non trovato! Controllare la sintassi del comando e riprovare!';
    }

    document.getElementById("past_commands").innerHTML += response + "<br>";

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
