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

//JQUERY

$("#terminal_icon").dblclick(createShell);
$("#file_system_icon").dblclick(createFileSystem);
$("#upload_icon").dblclick(createUpload);
$(".app_icon").draggable({ grid: [100, 100] });

//FUNZIONI

//CHIAMATE

getTime();
getRemoteFiles();

//DEFINIZIONE

function createShell() {
    $('desktop').find('.app_icon').css('z-index', '1');
    _.each($('desktop').find('.window'), (e) => e.style.zIndex = 30);
    let s = new Shell();
    shells.push(s);
};

function createFileSystem() {
    $('desktop').find('.app_icon').css('z-index', '1');
    _.each($('desktop').find('.window'), (e) => e.style.zIndex = 30);
    let fs = new FileSystem();
    fs_arr.push(fs);
}

function createNano(data) {
    $('desktop').find('.app_icon').css('z-index', '1');
    _.each($('desktop').find('.window'), (e) => e.style.zIndex = 30);
    let n = new Nano(data);
    nanos.push(n);
}

function createUpload() {
    $('desktop').find('.app_icon').css('z-index', '1');
    _.each($('desktop').find('.window'), (e) => e.style.zIndex = 30);
    let up = new UploadFile();
    upfis.push(up);
}

function getTime() {
    const days = ['dom', 'lun', 'mar', 'mer', 'gio', 'ven', 'sab'];
    const months = ['gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dic'];
    let data = new Date();
    let day = data.getDay();
    let date = ""+data.getDate();
    let month = data.getMonth();
    let hh = ""+data.getHours();
    let mm = ""+data.getMinutes();
    let time = days[day] + " " + (date.length == 1 ? '0'+date : date) + " " + months[month] + " " + (hh.length == 1 ? '0'+hh : hh) + ":" + (mm.length == 1 ? '0'+mm : mm);
    $(".header-time").html(time);
    //console.log(time);
    window.setTimeout("getTime()", 1000);
}

function getRemoteFiles() {
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
}

function setUploadFolder(obj) {
    for(let o in obj) {
        file_manager.upload.children.push(obj[o]);
    }
}