// 定义全局变量
var ROOT_PATH = getRootPath();
var PROBLEM_ROOT_PATH = ROOT_PATH + "/problem";
var PROBLEM_CONFIG_FILENAME = "/config.json";
var PROBLEM_CONFIG_ROOT_PATH = PROBLEM_ROOT_PATH;
var PROBLEM_DATA_ROOT_PATH = PROBLEM_ROOT_PATH +"/data";
var PROBLEM_CONFIG_PATH = PROBLEM_CONFIG_ROOT_PATH + PROBLEM_CONFIG_FILENAME;
var INIT_CONFIG_DATA = {
	"title": "",
	"timelimit": 1000,
	"memorylimit": 65536,
	"level":3,
	"description":"",
	"inputdescription":"",
	"outputdescription":"",
	"inputsample":"<pre></pre>",
	"outputsample":"<pre></pre>",
	"datacount":0,
	"datascore":{},
	"hint":"",
	"source":"",
	"compiler":"cpp",
	"solutioncode":"",
	"solutiontext":""
}

/**
 * 得到程序的根目录
 * @return { string } [程序的根目录]
 */
function getRootPath(){
	var path = require('path');
	var nwPath = process.execPath;
	var rootPath = path.dirname(nwPath);
	return rootPath;
}

/**
 * 初始化导航条的点击事件
 * @return {[type]} [description]
 */
function initStep(){
    var steps = document.getElementsByName("stepBtn");
    for(var i = 0; i < steps.length; i++){
        steps[i].index = i;
        steps[i].onclick=function(){
        	if(checkChange()) window.location.href = "step" + this.index +".html";
        }
    }
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
		icon : "static/images/favicon.png",
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
	fs = require("fs");
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
	err_message = "";
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

/**
 * [downloadproblema 下载题目压缩包]
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
	fs = require("fs");
	var data = fs.readFileSync(picUrl);
	if(data != null) return data.toString('base64');
	else return null;
}
