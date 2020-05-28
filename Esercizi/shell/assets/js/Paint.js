var paint_id = 0;
var isPaintOpen = false;
var c;
var sWeight;

class Paint {
    constructor(node) {
        this.init_state(node);
        this.renderPaint();
        this.setListeners();

        console.log("Created paint #" + this.id + "!")
    }

    init_state(node) {
        //console.log(node);
        if (node)
            this.actual_node = node;
        //else
        this.actual_node = file_manager.username;
        this.id = paint_id++;
        this.height = 600;
        this.width = 600;
        isPaintOpen = true;
        c = "#000000";
        sWeight = 10;
        //Resetto il canvas
        setup(this.width, this.height - 30);
        this.canvas = $('canvas').detach();
    }

    renderPaint() {
        this.window = $("<div class='window' id='paint" + this.id + "'></div>");
        const title_bar = $('<div class="title_bar"></div>')
            .append('<font class="title_text">' + this.actual_node.name + '</font>')
            .append('<div class="close_button" style="background-image: url(assets/img/close.png);"></div>')
            .append('<div class="min_button" style="background-image: url(assets/img/min.png);"></div>')
            .append('<div class="max_button" style="background-image: url(assets/img/max.png);"></div>');

        const tool_bar = $('<div class="tool-bar"></div>')
            .append('<div class="color-picker">\
                        Color : <input type="color" id="color_canvas" name="color_canvas" value="'+ c + '">\
                    </div>')
            .append('<div class="radius-weight">\
                        Size : <input type="range" min="10" max="50" value="'+ sWeight + '" id="radius_weight">\
                    </div>')
            .append('<div class="paint-icons">\
                        <img id="pencil" class="border2bl" src="assets/img/pencil.png">\
                        <img id="fill" src="assets/img/fill.png">\
                        <img id="rubber" src="assets/img/rubber.png">\
                        <img id="clear" src="assets/img/clear.png">\
                        <img id="save" src="assets/img/save.png">\
                    </div>');

        const paint = $('<div class="paint" style="background-image: url(\'' + this.actual_node.path + '\');"></div>').append(this.canvas);

        this.window.css({
            top: 0,
            height: this.height,
            width: this.width
        });

        this.window.append(title_bar).append(tool_bar).append(paint);

        this.footer_icon = $("<div class='footer_icon' id='p_icon" + this.id + "'></div>")
            .append("<img class='high_img' src='assets/img/paint.png'>")
            .append("<img class='dot' src='assets/img/dot.png'>");

        $('desktop').append(this.window);
        this.footer_icon.find('img').css({
            'border-radius': '50px',
            'background-color': 'white'
        });

        $('footer').append(this.footer_icon);
    }

    setListeners() {

        this.window.draggable({ stack: 'div', cursor: "pointer", containment: 'parent', handle: '.title_bar' }).resizable({ minHeight: 600, minWidth: 600 });
        $('#paint' + this.id + ' .title_bar').dblclick(this.maximize);
        $('#paint' + this.id + ' .max_button').click(this.maximize);
        $('#paint' + this.id + ' .close_button').click(this.close);
        $('#paint' + this.id + ' .min_button').click(this.minimize);
        $('#p_icon' + this.id).click(this.minimize);
        this.window.find('canvas').on('click', this.stackOnTop);
        this.window.find('canvas').on('mousedown', () => loop());
        this.window.find('canvas').on('mouseup', () => noLoop());
        this.window.find('.tool-bar img').on('click', (event) => this.pickTool(event));
    }

    stackOnTop = function () {
        $('.window').css('z-index', 30);
        const window = $(this).parent().parent().detach();
        $('desktop').append(window);
    }

    maximize = () => {
        let h = $('desktop').height();
        let w = $('desktop').width();
        if (h != $('#paint' + this.id).height() && w != $('#paint' + this.id).width()) {
            this.tmpHeight = $('#paint' + this.id).height();
            this.tmpWidth = $('#paint' + this.id).width();
            this.tmpTop = $('#paint' + this.id).position().top;
            this.tmpLeft = $('#paint' + this.id).position().left;
            $('#paint' + this.id).css({ top: 0, left: 0, height: h, width: w });
        }
        else {
            $('#paint' + this.id).css({ top: this.tmpTop, left: this.tmpLeft, height: this.tmpHeight, width: this.tmpWidth });
            this.tmpHeight = this.tmpWidth = this.tmpTop = this.tmpLeft = 0;
        }
    };

    minimize = () => {
        if ($('#p_icon' + this.id + ' .dot').css("display") == "none") {
            this.window.css({ display: "none" });
            $('#p_icon' + this.id + ' .dot').css({ display: "block" });
        }
        else {
            this.window.css({ display: "block" });
            $('#p_icon' + this.id + ' .dot').css({ display: "none" });
        }
    }

    close = () => {
        this.window.remove();
        this.footer_icon.remove();
        paints = _.filter(paints, (n) => n.id != this.id);
        if (task && task.state == 0)
            task.renderActivities();
        isPaintOpen = false;
    };

    checkExistence(node) {
        for (let inode in file_manager) {
            if (file_manager[inode].id == this.actual_node.id) {
                return;
            }
        }
    };

    pickTool = (event) => {
        this.window.find('.tool-bar img').removeClass('border2bl');
        let id = $(event.target).attr('id');
        console.log($(event.target).attr('id'))
        if(id == "pencil") {
            $(event.target).addClass('border2bl');
        } else if(id == "fill") {
            $(event.target).addClass('border2bl');
        } else if(id == "rubber") {
            $(event.target).addClass('border2bl');
        } else if(id == "clear") {
            clear();
            background(255);
        }
    }
}

function setup(w, h) {
    createCanvas(w, h);
    background(255);
    colorMode(RGB);
    noLoop();
};

function draw() {
    if (mouseIsPressed) {
        let mode = $(document).find('.border2bl').attr('id');
        if(mode == "pencil") {
            strokeWeight($(document).find('#radius_weight').val());
            line(mouseX, mouseY, pmouseX, pmouseY);
        } else if(mode == "fill") {

        }
    }

};

function mousePressed() { // different function (not in the continuous draw loop) with a condition of pressing the mouse
    // each time the mouse is pressed over these coordinates (the random rect), then the rect color will change color
    if ((mouseX > 0) && (mouseX < width) && (mouseY > 0) && (mouseY < height)) {
        stroke($(document).find('#color_canvas').val())
    }
};