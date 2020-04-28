const commands = {
    echo : (text) => {
        return text.toString();
    },
    help : () => {
        return "Lista dei comandi disponibili:<br>\
                - echo [text]<br>";
    }
}