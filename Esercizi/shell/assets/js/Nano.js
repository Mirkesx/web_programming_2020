var nano_id = 0;

class Nano {
    constructor(node) {
        this.actual_node = node;
        console.log(this.actual_node);
        this.init_state();
        this.renderNano();
        this.setListeners();

        console.log("Created nano #" + this.id + "!")
    }

    init_state() {
        this.id = nano_id++;
        this.fS = 15;
    }

    renderNano() {
        this.window = $("<div class='window' id='nano" + this.id + "'></div>");
        const title_bar = $('<div class="title_bar"></div>')
            .append('<font class="title_text">' +this.actual_node.name + '</font>')
            .append('<div class="close_button" style="background-image: url(assets/img/close.png);"></div>')
            .append('<div class="min_button" style="background-image: url(assets/img/min.png);"></div>')
            .append('<div class="max_button" style="background-image: url(assets/img/max.png);"></div>');

        const nano = $('<div class="nano"></div>')
            .append('<textarea class="catArea"></textarea>')
            .append('<div class="nanoBar topNanoBar">GNU Nano 4.3</div>')
            .append('<div class="nanoBar botNanoBar">CTRL+ALT+S: Salva ed Esci.<br>CTRL+ALT+Q: Esci senza Salvare.</div>');

        this.window.css({
            top: 0,
            height: '250px',
            width: '350px'
        });

        this.window.append(title_bar).append(nano);

        this.footer_icon = $("<div class='footer_icon' id='n_icon" + this.id + "'></div>")
            .append("<img class='high_img' src='assets/img/text.png'>")
            .append("<img class='dot' src='assets/img/dot.png'>");

        $("#nano" + this.id + " .nano").css({ fontSize: this.fS + "px" });
        $("#nano" + this.id + " .catArea").focus();

        $('desktop').append(this.window);
        this.footer_icon.find('img').css({
            'border-radius': '50px',
            'background-color': 'white'
        });

        $('footer').append(this.footer_icon);


        $("#nano" + this.id + " .catArea").val(this.actual_node.content);
    }

    setListeners() {

        $('#nano' + this.id).draggable({ stack: 'div', cursor: "pointer", containment: 'parent' }).resizable({ minHeight: 150, minWidth: 250 });
        $('#nano' + this.id + ' .title_bar').dblclick(this.maximize);
        $('#nano' + this.id + ' .max_button').click(this.maximize);
        $('#nano' + this.id + ' .close_button').click(this.close);
        $('#nano' + this.id + ' .min_button').click(this.minimize);
        $('#nano' + this.id + ' .nano').click(() => { $('#nano' + this.id + ' .catArea').focus() });
        $('#n_icon' + this.id).click(this.minimize);
        $('#nano' + this.id + ' .nano').keydown(this.key_down_actions);
        $('#nano' + this.id).on('click', this.stackOnTop);
    }

    stackOnTop = function () {
        $('.window').css('z-index', 30);
        const window = $(this).detach();
        $('desktop').append(window);
        window.find('.catArea').focus();
    }

    maximize = () => {
        let h = $('desktop').height();
        let w = $('desktop').width();
        if (h != $('#nano' + this.id).height() && w != $('#nano' + this.id).width()) {
            this.tmpHeight = $('#nano' + this.id).height();
            this.tmpWidth = $('#nano' + this.id).width();
            this.tmpTop = $('#nano' + this.id).position().top;
            this.tmpLeft = $('#nano' + this.id).position().left;
            $('#nano' + this.id).css({ top: 0, left: 0, height: h, width: w });
        }
        else {
            $('#nano' + this.id).css({ top: this.tmpTop, left: this.tmpLeft, height: this.tmpHeight, width: this.tmpWidth });
            this.tmpHeight = this.tmpWidth = this.tmpTop = this.tmpLeft = 0;
        }
    };

    minimize = () => {
        if ($('#n_icon' + this.id + ' .dot').css("display") == "none") {
            this.window.css({ display: "none" });
            $('#n_icon' + this.id + ' .dot').css({ display: "block" });
        }
        else {
            this.window.css({ display: "block" });
            $('#n_icon' + this.id + ' .dot').css({ display: "none" });
        }
    }

    close = () => {
        this.window.remove();
        this.footer_icon.remove();
        nanos = _.filter(nanos, (n) => n.id != this.id);
        if (task && task.state == 0)
            task.renderActivities();
    };

    key_down_actions = (event) => {
        if (event.ctrlKey && event.key === ',') { // Ingrandire il font
            this.fS += 1;
            if (this.fS > 20)
                this.fS = 20;
            $("#nano" + this.id + " .catArea").css({ fontSize: this.fS + "px" });
        }

        if (event.ctrlKey && event.key === '.') { // Diminuire il font
            this.fS -= 1;
            if (this.fS < 10)
                this.fS = 10;
            $("#nano" + this.id + " .catArea").css({ fontSize: this.fS + "px" });
        }

        if (event.ctrlKey && event.altKey && event.key === 's') { // Per nano. Salvare il file.
            let $el;
            if (($el = $("#nano" + this.id + " .catArea")) !== null && $el !== undefined) {
                file_manager[this.actual_node.name + this.actual_node.id].content = $el.val();
                console.log(file_manager[this.actual_node.name + this.actual_node.id]);
                this.close();
            }
        }

        if (event.ctrlKey && event.altKey && event.key === 'q') { // Per nano. Uscire senza salvare il file.
            let $el;
            if (($el = $("#nano" + this.id + " .catArea")) !== null && $el !== undefined) {
                console.log(file_manager[this.actual_node.name + this.actual_node.id]);
                this.close();
            }
        }
    }

    checkExistence() {
        for (let inode in file_manager) {
            if (file_manager[inode].id == this.actual_node.id) {
                return;
            }
        }
        this.close();
    }
}