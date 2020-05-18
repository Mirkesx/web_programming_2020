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

function createShell() {
    $('desktop').find('.app_icon').css('z-index','1');
    _.each($('desktop').find('.window'), (e) => e.style.zIndex = 30);
    let s = new Shell();
    shells.push(s);
};

function createFileSystem() {
    $('desktop').find('.app_icon').css('z-index','1');
    _.each($('desktop').find('.window'), (e) => e.style.zIndex = 30);
    let fs = new FileSystem();
    fs_arr.push(fs);
}

function createNano(data) {
    $('desktop').find('.app_icon').css('z-index','1');
    _.each($('desktop').find('.window'), (e) => e.style.zIndex = 30);
    let n = new Nano(data);
    nanos.push(n);
}

function createUpload() {
    $('desktop').find('.app_icon').css('z-index','1');
    _.each($('desktop').find('.window'), (e) => e.style.zIndex = 30);
    let up = new UploadFile();
    upfis.push(up);
}
