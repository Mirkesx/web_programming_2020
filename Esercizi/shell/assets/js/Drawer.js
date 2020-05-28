var drawer_id = 0;

class Drawer {
    constructor(node) {
        this.actual_node = node;
        console.log(this.actual_node);
        this.init_state();
        this.renderDrawer();
        this.setListeners();

        console.log("Created drawer #" + this.id + "!")
    }

    init_state() {
        this.id = drawer_id++;
    }

    renderDrawer() {
        this.window = $("<div class='window' id='drawer" + this.id + "'></div>");
        const title_bar = $('<div class="title_bar"></div>')
            .append('<font class="title_text">' +this.actual_node.name + '</font>')
            .append('<div class="close_button" style="background-image: url(assets/img/close.png);"></div>')
            .append('<div class="min_button" style="background-image: url(assets/img/min.png);"></div>')
            .append('<div class="max_button" style="background-image: url(assets/img/max.png);"></div>');

        const drawer = $('<div class="drawer" style="background-image: url(\'' + this.actual_node.path + '\');"></div>');
        //const drawer = $('<div class="drawer"></div>');

        //drawer.append("<img class='draw_back' src='"+this.actual_node.path+"'>")

        this.window.css({
            top: 0,
            height: '250px',
            width: '350px'
        });

        this.window.append(title_bar).append(drawer);

        this.footer_icon = $("<div class='footer_icon' id='d_icon" + this.id + "'></div>")
            .append("<img class='high_img' src='assets/img/image_icon.png'>")
            .append("<img class='dot' src='assets/img/dot.png'>");

        $('desktop').append(this.window);
        this.footer_icon.find('img').css({
            'border-radius': '50px',
            'background-color': 'white'
        });

        $('footer').append(this.footer_icon);
    }

    setListeners() {

        $('#drawer' + this.id).draggable({handle: '.title_bar', stack: 'div', cursor: "pointer", containment: 'parent' }).resizable({ minHeight: 150, minWidth: 250 });
        $('#drawer' + this.id + ' .title_bar').dblclick(this.maximize);
        $('#drawer' + this.id + ' .max_button').click(this.maximize);
        $('#drawer' + this.id + ' .close_button').click(this.close);
        $('#drawer' + this.id + ' .min_button').click(this.minimize);
        $('#drawer' + this.id + ' .drawer').click(() => { $('#drawer' + this.id + ' .catArea').focus() });
        $('#d_icon' + this.id).click(this.minimize);
        $('#drawer' + this.id).on('click', this.stackOnTop);
    }

    stackOnTop = function () {
        $('.window').css('z-index', 30);
        const window = $(this).detach();
        $('desktop').append(window);
    }

    maximize = () => {
        let h = $('desktop').height();
        let w = $('desktop').width();
        if (h != $('#drawer' + this.id).height() && w != $('#drawer' + this.id).width()) {
            this.tmpHeight = $('#drawer' + this.id).height();
            this.tmpWidth = $('#drawer' + this.id).width();
            this.tmpTop = $('#drawer' + this.id).position().top;
            this.tmpLeft = $('#drawer' + this.id).position().left;
            $('#drawer' + this.id).css({ top: 0, left: 0, height: h, width: w });
        }
        else {
            $('#drawer' + this.id).css({ top: this.tmpTop, left: this.tmpLeft, height: this.tmpHeight, width: this.tmpWidth });
            this.tmpHeight = this.tmpWidth = this.tmpTop = this.tmpLeft = 0;
        }
    };

    minimize = () => {
        if ($('#d_icon' + this.id + ' .dot').css("display") == "none") {
            this.window.css({ display: "none" });
            $('#d_icon' + this.id + ' .dot').css({ display: "block" });
        }
        else {
            this.window.css({ display: "block" });
            $('#d_icon' + this.id + ' .dot').css({ display: "none" });
        }
    }

    close = () => {
        this.window.remove();
        this.footer_icon.remove();
        drawers = _.filter(drawers, (n) => n.id != this.id);
        if (task && task.state == 0)
            task.renderActivities();
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