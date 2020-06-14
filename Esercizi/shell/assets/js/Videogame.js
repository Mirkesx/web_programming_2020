var isGameOpened = false;
var record = 0;

class Videogame {
    constructor(name, icon) {
        this.name = name;
        this.icon = icon;
        isGameOpened = true;
        this.renderVideogame();
        switch (name) {
            case "Snake":
                this.initSnake();
                this.renderSnake();
                this.setSnakeListeners();
                break;
        }
        this.setListeners();

        console.log("Created videogame " + this.name + "!")
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

    initSnake() {
        this.gameScreen = 0;

        this.window.find("iframe").remove();

        this.window.css({
            top: 0,
            left: 0,
            height: 450,
            width: 400
        });
    }

    renderSnake() {
        if (this.gameScreen == 0) {
            this.renderHomePage();
        } else {
            this.window.find('.snake-screen').html("");
            this.window.find('.snake-tab').html("");
            this.resetVal();
            this.createGameField();
            this.run();
        }
    }

    renderHomePage() {
        this.window.find('.videogame')
            .append('<div class="snake-screen" tabindex="0"></div>')
            .append('<div class="snake-tab"></div>');

        this.window.find('.snake-screen')
            .append("<table>\
                    <tr>\
                    <td colspan='5'><h1>Snake</h1></td>\
                    </tr>\
                    <tr>\
                    <td id='level_1' colspan='2'><h4>Play</h4></td>\
                    <td colspan='3' rowspan='3'><img src='assets/img/snakeHome.png'></td>\
                    </tr>\
                    <tr>\
                    <td id='level_2' colspan='2'></td>\
                    </tr>\
                    <tr>\
                    <td id='level_3' colspan='2'></td>\
                    </tr>\
                    </table>");

        this.window.find('table').css({
            color: "white",
            "text-align": "center",
            width: "100%",
            height: "100%",
        });

        this.window.find('.snake-tab').html("");

        this.window.find('h4').parent().css("cursor", "pointer");

        this.window.find('table img').css({
            height: 200,
        });

        this.window.find('#level_1').click(() => {
            this.gameScreen = 1;
            this.renderSnake();
        });

        this.window.find('#level_2').click(() => {
            this.gameScreen = 2;
            this.renderSnake();
        });

        this.window.find('#level_3').click(() => {
            this.gameScreen = 3;
            this.renderSnake();
        });
    }

    resetVal() {
        this.lifes = 1;
        this.points = 0;
        this.snake_body = [];
        this.item_loc = [];
        this.snake_speed = 500;
        this.gameBoard = [];
        this.direction = "+y";
        this.columns = 20;
    }

    createGameField() {
        this.createElement('body');
        this.createElement('item');
        this.window.find('.snake-tab')
            .append('<div class="snake-points">\
                        Points: <span id="your-points">0</span> Record: '+record+'<br>\
                        <span id="snake-reset">Restart</span>\
                    </div>');
        this.window.find('#snake-reset').click(() => {this.restart()});
    }

    createElement(type) {
        let found = false;
        let x, y;
        while (!found) {
            x = parseInt(Math.random() * this.columns);
            y = parseInt(Math.random() * this.columns);
            if (this.snake_body == 0 || _.filter(this.snake_body, (e) => e && e[0] == x && e[1] == y).length == 0) {
                found = true;
            }
        }

        const height = this.window.find('.snake-screen').height() * 5 / 100;
        const width = this.window.find('.snake-screen').width() * 5 / 100;

        const last = this.snake_body.length - 1;
        const element = $('<div"></div>').css({ top: x * height, left: y * width });

        if (type == 'body') {
            element.addClass('snake-body snake-tail snake-head');
            this.snake_body = [[element, x, y, -1]];
        } else {
            element.addClass('snake-item');
            this.item_loc = [element, x, y];
        }
        element.appendTo('.snake-screen');
    }

    run() {
        this.changedDirection = false;
        switch (this.direction) {
            case '+y':
                this.moveSnake(0, 1);
                break;
            case '-y':
                this.moveSnake(0, -1);
                break;
            case '+x':
                this.moveSnake(1, 0);
                break;
            case '-x':
                this.moveSnake(-1, 0);
                break;
        }
        if (this.collisionItem()) {
            this.points++;
            this.window.find('#your-points').html(this.points);
            this.snake_speed *= 0.95;
            this.item_loc[0].remove();
            this.appendToSnake(this.item_loc[1], this.item_loc[2], this.snake_body.length-1);
            this.createElement('item');
        } 

        if(!this.collisionBody())
            this.runTimeout = setTimeout(() => this.run(), this.snake_speed);
        else {
            console.log("Game Over");
            if(record < this.points) {
                record = this.points;
                console.log("Hai stabilito un nuovo record di "+record+" punti!");
            }
        }
    }

    restart() {
        if(this.runTimeout)
            clearTimeout(this.runTimeout);
        this.renderSnake();
    }

    moveSnake(x, y) {
        const height = this.window.find('.snake-screen').height() * 5 / 100;
        const width = this.window.find('.snake-screen').width() * 5 / 100;
        const prec_x = this.snake_body[0][1];
        const prec_y = this.snake_body[0][2];
        let new_x = (parseInt((prec_x + x) % this.columns) >= 0 ? parseInt((prec_x + x) % this.columns) : this.columns - 1);
        let new_y = (parseInt((prec_y + y) % this.columns) >= 0 ? parseInt((prec_y + y) % this.columns) : this.columns - 1);
        this.snake_body[0][0].css({ top: new_x * height, left: new_y * width });
        this.snake_body[0][1] = new_x;
        this.snake_body[0][2] = new_y;

        for (let i = this.snake_body.length - 1; i > 0; i--) {
            if(i > 1) {
                new_x = this.snake_body[i - 1][1];
                new_y = this.snake_body[i - 1][2];
            } else {
                new_x = prec_x;
                new_y = prec_y;
            }
            if (this.snake_body[i][3] == -1) {
                this.snake_body[i][0].css({ top: new_x * height, left: new_y * width });
                this.snake_body[i][1] = new_x;
                this.snake_body[i][2] = new_y;
            } else {
                if (this.snake_body[i][3] == 0) {
                    this.snake_body[i][0].css({ top: new_x * height, left: new_y * width });
                    this.window.find('.snake-screen').append(this.snake_body[i][0]);
                    this.window.find('.snake-tail').removeClass("snake-tail");
                    this.snake_body[i][0].addClass("snake-tail");
                }
                this.snake_body[i][3]--;
            }
        }
    }

    setSnakeListeners() {
        $('#videogame' + this.id).draggable({ handle: '.title_bar', stack: 'div', cursor: "pointer", containment: 'parent' }).resizable({ minHeight: 500, minWidth: 400 });
        $('#videogame' + this.id + ' .title_bar').dblclick(this.maximize);
        $('#videogame' + this.id + ' .max_button').click(this.maximize);

        $(document).keydown((event) => {
            if (!this.changedDirection) {
                if (event.keyCode === 37 && this.direction != '+y') {
                    this.direction = '-y';
                    this.changedDirection = true;
                }
                if (event.keyCode === 38 && this.direction != '+x') {
                    this.direction = '-x';
                    this.changedDirection = true;
                }
                if (event.keyCode === 39 && this.direction != '-y') {
                    this.direction = '+y';
                    this.changedDirection = true;
                }
                if (event.keyCode === 40 && this.direction != '-x') {
                    this.direction = '+x';
                    this.changedDirection = true;
                }
            }
        });
    }

    collisionItem() {
        return this.snake_body[0][1] == this.item_loc[1] && this.snake_body[0][2] == this.item_loc[2];
    }

    collisionBody() {
        const head_x = this.snake_body[0][1];
        const head_y = this.snake_body[0][2];
        for(let i = 4; i < this.snake_body.length; i++) { //inutile controllare prima perchè le collissioni sono impossibili
            let body_x = this.snake_body[i][1];
            let body_y = this.snake_body[i][2];
            if(head_x == body_x && head_y == body_y)
                return true;
        }
        return false;
    }

    appendToSnake(x, y, l) {
        const height = this.window.find('.snake-screen').height() * 5 / 100;
        const width = this.window.find('.snake-screen').width() * 5 / 100;
        const element = $('<div"></div>').css({ top: x * height, left: y * width }).addClass('snake-body');
        this.snake_body.push([element, -1, -1, l]);
    }

    setListeners() {
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

    maximize = () => {
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
    };

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