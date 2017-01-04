// let Config = require('./config.js');
// let FileManager = require('./filemanager.js');

class App{
    constructor(){
        this.os = require("os");
        this.path = require("path");
        this.gui = require('nw.gui');

        this.isNeedClear = false;
        this.config = new Config();
        this.fileManager = new FileManager();

        this.ROOT_PATH = this.os.tmpdir();
        this.PROBLEM_ROOT_PATH = this.path.join(this.ROOT_PATH, "problem");
        this.PROBLEM_CONFIG_FILENAME = "config.json";
        this.PROBLEM_CONFIG_ROOT_PATH = this.PROBLEM_ROOT_PATH;
        this.PROBLEM_DATA_ROOT_PATH = this.path.join(this.PROBLEM_ROOT_PATH, "data");
        this.PROBLEM_CONFIG_PATH = this.path.join(this.PROBLEM_CONFIG_ROOT_PATH,
            this.PROBLEM_CONFIG_FILENAME);
    }

    readyToClose(){
        function compareJson(obj1, obj2) {
            let ret = {};
            for(let i in obj2) {
                if(i == 'datascore'){
                    continue;
                }
                if(!obj1.hasOwnProperty(i) || obj2[i] !== obj1[i]) {
                    ret[i] = obj2[i];
                }
            }
            return ret;
        }

        let self = this;
        if(self.isNeedClear){
            self.fileManager.deleteDir(self.PROBLEM_ROOT_PATH);
        }else{
            let _config = new Config();
            let initConfig = _config.getConfigByJson();
            let result = compareJson(initConfig, self.config.getConfigByJson());
            if($.isEmptyObject(result)){
                self.fileManager.deleteDir(self.PROBLEM_ROOT_PATH);
            }
        }
    }

    getConfig(){
        console.log('App: getConfig start');
        return this.config.getConfigByJson();
    }

    setConfig(configJson){
        this.config.initByJson(configJson);
    }

    createNewProblem(){
        this.fileManager.deleteDir(this.PROBLEM_ROOT_PATH);
        this.config = new Config();
        return this.config.getConfigByJson();
    }

    checkRootFiles(configData, rootPath){
        let err_message = [];
        for(let key in configData.datascore){
            let fileDir = rootPath;
            let inFileName = key + '.in';
            let outFileName = key + '.out';
            try{
                this.fileManager.isFileExistSync(fileDir, inFileName);
                this.fileManager.isFileExistSync(fileDir, outFileName);
            }catch(err){
                console.error(err);
                err_message.push('名称为 ' + key + ' 的题目测试数据文件缺失');
            }
        }
        return err_message;
    }

    uploadProblem(zipFilePath, successFunc, errorFunc){
        let self = this;
        self.fileManager.deleteDir(self.PROBLEM_ROOT_PATH);
        self.fileManager.makeDirSync(self.PROBLEM_ROOT_PATH);
        try{
            self.fileManager.unZipFile(
                zipFilePath,
                self.PROBLEM_ROOT_PATH,
                function(){
                    self.setConfigFromRoot(successFunc, errorFunc);
                }
            );
        }catch(err){
            errorFunc(err);
        }
    }

    clearAllData(){
        this.fileManager.deleteDir(this.PROBLEM_ROOT_PATH);
        this.config = new Config();
        return this.config.getConfigByJson();
    }

    downloadProblem(detFileName, successFunc, errorFunc){
        this.fileManager.zipFile(this.PROBLEM_ROOT_PATH, detFileName,
            successFunc, errorFunc);
    }

    setConfigFromRoot(successFunc, errorFunc){
        let self = this;
        self.fileManager.readFile(
            self.PROBLEM_CONFIG_PATH,
            function(configData){
                try{
                    configData = JSON.parse(configData);
                    let err_message = self.checkRootFiles(
                        configData, self.PROBLEM_DATA_ROOT_PATH);
                    if(!$.isEmptyObject(err_message)){
                        self.fileManager.deleteDir(self.PROBLEM_ROOT_PATH);
                        throw err_message.join('<br/>');
                    }
                    self.config.initByJson(configData);
                    successFunc(configData);
                }catch(err){
                    console.error(err);
                    self.fileManager.deleteDir(self.PROBLEM_ROOT_PATH);
                    errorFunc(err);
                }
            },
            function(err){
                console.info(err);
                self.fileManager.deleteDir(self.PROBLEM_ROOT_PATH);
                errorFunc(err);
            }
        );
    }

    saveConfig(configJson, successFunc, errorFunc){
        this.config.initByJson(configJson);
        let configStr = JSON.stringify(configJson);
        this.fileManager.writeFile(
            this.PROBLEM_CONFIG_ROOT_PATH,
            this.PROBLEM_CONFIG_FILENAME,
            configStr,
            successFunc,
            errorFunc
        );
    }

    saveTestData(dataFilesPath, successFunc){
        let self = this;
        let inFiles = [], outFiles = []
        let err = []
        self.fileManager.getDirSync(
            dataFilesPath,
            function eachFileFunc(fileName){
                let nameArr = fileName.split('.');
                let len = nameArr.length;
                if(len === 2 && nameArr[1] === 'in'){
                    inFiles.push(nameArr[0]);
                }else if(len === 2 && nameArr[1] === 'out'){
                    outFiles.push(nameArr[0]);
                }else{
                    err.push({'name': fileName, 'text': '命名不符合要求'});
                }
            }, function finishFunc(){
                inFiles.sort();
                outFiles.sort();
                if(inFiles.length !== outFiles.length){
                    err.push({'name': '输入与输出文件', 'text': '数量不同'});
                }
                let idx = 0, odx = 0;
                let legalFiles = [];
                let len = inFiles.length;
                self.fileManager.deleteDir(self.PROBLEM_DATA_ROOT_PATH);
                while(idx < len && odx < len){
                    if(inFiles[idx] === outFiles[odx]){
                        self.fileManager.copyFile(dataFilesPath, inFiles[idx] + '.in',
                            self.PROBLEM_DATA_ROOT_PATH, inFiles[idx] + '.in');
                        self.fileManager.copyFile(dataFilesPath, outFiles[odx] + '.out',
                            self.PROBLEM_DATA_ROOT_PATH, outFiles[odx] + '.out');
                        legalFiles.push(inFiles[idx]);
                        idx += 1;
                        odx += 1;
                    }else if(inFiles[idx] > outFiles[odx]){
                        err.push({'name': outFiles[odx]+'.out', 'text': '无法找到匹配的输入文件'});
                        odx += 1;
                    }else{
                        err.push({'name': inFiles[idx]+'.in', 'text': '无法找到匹配的输出文件'});
                        idx += 1;
                    }
                }
                while(idx < len){
                    err.push({'name': inFiles[idx]+'.in', 'text': '无法找到匹配的输出文件'});
                    idx += 1;
                }
                while(odx < len){
                    err.push({'name': outFiles[odx]+'.out', 'text': '无法找到匹配的输入文件'});
                    odx += 1;
                }
                let datascore = {};
                let num = legalFiles.length;
                if(num !== 0){
                    let score = parseInt(100 / num);
                    legalFiles.forEach(function(file, index){
                        if(index === num - 1){
                            datascore[file] = 100 - score * (num - 1);
                        }else{
                            datascore[file] = score;
                        }
                    });
                }
                self.config.setTestDataInfo(num, datascore);
                successFunc(self.config.getConfigByJson(), err);
            }
        );
    }

    saveAll(configJson, dataName){
    }
}
// module.exports = App;
