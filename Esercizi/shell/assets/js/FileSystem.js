var file_id = 0;

class FileSystem {
    constructor() {
        this.init_state();
        this.renderFileSystem();
        this.setListeners();
        this.renderElements(this.actual_node);

        console.log("Created shell #" + this.id + "!")
    }

    init_state() {
        this.id = shell_id++;
        this.actual_node = file_manager.username;
    }

    renderFileSystem() {
        this.window = $("<div class='window' id='file-system" + this.id + "'></div>");
        let title_bar = $('<div class="title_bar"></div>')
            .append('<font class="title_text">FileSystem ' + this.id + '</font>')
            .append('<div class="close_button" style="background-image: url(assets/img/close.png);"></div>')
            .append('<div class="min_button" style="background-image: url(assets/img/min.png);"></div>')
            .append('<div class="max_button" style="background-image: url(assets/img/max.png);"></div>')
        let fs_top_bar = $('<div class="file-system-bar"></div>')
            .append('<div class="parent-icon" style="background-image: url(assets/img/parent.png);"></div>')
            .append('<div class="relative-path"></div>')
            .append('<div class="new-folder-icon" style="background-image: url(assets/img/new_folder.png);"></div>');
        let file_system = $('<div class="file-system"></div>')
        

        this.window.append(title_bar).append(fs_top_bar).append(file_system);

        $('desktop').append(this.window);
        $('#file-system' + this.id).css({
            top: 0,
            height: '250px',
            width: '350px'
        });

        this.footer_icon = $("<div class='footer_icon' id='fs_icon" + this.id + "'></div>")
            .append("<img src='assets/img/folder.png'>")
            .append("<font class='dot'>.</font>")
        $('footer').append(this.footer_icon);
        $('#fs_icon' + this.id).css({
            'margin-left': '10px',
            height: '40px',
            width: '30px'
        });

        this.window.css({ fontSize: "15px" });
    }

    renderElements(node) {
        this.actual_node = node;
        if(this.actual_node == file_manager.root) {
            this.window.find('.parent-icon').hide();
        } else {
            this.window.find('.parent-icon').show();
        }
        this.window.find('.relative-path').html(printPath(this.actual_node));
        this.window.find(".file-system > *").remove();
        
        for(const child of this.actual_node.children) {
            this.window.find(".file-system")
                .append('<div class="fs_icon">\
                            <img src="assets/img/'+(child.type == "dir" ? 'folder' : 'text')+'.png">\
                            <span>'+child.name+'</span>\
                        </div>');
        }
    }

    setListeners() {

        $('#file-system' + this.id).draggable({ stack: 'div', cursor: "pointer" }).resizable({ minHeight: 150, minWidth: 250 });
        $('#file-system' + this.id + ' .title_bar').dblclick(this.maximize);
        $('#file-system' + this.id + ' .max_button').click(this.maximize);
        $('#file-system' + this.id + ' .close_button').click(this.close);
        $('#file-system' + this.id + ' .min_button').click(this.minimize);
        $('#file-system' + this.id + ' .shell').click(() => { $('#file-system' + this.id + ' .shell_input').focus() })
        $('#fs_icon' + this.id).click(this.minimize);

        this.window.find('.parent-icon').click(() => {this.renderElements(this.actual_node.parent)});
    }

    maximize = () => {
        let h = $('desktop').height();
        let w = $('desktop').width();
        if (h != $('#file-system' + this.id).height() && w != $('#file-system' + this.id).width()) {
            this.tmpHeight = $('#file-system' + this.id).height();
            this.tmpWidth = $('#file-system' + this.id).width();
            this.tmpTop = $('#file-system' + this.id).position().top;
            this.tmpLeft = $('#file-system' + this.id).position().left;
            $('#file-system' + this.id).css({ top: 0, left: 0, height: h, width: w });
        }
        else {
            $('#file-system' + this.id).css({ top: this.tmpTop, left: this.tmpLeft, height: this.tmpHeight, width: this.tmpWidth });
            this.tmpHeight = this.tmpWidth = this.tmpTop = this.tmpLeft = 0;
        }
    };

    minimize = () => {
        if ($('#fs_icon' + this.id + ' .dot').css("display") == "none") {
            this.window.css({ display: "none" });
            $('#fs_icon' + this.id + ' .dot').css({ display: "block" });
        }
        else {
            this.window.css({ display: "block" });
            $('#fs_icon' + this.id + ' .dot').css({ display: "none" });
        }
    }

    close = () => {
        this.window.remove();
        this.footer_icon.remove();
    };
}