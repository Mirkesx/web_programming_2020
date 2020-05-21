apps = {
    file_manager : {
        name : "FileManager",
        icon : "assets/img/folder.png",
        open : createFileSystem,
    },
    info : {
        name : "System Info",
        icon : "assets/img/info.png",
        open : createInfoOS,
    },
    task : {
        name : "TaskManager",
        icon : "assets/img/sysinfo.png",
        open : createTaskManager,
    },
    terminal : {
        name : "Terminale",
        icon : "assets/img/terminal.png",
        open : createShell,
    },
    upload : {
        name : "Upload",
        icon : "assets/img/upload.png",
        open : createUpload,
    },
}

function createInfoOS() {
    if (info)
        info.close();
    info = new InfoOS();
};

function createTaskManager() {
    if (info)
        info.close();
    info = new TaskManager();
};

function createShell() {
    $('desktop').find('.app_icon').css('z-index', '1');
    _.each($('desktop').find('.window'), (e) => e.style.zIndex = 30);
    let s = new Shell();
    shells.push(s);
    if (info && info.state == 0)
        info.renderActivities();
};

function createFileSystem(data) {
    $('desktop').find('.app_icon').css('z-index', '1');
    _.each($('desktop').find('.window'), (e) => e.style.zIndex = 30);
    let fs = new FileSystem(data);
    fs_arr.push(fs);
    if (info && info.state == 0)
        info.renderActivities();
};

function createNano(data) {
    $('desktop').find('.app_icon').css('z-index', '1');
    _.each($('desktop').find('.window'), (e) => e.style.zIndex = 30);
    let n = new Nano(data);
    nanos.push(n);
    if (info && info.state == 0)
        info.renderActivities();
};

function createUpload() {
    $('desktop').find('.app_icon').css('z-index', '1');
    _.each($('desktop').find('.window'), (e) => e.style.zIndex = 30);
    let up = new UploadFile();
    upfis.push(up);
    if (info && info.state == 0)
        info.renderActivities();
};

function createDrawer(data) {
    $('desktop').find('.app_icon').css('z-index', '1');
    _.each($('desktop').find('.window'), (e) => e.style.zIndex = 30);
    let d = new Drawer(data);
    drawers.push(d);
    if (info && info.state == 0)
        info.renderActivities();
};

function createReader(data) {
    $('desktop').find('.app_icon').css('z-index', '1');
    _.each($('desktop').find('.window'), (e) => e.style.zIndex = 30);
    let r = new Reader(data);
    readers.push(r);
    if (info && info.state == 0)
        info.renderActivities();
};