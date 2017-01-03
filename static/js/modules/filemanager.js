class FileManager {

    constructor(){
        this.fs = require("fs");
        this.path = require("path");
        this.unzip = require("unzip");
        this.archiver = require('archiver');
    }

    readFile(filePath, successFunc, errorFunc){
        this.fs.readFile(filePath,'utf-8', function(readErr, data){
            if(readErr){
                errorFunc(readErr);
            }else{
                successFunc(data);
            }
        });
    }

    readFileSync(filePath){
        return this.fs.readFileSync(filePath, 'utf-8');
    }

    writeFile(fileDir, fileName, fileData, successFunc, errorFunc){
        if(fileDir){
            this.makeDirSync(fileDir);
            fileName = this.path.join(fileDir, fileName);
        }
        this.fs.writeFile(fileName, fileData, function(err){
            if(err){
                errorFunc(err);
            }else{
                successFunc();
            }
        });
    }

    writeFileSync(fileDir, fileName, fileData){
        if(fileDir){
            this.makeDirSync(fileDir);
            fileName = this.path.join(fileDir, fileName);
        }
        this.fs.writeFileSync(fileName, data);
    }

    makeDirSync(dirPath, dirName){
        if(typeof dirName === 'undefined'){
            if(this.fs.existsSync(dirPath)){
                return;
            }else{
                this.makeDirSync(dirPath, this.path.dirname(dirPath));
            }
        }else{
            if(dirName !== this.path.dirname(dirPath)){
                this.makeDirSync(dirPath);
                return;
            }
            if(this.fs.existsSync(dirName)){
                this.fs.mkdirSync(dirPath);
            }else{
                this.makeDirSync(dirName, this.path.dirname(dirName));
                this.fs.mkdirSync(dirPath);
            }
        }
    }

    isFileExistSync(fileDir, fileName){
        let filePath = this.path.join(fileDir, fileName);
        return this.fs.statSync(filePath);
    }

    copyFile(srcFileDir, srcFileName, detFileDir, detFileName){
        let srcFilePath = this.path.join(srcFileDir, srcFileName);
        let detFilePath = this.path.join(detFileDir, detFileName);
        this.makeDirSync(detFileDir);
        let readStream = this.fs.createReadStream(srcFilePath);
        let writeStream = this.fs.createWriteStream(detFilePath);
        readStream.pipe(writeStream);
    }

    unZipFile(zipFilePath, detFileDir, finishFunc){
        let stream = this.fs.createReadStream(zipFilePath)
            .pipe(this.unzip.Extract({ path: detFileDir }));
        stream.on('close', function(){
            finishFunc();
        })
    }

    zipFile(srcFileDir, filePath, successFunc, errorFunc){
        let output = this.fs.createWriteStream(filePath);
        let archive = this.archiver('zip');
        output.on('close', function(){
            successFunc();
        });
        archive.on('error', function(err){
            errorFunc(err);
        });
        archive.pipe(output);
        archive.bulk([
            {
                dest: '/',
                src: ['**'],
                expand: true,
                cwd: srcFileDir
            }
        ]);
        archive.finalize();
    }

    getDirSync(dirPath, eachFileFunc, finishFunc){
        var files = this.fs.readdirSync(dirPath);
        files.forEach(function(file, index){
            eachFileFunc(file);
        });
        finishFunc();
    }

    deleteDir(dirPath){
        let self = this;
        if(self.fs.existsSync(dirPath)) {
            var files = self.fs.readdirSync(dirPath);
            files.forEach(function(file, index){
                var curPath = self.path.join(dirPath, file);
                if(self.fs.statSync(curPath).isDirectory()) {
                    self.deleteDir(curPath);
                } else {
                    self.fs.unlinkSync(curPath);
                }
            });
        }
    }
};
// module.exports = FileManager;