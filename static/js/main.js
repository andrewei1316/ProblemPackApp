// 定义全局变量
var ROOT_PATH = null;
var PROBLEM_ROOT_PATH = null;
var PROBLEM_CONFIG_FILENAME = null;
var PROBLEM_CONFIG_ROOT_PATH = null;
var PROBLEM_DATA_ROOT_PATH = null;
var PROBLEM_CONFIG_PATH = null;
var INIT_CONFIG_DATA = {
	"title": "",
	"timelimit": 1000,
	"memorylimit": 65536,
	"level":3,
	"description":"",
	"inputdescription":"",
	"outputdescription":"",
	"inputsample":"",
	"outputsample":"",
	"datacount":0,
	"datascore":{},
	"hint":"",
	"source":"",
	"compiler":"cpp",
	"solutioncode":"",
	"solutiontext":""
}

// 全局配置文件
// var timer = null;
var config = null;

// 按钮相关
var preBtn = null;
var nextBtn = null;
var saveBtn = null;
var stepBtn = null;
var stepDiv = null;
var curPage = null;
var allPage = null;
var uploadBtn = null;
var previewBtn = null;
var preStepBtn = null;
var nextStepBtn = null;
var saveStepBtn = null;
var uploadProBtn = null;
var previewStepBtn = null;

// 题目基本信息相关
var title = null;
var level = null;
var timelimit = null;
var memorylimit = null;

// 题目描述相关
var hint = null;
var source = null;
var problemData = null;
var description = null;
var inputsample = null;
var outputsample = null;
var inputdescription = null;
var outputdescription = null;

// 测试数据相关
var oTable = null;
var chooser = null;
var infileName = [];
var outfileName = [];
var datafilesPath = null;

// 题解相关
var codeArea = null;
var codeEdit = null;
var solution = null;
var compiler = null;

// 完成检查相关
var hintDiv = null;
var repeatBtn = null;
var saveProBtn = null;
var downloadBtn = null;

/**
 * 全部初始化
 * @return {[type]} [description]
 */
function initReset(){
    var resetBtn = document.getElementById("reset");
    resetBtn.onclick = function(){
        if(confirm('重置会删除正在编辑的所有数据，是否继续?')){
            deleteAllFiles(PROBLEM_ROOT_PATH);
            document.location.reload();
        }
    }
}

/**
 * 添加测试用例表格行
 */
function addRow(){
    // 文件个数校验
    if(infileName.length != outfileName.length){
        alert("输入文件个数与输出文件个数不一致！");
        return;
    }
    if(infileName.length == 0) return;

    // 按名称排一下序 
    infileName.sort();
    outfileName.sort();

    // 将原来的table元素删掉
    removeClass(oTable, "hidden");
    var len = oTable.rows.length;
    for(var i = len - 1; i > 0; i--)
        oTable.deleteRow(i);

    // 重新生成table
    len = infileName.length;
    var aveInt = Math.floor(100 / len);
    for(var i = 0; i < len; i++){
        var oTr = oTable.insertRow();
        var oTd0 = oTr.insertCell(-1);
        oTd0.innerHTML = i;

        var oTd1 = oTr.insertCell(-1);
        oTd1.innerHTML = infileName[i];

        var oTd2 = oTr.insertCell(-1);
        oTd2.innerHTML = outfileName[i];

        if(infileName[i].split('.')[0] != outfileName[i].split('.')[0]){
            alert("输入输出文件的文件名称不一致, 请检查!");
            oTr.className = "danger";
        }
        if(i == len - 1) aveInt = (100 - aveInt * (len - 1));
        if(datafilesPath == PROBLEM_DATA_ROOT_PATH)
            aveInt = config.datascore[infileName[i].split('.')[0]];
        var oTd3 = oTr.insertCell(-1);
        oTd3.innerHTML = "<input class='form-control' type='text' value = '"+ aveInt +"'/>";
    }
}

/*
 * 读取测试用例文件名
 */
function appendText(text) {
    var name = text.split('.');
    if(name.length == 2){
        if(name[1] == 'in') infileName[infileName.length] = text;
        else if(name[1] == 'out') outfileName[outfileName.length] = text;
        else alert(text + "文件命名格式错误！");
    }else alert(text + "文件命名格式错误！");
}

function initData(){
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
    infileName.length = 0;
    outfileName.length = 0;
    datafilesPath = PROBLEM_DATA_ROOT_PATH;
    getDataFiles(appendText, addRow, function(err){
        alert(err);
    });

    // 题解相关
    compiler.value = config.compiler;
    solution.value = config.solutiontext;
    codeEdit.setValue(config.solutioncode);
}

/*
 * 初始化数据
 */
function initAll(){

    curPage = 0;
    allPage = 6;

    // 按钮相关
    preBtn = document.getElementById("preBtn");
    nextBtn = document.getElementById("nextBtn");
    saveBtn = document.getElementById("saveBtn");
    stepBtn = document.getElementsByName("stepBtn");
    stepDiv = document.getElementsByName("stepDiv");
    uploadBtn = document.getElementById("uploadBtn");
    previewBtn = document.getElementById("previewBtn");
    preStepBtn = document.getElementById("preStepBtn");
    nextStepBtn = document.getElementById("nextStepBtn");
    saveStepBtn = document.getElementById("saveStepBtn");
    uploadProBtn = document.getElementById("uploadProBtn");
    previewStepBtn = document.getElementById("previewStepBtn");

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
    inputdescription = document.getElementById("inputdescription_text");
    outputdescription = document.getElementById("outputdescription_text");

    // 测试数据相关
    chooser = document.querySelector('#fileupload');
    oTable = document.getElementById('testCaseTable');

    // 题解相关
    codeArea = document.getElementById('code');
    solution = document.getElementById("solution");
    compiler = document.getElementById("compiler");
    codeEdit = CodeMirror.fromTextArea(codeArea, {
                indentUnit:4,
                lineNumbers:true,
                lineWrapping:true,
                scrollbarStyle:null,
                mode:"text/x-c++src",
                styleActiveLine:true,
                cursorScrollMargin:10
    });
    codeEdit.setSize('auto', '512px');

    // 完成检查相关
    hintDiv = document.getElementById('hintDiv');
    repeatDiv = document.getElementById('repeatDiv');
    repeatBtn = document.getElementById('repeatBtn');
    saveProBtn = document.getElementById('saveProBtn');
    downloadBtn = document.getElementById("downloadBtn");

    getRootPath();

    getConfig(function success(data){
    	config = data;
    	initData();
        addEvent();
    }, function error(err){
    	alert(err);
    });
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
        addClass(saveStepBtn, "hidden");
    }else{
        removeClass(nextStepBtn, "hidden");
    }
    if(curPage == 2){
        removeClass(previewStepBtn, "hidden");
    }else{
        addClass(previewStepBtn, "hidden");
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
 * 添加事件
 */
function addEvent(){

    preBtn.onclick = function(){
        if(curPage == 0) return;
        jumpToPage(curPage - 1);
    }

    nextBtn.onclick = function(){
        if(curPage == allPage - 1) return;
        jumpToPage(curPage + 1);
    }

    saveBtn.onclick = function(){
    	saveCurPage(curPage, false);
    }

    for(var i = 0; i < stepBtn.length; i++){
        stepBtn[i].index = i;
        stepBtn[i].onclick = function(){
            jumpToPage(this.index);
        }
    }

    uploadBtn.onclick = function(){
        if(confirm("此操作将会导致您正在编辑的内容丢失，是否继续？")){
            var upload = $("#uploadProBtn");
            upload.change(function(evt){
                var filePath = $(this).val();
                uploadProblem(filePath, function success(){
                    getConfig(function success(data){
                        config = data;
                        initData();
                        addEvent();
                        jumpToPage(1);
                    }, function error(err){
                        alert(err);
                    });
                }, function error(data){
                    alert(data);
                });
                $(this).val('');
            });
            upload.trigger('click');
        }
    }

    timer = setInterval(function(){
    	// saveCurPage(curPage, true);
    }, 30000);

    previewBtn.onclick = function(){
        problemData = new Object(); 
        problemData.hint = hint.innerHTML;
        problemData.source = source.innerHTML;
        problemData.description = description.innerHTML;
        problemData.inputsample = inputsample.innerHTML;
        problemData.outputsample = outputsample.innerHTML;
        problemData.inputdescription = inputdescription.innerHTML;
        problemData.outputdescription = outputdescription.innerHTML;
        window.open ('preview.html','预览','height=700,width=1240,top=0,left=0,toolbar=no,menubar=no,scrollbars=no, resizable=no,location=no, status=no');
    }

    chooser.addEventListener("change", function(evt){
        var files = this.files;
        var filesPath = files[0].path;
        infileName.length = 0;
        outfileName.length = 0;
        datafilesPath = filesPath;
        getFiles(filesPath, appendText, addRow);
    }, false);

    compiler.onchange = function(){
        if(compiler.value == 'java'){
            codeEdit.setOption("mode", "text/x-java");
        }else{
            codeEdit.setOption("mode", "text/x-c++src");
        }
    }

    downloadBtn.onclick = function(){
        if(checkChange()){
            var save = $("#saveProBtn");
            save.change(function(evt){
                var filesPath = $(this).val();
                downloadproblem(filesPath, function success(){
                    showBanner("保存成功", "", "alert-success");
                    removeClass(hintDiv, 'hidden');
                    removeClass(repeatDiv, 'hidden');
                }, function error(err){
                    err_message = "校验失败, 请仔细检查一下项目:<br/>" + err;
                    showBanner("错误", err_message, "alert-danger");
                });
                $(this).val('');
            });
            save.trigger("click");
        }
    }

    repeatBtn.onclick = function(){
        deleteAllFiles(PROBLEM_ROOT_PATH);
        window.location.reload();
    }
}

/**
 * 保存当前页面信息
 * @param  {int}
 * @param  {Boolean}
 * @return {void}
 */
function saveCurPage(curPage, isAuto){
	if(curPage == 1){
		savePage1(isAuto);
	}else if(curPage == 2){
		savePage2(isAuto);
	}else if(curPage == 3){
		savePage3(isAuto);
	}else if(curPage == 4){
		savePage4(isAuto);
	}
}

/**
 * 以下几个函数均为校验和保存某页的信息
 * @param  {Boolean}
 * @return {void}
 */
function savePage1(isAuto){
    function checkAvail(){
        var err_message = "";
        if(!title.value){
            removeClass(title.parentNode, "has-success");
            addClass(title.parentNode, "has-error");
            err_message += "标题不能为空<br/>";
        }else{
            removeClass(title.parentNode, "has-error");
            addClass(title.parentNode, "has-success");
        }
        if(isNaN(timelimit.value) || timelimit.value < 1000 || timelimit.value > 50000){
            removeClass(timelimit.parentNode, "has-success");
            addClass(timelimit.parentNode, "has-error");
            err_message += "时间限制范围应为[1000, 50000]<br/>";
        }else{
            removeClass(timelimit.parentNode, "has-error");
            addClass(timelimit.parentNode, "has-success");
        }
        if(isNaN(memorylimit.value) || memorylimit.value < 65536 || memorylimit.value > 262144){
            removeClass(memorylimit.parentNode, "has-success");
            addClass(memorylimit.parentNode, "has-error");
            err_message += "内存限制范围为[65536, 262144]<br/>";
        }else{
            removeClass(memorylimit.parentNode, "has-error");
            addClass(memorylimit.parentNode, "has-success");
        }
        if(isNaN(level.value) || level.value < 1 || level.value > 5){
            removeClass(level.parentNode, "has-success");
            addClass(level.parentNode, "has-error");
            err_message += "题目难度请从选项框中选择<br/>";
        }else{
            removeClass(level.parentNode, "has-error");
            addClass(level.parentNode, "has-success");
        }
        if(err_message){
            showBanner("错误", err_message, "alert-danger");
            return false;
        }else{
            return true;
        }
    }

    if(checkAvail()){
        config.title = title.value;
        config.timelimit = timelimit.value;
        config.memorylimit = memorylimit.value;
        config.level = level.value;
        saveConfig(config, function(){
            showBanner("保存成功", "", "alert-success");
        }, function(err){
            showBanner("错误", "保存失败, 请重试!", "alert-danger");
        });
    }
}

function savePage2(isAuto){
    config.hint = hint.innerHTML;
    config.source = source.innerHTML;
    config.description = description.innerHTML;
    config.inputsample = inputsample.innerHTML;
    config.outputsample = outputsample.innerHTML;
    config.inputdescription = inputdescription.innerHTML;
    config.outputdescription = outputdescription.innerHTML;

    saveConfig(config, function(){
        showBanner("保存成功", "", "alert-success");
    }, function(err){
        showBanner("错误", err_message, "alert-danger");
    });
}

function savePage3(isAuto){
	function checkAvail(){
        var sum = 0;
        var err_message = "";
        for(var i = 0; i < infileName.length; i++){
            var oTr = oTable.rows[i+1];
            var flag = true;
            if(oTr.cells[1].innerHTML.split('.')[0] != oTr.cells[2].innerHTML.split('.')[0]){
                flag = false;
                err_message += "表格第"+ (i+1) +"行的输入输出文件名称不一致，请检查<br/>";
            }
            if(isNaN(oTable.rows[i+1].cells[3].firstChild.value)){
                flag = false;
                err_message += "表格第"+ (i+1) +"行的测试用例分值不是一个整数，请检查<br/>";
            }else sum += Number(oTable.rows[i+1].cells[3].firstChild.value);

            if(!flag){
                removeClass(oTr, "success");
                addClass(oTr, "danger");
            }else{
                removeClass(oTr, "danger");
                addClass(oTr, "success");
            }
        }
        if(sum != 100){
            err_message += "所有测试用例的总分不为100, 请重新设定";
        }
        if(err_message){
            showBanner("错误", err_message, "alert-danger");
            return false;
        }else{
            return true;
        }
    }

	if(checkAvail()){
        err_message = "";
        var len = infileName.length;
        config.datacount = len;
        config.datascore = {};
        for(var i = 0; i < len; i++){
            config.datascore[infileName[i].split('.')[0]] = Number(oTable.rows[i+1].cells[3].firstChild.value);
        }
        var cnt = 0;
        saveDataFiles(config, datafilesPath, function success(){
            cnt = cnt + 1;
        }, function error(err){
            cnt = cnt + 1;
            removeClass(oTable.rows[cnt], "success");
            addClass(oTable.rows[cnt], "danger");
            err_message += "第" + cnt +"个测试用例保存失败!<br/>";
            showBanner("错误", err_message, "alert-danger");
        });
        if(!err_message){
            showBanner("保存成功", "", "alert-success");
            datafilesPath = PROBLEM_DATA_ROOT_PATH;
        }
    }
}

function savePage4(isAuto){
    config.compiler = compiler.value;
    config.solutioncode = codeEdit.getValue();
    config.solutiontext = solution.value;

    saveConfig(config, function(){
        showBanner("保存成功", "", "alert-success");
    }, function(err){
        showBanner("错误", "保存失败, 请重试!", "alert-danger");
    });
}

function checkChange(){
    var flag = true;
	err_message = "";
    if(title.value != config.title) flag = false;
    if(level.value != config.level) flag = false;
    if(timelimit.value != config.timelimit) flag = false;
    if(memorylimit.value != config.memorylimit) flag = false;
    if(!flag) err_message += "题目基本信息, ";

    flag = true;
    if(hint.innerHTML != config.hint) flag = false;
    if(source.innerHTML != config.source) flag = false;
    if(description.innerHTML != config.description) flag = false;
    if(inputsample.innerHTML != config.inputsample) flag = false;
    if(outputsample.innerHTML != config.outputsample) flag = false;
    if(inputdescription.innerHTML != config.inputdescription) flag = false;
    if(outputdescription.innerHTML != config.outputdescription) flag = false;
    if(!flag) err_message += "编辑题目描述, ";

    flag = true;
    if(config.datacount != infileName.length) flag = false;
    else{
        for(var i = 0; i < config.datacount; i++){
            if(config.datascore[infileName[i].split('.')[0]] != oTable.rows[i+1].cells[3].firstChild.value) flag = false;
        }
    }
    if(datafilesPath != null && datafilesPath != PROBLEM_DATA_ROOT_PATH) flag = false;
    if(!flag) err_message += "添加测试用例, ";

    flag = true;
    if(compiler.value != config.compiler) flag = false;
    if(codeEdit.getValue() != "" && codeEdit.getValue() != config.solutioncode) flag = false;
    if(solution.value != "" && solution.value != config.solutiontext) flag = false;
    if(!flag) err_message += "添加题解, "

    if(err_message != ""){
    	return confirm("以下信息在更改后未保存, 确定忽略更改吗?\n\n" + err_message);
    }else return true;
}

/**
 * 得到程序的根目录
 * @return { string } [程序的根目录]
 */
function getRootPath(){
	var os = require("os");
    var path = require("path");
    ROOT_PATH = os.tmpdir();
    PROBLEM_ROOT_PATH = path.join(ROOT_PATH, "problem");
    PROBLEM_CONFIG_FILENAME = "config.json";
    PROBLEM_CONFIG_ROOT_PATH = PROBLEM_ROOT_PATH;
    PROBLEM_DATA_ROOT_PATH = path.join(PROBLEM_ROOT_PATH, "data");
    PROBLEM_CONFIG_PATH = path.join(PROBLEM_CONFIG_ROOT_PATH, PROBLEM_CONFIG_FILENAME);
}

/**
 * 弹出提示框
 * @param  { string } tipTitle   [ 弹出框的标题 ]
 * @param  { string } tipContent [ 弹出框的内容 ]
 * @param  { string } tipClass   [ 弹出框的样式 ]
 * @return {[type]}            [description]
 */
function showBanner(tipTitle, tipContent, tipClass){
	var time = 2000;
	if(tipClass == 'alert-danger') time = 4000;
	$("body").showbanner({
		title : tipTitle,
		content : tipContent,
		addclass : tipClass,
		show_duration : 200,
		duration : time,
		hide_duration : 500,
		handle: false,
		html: true
	});
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
        var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');  
        obj.className = obj.className.replace(reg, ' ');  
    }  
}

function readFile(fs, fileFullPath, successFunc, errorFunc){
	fs.readFile(fileFullPath,'utf-8', function(readErr, data){  
	    if(readErr){  
	    	errorFunc(readErr);
	    }else{  
	    	successFunc(data);
	    }
    });
}

/**
  * 函数功能描述: 获取一个文件, 并分别处理当文件目录不存在, 文件不存在和读取错误
  *
  * @param { string } [filePath] [要获取的文件的目录]
  * @param { string } [fileFullPath] [要获取的文件的完整目录]
  * @param { function } [successFunc] [获取成功时调用的函数]
  * @param { function } [pathErrFunc] [当要获取的文件目录不存在时调用的函数]
  * @param { function } [fileErrFunc] [当要获取的文件不存在时调用的函数]
  * @param { function } [readErrFunc] [当读取文件失败时调用的函数]
**/
function getFile(filePath, fileFullPath, successFunc, pathErrFunc, fileErrFunc, readErrFunc){
	var fs = require("fs");
	fs.stat(filePath, function(pathErr, stat){
		if(pathErr == null && stat && stat.isDirectory()){
			fs.stat(fileFullPath, function(fileErr, stat){
				if(fileErr == null && stat && stat.isFile()){
					readFile(fs, fileFullPath, function success(data){
						successFunc(data);
					}, function error(readErr){
						readErrFunc(readErr);
					});
				}else{
					fileErrFunc(fileErr);
				}
			});
		}else{
			pathErrFunc(pathErr);
		}
	});
}

/**
  * 函数功能描述: 获取某个文件夹下所有的文件, 每得到一个文件调用一下successFunc函数，
  * 当所有文件都获取时, 调用finish
  *
  * @param { string } [filePath] [要获取的文件目录]
  * @param { function } [successFunc] [每获取到一个文件调用一下这个函数]
  * @param { function } [finish] [将所有文件都获取到后调用的函数]
**/
function getFiles(filePath, successFunc, finish){
	var fs = require("fs");
	var files = fs.readdirSync(filePath);
	var len = files.length;
	for(var i = 0; i < files.length; i++){
		successFunc(files[i]);
	}
	finish();
}

/**
 * 获取题目的数据文件
 * @param  { function } successFunc [获取文件成功后调用这个函数]
 * @param  { function } finish      [获取文件完成后调用这个含素]
 * @param  { function } errorFunc   [出错时调用这个函数]
 * @return {[type]}             [description]
 */
function getDataFiles(successFunc, finish, errorFunc){
	fs = require("fs");
	fs.stat(PROBLEM_DATA_ROOT_PATH, function(err, stat){
		if(err == null && stat && stat.isDirectory()){
			getFiles(PROBLEM_DATA_ROOT_PATH, successFunc, finish);
		}else{
			fs.mkdirSync(PROBLEM_DATA_ROOT_PATH);
		}
	});
}

/**
  * 函数功能描述: 获取配置文件 config.json 如果文件不存在则创建
  *
  * @param { function } [successFunc] [获取成功后要调用的函数]
  * @param { function } [errorFunc] [获取失败后要调用的函数]
**/
function getConfig(successFunc, errorFunc){
	fs = require("fs");
	getFile(PROBLEM_CONFIG_ROOT_PATH, PROBLEM_CONFIG_PATH, function success(data){
		data = JSON.parse(data);
		successFunc(data);
	}, function pathErrFunc(err){
		fs.mkdir(PROBLEM_CONFIG_ROOT_PATH, 0777, function(mkdirErr){
			if(mkdirErr){
				mkdirErr += "临时文件创建失败, 请检查程序权限！";
				errorFunc(mkdirErr);
			}else{
				successFunc(INIT_CONFIG_DATA);
			}
		});
	}, function fileErrFunc(err){
		successFunc(INIT_CONFIG_DATA);
	}, function readErrFunc(err){
		errorFunc(err);
	});
}

/**
 * 函数功能描述: 写入文件
 *
 * @param { object } [fs] [文件对象]
 * @param { string } [fileFullPath] [要写入的文件的完整目录]
 * @param { string } [data] [要写入文件的数据]
 * @param { function } [successFunc] [写入成功时调用的函数]
 * @param { function } [errorFunc] [写入失败时要调用的函数]
**/
function writeFile(fs, fileFullPath, data, successFunc, errorFunc){
	fs.writeFile(fileFullPath, data, function(err){
		if(err){
			errorFunc(err);
		}else{
			successFunc();
		}
	});
}

/** 
  * 函数功能描述: 保存文件, 如果文件的目录不存在则创建后再保存, 
  * 保存成功后调用 successFunc, 失败调用 errorFunc
  *
  * @param { string } [filePath] [要保存的文件的目录]
  * @param { string } [fileFullPath] [要保存的文件的完整目录]
  * @param { string } [data] [要向文件中写入的数据]
  * @param { function } [successFunc] [保存成功后调用的函数]
  * @param { function } [errorFunc] [保存失败后调用的函数]
**/
function saveFile(filePath, fileFullPath, data, successFunc, errorFunc){
	var fs = require("fs");
	fs.stat(filePath, function(err, stat){
		if(err == null && stat && stat.isDirectory()){
			writeFile(fs, fileFullPath, data, successFunc, errorFunc);
		}else{
			fs.mkdirSync(filePath);
			writeFile(fs, fileFullPath, data, successFunc, errorFunc);
		}
	});
}

/**
  * 函数功能描述: 保存题目信息配置文件 config.json, 
  * 如果目录不存在则创建
  *
  * @param { string } [configData] [传入要保存的数据]
  * @param { function } [successFunc ] [保存成功后要调用的函数]
  * @param { function } [errorFunc ] [保存失败要掉用的函数]
**/
function saveConfig(configData, successFunc, errorFunc){
	configData = JSON.stringify(configData);
	saveFile(PROBLEM_CONFIG_ROOT_PATH, PROBLEM_CONFIG_PATH, configData, successFunc, errorFunc);
}

/**
 * 下面是两个同步读写函数
 * @param  {[type]} fs           [description]
 * @param  {[type]} fileFullPath [description]
 * @return {[type]}              [description]
 */
function readFileSync(fs, fileFullPath){
	return fs.readFileSync(fileFullPath, 'utf-8');
}

function writeFileSync(fs, fileFullPath, data){
	fs.writeFileSync(fileFullPath, data);
}

/**
 * 拷贝dataFilePath里面的文件
 * @param  {[type]} fs           [description]
 * @param  {[type]} configData   [description]
 * @param  {[type]} dataFilePath [description]
 * @param  {[type]} successFunc  [description]
 * @param  {[type]} errorFunc    [description]
 * @return {[type]}              [description]
 */
function copyMutiFiles(fs, configData, dataFilePath, successFunc, errorFunc){
	for(var key in configData.datascore){
		var inFileName = "/"+key+ ".in";
		var outFileName = "/"+key+ ".out";
		try{
			var fileData = readFileSync(fs, dataFilePath+inFileName);
			writeFileSync(fs, PROBLEM_DATA_ROOT_PATH+inFileName, fileData);

			fileData = readFileSync(fs, dataFilePath+outFileName);
			writeFileSync(fs, PROBLEM_DATA_ROOT_PATH+outFileName, fileData);
			successFunc();
		}catch(err){
			errorFunc(err);
		}
	}
}

/**
 * 删除一个文件夹包括其子文件夹下的所有文件
 * @param  { object } fs        [文件对象]
 * @param  { string } filesPath [要删除的文件夹路径]
 * @return {[type]}           [description]
 */
function deleteAllFiles(filesPath){
	fs = require("fs");
    if(fs.existsSync(filesPath) ) {
        var files = fs.readdirSync(filesPath);
        files.forEach(function(file, index){
            var curPath = filesPath + "/" + file;
            if(fs.statSync(curPath).isDirectory()) { // recurse
                deleteAllFiles(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
    }
}

/**
 * 用来保存题目的测试数据文件
 * @param  {JSON} configData    [前台的题目配置文件]
 * @param  {string} dataFilePath [题目测试文件的文件目录]
 * @param  {function} successFunc   [函数执行成功要调用的函数]
 * @param  {function} errorFunc     [函数执行失败要调用的函数]
 * @return {[type]}               [description]
 */
function saveDataFiles(configData, dataFilePath, successFunc, errorFunc){
	var fs = require("fs");
	configDataString = JSON.stringify(configData);
	saveFile(PROBLEM_CONFIG_ROOT_PATH, PROBLEM_CONFIG_PATH, configDataString, function success(){
		if(dataFilePath == PROBLEM_DATA_ROOT_PATH){return; }
		deleteAllFiles(PROBLEM_DATA_ROOT_PATH);
		fs.stat(PROBLEM_DATA_ROOT_PATH, function(err, stat){
			if(err == null && stat && stat.isDirectory()){
				copyMutiFiles(fs, configData, dataFilePath, successFunc, errorFunc);
			}else{
				fs.mkdirSync(PROBLEM_DATA_ROOT_PATH);
				copyMutiFiles(fs, configData, dataFilePath, successFunc, errorFunc);
			}
		});
	}, function error(err){
		errorFunc(err);
	})
}

/**
 * 检查所有的配置项目是否正确
 * @param  { function } successFunc [确认都没有错误后调用的函数]
 * @param  { function } errorFunc   [有错误时调用的函数]
 * @return {[type]}             [description]
 */
function checkAll(successFunc, errorFunc){
	var err_message = "";
	fs = require("fs");
	getConfig(function success(configData){
		if(configData.title == null || configData.title == "")
			err_message += "题目的标题不能为空, 请修改!<br/>";
		if(isNaN(configData.timelimit) || configData.timelimit < 1000 || configData.timelimit > 50000)
			err_message += "题目的时间限制不合法, 请修改!<br/>";
		if(isNaN(configData.memorylimit) || configData.memorylimit < 65536 || configData.memorylimit > 262144)
			err_message += "题目的内存限制不合法, 请修改!<br/>";
		if(isNaN(configData.level) || configData.level < 1 || configData.level > 5)
			err_message += "题目的难度选择不合法, 请修改!<br/>"
		var keycnt = 0;
		for(var key in configData.datascore){
			keycnt = keycnt + 1;
			var fileFullPath = PROBLEM_DATA_ROOT_PATH +"/"+ key +".in";
			fs.stat(fileFullPath, function(err, stat)	{
				if(err == null && stat && stat.isFile()){
				}else{
					err_message += (key + ".in 文件丢失, 请重新添加测试用例!<br/>");
				}
			});
			fileFullPath = PROBLEM_DATA_ROOT_PATH +"/"+ key +".out";
			fs.stat(fileFullPath, function(err, stat)	{
				if(err == null && stat && stat.isFile()){
				}else{
					err_message += (key + ".out 文件丢失, 请重新添加测试用例!<br/>");
				}
			});
		}
		if(configData.datacount != keycnt)
			err_message += "测试文件数目与记录值不一致, 请重新添加测试用例!<br/>";
		if(configData.datacount == 0)
			err_message += "您尚未提交测试文件, 请先提交测试文件后保存!<br/>";
		if(err_message) errorFunc(err_message);
		else successFunc();
	}, function error(err){
		errorFunc(err);
	});
}

/**
 * 将problem文件夹打包放在detPath处
 * @param  { string } detPath     [目的文件目录]
 * @param  { function } successFunc [成功后调用的函数]
 * @param  { function } errorFunc   [失败时调用的函数]
 * @return {[type]}             [description]
 */
function zipFiles(detPath, successFunc, errorFunc){
	var fs = require("fs");
	var jsZip = require("jszip");
	var zip = new jsZip();
	getConfig(function success(configData){
		zip.file('config.json', JSON.stringify(configData));
		for(var key in configData.datascore){
			var fileFullPath = PROBLEM_DATA_ROOT_PATH +"/"+ key +".in";
			var fileData = readFileSync(fs, fileFullPath);
			zip.file("data/"+key+".in", fileData);

			fileFullPath = PROBLEM_DATA_ROOT_PATH+ "/" + key +".out";
			fileData = readFileSync(fs, fileFullPath);
			zip.file("data/"+key+".out", fileData);
		}
		var data = zip.generate({type: "nodebuffer"});
		writeFile(fs, detPath, data, function(){
			successFunc();
		}, errorFunc);
	}, function error(readErr){
		errorFunc(readErr);
	});
}

function uploadProblem(srcPath, successFunc, errorFunc){
    if(srcPath == '') return;
    var fs = require("fs");
    var path = require("path");
    var jsZip = require("jszip");
    var zip = new jsZip();
    var cnt = -1;
    fs.readFile(srcPath, function(err, data) {
        if (err) errorFunc(err);
        deleteAllFiles(PROBLEM_ROOT_PATH);
        zip.folder(srcPath).load(data);
        Object.keys(zip.files).forEach(function(filename){
            cnt += 1;
            if(cnt){
                var content = zip.files[filename].asNodeBuffer();
                var dest = path.join(PROBLEM_ROOT_PATH, filename.slice(srcPath.length));
                writeFileSync(fs, dest, content);
            }
        });
        successFunc();
    });
}

/**
 * [downloadproblem 下载题目压缩包]
 * @param  { string } detPath     [文件保存位置]
 * @param  { function } successFunc [成功后调用的函数]
 * @param  { function } errorFunc   [失败后调用的函数]
 * @return {[type]}             [description]
 */
function downloadproblem(detPath, successFunc, errorFunc){
	checkAll(function(){
		zipFiles(detPath, successFunc, errorFunc);
	}, errorFunc);
}

/**
 * [getPictionBase64 得到一张图片的base64编码]
 * @param  { string } picUrl [图片的完整路径]
 * @return { string }        [图片的base64编码]
 */
function getPictionBase64(picUrl){
	var fs = require("fs");
	var data = fs.readFileSync(picUrl);
	if(data != null) return data.toString('base64');
	else return null;
}
