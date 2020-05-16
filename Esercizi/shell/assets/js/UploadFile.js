var upfi_id = 0;
//https://www.youtube.com/watch?v=H-091qVG6LM

class UploadFile {
    constructor() {
        this.init_state();
        this.renderFileSystem();
        this.setListeners();

        console.log("Created filesys #" + this.id + "!")
    }

    init_state() {
        this.id = upfi_id++;
    }

    renderFileSystem() {
        this.window = $("<div class='window' id='upfi" + this.id + "'></div>");
        let title_bar = $('<div class="title_bar"></div>')
            .append('<font class="title_text">Upload ' + this.id + '</font>')
            .append('<div class="close_button" style="background-image: url(assets/img/close.png);"></div>')
            .append('<div class="min_button" style="background-image: url(assets/img/min.png);"></div>')
            .append('<div class="max_button" style="background-image: url(assets/img/max.png);"></div>');
        let upload_form = $('<div class="upload"></div>')
            .append('<form class="uploadForm">\
                        <input type="file" name="inpFile" class="inpFile"><br>\
                        <input type="submit" value="Carica" class="buttonUpload">\
                    </form>')
            .append('<div class="progressBar">\
                        <div class="progressBarFill">\
                            <span class="progressBarText">0%</span>\
                        </div>\
                    </div>');

        this.window.append(title_bar).append(upload_form);

        $('desktop').append(this.window);
        $('#upfi' + this.id).css({
            top: 0,
            height: '250px',
            width: '350px'
        });

        this.footer_icon = $("<div class='footer_icon' id='upfi_icon" + this.id + "'></div>")
            .append("<img class='high_img' src='assets/img/upload.png'>")
            .append("<img class='dot' src='assets/img/dot.png'>");
        $('footer').append(this.footer_icon);

        this.window.css({ fontSize: "15px" });
    }

    setListeners() {

        $('#upfi' + this.id).draggable({ stack: 'div', cursor: "pointer" }).resizable({ minHeight: 150, minWidth: 250 });
        $('#upfi' + this.id + ' .title_bar').dblclick(this.maximize);
        $('#upfi' + this.id + ' .max_button').click(this.maximize);
        $('#upfi' + this.id + ' .close_button').click(this.close);
        $('#upfi' + this.id + ' .min_button').click(this.minimize);
        $('#upfi_icon' + this.id).click(this.minimize);
    }

    maximize = () => {
        let h = $('desktop').height()+40;
        let w = $('desktop').width()+40;
        if (h != $('#upfi' + this.id).height() && w != $('#upfi' + this.id).width()) {
            this.tmpHeight = $('#upfi' + this.id).height();
            this.tmpWidth = $('#upfi' + this.id).width();
            this.tmpTop = $('#upfi' + this.id).position().top;
            this.tmpLeft = $('#upfi' + this.id).position().left;
            $('#upfi' + this.id).css({ top: 0, left: 0, height: h, width: w });
        }
        else {
            $('#upfi' + this.id).css({ top: this.tmpTop, left: this.tmpLeft, height: this.tmpHeight, width: this.tmpWidth });
            this.tmpHeight = this.tmpWidth = this.tmpTop = this.tmpLeft = 0;
        }
    };

    minimize = () => {
        if ($('#upfi_icon' + this.id + ' .dot').css("display") == "none") {
            this.window.css({ display: "none" });
            $('#upfi_icon' + this.id + ' .dot').css({ display: "block" });
        }
        else {
            this.window.css({ display: "block" });
            $('#upfi_icon' + this.id + ' .dot').css({ display: "none" });
        }
    }

    close = () => {
        this.window.remove();
        this.footer_icon.remove();
    };
}