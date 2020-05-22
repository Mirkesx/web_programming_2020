task_id = 0;

class TaskManager {
    constructor() {
        this.init_state();
        this.renderTaskManager();
        this.setListeners();

        console.log("Created task #" + this.id + "!")
    }

    init_state() {
        this.id = task_id++;
        this.state = 0;
        this.specs = {};
        this.getOSInfo();
    }

    renderTaskManager() {
        this.window = $("<div class='window' id='task" + this.id + "'></div>");
        const title_bar = $('<div class="title_bar"></div>')
            .append('<font class="title_text">TaskManager ' + this.id + '</font>')
            .append('<div class="close_button" style="background-image: url(assets/img/close.png);"></div>')
            .append('<div class="min_button" style="background-image: url(assets/img/min.png);"></div>')
            .append('<div class="max_button" style="background-image: url(assets/img/max.png);"></div>');

        const task = $('<div class="task" ></div>');

        this.window.css({
            top: 0,
            height: '250px',
            width: '350px'
        });

        this.window.append(title_bar).append(task);

        this.window.find('.task')
            .append('<div class="task-bar"></div>')
            .append('<div class="task-body"></div>');

        this.window.find('.task-bar')
            .append('<input type="button" value="Attività" class="button-left">')
            .append('<input type="button" value="System Info" class="button-right">');

        this.footer_icon = $("<div class='footer_icon' id='t_icon" + this.id + "'></div>")
            .append("<img class='high_img' src='assets/img/sysinfo.png'>")
            .append("<img class='dot' src='assets/img/dot.png'>");

        $('desktop').append(this.window);
        this.footer_icon.find('img').css({
            'border-radius': '50px',
            'background-color': 'white'
        });

        $('footer').append(this.footer_icon);

        this.renderActivities();
    }

    renderActivities() {
        this.window.find(".task-body").html("");
        let htmlToAppend = "";

        if (shells.length > 0) {
            htmlToAppend = "<div><h4>Terminal Attivi</h4><ul>";
            for (let s of shells) {
                htmlToAppend += "<li><span class='text_task'>Terminal " + s.id + "</span><img src='assets/img/delete.png' class='delete_task' id='shell_" + s.id + "'></li>";
            }
            htmlToAppend += '</ul></div>';
            this.window.find(".task-body").append(htmlToAppend);
        }

        if (fs_arr.length > 0) {
            htmlToAppend = '<div><h4>FileSystem Attivi</h4><ul>';
            for (let s of fs_arr) {
                htmlToAppend += "<li><span class='text_task'>FileSystem " + s.id + "</span><img src='assets/img/delete.png' class='delete_task' id='fs_" + s.id + "'></li>";
            }
            htmlToAppend += '</ul></div>';
            this.window.find(".task-body").append(htmlToAppend);
        }

        if (upfis.length > 0) {
            htmlToAppend = '<div><h4>Upload Attivi</h4><ul>';
            for (let s of upfis) {
                htmlToAppend += "<li><span class='text_task'>Upload " + s.id + "</span><img src='assets/img/delete.png' class='delete_task' id='upload_" + s.id + "'></li>";
            }
            htmlToAppend += '</ul></div>';
            this.window.find(".task-body").append(htmlToAppend);
        }

        if (nanos.length > 0) {
            htmlToAppend = '<div><h4>Nano Attivi</h4><ul>';
            for (let s of nanos) {
                htmlToAppend += "<li><span class='text_task'>Nano " + s.id + "</span><img src='assets/img/delete.png' class='delete_task' id='nano_" + s.id + "'></li>";
            }
            htmlToAppend += '</ul></div>';
            this.window.find(".task-body").append(htmlToAppend);
        }

        if (drawers.length > 0) {
            htmlToAppend = '<div><h4>Drawer Attivi</h4><ul>';
            for (let s of drawers) {
                htmlToAppend += "<li><span class='text_task'>Drawer " + s.id + "</span><img src='assets/img/delete.png' class='delete_task' id='drawer_" + s.id + "'></li>";
            }
            htmlToAppend += '</ul></div>';
            this.window.find(".task-body").append(htmlToAppend);
        }

        if (readers.length > 0) {
            htmlToAppend = '<div><h4>Reader Attivi</h4><ul>';
            for (let s of readers) {
                htmlToAppend += "<li><span class='text_task'>Reader " + s.id + "</span><img src='assets/img/delete.png' class='delete_task' id='reader_" + s.id + "'></li>";
            }
            htmlToAppend += '</ul></div>';
            this.window.find(".task-body").append(htmlToAppend);
        }

        this.window.find('h4').click(this.closeUL);
        this.window.find(".delete_task").click(this.deleteItem);
    }

    renderSysInfo() {
        this.window.find(".task-body").html("");

        this.window.find(".task-body")
            .append('\
        <table>\
        <tr>\
            <th>Spec</th>\
            <th>Valore</th>\
        </tr>\
        <tr>\
            <td>Nome OS</dh>\
            <td id="os_name">'+ this.specs.os_name + '</td>\
        </tr>\
        <tr>\
            <td>Versione OS</dh>\
              <td id="os_version">'+ this.specs.os_version + '</td>\
        </tr>\
        <tr>\
            <td>Architettura</dh>\
              <td id="os_machine">'+ this.specs.os_machine + '</td>\
        </tr>\
        <tr>\
            <td>CPU usata (avg)</dh>\
              <td id="cpu_avg">'+ this.specs.cpu_avg + '</td>\
        </tr>\
        <tr>\
            <td>RAM usata</dh>\
              <td id="memory_used">'+ this.specs.memory_used + '</td>\
        </tr>\
        <tr>\
            <td>RAM totale</dh>\
              <td id="memory_all">'+ this.specs.memory_all + '</td>\
        </tr>\
        <tr>\
            <td>Ram usata/totale</dh>\
              <td id="memory_prc">'+ this.specs.memory_prc + '</td>\
        </tr>\
        </table>');

        window.setTimeout(this.getOSInfo, 1000);
    }

    setListeners() {

        $('#task' + this.id).draggable({ stack: 'div', cursor: "pointer", containment: 'parent' }).resizable({ minHeight: 150, minWidth: 250 });
        $('#task' + this.id + ' .title_bar').dblclick(this.maximize);
        $('#task' + this.id + ' .max_button').click(this.maximize);
        $('#task' + this.id + ' .close_button').click(this.close);
        $('#task' + this.id + ' .min_button').click(this.minimize);
        $('#t_icon' + this.id).click(this.minimize);
        $('#task' + this.id).on('click', this.stackOnTop);

        this.window.find('.button-left').click(() => {
            if (this.state == 1) {
                this.state = 0;
                this.renderActivities();
            }
        });
        this.window.find('.button-right').click(() => {
            if (this.state == 0) {
                this.state = 1;
                this.renderSysInfo();
            }
        });
    }

    stackOnTop = function () {
        $('.window').css('z-index', 30);
        const window = $(this).detach();
        $('desktop').append(window);
    }

    maximize = () => {
        let h = $('desktop').height();
        let w = $('desktop').width();
        if (h != $('#task' + this.id).height() && w != $('#task' + this.id).width()) {
            this.tmpHeight = $('#task' + this.id).height();
            this.tmpWidth = $('#task' + this.id).width();
            this.tmpTop = $('#task' + this.id).position().top;
            this.tmpLeft = $('#task' + this.id).position().left;
            $('#task' + this.id).css({ top: 0, left: 0, height: h, width: w });
        }
        else {
            $('#task' + this.id).css({ top: this.tmpTop, left: this.tmpLeft, height: this.tmpHeight, width: this.tmpWidth });
            this.tmpHeight = this.tmpWidth = this.tmpTop = this.tmpLeft = 0;
        }
    };

    minimize = () => {
        if ($('#t_icon' + this.id + ' .dot').css("display") == "none") {
            this.window.css({ display: "none" });
            $('#t_icon' + this.id + ' .dot').css({ display: "block" });
        }
        else {
            this.window.css({ display: "block" });
            $('#t_icon' + this.id + ' .dot').css({ display: "none" });
        }
    }

    close = () => {
        this.window.remove();
        this.footer_icon.remove();
    };

    closeUL = (event) => {
        console.log($(event.target).parent().find('ul'));
        const element = $(event.target).parent().find('li');
        if(element.css('display') == 'list-item') {
            element.css('display','none');
        } else {
            element.css('display','list-item');
        }
    };

    deleteItem = (event) => {
        const split = event.target.id.split('_');
        const type = split[0];
        const id = split[1];
        let empty;
        let el;
        switch (type) {
            case "shell":
                el = _.filter(shells, (e) => e.id == id);
                el[0].close();
                empty = shells == 0;
                break;
            case "fs":
                el = _.filter(fs_arr, (e) => e.id == id);
                el[0].close();
                empty = fs_arr == 0;
                break;
            case "upload":
                el = _.filter(upfis, (e) => e.id == id);
                el[0].close();
                empty = upfis == 0;
                break;
            case "nano":
                el = _.filter(nanos, (e) => e.id == id);
                el[0].close();
                empty = nanos == 0;
                break;
            case "drawer":
                el = _.filter(drawers, (e) => e.id == id);
                el[0].close();
                empty = drawers == 0;
                break;
            case "reader":
                el = _.filter(readers, (e) => e.id == id);
                el[0].close();
                empty = readers == 0;
                break;
            default:
                break;
        }
        const h3 = $('#' + event.target.id).parent().parent().parent();
        $('#' + event.target.id).parent().remove();
        if(empty)
            h3.remove();
            
    };

    getOSInfo = () => {
        $.ajax({
            url: "/php/getInfos.php",
            method: "GET",
            contentType: false,
            cache: false,
            callFunction: (obj) => {
                if (task) {
                    task.specs = obj;

                    const window = $(this)[0].window;

                    if (window.find('table').length > 0) {
                        for (let o in obj) {
                            window.find("#" + o).html(obj[o]);
                        }
                    }
                }
            },
            processData: false,
            error: function (e) {
                console.log("PHP - Errore!");
                console.log(e);
            },
            success: function (response) {
                this.callFunction(JSON.parse(response));
            }
        });

        if (this.state == 1)
            window.setTimeout(this.getOSInfo, 1000);
    };
}
