// let PNotify = require("../tools/pnotify.custom.min");

class Pnotify{
    constructor(){}

    createPnotify(opt){
        PNotify.prototype.options.styling = "fontawesome";
        new PNotify(opt);
    }

    showConfirm(title, text, type, confirm, cancel, confirmFunc, cancelFunc){
        let opt = {
            title: title,
            text: text,
            hide: false,
            width: "500px",
            type: type,
            delay: 0,
            animate_speed: "fast",
            icon: 'glyphicon glyphicon-info-sign',
            confirm: {
                confirm: true,
                buttons: [{
                    text: cancel,
                    addclass: 'btn-default',
                    click: function(notice){
                        notice.remove();
                        cancelFunc();
                    }
                },{
                    text: confirm,
                    addclass: 'btn-default',
                    click: function(notice) {
                        notice.remove();
                        confirmFunc();
                    }
                }]
            },
            buttons: {
                closer: false,
                sticker: false
            },
            addclass: "confirm"
        };
        this.createPnotify(opt);
    }

    showAlert(title, text, type){
        let opt = {
            title: title,
            text: text,
            hide: false,
            width: "500px",
            type: type,
            delay: 0,
            animate_speed: "fast",
            icon: 'glyphicon glyphicon-info-sign',
            confirm: {
                confirm: true,
                buttons: [{
                    text: '确定',
                    addclass: 'btn-default',
                    click: function(notice) {
                        notice.remove();
                    }
                }, null]
            },
            buttons: {
                closer: false,
                sticker: false
            },
            addclass: "confirm"
        };
        this.createPnotify(opt);
    }

    showMessage(text, type){
        this.createPnotify({text: text, type: type, delay: 5000});
    }
}
// module.exports = Pnotify;