var isGameOpened = false;

class Videogame {
    constructor(name, icon) {
        this.name = name;
        this.icon = icon;
        isGameOpened = true;
        this.renderVideogame();
        this.setListeners();

        console.log("Created videogame #" + this.id + "!")
    }

    renderVideogame() {
        this.window = $("<div class='window' id='videogame" + this.id + "'></div>");
        const title_bar = $('<div class="title_bar"></div>')
            .append('<font class="title_text">' + this.name + '</font>')
            .append('<div class="close_button" style="background-image: url(assets/img/close.png);"></div>')
            .append('<div class="min_button" style="background-image: url(assets/img/min.png);"></div>')
            .append('<div class="max_button" style="background-image: url(assets/img/max.png);"></div>');

        const videogame = $('<div class="videogame" ></div>');

        this.window.append(title_bar).append(videogame);

        let path = "";

        switch (this.name) {
            case "Bomber Man":
                path = "http://cavallispa.altervista.org/Bomberman/Bomberman_-_Select_Level.html";
                break;
            case "Snake":
                path = "http://cavallispa.altervista.org/snake/Snake_noboard.html";
                break;
            case "Tris":
                path = "http://cavallispa.altervista.org/tris/Tris.html";
                break;
        }

        this.window.find('.videogame').append('<iframe src="' + path + '" title="' + this.name + '"></iframe>');

        this.footer_icon = $("<div class='footer_icon' id='v_icon" + this.id + "'></div>")
            .append("<img class='high_img' src='" + this.icon + "'>")
            .append("<img class='dot' src='assets/img/dot.png'>");

        this.window.css({
            top: 0,
            left: 0,
            height: '100%',
            width: '100%'
        });

        this.window.find('iframe').css({
            position: "absolute",
            top: 15,
            left: 0,
            height: 'calc(100% - 20px)',
            width: '100%'
        });

        $('desktop').append(this.window);
        this.footer_icon.find('img').css({
            'border-radius': '50px',
            'background-color': 'white'
        });

        $('footer').append(this.footer_icon);
    }

    setListeners() {

        //$('#videogame' + this.id).draggable({ handle: '.title_bar', stack: 'div', cursor: "pointer", containment: 'parent' }).resizable({ minHeight: 150, minWidth: 250 });
        //$('#videogame' + this.id + ' .title_bar').dblclick(this.maximize);
        //$('#videogame' + this.id + ' .max_button').click(this.maximize);
        $('#videogame' + this.id + ' .close_button').click(this.close);
        $('#videogame' + this.id + ' .min_button').click(this.minimize);
        $('#v_icon' + this.id).click(this.minimize);
        this.window.find('.title_bar').on('click', this.stackOnTop);
    }

    stackOnTop = function () {
        $('.window').css('z-index', 30);
        const window = $(this).parent().detach();
        $('desktop').append(window);
    }

    /*maximize = () => {
        let h = $('desktop').height();
        let w = $('desktop').width();
        if (h != $('#videogame' + this.id).height() && w != $('#videogame' + this.id).width()) {
            this.tmpHeight = $('#videogame' + this.id).height();
            this.tmpWidth = $('#videogame' + this.id).width();
            this.tmpTop = $('#videogame' + this.id).position().top;
            this.tmpLeft = $('#videogame' + this.id).position().left;
            $('#videogame' + this.id).css({ top: 0, left: 0, height: h, width: w });
        }
        else {
            $('#videogame' + this.id).css({ top: this.tmpTop, left: this.tmpLeft, height: this.tmpHeight, width: this.tmpWidth });
            this.tmpHeight = this.tmpWidth = this.tmpTop = this.tmpLeft = 0;
        }
    };*/

    minimize = () => {
        if ($('#v_icon' + this.id + ' .dot').css("display") == "none") {
            this.window.css({ display: "none" });
            $('#v_icon' + this.id + ' .dot').css({ display: "block" });
        }
        else {
            this.window.css({ display: "block" });
            $('#v_icon' + this.id + ' .dot').css({ display: "none" });
        }
    }

    close = () => {
        this.window.remove();
        this.footer_icon.remove();
        videogames = _.filter(videogames, (n) => n.id != this.id);
        if (task && task.state == 0)
            task.renderActivities();
        isGameOpened = false;
    };
}