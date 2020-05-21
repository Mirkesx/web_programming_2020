infoos_id = 0;

class InfoOS {
    constructor() {
        this.init_state();
        this.renderInfoOS();
        this.setListeners();

        console.log("Created infoos #" + this.id + "!")
    }

    init_state() {
        this.id = infoos_id++;
    }

    renderInfoOS() {
        this.window = $("<div class='window' id='infoos" + this.id + "'></div>");
        const title_bar = $('<div class="title_bar"></div>')
            .append('<font class="title_text">InfoOS ' + this.id + '</font>')
            .append('<div class="close_button" style="background-image: url(assets/img/close.png);"></div>')
            .append('<div class="min_button" style="background-image: url(assets/img/min.png);"></div>')
            .append('<div class="max_button" style="background-image: url(assets/img/max.png);"></div>');

        const infoos = $('<div class="infoos" ></div>');

        this.window.css({
            top: 0,
            height: '250px',
            width: '350px'
        });

        this.window.append(title_bar).append(infoos);

        this.window.find('.infoos').append('<iframe src="http://localhost:3000/php/phpsysinfo/index.php" title="SysInfo"></iframe>');

        this.footer_icon = $("<div class='footer_icon' id='ios_icon" + this.id + "'></div>")
            .append("<img class='high_img' src='assets/img/sysinfo.png'>")
            .append("<img class='dot' src='assets/img/dot.png'>");

        $('desktop').append(this.window);
        this.footer_icon.find('img').css({
            'border-radius': '50px',
            'background-color': 'white'
        });

        $('footer').append(this.footer_icon);
    }

    setListeners() {

        $('#infoos' + this.id).draggable({ stack: 'div', cursor: "pointer", containment: 'parent' }).resizable({ minHeight: 150, minWidth: 250 });
        $('#infoos' + this.id + ' .title_bar').dblclick(this.maximize);
        $('#infoos' + this.id + ' .max_button').click(this.maximize);
        $('#infoos' + this.id + ' .close_button').click(this.close);
        $('#infoos' + this.id + ' .min_button').click(this.minimize);
        $('#ios_icon' + this.id).click(this.minimize);
        $('#infoos'+this.id).on('click',this.stackOnTop);
    }

    stackOnTop = function() {
        $('.window').css('z-index',30);
        const window = $(this).detach();
        $('desktop').append(window);
    }

    maximize = () => {
        let h = $('desktop').height();
        let w = $('desktop').width();
        if (h != $('#infoos' + this.id).height() && w != $('#infoos' + this.id).width()) {
            this.tmpHeight = $('#infoos' + this.id).height();
            this.tmpWidth = $('#infoos' + this.id).width();
            this.tmpTop = $('#infoos' + this.id).position().top;
            this.tmpLeft = $('#infoos' + this.id).position().left;
            $('#infoos' + this.id).css({ top: 0, left: 0, height: h, width: w });
        }
        else {
            $('#infoos' + this.id).css({ top: this.tmpTop, left: this.tmpLeft, height: this.tmpHeight, width: this.tmpWidth });
            this.tmpHeight = this.tmpWidth = this.tmpTop = this.tmpLeft = 0;
        }
    };

    minimize = () => {
        if ($('#ios_icon' + this.id + ' .dot').css("display") == "none") {
            this.window.css({ display: "none" });
            $('#ios_icon' + this.id + ' .dot').css({ display: "block" });
        }
        else {
            this.window.css({ display: "block" });
            $('#ios_icon' + this.id + ' .dot').css({ display: "none" });
        }
    }

    close = () => {
        this.window.remove();
        this.footer_icon.remove();
    };
}