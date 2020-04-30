// GLOBALS

var fS; //fontSize del body
var actual_node = file_manager.root;
var temp_node = undefined;

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
    document.getElementById("path").innerHTML = printPath(actual_node);
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

    document.getElementById("past_commands").innerHTML += "<font class='past_time'>" + time + " > </font> : <font class='past_path'>"+printPath(actual_node)+"</font>$ " + line + "<br>";

    let line_splitted = [line.split(" ",1)[0], line.substr(line.split(" ",1)[0].length+1)];
    let com = line_splitted[0];
    let response = {};
    //console.log(line_splitted);

    if(commands[com] !== undefined) {
        response = commands[com].com(actual_node, line_splitted[1]);
        actual_node = response.node;
    }
    else {
        response = 'Comando "'+com+'" non trovato! Controllare la sintassi del comando e riprovare!';
    }

    console.log("actual_node ",actual_node);

    switch(com) {
        case "nano":
            nanoHandler(response);
            break;
        default:
            if(response.result && response.result.length > 0)
                document.getElementById("past_commands").innerHTML += response.result + "<br>";
    }
    new_command_line();
}

// FUNCTIONS

function nanoHandler(response) {
    if(typeof response.result === 'string') {
        document.getElementById("past_commands").innerHTML += response.result + "<br>";
        return;
    }
    console.log(response);
    temp_node = response.result;
    document.getElementById("past_commands").innerHTML += "<textarea id='catArea'>"+(temp_node.content !== undefined ? temp_node.content : "");
    document.getElementById("command_line").style.display = "none";
}

// EVENTS

window.addEventListener('keypress', function (event) {
    if (event.keyCode === 13) { // Riconoscimento Enter per invio del comando
        let $el;
        if(($el = document.getElementById("catArea")) !== null && $el !== undefined) {
            console.log(file_manager[temp_node.name+temp_node.id]);
            file_manager[temp_node.name+temp_node.id].content = $el.value;
            $el.parentNode.removeChild($el);
            document.getElementById("past_commands").innerHTML += temp_node.content + "<br>";
            document.getElementById("command_line").style.display = "block";
            temp_node = undefined;
        }
        else {
            parse_command();
        }
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
