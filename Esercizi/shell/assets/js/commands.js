const commands = {
    echo : {
        com : echo,
        help : "Stampa il valore che gli si passa in input"
    },
    help : {
        com : printAllCommands,
        help : "Stampa la lista dei comandi disponibili."
    },
    cd : {
        com : cd,
        help : "Cambia la directory attiva. Chiede un path relativo/assoluto in input."
    },
    ls : {
        com : ls,
        help : "TO DO"
    },
    tree : {
        com : printTree,
        help : "TO DO"
    },
    mk : {
        com : mkFile,
        help : "TO DO"
    },
    mkDir : {
        com : mkDir,
        help : "TO DO"
    },
    cat : {
        com : cat,
        help : "TO DO"
    },
    nano : {
        com : nano,
        help : "TO DO"
    },
}

//

function echo(node, text) {
    let result = text.toString();
    return {node,result};
}

function printAllCommands(node) {
    var keyNames = Object.keys(commands);
    let result = "I comandi disponibili sono:<br>"
    for(com in commands) {
        result += "- "+com+"<br>";
    }
    return {node,result};
}

function printPath(node) {
    if (node.parent !== undefined)
        return printPath(node.parent) + "/" + node.name;
    else
        return "/" + node.name;
}

function printTree(node,param) {
    let result = printTreeR(node);
    console.log(result);
    return {node,result};
}

function printTreeR(node,indent="") {
    let result = indent + (node.type === "file" ? "#" : "@") + node.name + "<br>";
    //console.log(node.children);

    if(node.children && node.children !== []) {
        indent = indent/*.replace(/-/g," ",3)*/.replace(/>/g,"-",3) + "|-----> ";
        for(child of node.children) {
            //console.log(child);
            result += printTreeR(child,indent);
        }
    }
    return result;
}

function ls(node, param = {}) {
    //console.log(param !== '-a' || param !== '--all');
    let result = "";
    for(child of node.children){
        result += "- " + (child.type == "dir" ? "@" : "#") + child.name + (param === '-a' || param === '--all' ? ", id: " + child.id + ", type: " + child.type + "<br>" : "<br>");
    }
    return {node,result};
}

function getLastNode(node, param) {
    let local = false;
    
    if(param[0] === "/")
        param = param.substr(1);
    else 
        local = true;
    let path_split = param.split("/");
    let actual_pos = node;
    for(let i = 0; i < path_split.length; i++) {
        let int_path = path_split[i];
        //console.log(int_path);
        
        if(int_path === "")
            continue;

        switch(int_path) {
            case "..":
                actual_pos = actual_pos.parent;
                break;
            case ".":
                actual_pos = actual_pos;
                break; 
            default:
                if(i == 0 && !local && int_path !== "root"){
                    return "In un path assoluto il primo nodo è /root!";
                }
                else if(i == 0 && !local){
                    actual_pos = file_manager.root;
                }
                else {
                    actual_pos = _.filter(actual_pos.children, (e) => (e.name === int_path))[0];
                    //console.log(actual_pos);
                }

            if(actual_pos === undefined) {
                return "Path non valido! Errore rilevato valutando " + int_path;
            } 
        }
    }
    return actual_pos;
}

function getName(str) {
    let len = str.length;
    let index = -1, i = len-1;
    while(i >= 0 && index == -1) {
        if(str[i] == '/') {
            index = i;
        }
        i--;
    }
    if(index > -1) {
        return [str.substr(0,index),str.substr(index+1)];
    }
    else {
        return [".",str];
    }
}

function mkDir(node, param) {
    let splitted_param = getName(param);
    let path = splitted_param[0], nam = splitted_param[1];
    console.log(path,nam);
    let parent = getLastNode(node, path);
    let result;

    //console.log(parent);
    if(_.filter(parent.children, (c) => (c.name === nam)).length > 0) {
        result = "Errore! E' presente un file o una directory con lo stesso nome.";
        return {node,result};
    }

    let idname = nam+id_element;

    if(parent && parent !== undefined && parent.type === "dir") {
        file_manager[idname] = {
            name: nam,
            id: id_element++,
            parent: parent,
            type: "dir",
            children: []
        };

        parent.children.push(file_manager[idname]);
        console.log(file_manager[idname]);
        result = "Creato la directory "+nam;
        return {node,result};
    }

    result = "Errore! Azione non consentita!";
    return {node,result};
}

function mkFile(node, param) {
    let splitted_param = getName(param);
    let path = splitted_param[0], nam = splitted_param[1];
    console.log(path,nam);
    let parent = getLastNode(node, path);
    let result;

    console.log(parent);
    if(_.filter(parent.children, (c) => (c.name === nam)).length > 0) {
        result = "Errore! E' presente un file o una directory con lo stesso nome.";
        return {node,result};
    }

    let idname = nam+id_element;

    if(parent && parent !== undefined && parent.type === "dir") {
        file_manager[idname] = {
            name: nam,
            id: id_element++,
            parent: parent,
            type: "file",
            content: "",
            children: []
        };

        parent.children.push(file_manager[idname]);
        console.log(file_manager[idname]);
        result = "Creato il file "+nam;
        return {node,result};
    }

    result = "Errore! Azione non consentita!";
    return {node,result};
}

function cd(node, param) {
    let dir = getLastNode(node, param);
    if(dir.type === "dir") {
        console.log(dir);
        return {node : dir};
    }
    return {node,result : "Errore! " + param + " non è un path valido!"};
}

function cat(node, param) {
    let file = getLastNode(node, param);
    let result;
    if(file.type === "file") {
        result = (file.content !== undefined && file.content !== "" ? file.content : "Il file è vuoto!");
    }
    else {
        result = "Errore! " + param + " non è un file valido!";
    }
    return {node,result};
}

function nano(node, param) {
    let file = getLastNode(node, param);
    if(file.type === "file") {
        console.log(file);
    }
    else {
        /*let splitted_param = getName(param);
        let path = splitted_param[0], nam = splitted_param[1];
        file = mkFile(node, printPath(node)+"/"+nam,nam+id_element);*/
        result = undefined;
    }    
    return {node, result : file};
}