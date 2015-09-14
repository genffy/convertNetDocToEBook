/**
 * Created by genffy on 15/9/13.
 */
var http = require("http"),
    https = require("https"),
    fs = require("fs"),
    path = require("path"),
    $ = require("jquery")(require("jsdom").jsdom().parentWindow);

var baseUrl = "laravel.com",
    basePath = "/docs/5.1",
    paths = [],
    htmlSrc = __dirname +"/html_src/";

var opt = {
    host: baseUrl,
    path: basePath
};

/**
 * 根据右边的导航获取URL列表
 */
function getUrlList(html){
    var $dom = $(html), urls = [];
    $dom.find(">ul>li").each(function(){
        var _$li = $(this), title = _$li.text();
        $(this).find("a").each(function(){
            var _$a = $(this), __obj = {
                title: title,
                subTitle: _$a.text(),
                host: baseUrl,
                path: _$a.attr("href")
            };
            urls.push(__obj);
        });
    });
    return urls;
}
/**
 * 保存获取到的内容
 */
function saveContent(opt, content){
    var filename = JSON.stringify(/<title>.*<\/title>/gi.exec(content)[0]).replace(/<\/*title>/g,'')+".txt";
    fs.stat(htmlSrc+opt.host +"/" +filename, function(err, stat){
        if(err == null) {
            console.log('File exists');
        } else if(err.code == 'ENOENT') {
            fs.writeFile(htmlSrc+opt.host +"/" +filename, content, function(err){
                if(err) throw err;
                console.log("It's saved!");
            });
        } else {
            console.log('Some other error: ', err.code);
        }
    });
}
function callback(response){
    var str = "";

    response.on("data", function(chunk){
        str+=chunk;
    });

    response.on("end", function(){
        paths = getUrlList(str);
        // 写到html原始文档里
        var stat = fs.statSync(htmlSrc+opt.host);

        for(var i=0, len = paths.length; i<len; i++){
            (function(opt){
                http.get(opt, function(res){
                    res.on("data", function(){

                    });
                    res.on("end", function(){
                        if(stat.isDirectory()){
                            saveContent(opt, str);
                        }else{
                            fs.mkdir(htmlSrc+opt.host, 0755, function(err){
                                if(err) throw err;
                                saveContent(opt, str);
                            });
                        }
                    });
                });
            })(paths[i]);
        }
        if(stat.isDirectory()){
            var filename = JSON.stringify(/<title>.*<\/title>/gi.exec(str)[0]).replace(/<\/*title>/g,'')+".txt";
            saveContent(opt, str);
        }else{
            fs.mkdir(htmlSrc+opt.host, 0755, function(err){
                if(err) throw err;
                saveContent(opt, str);
            });
        }
    });
}

var request = http.get(opt, callback);
request.on("error", function (error) {
    console.log(error);
});
request.end();