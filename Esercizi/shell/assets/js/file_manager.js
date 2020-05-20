var id_element = 0;

const file_manager = {
    root: {
        name: "root",
        id: id_element++,
        parent: undefined,
        type: "dir",
    },
    usr: {
        name: "usr",
        id: id_element++,
        type: "dir",
    },
    etc: {
        name: "etc",
        id: id_element++,
        type: "dir",
    },
    home: {
        name: "home",
        id: id_element++,
        type: "dir",
    },
    username: {
        name: "username",
        id: id_element++,
        type: "dir",
    },
    scrivania: {
        name: "scrivania",
        id: id_element++,
        type: "dir",
    },
    file6: {
        name: "file",
        id: id_element++,
        type: "file",
        content: "Hello World",
    },
    upload: {
        name: "upload",
        id: id_element++,
        type: "upload",
        childrenUrl : [],
    }
}

file_manager.root.children = [file_manager.etc, file_manager.home, file_manager.usr, file_manager.upload];

file_manager.usr.parent = file_manager.root;
file_manager.usr.children = [];

file_manager.etc.parent = file_manager.root;
file_manager.etc.children = [];

file_manager.home.parent = file_manager.root;
file_manager.home.children = [file_manager.username];

file_manager.username.parent = file_manager.home;
file_manager.username.children = [file_manager.scrivania];

file_manager.scrivania.parent = file_manager.username;
file_manager.scrivania.children = [file_manager.file6];

file_manager.file6.parent = file_manager.scrivania;

file_manager.upload.parent = file_manager.root;