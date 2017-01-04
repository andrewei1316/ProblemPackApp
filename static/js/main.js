// 声明全局变量
let app = null;
let config = null;
let pnotify = null;
let saveTimer = null;

// 首页按钮
let newBtn = null;
let restoreBtn = null;
let proUploadBtn = null;
let proUploadSpan = null;

// 按钮相关
let preBtn = null;
let nextBtn = null;
let saveBtn = null;
let previewBtn = null;
let preStepBtn = null;
let nextStepBtn = null;
let saveStepBtn = null;
let previewStepBtn = null;

// 页面切换
let curPage = null;
let allPage = null;
let stepBtn = null;
let stepDiv = null;

// 页面链接
let aboutBtn = null;
let instrucBtn = null;
let helpPageBtn = null;

// 题目基本信息页面
let title = null;
let level = null;
let timelimit = null;
let memorylimit = null;

// 题目描述页面
let hint = null;
let source = null;
let problemData = null;
let description = null;
let inputsample = null;
let outputsample = null;
let problemeditbar = null;
let inputdescription = null;
let outputdescription = null;

// 测试数据页面
let oTable = null;
let dataUploadBtn = null;
let dataUploadSpan = null;

// 题解页面
let codeArea = null;
let codeEdit = null;
let solution = null;
let compiler = null;

// 完成检查页面
let hintDiv = null;
let repeatBtn = null;
let saveProBtn = null;
let downloadBtn = null;

/**
 * 初始化重置按钮功能
 * @return {[type]} [description]
 */
function initReset(){
    let resetBtn = document.getElementById("reset");
    resetBtn.onclick = function(){
        let errText = '重置会删除正在编辑的所有数据，是否继续？';
        pnotify.showConfirm('注意', errText, 'notice', '继续', '取消',
            function(){
                let ROOT_PATH = require('os').tmpdir();
                let PROBLEM_ROOT_PATH = require('path').join(ROOT_PATH, "problem");
                let fileManager = new FileManager();
                fileManager.deleteDir(PROBLEM_ROOT_PATH);
                chrome.runtime.reload();
            }, function(){
                pnotify.showMessage('您取消了重置操作.', 'notice');
            }
        );
    }
}

/*
 * 初始化数据
 */
function initAll(){

    curPage = 0;
    allPage = 6;

    // 重置按钮
    initReset();

    app = new App();

    // 通知条样式
    pnotify = new Pnotify();
    PNotify.prototype.options.styling = "fontawesome";

    // 首页按钮
    newBtn = document.getElementById("newBtn");
    restoreBtn = document.getElementById("restoreBtn");
    proUploadBtn = document.getElementById("proUploadBtn");
    proUploadSpan = document.getElementById("proUploadSpan");

    // 按钮相关
    preBtn = document.getElementById("preBtn");
    nextBtn = document.getElementById("nextBtn");
    saveBtn = document.getElementById("saveBtn");
    previewBtn = document.getElementById("previewBtn");
    preStepBtn = document.getElementById("preStepBtn");
    nextStepBtn = document.getElementById("nextStepBtn");
    saveStepBtn = document.getElementById("saveStepBtn");
    previewStepBtn = document.getElementById("previewStepBtn");

    // 页面切换相关
    stepBtn = document.getElementsByName("stepBtn");
    stepDiv = document.getElementsByName("stepDiv");

    // 页面链接相关
    aboutBtn = document.getElementById("aboutBtn");
    instrucBtn = document.getElementById("instrucBtn");
    helpPageBtn = document.getElementById("helpPageBtn");

    // 题目基本信息相关
    level = document.getElementById("proLevel");
    title = document.getElementById("title");
    timelimit = document.getElementById("timelimit");
    memorylimit = document.getElementById("memorylimit");

    // 题目描述相关
    hint = document.getElementById("hint_text");
    source = document.getElementById("source_text");
    preViewBtn = document.getElementById("preViewBtn");
    description = document.getElementById("description_text");
    inputsample = document.getElementById("inputsample_text");
    outputsample = document.getElementById("outputsample_text");
    problemeditbar = document.getElementById("problem_edit_bar");
    inputdescription = document.getElementById("inputdescription_text");
    outputdescription = document.getElementById("outputdescription_text");

    // 测试数据相关
    oTable = document.getElementById('testCaseTable');
    dataUploadBtn = document.getElementById('dataUploadBtn');
    dataUploadSpan = document.getElementById('dataUploadSpan');

    // 题解相关
    codeArea = document.getElementById('code');
    solution = document.getElementById("solution");
    compiler = document.getElementById("compiler");
    codeEdit = CodeMirror.fromTextArea(codeArea, {
                indentUnit: 4,
                lineNumbers: true,
                lineWrapping: true,
                scrollbarStyle: null,
                mode: "text/x-c++src",
                styleActiveLine: true,
                cursorScrollMargin: 10
    });
    codeEdit.setSize('auto', '712px');

    // 完成检查相关
    hintDiv = document.getElementById('hintDiv');
    repeatDiv = document.getElementById('repeatDiv');
    repeatBtn = document.getElementById('repeatBtn');
    saveProBtn = document.getElementById('saveProBtn');
    downloadBtn = document.getElementById("downloadBtn");

    addEvent();
    setScrollBar();

    app.setConfigFromRoot(function successFunc(configData){
        let noteText = '发现上次未完成的工作信息，是否恢复？'
        pnotify.showConfirm('提示', noteText, 'success', '恢复', '取消',
            function(){
                config = configData;
                initPage();
                jumpToPage(1);
                pnotify.showMessage("恢复成功!", 'success');
            }, function(){
                config = app.createNewProblem();
                initPage();
                pnotify.showMessage("已取消恢复操作!", "notice");
            }
        );
    }, function errorFunc(){
        config = app.createNewProblem();
        initPage();
    });
}

/**
 * 添加测试用例表格行
 */
function addRow(index, fileName, fileScore){
    let oTbody = oTable.children[1];
    let oTr = oTbody.insertRow();
    let oTd0 = oTr.insertCell(-1);
    oTd0.innerHTML = index;

    let oTd1 = oTr.insertCell(-1);
    oTd1.innerHTML = fileName + '.in';

    let oTd2 = oTr.insertCell(-1);
    oTd2.innerHTML = fileName + '.out';

    let oTd3 = oTr.insertCell(-1);
    oTd3.innerHTML = "<input class='form-control' type='text' value = '"+ fileScore +"'/>";
}

/*
 * 读取测试用例文件名
 */
function makeTable(datascore) {
    if(!$.isEmptyObject(datascore)){
        removeClass(oTable, "hidden");
    }
    let len = oTable.rows.length;
    for(let i = len - 1; i > 0; i--)
        oTable.deleteRow(i);
    let index = 0;
    for(let key in datascore){
        addRow(index, key, datascore[key]);
        index += 1;
    }
}

function initPage(){
    // 题目基本信息相关
    title.value = config.title;
    level.value = config.level;
    timelimit.value = config.timelimit;
    memorylimit.value = config.memorylimit;

    // 题目描述相关
    hint.innerHTML = config.hint;
    source.innerHTML = config.source;
    description.innerHTML = config.description;
    inputdescription.innerHTML = config.inputdescription;
    outputdescription.innerHTML = config.outputdescription;
    inputsample.innerHTML = config.inputsample;
    outputsample.innerHTML = config.outputsample;

    // 题目测试数据相关
    makeTable(config.datascore);

    // 题解相关
    compiler.value = config.compiler;
    solution.value = config.solutiontext;
    codeEdit.setValue(config.solutioncode);

    app.isNeedClear = false;
    if(!saveTimer) clearInterval(saveTimer);
    saveTimer = setInterval(function(){
        savePage(function(){
            // pnotify.showMessage("自动保存成功!", 'success');
        }, function(){});
    }, 30000);
}

function setScrollBar(){
    $("div.dBody").niceScroll({
        cursorwidth: "10px",
        autohidemode: false,
        cursorcolor: "#DCDCDC",
        grabcursorenabled: false,
    });
}

/**
 * 添加事件
 */
function addEvent(){

    // overridePaste();
    newBtn.onclick = function(){
        config = app.createNewProblem();
        initPage();
        jumpToPage(1);
        pnotify.showMessage('创建成功!', 'success');
    }

    proUploadSpan.onclick = function(){
        let warningText = "此操作将会导致您正在编辑的内容丢失，是否继续？";
        pnotify.showConfirm("注意", warningText, "notice", '继续', '取消', function(){
            let proUpload = $("#proUploadBtn");
            proUpload.change(function(evt){
                let filePath = $(this).val();
                if(filePath === '') return;
                console.log('filePath = '+ filePath);
                app.uploadProblem(filePath, function successFunc(configData){
                    config = configData;
                    initPage();
                    jumpToPage(1);
                    pnotify.showMessage('上传成功!', 'success');
                }, function errorFunc(err){
                    warningText = '读取解析压缩包文件时发生错误，具体错误信息为:<br/>' + err;
                    pnotify.showAlert('错误', warningText, 'error');
                });
                $(this).val('');
            });
            proUpload.trigger('click');
        }, function(){
            pnotify.showMessage('您取消了上传操作', 'notice');
        });
    }

    restoreBtn.onclick = function(){
        app.setConfigFromRoot(function(configData){
            config = configData;
            initPage();
            jumpToPage(1);
            pnotify.showMessage('恢复成功!', 'success');
        }, function(err){
            let errText = '恢复过程出现问题，备份文件不存在或已经损坏，具体错误如下:<br/>' + err;
            pnotify.showAlert('错误', errText, 'error');
        });
    }

    preBtn.onclick = function(){
        if(curPage == 0) return;
        jumpToPage(curPage - 1);
    }

    nextBtn.onclick = function(){
        if(curPage == allPage - 1) return;
        jumpToPage(curPage + 1);
    }

    saveBtn.onclick = function(){
        savePage(function successFunc(){
            pnotify.showMessage('保存成功!', 'success');
        }, function errorFunc(err){
            let errText = '保存过程出现问题，具体错误信息如下: <br/>' + err;
            pnotify.showAlert('错误', errText, 'error');
        });
    }

    stepBtn.forEach(function(step, index){
        step.onclick = function(){
            jumpToPage(index);
        }
    });

    $('#dataUploadBtn').change(function(evt){
        let dataFilesPath = $(this).val();
        if(dataFilesPath === '') return;
        app.saveTestData(dataFilesPath,
            function successFunc(configData, err){
                config = configData;
                makeTable(config.datascore);
                if(!$.isEmptyObject(err)){
                    let errText = '有一些错误需要注意:<br/>';
                    err.forEach(function(data, index){
                        errText += (data.name +": "+ data.text + '<br/>');
                    });
                    pnotify.showAlert('注意', errText, 'notice');
                }
            }
        );
        $(this).val('');
    });

    compiler.onchange = function(){
        if(compiler.value == 'java'){
            codeEdit.setOption("mode", "text/x-java");
        }else{
            codeEdit.setOption("mode", "text/x-c++src");
        }
    }

    downloadBtn.onclick = function(){
        checkAll(function successFunc(){
            let save = $("#saveProBtn");
            save.change(function(evt){
                let filePath = $(this).val();
                if(filePath === '') return;
                console.log('filePath = ' + filePath);
                app.downloadProblem(filePath,
                    function(){
                        app.isNeedClear = true;
                        if(saveTimer){
                            clearInterval(saveTimer);
                            saveTimer = null;
                        }
                        pnotify.showMessage('下载成功!', 'success');
                        removeClass(hintDiv, 'hidden');
                        removeClass(repeatDiv, 'hidden');
                    }, function(err){
                        let errText = '保存过程出现了问题，具体错误信息如下:<br/>' + err;
                        errText += ('<br/> 如果重新下载依然如此，请重置程序后再试');
                        pnotify.showAlert('错误', errText, 'error');
                });
                $(this).val('');
            });
            save.trigger("click");
        }, function errorFunc(err){
            let errText = '校验和保存过程中出现了一些错误，具体信息如下，请修改后重试：<br/>' + err;
            pnotify.showAlert('错误', errText, 'error');
        });
    }

    repeatBtn.onclick = function(){
        config = app.createNewProblem();
        initPage();
        jumpToPage(1);
        addClass(hintDiv, 'hidden');
        addClass(repeatDiv, 'hidden');
        pnotify.showMessage('创建成功!', 'success');
    }

    previewBtn.onclick = function(){
        problemData = new Object();
        problemData.hint = hint.innerHTML;
        problemData.source = source.innerHTML;
        problemData.description = description.innerHTML;
        problemData.inputsample = inputsample.innerHTML;
        problemData.outputsample = outputsample.innerHTML;
        problemData.inputdescription = inputdescription.innerHTML;
        problemData.outputdescription = outputdescription.innerHTML;
        require('nw.gui').Window.open(
            'preview.html',
            {
                width: 1240,
                height: 680,
                position: 'center'
            },
            function(win){
                win.on('loaded', function(){
                    initPreviewPage(win, problemData);
                });
            }
        );
    }

    instrucBtn.onclick = function(){
        let win = require('nw.gui').Window.open('instructions.html', {
            width: 580,
            height: 300,
            resizable: false,
            position: 'center'
        });
    }

    aboutBtn.onclick = function(){
        let win = require('nw.gui').Window.open('about.html', {
            width: 580,
            height: 300,
            resizable: false,
            position: 'center'
        });
    }

    helpPageBtn.onclick = function(){
        let win = require('nw.gui').Window.open('help.html', {
            width: 1240,
            height: 680,
            position: 'center'
        });
    }

    nw.Window.get().on('close', function() {
        let self = this;
        savePage(function(){
            app.readyToClose(function saveDataFunc(){
                let warningText = '您有尚未保存的更改，是否保存以便下次启动时恢复？';
                console.info(warningText);
                pnotify.showConfirm('注意', warningText, 'notice', '保存', '不保存', function(){
                    self.close(true);
                }, function(){
                    app.clearAllData();
                    self.close(true);
                });
            }, function deleteDataFunc(){
                app.clearAllData();
                self.close(true);
            });
        }, function(){
            app.clearAllData();
            self.close(true);
        });
    });

    $('[data-toggle="tooltip"]').tooltip();
}

function checkAll(successFunc, errorFunc){
    err_message = []
    if(!title.value){
        addClass(title.parentNode, "has-error");
        err_message.push("标题不能为空");
    }else{
        removeClass(title.parentNode, "has-error");
    }
    if(isNaN(timelimit.value) || timelimit.value < 1000 || timelimit.value > 50000){
        addClass(timelimit.parentNode, "has-error");
        err_message.push("时间限制范围应为[1000, 50000]");
    }else{
        removeClass(timelimit.parentNode, "has-error");
    }
    if(isNaN(memorylimit.value) || memorylimit.value < 65536 || memorylimit.value > 262144){
        addClass(memorylimit.parentNode, "has-error");
        err_message.push("内存限制范围为[65536, 262144]");
    }else{
        removeClass(memorylimit.parentNode, "has-error");
    }
    if(isNaN(level.value) || level.value < 1 || level.value > 5){
        addClass(level.parentNode, "has-error");
        err_message.push("题目难度请从选项框中选择");
    }else{
        removeClass(level.parentNode, "has-error");
    }

    function isNum(s){
        if (s !== null && s !== ""){
            return !isNaN(s);
        }
        return false;
    }

    let allScore = 0;
    let len = config.datacount;
    for(let i = 0; i < len; i++){
        let fileScore = oTable.rows[i + 1].cells[3].firstChild.value;
        if(!isNum(fileScore)){
            err_message.push("编号为"+ (i + 1) +"的测试用例分值不是一个整数");
            addClass(oTable.rows[i + 1].cells[3], 'has-error');
        }else{
            removeClass(oTable.rows[i + 1].cells[3], 'has-error');
            allScore += Number(fileScore);
        }
    }
    if(allScore !== 100){
        err_message.push('测试数据总分不是 100 分');
    }

    if($.isEmptyObject(err_message)){
        savePage(successFunc, errorFunc);
    }else{
        errorFunc(err_message.join('<br/>'));
    }
}

function savePage(successFunc, errorFunc){
    config.title = title.value;
    config.level = Number(level.value);
    config.timelimit = Number(timelimit.value);
    config.memorylimit = Number(memorylimit.value);

    config.hint = hint.innerHTML;
    config.source = source.innerHTML;
    config.description = description.innerHTML;
    config.inputsample = inputsample.innerHTML;
    config.outputsample = outputsample.innerHTML;
    config.inputdescription = inputdescription.innerHTML;
    config.outputdescription = outputdescription.innerHTML;

    try{
        let len = config.datacount;
        for(let i = 0; i < len; i++){
            let fileName = oTable.rows[i + 1].cells[1].innerHTML.split('.')[0];
            let fileScore = Number(oTable.rows[i + 1].cells[3].firstChild.value);
            config.datascore[fileName] = fileScore;
        }
    }catch(err){
        errorFunc(err);
    }

    config.compiler = compiler.value;
    config.solutioncode = codeEdit.getValue();
    config.solutiontext = solution.value;
    app.saveConfig(config, successFunc, errorFunc);
}

function initPreviewPage(win, _config){
    let document = win.window.document;
    let hint = document.getElementById("hint_text");
    let message = document.getElementById("message");
    let source = document.getElementById("source_text");
    let description = document.getElementById("description_text");
    let inputsample = document.getElementById("inputsample_text");
    let outputsample = document.getElementById("outputsample_text");
    let inputdescription = document.getElementById("inputdescription_text");
    let outputdescription = document.getElementById("outputdescription_text");

    if(_config.hint) hint.innerHTML = _config.hint;
    else addClass(hint.parentNode, "hidden");
    if(_config.source) source.innerHTML = _config.source;
    else addClass(source.parentNode, "hidden");
    if(_config.description) description.innerHTML = _config.description;
    else addClass(description.parentNode, "hidden");
    if(_config.inputdescription) inputdescription.innerHTML = _config.inputdescription;
    else addClass(inputdescription.parentNode, "hidden");
    if(_config.outputdescription) outputdescription.innerHTML = _config.outputdescription;
    else addClass(outputdescription.parentNode, "hidden");
    if(_config.inputsample) inputsample.innerHTML = _config.inputsample;
    else addClass(inputsample.parentNode, "hidden");
    if(_config.outputsample) outputsample.innerHTML = _config.outputsample;
    else addClass(outputsample.parentNode, "hidden");
}

/*
 * 切换页面时控制按钮的隐藏和显示
 */
function btnShowAndHidden(curPage){
    // console.log('cur = '+ curPage);
    if(curPage == 0){
        addClass(preStepBtn, "hidden");
    }else{
        removeClass(preStepBtn, "hidden");
    }
    if(curPage == allPage - 1){
        addClass(nextStepBtn, "hidden");
        // addClass(saveStepBtn, "hidden");
    }else{
        removeClass(nextStepBtn, "hidden");
    }
    if(curPage == 2){
        removeClass(previewStepBtn, "hidden");
        removeClass(problemeditbar, "hidden");
    }else{
        addClass(previewStepBtn, "hidden");
        addClass(problemeditbar, "hidden");
    }
    if(curPage == 0 || curPage == allPage - 1){
        addClass(saveStepBtn, "hidden");
    }else{
        removeClass(saveStepBtn, "hidden");
    }
    if(curPage == allPage - 1 && config.title != ""){
        saveProBtn.nwsaveas = config.title +".zip";
    }
    if(curPage == 4){
        codeEdit.refresh();
    }
}

/*
 * 页面跳转时隐藏和显示 div 和 step
 */
function jumpToPage(tarPage){
    addClass(stepDiv[curPage], "hidden");
    removeClass(stepBtn[curPage], "active");
    removeClass(stepDiv[tarPage], "hidden");
    addClass(stepBtn[tarPage], "active");
    btnShowAndHidden(tarPage);
    curPage = tarPage;
}

/**
 * js实现的对元素进行添加删除class样式
 * @param  { object }  obj [要进行操作的元素对象]
 * @param  { string }  cls [class 名称]
 * @return {Boolean}     [description]
 */
function hasClass(obj, cls) {
    return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
}

function addClass(obj, cls) {
    if (!this.hasClass(obj, cls)) obj.className += " " + cls;
}

function removeClass(obj, cls) {
    if (hasClass(obj, cls)) {
        let reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
        obj.className = obj.className.replace(reg, ' ');
    }
}

// function overridePaste(){
//     let $plainText = $("div.desc_text");
//     $plainText.each(function(){
//         $(this).on('paste', function(e){
//             let self = this;
//             let prev_len = $(self).html().length;
//             window.setTimeout(function () {
//                 let now_len = $(self).html().length;
//                 let paste_values = $(self).html().slice(prev_len);
//                 let old_values = $(self).html().slice(0, prev_len);
//                 let new_values = paste_values.replace(/<[^>]*>|/g,"");
//                 $(self).html(old_values + new_values);
//             }, 0);
//         });
//     });
// }
