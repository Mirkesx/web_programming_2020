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
            .append('<span class="titleUpload">Choose a file to upload.</span>')
            .append('<form class="uploadForm" enctype="multipart/form-data">\
                        <input type="file" class="inpFile fileInput" name="file">\
                        <input type="submit" name="submit" class="buttonUpload" value="UPLOAD"/>\
                    </form>')
            .append('<input type="button" class="buttonReset" value="RESET">')
            .append('<div class="progress">\
                        <div class="progress-bar">\
                            <span>0%</span>\
                        </div>\
                    </div>')
            .append('<div class="uploadStatus"></div>');

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

        this.window.find('.buttonReset').on('click',this.reset);
        this.window.ready(this.handleUpload);
        $('#upfi'+this.id).on('click',this.stackOnTop);
    }

    stackOnTop = function() {
        $('.window').css('z-index',30);
        const window = $(this).detach();
        $('desktop').append(window);
    }

    maximize = () => {
        let h = $('desktop').height() + 40;
        let w = $('desktop').width() + 40;
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

    handleUpload = () => {
        // File upload via Ajax
        $(".uploadForm").on('submit', function (e) {
            $('.buttonUpload').prop('disabled', true).css({'background-color': 'grey'});
            e.preventDefault();
            $('.buttonReset').css({'background-color': 'blue'});
            $.ajax({
                xhr: function () {
                    var xhr = new window.XMLHttpRequest();
                    xhr.upload.addEventListener("progress", function (evt) {
                        if (evt.lengthComputable) {
                            var percentComplete = ((evt.loaded / evt.total) * 100);
                            $(".progress-bar").width(percentComplete + '%');
                            $(".progress-bar>span").html(percentComplete.toFixed(2) + '%');
                        }
                    }, false);
                    return xhr;
                },
                type: 'POST',
                url: '/php/upload.php',
                data: new FormData(this),
                contentType: false,
                cache: false,
                processData: false,
                beforeSend: function () {
                    $(".progress-bar").width('0%');
                },
                error: function () {
                    $('.uploadStatus').html('<p style="color:#EA4335;">File upload failed, please try again.</p>');
                },
                success: function (response) {
                    const resp = {path : response.split("!")[0], type : response.split("!")[1]}
                    console.log(resp);
                    console.log(['jpg', 'png', 'jpeg', 'gif'].includes(resp.type));
                    $('.uploadForm')[0].reset();
                    $('.uploadStatus').html('<p style="color:#28A74B;">File has been uploaded successfully!</p>')
                        .append(['jpg', 'png', 'jpeg', 'gif'].includes(resp.type) ? '<img src="/php/'+resp.path+'"><br>' : "")
                        .append('<a href="/php/'+resp.path+'" target="_blank">Open on browser</a>');
                }
            });
        });

        // File type validation
        $(".fileInput").change(function () {
            var allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.ms-office', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
            var file = this.files[0];
            var fileType = file.type;
            if (!allowedTypes.includes(fileType)) {
                alert('Please select a valid file (PDF/DOC/DOCX/JPEG/JPG/PNG/GIF).');
                $(".fileInput").val('');
                return false;
            }
        });
    };

    reset = () => {
        console.log(this.window.find('.buttonReset').css('background-color'));
        if(this.window.find('.buttonReset').css('background-color') == 'rgb(0, 0, 255)') {
            console.log();
            this.window.remove();
            this.footer_icon.remove();
            this.init_state();
            this.renderFileSystem();
            this.setListeners();
        }
    };
}