var id_element = 0;

const file_manager = {
    root : {
        name : "root",
        id : id_element++,
        parent : undefined,
        type : "dir",
        //children : function(){return [this.usr,this.etc,this.home]}
    },
    usr : {
        name : "usr",
        id : id_element++,
        //parent : function(){return this.root},
        type : "dir",
        //children : function(){return []}
    },
    etc : {
        name : "etc",
        id : id_element++,
        //parent : function(){return this.root},
        type : "dir",
        //children : function(){return []}
    },
    home : {
        name : "home",
        id : id_element++,
        //parent : function(){return this.root},
        type : "dir",
        //children : function(){return [this.username]}
    },
    username : {
        name : "username",
        id : id_element++,
        //parent : function(){return this.home},
        type : "dir",
        //children : function(){return []}
    },
}

file_manager.root.children = [file_manager.etc,file_manager.usr,file_manager.home];

file_manager.usr.parent = file_manager.root;
file_manager.usr.children = [];

file_manager.etc.parent = file_manager.root;
file_manager.etc.children = [];

file_manager.home.parent = file_manager.root;
file_manager.home.children = [file_manager.username];

file_manager.username.parent = file_manager.home;
file_manager.username.children = [];

//

function printPath(node) {
    if(node.parent !== undefined)
        return printPath(node.parent) + "/" + node.name;
    else
        return "/" + node.name;
}

function mkDir(path, nam) {
    let parent = path.split("/")[path.split("/").length-1];
    file_manager['name'] = {
        name : nam,
        id : id_element++,
        parent : file_manager[parent],
        type : "dir",
        children : []
    }
}

function mkFile(path, nam) {
    let parent = path.split("/")[path.split("/").length-1];
    file_manager['name'] = {
        name : nam,
        id : id_element++,
        parent : file_manager[parent],
        type : "file",
        children : []
    }
}

function printTree(indent, node) {
    if(node !== undefined) {
        console.log(node.name);
        return indent + node.name + "\n" + _.forEach(node.children, (e) => { printTree(indent+"  ", e) });
    }
}