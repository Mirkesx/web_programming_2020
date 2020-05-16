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
    let s = new Shell();
    shells.push(s);
};

function createFileSystem() {
    let fs = new FileSystem();
    fs_arr.push(fs);
}

function createNano(data) {
    let n = new Nano(data);
    nanos.push(n);
}

function createUpload() {
    let up = new UploadFile();
    upfis.push(up);
}