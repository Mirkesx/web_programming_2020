//ADD ICONS

$("desktop").append('<div class="app_icon" id="terminal_icon">\
                        <img src="assets/img/terminal.png">\
                        <span>Terminal</span>\
                    </div>');
$("desktop").append('<div class="app_icon" id="file_system_icon">\
                    <img src="assets/img/folder.png">\
                    <span>FileSys</span>\
                </div>');
$("desktop").append('<div class="app_icon" id="upload_icon">\
                <img src="assets/img/upload.png">\
                <span>Upload</span>\
            </div>');

//VARIABILI

let shells = [];
let fs_arr = [];
let nanos = [];
let upfis = [];
let drawers = [];
let readers = [];
let info;

//JQUERY

$("#terminal_icon").dblclick(createShell);
$("#file_system_icon").dblclick(() => createFileSystem(file_manager.username));
$("#upload_icon").dblclick(createUpload);
$(".app_icon").draggable({ grid: [100, 100] });
$("footer-menu > img").on('click', openMenu);
$(document).keydown((event) => {
    if (event.ctrlKey && event.altKey && event.keyCode == '80') {
        createInfoOS();
    }

    if (event.ctrlKey && event.altKey && event.keyCode == '79') {
        if (info)
            info.close();
        info = new TaskManager();
    }
});

//FUNZIONI

//CHIAMATE

getTime();
getRemoteFiles();

//DEFINIZIONE

function getTime() {
    const days = ['dom', 'lun', 'mar', 'mer', 'gio', 'ven', 'sab'];
    const months = ['gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dic'];
    let data = new Date();
    let day = data.getDay();
    let date = "" + data.getDate();
    let month = data.getMonth();
    let hh = "" + data.getHours();
    let mm = "" + data.getMinutes();
    let time = days[day] + " " + (date.length == 1 ? '0' + date : date) + " " + months[month] + " " + (hh.length == 1 ? '0' + hh : hh) + ":" + (mm.length == 1 ? '0' + mm : mm);
    $(".header-time").html(time);
    //console.log(time);
    window.setTimeout("getTime()", 1000);
};

function getRemoteFiles() {
    file_manager.upload.children = [];
    $.ajax({
        type: 'GET',
        url: '/php/getRemoteFiles.php',
        contentType: false,
        cache: false,
        processData: false,
        error: function (e) {
            console.log("PHP - Errore!");
            console.log(e);
        },
        success: function (response) {
            //console.log(JSON.parse(response));
            setUploadFolder(JSON.parse(response));
        }
    });
};

function setUploadFolder(obj) {
    for (let o in obj) {
        if (['jpg', 'png', 'jpeg', 'gif'].includes(obj[o].ext)) {
            obj[o].type = 'img';
        } else {
            obj[o].type = 'rem_file';
        }
        obj[o].parent = file_manager.upload;
        file_manager.upload.children.push(obj[o]);
    }
};

function openMenu() {
    let menu = $("desktop").find('.menu-back');
    console.log(menu)
    if (menu.length == 0) {
        menu = $('<div class="menu-back"></div>');
        const drawer = $('<div class="menu-drawer"></div>');

        for (let app in apps) {
            drawer.append('<div class="menu-icon">\
                                <img src="'+ apps[app].icon + '">\
                                <span>'+ apps[app].name + '</span>\
                                <input type="hidden" value="'+app+'">\
                            </div>')
        }
        menu.append(drawer);
        $("desktop").append(menu);

        $("desktop").find(".menu-icon").on('click', openApp);
        $("desktop").find(".menu-back").on('click', closeMenu);
    } else {
        closeMenu();
    }
};

function openApp(event) {
    const element = $(event.target).parent().find('input');
    apps[element.val()].open();
    closeMenu();
};

function closeMenu() {
    $(".container").find('.menu-back').remove();
};