var reader_id = 0;

class Reader {
    constructor(node) {
        this.actual_node = node;
        console.log(this.actual_node);
        this.init_state();
        this.renderReader();
        this.setListeners();

        console.log("Created reader #" + this.id + "!")
    }

    init_state() {
        this.id = reader_id++;
        this.fS = 15;
    }

    renderReader() {
        this.window = $("<div class='window' id='reader" + this.id + "'></div>");
        const title_bar = $('<div class="title_bar"></div>')
            .append('<font class="title_text">' +this.actual_node.name + '</font>')
            .append('<div class="close_button" style="background-image: url(assets/img/close.png);"></div>')
            .append('<div class="min_button" style="background-image: url(assets/img/min.png);"></div>')
            .append('<div class="max_button" style="background-image: url(assets/img/max.png);"></div>');

        const reader = $('<div class="reader" ></div>');

        this.window.css({
            top: 0,
            height: '250px',
            width: '350px'
        });

        this.window.append(title_bar).append(reader);

        this.window.find('.reader').append('<iframe src="' + this.actual_node.path + '" title="' + this.actual_node.name + '"></iframe>');

        this.footer_icon = $("<div class='footer_icon' id='r_icon" + this.id + "'></div>")
            .append("<img class='high_img' src='assets/img/reader.png'>")
            .append("<img class='dot' src='assets/img/dot.png'>");

        $('desktop').append(this.window);
        this.footer_icon.find('img').css({
            'border-radius': '50px',
            'background-color': 'white'
        });

        $('footer').append(this.footer_icon);
    }

    setListeners() {

        $('#reader' + this.id).draggable({ stack: 'div', cursor: "pointer", containment: 'parent' }).resizable({ minHeight: 150, minWidth: 250 });
        $('#reader' + this.id + ' .title_bar').dblclick(this.maximize);
        $('#reader' + this.id + ' .max_button').click(this.maximize);
        $('#reader' + this.id + ' .close_button').click(this.close);
        $('#reader' + this.id + ' .min_button').click(this.minimize);
        $('#r_icon' + this.id).click(this.minimize);
        $('#reader' + this.id).on('click', this.stackOnTop);
    }

    stackOnTop = function () {
        $('.window').css('z-index', 30);
        const window = $(this).detach();
        $('desktop').append(window);
    }

    maximize = () => {
        let h = $('desktop').height();
        let w = $('desktop').width();
        if (h != $('#reader' + this.id).height() && w != $('#reader' + this.id).width()) {
            this.tmpHeight = $('#reader' + this.id).height();
            this.tmpWidth = $('#reader' + this.id).width();
            this.tmpTop = $('#reader' + this.id).position().top;
            this.tmpLeft = $('#reader' + this.id).position().left;
            $('#reader' + this.id).css({ top: 0, left: 0, height: h, width: w });
        }
        else {
            $('#reader' + this.id).css({ top: this.tmpTop, left: this.tmpLeft, height: this.tmpHeight, width: this.tmpWidth });
            this.tmpHeight = this.tmpWidth = this.tmpTop = this.tmpLeft = 0;
        }
    };

    minimize = () => {
        if ($('#r_icon' + this.id + ' .dot').css("display") == "none") {
            this.window.css({ display: "none" });
            $('#r_icon' + this.id + ' .dot').css({ display: "block" });
        }
        else {
            this.window.css({ display: "block" });
            $('#r_icon' + this.id + ' .dot').css({ display: "none" });
        }
    }

    close = () => {
        this.window.remove();
        this.footer_icon.remove();
        readers = _.filter(readers, (n) => n.id != this.id);
        if (info && info.state == 0)
            info.renderActivities();
    };

    checkExistence(node) {
        /*for (let inode in file_manager) {
            if (file_manager[inode].id == this.actual_node.id) {
                return;
            }
        }*/
        if(node.name == this.actual_node.name)
            this.close();
    }
}