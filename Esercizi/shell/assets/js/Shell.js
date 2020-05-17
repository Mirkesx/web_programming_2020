var shell_id = 0;

class Shell {
    constructor() {
        this.init_state();
        this.renderShell();
        this.setListeners();

        console.log("Created shell #" + this.id + "!")
        console.log(this.window);
    }

    init_state() {
        this.id = shell_id++;
        this.actual_node = file_manager.username;
        this.temp_node = undefined;
        this.tmpHeight = this.tmpWidth = 0;
        this.tmpTop = this.tmpLeft = 0;
        this.command_history = [];
        this.index_history = -1;
        this.fS = 15;
        this.pc = this.cl = undefined;
        this.shell_detached = undefined;
    }

    renderShell() {
        this.window = $("<div class='window' id='shell" + this.id + "'></div>");
        let title_bar = $('<div class="title_bar"></div>')
            .append('<font class="title_text">Terminal ' + this.id + '</font>')
            .append('<div class="close_button" style="background-image: url(assets/img/close.png);"></div>')
            .append('<div class="min_button" style="background-image: url(assets/img/min.png);"></div>')
            .append('<div class="max_button" style="background-image: url(assets/img/max.png);"></div>')
        let shell = $('<div class="shell"></div>')
            .append('<div class="past_commands" disabled></div>');
        let command_line = $('<div class="command_line"></div>')
            .append("<input type='hidden' class='shell_time' />")
            .append("<font class='time'> :</font><font class='path'>$</font>")
            .append('<input type="text" class="shell_input" />');
        shell.append(command_line);

        this.window.append(title_bar).append(shell);

        $('desktop').append(this.window);
        $('#shell' + this.id).css({
            top: 0,
            height: '250px',
            width: '350px'
        });

        this.footer_icon = $("<div class='footer_icon' id='t_icon" + this.id + "'></div>")
            .append("<img class='high_img' src='assets/img/terminal.png'>")
            .append("<img class='dot' src='assets/img/dot.png'>");
        $('footer').append(this.footer_icon);

        $("#shell" + this.id + " .shell").css({ fontSize: this.fS + "px" });
        this.new_command_line();
        $("#shell" + this.id + " .shell_input").focus();
    }

    new_command_line() {
        const today = new Date();
        const hours = today.getHours().toString().length === 1 ? "0" + today.getHours() : today.getHours();
        const minutes = today.getMinutes().toString().length === 1 ? "0" + today.getMinutes() : today.getMinutes();
        const seconds = today.getSeconds().toString().length === 1 ? "0" + today.getSeconds() : today.getSeconds();
        const time = hours + ":" + minutes + ":" + seconds;

        $("#shell" + this.id + " .path").html(printPath(this.actual_node).replace(" ", "") + "$");
        $("#shell" + this.id + " .time").html(time + " > :");
        $("#shell" + this.id + " .shell_input").val("");
        $("#shell" + this.id + " .shell_time").val(time);
    }

    parse_command() {
        const line = $("#shell" + this.id + " .shell_input").val();
        const time = $("#shell" + this.id + " .shell_time").val();
        this.command_history.push(line);
        this.index_history = -1;

        $("#shell" + this.id + " .past_commands").append("<font class='past_time'>" + time + " > :</font> <font class='past_path'>" + printPath(this.actual_node) + "$</font><br>" + line + "<br>");

        let line_splitted = [line.split(" ", 1)[0], line.substr(line.split(" ", 1)[0].length + 1)];
        let com = line_splitted[0];
        let response = {};

        if (commands[com] !== undefined && (line_splitted[1] !== '--help' && line_splitted[1] !== '-h')) {
            response = commands[com].com(this.actual_node, line_splitted[1], this.id);
            //console.log("Response com");
            //console.log(response);
            if (response && response.node !== undefined)
                this.actual_node = response.node;
        } else if (commands[com] !== undefined && com !== "help" && (line_splitted[1] === '--help' || line_splitted[1] === '-h')) {
            response.com = "showHelp"
            response.result = "<br>" + commands[com].help + "<br>";
        } else {
            response.com = "none"
            response.result = '<br>Comando "' + com + '" non trovato! Controllare la sintassi del comando e riprovare!';
        }

        console.log("actual_node ", this.actual_node);

        switch (com) {
            case "nano":
                this.nanoHandler(response);
                return;
            case "inSTR":
                break;
            default:
                if (response.result && response.result.length > 0)
                    $("#shell" + this.id + " .past_commands").append("<br>" + response.result + "<br>");
        }
        this.new_command_line();
        //console.log('top_shell_input: ', $("#shell"+this.id+ " .shell_input").offset().top);
        $("#shell" + this.id + " .shell_input")[0].scrollIntoView(false);
    }

    nanoHandler(response) {
        if (typeof response.result === 'string') {
            $("#shell" + this.id + " .past_commands").append(response.result + "<br>");
            return;
        }
        if (response.node === response.result) {
            $("#shell" + this.id + " .past_commands").append("Indicare un file come parametro." + "<br>");
            return;
        }
        console.log(response);
        this.temp_node = response.result;
        this.shell_detached = $("#shell" + this.id + " .shell").detach();
        this.window.append('<div class="nano"></div>');
        $("#shell" + this.id + " .nano").append('<textarea class="catArea"></textarea>');
        $("#shell" + this.id + " .nano").append('<div class="nanoBar topNanoBar">GNU Nano 4.3</div>');
        $("#shell" + this.id + " .nano").append('<div class="nanoBar botNanoBar">CTRL+ALT+S: Salva ed Esci.<br>CTRL+ALT+Q: Esci senza Salvare.</div>');
        $("#shell" + this.id + " .catArea").val(response.result.content);
        $('#shell' + this.id + ' .nano').keydown(this.key_down_actions);
    }

    closeNano() {
        $("#shell" + this.id + " .past_commands").append("Uscita dall'editor. File modificato!" + "<br>");
        $("#shell" + this.id + " .past_commands").css({ display: "block" });
        $("#shell" + this.id + " .command_line").css({ display: "block" });
        this.temp_node = undefined;
        $('#shell' + this.id + ' .nano').off('keydown', '**');
        $("#shell" + this.id + " .nano").remove();
        this.window.append(this.shell_detached);
        this.new_command_line();
        $("#shell" + this.id + " .shell_input").focus();
        $("#shell" + this.id + " .shell_input")[0].scrollIntoView(false);
    }

    setListeners() {

        $('#shell' + this.id).draggable({ stack: 'div', cursor: "pointer" }).resizable({ minHeight: 150, minWidth: 250 });
        $('#shell' + this.id + ' .title_bar').dblclick(this.maximize);
        $('#shell' + this.id + ' .max_button').click(this.maximize);
        $('#shell' + this.id + ' .close_button').click(this.close);
        $('#shell' + this.id + ' .min_button').click(this.minimize);
        //$('#shell' + this.id + ' .shell').click(() => { $('#shell' + this.id + ' .shell_input').focus() })
        $('#t_icon' + this.id).click(this.minimize);

        $('#shell' + this.id + ' .shell').keydown(this.key_down_actions);
        $('#shell'+this.id).on('click',this.stackOnTop);
    }

    stackOnTop = function() {
        $('.window').css('z-index',30);
        const window = $(this).detach();
        $('desktop').append(window);
        window.find('.shell_input').focus();
        window.find('.catArea').focus();
    }

    maximize = () => {
        let h = $('desktop').height()+40;
        let w = $('desktop').width()+40;
        if (h != $('#shell' + this.id).height() && w != $('#shell' + this.id).width()) {
            this.tmpHeight = $('#shell' + this.id).height();
            this.tmpWidth = $('#shell' + this.id).width();
            this.tmpTop = $('#shell' + this.id).position().top;
            this.tmpLeft = $('#shell' + this.id).position().left;
            $('#shell' + this.id).css({ top: 0, left: 0, height: h, width: w });
        }
        else {
            $('#shell' + this.id).css({ top: this.tmpTop, left: this.tmpLeft, height: this.tmpHeight, width: this.tmpWidth });
            this.tmpHeight = this.tmpWidth = this.tmpTop = this.tmpLeft = 0;
        }
    };

    minimize = () => {
        if ($('#t_icon' + this.id + ' .dot').css("display") == "none") {
            this.window.css({ display: "none" });
            $('#t_icon' + this.id + ' .dot').css({ display: "block" });
        }
        else {
            this.window.css({ display: "block" });
            $('#t_icon' + this.id + ' .dot').css({ display: "none" });
        }
    }

    close = () => {
        this.window.remove();
        this.footer_icon.remove();
    };

    key_down_actions = (event) => {
        if (event.keyCode === 13) { // Riconoscimento Enter per invio del comando
            this.parse_command();
        }

        if (event.ctrlKey && event.key === ',') { // Ingrandire il font
            this.fS += 1;
            if (this.fS > 20)
                this.fS = 20;
            $("#shell" + this.id + " > .shell *").css({ fontSize: this.fS + "px" });
        }

        if (event.ctrlKey && event.key === '.') { // Diminuire il font
            this.fS -= 1;
            if (this.fS < 10)
                this.fS = 10;
            $("#shell" + this.id + " > .shell *").css({ fontSize: this.fS + "px" });
        }

        if (event.ctrlKey && event.altKey && event.key === 's') { // Per nano. Salvare il file.
            let $el;
            if (($el = $("#shell" + this.id + " .catArea")) !== null && $el !== undefined) {
                console.log(file_manager[this.temp_node.name + this.temp_node.id]);
                file_manager[this.temp_node.name + this.temp_node.id].content = $el.val();
                this.closeNano();
            }
        }

        if (event.ctrlKey && event.altKey && event.key === 'q') { // Per nano. Uscire senza salvare il file.
            let $el;
            if (($el = $("#shell" + this.id + " .catArea")) !== null && $el !== undefined) {
                console.log(file_manager[this.temp_node.name + this.temp_node.id]);
                this.closeNano();
            }
        }

        if (event.keyCode === 38) {
            if (this.command_history.length > 0) {
                if (this.index_history === -1) {
                    this.index_history = this.command_history.length - 1;

                }
                if (this.index_history >= 0) {
                    $("#shell" + this.id + " .shell_input").val(this.command_history[this.index_history]);
                    this.index_history--;
                }
            }
        }

        if (event.keyCode === 40) {
            if (this.command_history.length > 0) {
                if (this.index_history !== -1) {
                    if (this.index_history === this.command_history.length) {
                        $("#shell" + this.id + " .shell_input").val("");
                        this.index_history = -1;
                    } else {
                        $("#shell" + this.id + " .shell_input").val(this.command_history[this.index_history]);
                        this.index_history++;
                    }
                }
            }
        }
    }
}