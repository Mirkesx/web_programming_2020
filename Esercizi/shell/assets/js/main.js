//ADD ICONS

$("desktop").append('<div class="app_icon" id="terminal_icon">\
                        <img src="assets/img/terminal.png">\
                        <span>Terminal</span>\
                    </div>');
$("desktop").append('<div class="app_icon" id="file_system_icon">\
                    <img src="assets/img/folder.png">\
                    <span>FileSys</span>\
                </div>');

//VARIABILI

let shells = [];
let fs_arr = [];

//JQUERY

$("#terminal_icon").dblclick(createShell);
$("#file_system_icon").dblclick(createFileSystem);


$( ".app_icon" ).draggable({ grid: [ 90, 90 ] });

//FUNZIONI

function createShell() {
    let s = new Shell();
    shells.push(s);
};

function createFileSystem() {
    let fs = new FileSystem();
    fs_arr.push(fs);
}