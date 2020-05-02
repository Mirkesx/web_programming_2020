// GLOBALS

var fS; //fontSize del body
var actual_node = file_manager.username;
var temp_node = undefined;
var isShellOpen = false;
var isShellMin = false;
var isMax = false;
var tmpHeight = tmpWidth = 0;
var tmpX = tmpY = 0;
var lastX = lastY = 0;
var titleBarPressed = false;
var interval = undefined;
var command_history = [];
var index_history = -1;

// FUNCTIONS

function create_shell() {
    console.log("Create a shell!")
    isShellOpen = true;
    isShellMin = false;
    fS = 15;
    document.getElementById("past_commands").innerHTML = "";
    $("#windows-shell").css({display: "block", fontSize: fS+"px"});
    $("#shell > *").css({display: "block"});
    new_command_line();
}

function close_shell() {
    $("#catArea").remove();
    $(".nanoBar").remove();
    document.getElementById("past_commands").innerHTML = "";
    document.getElementById("windows-shell").style.display = "none";
    document.getElementById("dot").style.display = "none";
    isShellOpen = false;
    isShellMin = false;
}

function min_shell() {
    document.getElementById("windows-shell").style.display = "none";
    document.getElementById("dot").style.display = "block";
    isShellOpen = true;
    isShellMin = true;
}

function resume_shell() {
    document.getElementById("windows-shell").style.display = "block";
    document.getElementById("dot").style.display = "none";
    isShellOpen = true;
    isShellMin = false;
}

function click_min_icon() {
    if (isShellMin) {
        resume_shell();
    } else {
        if (isShellOpen) {
            min_shell();
        } else {
            create_shell();
        }
    }
}

function click_icon() {
    if (isShellOpen) {
        if(isShellMin) {
            resume_shell();
        } else {
            min_shell();
        }
    } else {
        create_shell();
    }
}

function new_command_line() {
    const today = new Date();
    const hours = today.getHours().toString().lengthlength === 1 ? "0" + today.getHours() : today.getHours();
    const minutes = today.getMinutes().toString().length === 1 ? "0" + today.getMinutes() : today.getMinutes();
    const seconds = today.getSeconds().toString().length === 1 ? "0" + today.getSeconds() : today.getSeconds();
    const time = hours + ":" + minutes + ":" + seconds;
    const len_str = time.length + 4 + printPath(actual_node).length;

    document.getElementById("path").innerHTML = printPath(actual_node).replace(" ","")+"$";
    document.getElementById("time").innerHTML = time + " > :";
    document.getElementById("shell_input").value = "";
    document.getElementById("shell_time").value = time;
    window, location.href = "#shell_input";
    document.getElementById("shell_input").focus();
    $('textarea').prop('selectionStart', len_str);

}

function parse_command() {
    const line = document.getElementById("shell_input").value;
    const time = document.getElementById("shell_time").value;
    command_history.push(line);
    index_history = -1;

    //console.log(line);
    //console.log(time);

    document.getElementById("past_commands").innerHTML += "<font class='past_time'>" + time + " > </font> : <font class='past_path'>" + printPath(actual_node) + "</font>$ " + line + "<br>";

    let line_splitted = [line.split(" ", 1)[0], line.substr(line.split(" ", 1)[0].length + 1)];
    let com = line_splitted[0];
    let response = {};
    //console.log(com);
    //console.log(line_splitted[1]);

    if (commands[com] !== undefined && (line_splitted[1] !== '--help' && line_splitted[1] !== '-h')) {
        response = commands[com].com(actual_node, line_splitted[1]);
        actual_node = response.node;
    } else if (commands[com] !== undefined && com !== "help" && (line_splitted[1] === '--help' || line_splitted[1] === '-h')) {
        response.com = "showHelp"
        response.result = "<br>"+commands[com].help+"<br>";
    } else {
        response.com = "none"
        response.result = 'Comando "' + com + '" non trovato! Controllare la sintassi del comando e riprovare!';
    }

    console.log("actual_node ", actual_node);

    switch (com) {
        case "nano":
            nanoHandler(response);
            break;
        default:
            if (response.result && response.result.length > 0)
                document.getElementById("past_commands").innerHTML += response.result + "<br>";
    }
    new_command_line();
}

function nanoHandler(response) {
    if (typeof response.result === 'string') {
        document.getElementById("past_commands").innerHTML += response.result + "<br>";
        return;
    }
    if(response.node === response.result) {
        document.getElementById("past_commands").innerHTML += "Indicare un file come parametro." + "<br>";
        return;
    }
    console.log(response);
    temp_node = response.result;
    //document.getElementById("past_commands").innerHTML += "<textarea id='catArea'>" + (temp_node.content !== undefined ? temp_node.content : "");
    document.getElementById("past_commands").style.display = "none";
    document.getElementById("command_line").style.display = "none";
    $("#shell").append('<textarea id="catArea"></textarea>');
    $("#shell").append('<div class="nanoBar" id="topNanoBar">GNU Nano 4.3</div>');
    $("#shell").append('<div class="nanoBar" id="botNanoBar">CTRL+ALT+S: Salva ed Esci.<br>CTRL+ALT+Q: Esci senza Salvare.</div>');
    $("#catArea").width($("#shell").width()).val(temp_node.content !== undefined ? temp_node.content : "");
}

function pressShell(event) {
    titleBarPressed = true;
    lastX = event.pageX;
    lastY = event.pageY;
}

function releaseShell(event) {
    titleBarPressed = false;
}

function resizePage() {
    if (isMax) {
        resizeBack();
    } else {
        resizeToMax();
    }
}

// JQUERY

$(document).ready(function () {
    $(window).resize(matchWindowDimensions);
});

function matchWindowDimensions() {
    var bodyheight = $(window).height();
    var bodywidth = $(window).width();
    $(".container").height(bodyheight).width(bodywidth);
    $("#windows-shell").height(bodyheight / 3 - 35).width(bodywidth / 3);
    $("#shell").height(bodyheight / 3 - 80).width(bodywidth / 3 - 10);
}

function resizeToMax() {
    tmpHeight = $("#windows-shell").height();
    tmpWidth = $("#windows-shell").width();
    var offset = $("#windows-shell").offset();
    tmpX = offset.left;
    tmpY = offset.top;
    var conHeight = $(".container").height();
    var conWidth = $(".container").width();
    $("#windows-shell").css({ top: 0, left: 0 });
    $("#windows-shell").height(conHeight - 40).width(conWidth);
    $("#shell").height(conHeight - 85).width(conWidth - 10);
    isMax = true;
}

function resizeBack() {
    if (tmpHeight > $(window).height() * 3 / 4 && tmpWidth > $(window).width() * 3 / 4) {
        tmpHeight *= 3 / 8;
        tmpWidth *= 3 / 8;
    }
    $("#windows-shell").css({ top: tmpY, left: tmpX });
    $("#windows-shell").height(tmpHeight).width(tmpWidth);
    $("#shell").height(tmpHeight - 45).width(tmpWidth - 10);
    isMax = false;
}

function moveShell(event) {
    //console.log(event);
    if (titleBarPressed) {
        //console.log(event);
        var offset = $("#windows-shell").offset();
        $("#windows-shell").css({ top: offset.top + (event.pageY - lastY), left: offset.left + (event.pageX - lastX) });
        lastX = event.pageX;
        lastY = event.pageY;
    }
}

function pollingResize() {
    interval = setInterval(resizeShell, 50);
}

function removingPollinResize() {
    clearInterval(interval);
    $("#catArea").width($("#shell").width());
    resizeShell();
}

function resizeShell() {
    //console.log("ciao");
    var width =  $("#windows-shell").width();
    var height = $("#windows-shell").height();
    $("#shell").height(height-45).width(width-10);
}

// EVENTS

window.addEventListener('keypress', function (event) {
    if (event.keyCode === 13) { // Riconoscimento Enter per invio del comando
        parse_command();
    }
}, false);

document.addEventListener('keydown', function (event) {
    if (event.ctrlKey && event.key === ',') { // Ingrandire il font
        fS += 1;
        if (fS > 20)
            fS = 20;
        $("#shell > *").css({fontSize: fS+"px"});
        //console.log(document.body.style.fontSize);
    }

    if (event.ctrlKey && event.key === '.') { // Diminuire il font
        fS -= 1;
        if (fS < 10)
            fS = 10;
            $("#shell > *").css({fontSize: fS+"px"});
        //console.log(document.body.style.fontSize);
    }

    if (event.ctrlKey && event.altKey && event.key === 's') { // Per nano. Salvare il file.
        let $el;
        if (($el = document.getElementById("catArea")) !== null && $el !== undefined) {
            console.log(file_manager[temp_node.name + temp_node.id]);
            file_manager[temp_node.name + temp_node.id].content = $el.value;
            $el.parentNode.removeChild($el);
            document.getElementById("past_commands").innerHTML += "Uscita dall'editor. File modificato!" + "<br>";
            document.getElementById("command_line").style.display = "block";
            document.getElementById("past_commands").style.display = "block";
            temp_node = undefined;
            $("#catArea").remove();
            $(".nanoBar").remove();
        }
        //console.log(document.body.style.fontSize);
    }

    if (event.ctrlKey && event.altKey && event.key === 'q') { // Per nano. Salvare il file.
        let $el;
        if (($el = document.getElementById("catArea")) !== null && $el !== undefined) {
            console.log(file_manager[temp_node.name + temp_node.id]);
            document.getElementById("past_commands").innerHTML += "Uscita dall'editor." + "<br>";
            document.getElementById("command_line").style.display = "block";
            document.getElementById("past_commands").style.display = "block";
            temp_node = undefined;
            $("#catArea").remove();
            $(".nanoBar").remove();
        }
        //console.log(document.body.style.fontSize);
    }

    if(event.keyCode === 38) {
        if(command_history.length > 0) {
            if(index_history === -1) {
                index_history = command_history.length-1;

            }
            if(index_history >= 0) {
                $("#shell_input").val(command_history[index_history]);
                index_history--;
            }
        }
    }

    if(event.keyCode === 40) {
        if(command_history.length > 0) {
            if(index_history !== -1) {
                if(index_history ===  command_history.length) {
                    $("#shell_input").val("");
                    index_history = -1;
                }
                else {
                    $("#shell_input").val(command_history[index_history]);
                    index_history++;
                }
            }
        }
    }
});

document.getElementById("terminal_icon").onclick = click_icon;
document.getElementById("close_button").onclick = close_shell;
document.getElementById("min_button").onclick = min_shell;
document.getElementById("min_shell").onclick = click_min_icon;
document.getElementById("max_button").onclick = resizePage;
document.getElementById("title_bar").onmousedown = pressShell;
document.getElementById("title_bar").onmouseup = releaseShell;
document.onmousemove = moveShell;
document.getElementById("windows-shell").onmousedown =  pollingResize;
document.getElementById("windows-shell").onmouseup =  removingPollinResize;