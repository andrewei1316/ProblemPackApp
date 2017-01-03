class Config {

    constructor(configJson){
        if(configJson){
            this.config = configJson;
        }else{
            this.config = {
                "title": "",
                "timelimit": 1000,
                "memorylimit": 65536,
                "level": 3,
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
            };
        }
        console.log('Config: constructor finish');
    }

    initByJson(JsonObj){
        this.config = JsonObj;
    }

    initByString(config_str){
        this.config = JSON.parse(config_str);
    }

    setTestDataInfo(num, datascore){
        this.config.datacount = num;
        this.config.datascore = datascore;
    }

    getConfigByJson(){
        return this.config;
    }

    getConfigByString(){
        return JSON.stringify(this.config);
    }
}
// module.exports = Config;