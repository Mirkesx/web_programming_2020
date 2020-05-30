apps = {
    file_manager: {
        name: "File Manager",
        idName: "file_system_icon",
        icon: "assets/img/folder.png",
        open: createFileSystem,
    },
    info: {
        name: "System Info",
        icon: "assets/img/info.png",
        open: createInfoOS,
    },
    task: {
        name: "Task Manager",
        icon: "assets/img/sysinfo.png",
        open: createTaskManager,
    },
    terminal: {
        name: "Terminale",
        idName: "terminal_icon",
        icon: "assets/img/terminal.png",
        open: createShell,
    },
    upload: {
        name: "Upload",
        idName: "upload_icon",
        icon: "assets/img/upload.png",
        open: createUpload,
    },
    paint: {
        name: "Paint",
        idName: "paint_icon",
        icon: "assets/img/paint.png",
        open: createPaint,
    },
    bomberman: {
        name: "Bomber Man",
        idName: "bomberman_icon",
        icon: "assets/img/bomberman.png",
        open: () => createVideoGame("Bomber Man", "assets/img/bomberman.png")
    },
    tris: {
        name: "Tris",
        idName: "tris_icon",
        icon: "assets/img/tris.png",
        open: () => createVideoGame("Tris", "assets/img/tris.png")
    },
    snake: {
        name: "Snake",
        idName: "snake_icon",
        icon: "assets/img/snake.png",
        open: () => createVideoGame("Snake", "assets/img/snake.png")
    }
}

apps = _.orderBy(apps, "name");

function createInfoOS() {
    if (info)
        info.close();
    info = new InfoOS();
};

function createTaskManager() {
    if (task)
        task.close();
    task = new TaskManager();
};

function createShell() {
    $('desktop').find('.app_icon').css('z-index', '1');
    _.each($('desktop').find('.window'), (e) => e.style.zIndex = 30);
    let s = new Shell();
    shells.push(s);
    if (task && task.state == 0)
        task.renderActivities();
};

function createFileSystem(data) {
    $('desktop').find('.app_icon').css('z-index', '1');
    _.each($('desktop').find('.window'), (e) => e.style.zIndex = 30);
    let fs = new FileSystem(data);
    fs_arr.push(fs);
    if (task && task.state == 0)
        task.renderActivities();
};

function createNano(data) {
    $('desktop').find('.app_icon').css('z-index', '1');
    _.each($('desktop').find('.window'), (e) => e.style.zIndex = 30);
    let n = new Nano(data);
    nanos.push(n);
    if (task && task.state == 0)
        task.renderActivities();
};

function createUpload() {
    $('desktop').find('.app_icon').css('z-index', '1');
    _.each($('desktop').find('.window'), (e) => e.style.zIndex = 30);
    let up = new UploadFile();
    upfis.push(up);
    if (task && task.state == 0)
        task.renderActivities();
};

function createDrawer(data) {
    $('desktop').find('.app_icon').css('z-index', '1');
    _.each($('desktop').find('.window'), (e) => e.style.zIndex = 30);
    let d = new Drawer(data);
    drawers.push(d);
    if (task && task.state == 0)
        task.renderActivities();
};

function createReader(data) {
    $('desktop').find('.app_icon').css('z-index', '1');
    _.each($('desktop').find('.window'), (e) => e.style.zIndex = 30);
    let r = new Reader(data);
    readers.push(r);
    if (task && task.state == 0)
        task.renderActivities();
};

function createPaint(data) {
    if (!isPaintOpen) {
        $('desktop').find('.app_icon').css('z-index', '1');
        _.each($('desktop').find('.window'), (e) => e.style.zIndex = 30);
        let p = new Paint(data);
        p.window.css('z-index', '31');
        paints.push(p);
        if (task && task.state == 0)
            task.renderActivities();
    }
};

function createVideoGame(name, icon) {
    console.log(name,icon);
    if (!isGameOpened) {
        $('desktop').find('.app_icon').css('z-index', '1');
        _.each($('desktop').find('.window'), (e) => e.style.zIndex = 30);
        let v = new Videogame(name, icon);
        v.window.css('z-index', '31');
        videogames.push(v);
        if (task && task.state == 0)
            task.renderActivities();
    }
}