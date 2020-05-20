var file_id = 0;

class FileSystem {
    constructor() {
        this.init_state();
        this.renderFileSystem();
        this.setListeners();
        this.renderElements(this.actual_node);

        console.log("Created filesys #" + this.id + "!")
    }

    init_state() {
        this.id = file_id++;
        this.actual_node = file_manager.username;
        this.fS = 10;
        this.spriteH = 80;
        this.spriteW = 60;
    }

    renderFileSystem() {
        this.window = $("<div class='window' id='file-system" + this.id + "'></div>");
        let title_bar = $('<div class="title_bar"></div>')
            .append('<font class="title_text">FileSystem ' + this.id + '</font>')
            .append('<div class="close_button" style="background-image: url(assets/img/close.png);"></div>')
            .append('<div class="min_button" style="background-image: url(assets/img/min.png);"></div>')
            .append('<div class="max_button" style="background-image: url(assets/img/max.png);"></div>');
        let fs_top_bar = $('<div class="file-system-bar"></div>')
            .append('<div class="parent-icon" style="background-image: url(assets/img/parent.png);"></div>')
            .append('<div class="relative-path"><input type="text"></div>')
            .append('<div class="new-file-icon" style="background-image: url(assets/img/new_file.png);"></div>')
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
            .append("<img class='high_img' src='assets/img/folder.png'>")
            .append("<img class='dot' src='assets/img/dot.png'>");
        $('footer').append(this.footer_icon);

        this.window.css({ fontSize: "15px" });
    }

    renderElements(node) {
        this.window.find('.fs_icon').off();
        this.actual_node = node;
        if (this.actual_node == file_manager.root) {
            this.window.find('.parent-icon').hide();
        } else {
            this.window.find('.parent-icon').show();
        }
        this.window.find('.relative-path>input').val(printPath(this.actual_node));
        this.window.find(".file-system > *").remove();

        for (const child of this.actual_node.children) {
            this.window.find(".file-system")
                .append('<div class="fs_sprite" id=' + child.id + '>\
                            <img class="sprite_image" src="assets/img/'+ (child.type == "dir" ? 'folder' : 'text') + '.png">\
                            <span>'+ child.name + '</span>\
                            <img src="assets/img/delete.png" class="delete_sprite">\
                        </div>');

            this.window.find('#' + child.id).click(() => {
                this.window.find('#' + child.id).focus();
            });

            this.window.find('#' + child.id + " .delete_sprite").click(() => {
                this.deleteElement(child.name, child.id);
            });
        }

        this.window.find('.fs_sprite').dblclick((event) => {this.open(event)});
    }

    setListeners() {

        $('#file-system' + this.id).draggable({ stack: 'div', cursor: "pointer", containment: 'parent' }).resizable({ minHeight: 150, minWidth: 250 });
        $('#file-system' + this.id + ' .title_bar').dblclick(this.maximize);
        $('#file-system' + this.id + ' .max_button').click(this.maximize);
        $('#file-system' + this.id + ' .close_button').click(this.close);
        $('#file-system' + this.id + ' .min_button').click(this.minimize);
        //$('#file-system' + this.id).keydown(this.key_down_actions);
        $('#fs_icon' + this.id).click(this.minimize);

        this.window.find('.relative-path>input').keydown(this.cd);
        this.window.find('.parent-icon').click(() => { this.renderElements(this.actual_node.parent) });
        this.window.find('.new-folder-icon').click(this.getName);
        this.window.find('.new-file-icon').click(this.getName);

        $('#file-system' + this.id).on('click', this.stackOnTop);
    }

    stackOnTop = function () {
        $('.window').css('z-index', 30);
        $(this).css('z-index', 45);
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
        fs_arr = _.filter(fs_arr, (fs) => fs != this.id);
    };

    key_down_actions = (event) => {
        console.log(event.keyCode);
        if (event.ctrlKey && event.key === ',') { // Ingrandire icone e font
            console.log("Ingrandire");
            this.fS += 1;
            this.spriteH += 4/3;
            this.spriteW += 3/4;
            if (this.fS <= 20) {
                $("#file-system" + this.id + " .fs_sprite span").css({ fontSize: this.fS + "px" });
                $("#file-system" + this.id + " .fs_sprite ").css({ height: this.spriteH + "px", width: this.spritew });
            } else {
                this.fS = 20;
            }
        }

        if (event.ctrlKey && event.key === '.') { // Diminuire icone e font
            console.log("Diminuire");
            this.fS -= 1;
            this.spriteH -= 4/3;
            this.spriteW -= 3/4;
            if (this.fS >= 10) {
                $("#file-system" + this.id + " .fs_sprite span").css({ fontSize: this.fS + "px" });
                $("#file-system" + this.id + " .fs_sprite ").css({ height: this.spriteH + "px", width: this.spritew });
            } else {
                this.fS = 10;
            }
        }
    }

    open = (event) => {
        const element_id = event.delegateTarget.id;
        let node = _.filter(file_manager, (e) => e.id == element_id);
        if (node !== [] && node[0].type == 'dir') {
            this.renderElements(node[0]);
        } else if (node !== []) {
            createNano(node[0]);
        }
    };

    getName = (e) => {
        let type = "";
        if (e.target.className == "new-folder-icon") {
            type = "dir";
        } else {
            type = "file";
        }
        const element = $('<div class="select-name"></div>');
        const win = $('<div class="select-name-win"></div>')
            .append('<span class="select-name-text">Indica il nome' + (type == "dir" ? ' della cartella.' : ' del file.') + '</span>')
            .append('<input type="text" class="select-name-value">')
            .append('<input type="button" value="INVIA" class="select-name-button invia">')
            .append('<input type="button" value="ANNULLA" class="select-name-button annulla">');

        element.append(win);
        $('.container').append(element);
        $('.select-name-value').focus();

        $('.select-name-value').keydown((event) => {
            if (event.keyCode == 13)
                $('.invia').trigger('click');
        });

        $('.invia').on('click', type == "dir" ?
            () => {
                let name = $('.select-name-value').val();
                if (name == "")
                    name = "dir";
                this.mkDir(name);
                $('.select-name').remove();
            }
            :
            () => {
                let name = $('.select-name-value').val();
                if (name == "")
                    name = "file";
                this.mkFil(name);
                $('.select-name').remove();
            });

        $('.annulla').on('click', (element) => {
            $('.select-name').remove();
        });
    };

    mkDir = (nam) => {
        const idname = nam + (++id_element);
        if (this.checkSameName(this.actual_node.children, nam)) {
            nam = idname;
        }
        file_manager[idname] = {
            name: nam,
            id: id_element,
            parent: this.actual_node,
            type: "dir",
            children: []
        };
        this.actual_node.children.push(file_manager[idname]);
        console.log(file_manager[idname]);
        _.each(fs_arr, (fs) => {
            if(fs.id != this.id && fs.actual_node.id == this.actual_node.id) {
                fs.renderElements(this.actual_node);
            } 
        });
        _.each(shells, (s) => {
            if(s.actual_node.id == this.actual_node.id) {
                s.actual_node = this.actual_node;
            } 
        });
        this.renderElements(this.actual_node);
    };

    mkFil = (nam) => {
        const idname = nam + (++id_element);
        if (this.checkSameName(this.actual_node.children, nam)) {
            nam = idname;
        }
        file_manager[idname] = {
            name: nam,
            id: id_element,
            parent: this.actual_node,
            type: "file",
            content: ''
        };
        this.actual_node.children.push(file_manager[idname]);
        console.log(file_manager[idname]);
        _.each(fs_arr, (fs) => {
            if(fs.id != this.id && fs.actual_node.id == this.actual_node.id) {
                fs.renderElements(this.actual_node);
            } 
        });
        this.renderElements(this.actual_node);
    };

    checkSameName = (arr, el) => {
        return _.filter(arr, (e) => e.name == el).length > 0;
    };

    cd = (event) => {
        if (event.keyCode == '13') {
            const path = this.window.find('.relative-path>input').val();
            const result = commands.cd.com(this.actual_node, path);
            if (result && result.node !== undefined) {
                this.renderElements(result.node);
            }
            else {
                this.renderElements(this.actual_node);
            }
        }
    };

    deleteElement = (path, id) =>  {
        const response = rm(this.actual_node, printPath(this.actual_node)+"/"+path);

        if(response.result) {
            console.log(response.result);
        } else {
            if(response.node.id !== this.actual_node.id) {
                this.renderElements(response.node);
            } else {
                this.window.find("#"+id).remove();
            }
            _.each(fs_arr, (fs) => {
                if(fs.id != this.id) {
                    //console.log("Chiusa finestra "+fs.id);
                    fs.checkExistence(response.node);
                } 
            });
            _.each(shells, (s) => {
                s.checkExistence(response.node);
            });
            _.each(nanos, (n) => {
                n.checkExistence(response.node);
            });
        }
    }

    checkExistence(node) {
        for(let inode in file_manager) {
            if(file_manager[inode].id == this.actual_node.id) {
                if(this.actual_node.id === node.id)
                    this.renderElements(node);
                return;
            }
        }
        this.close();
    }
}