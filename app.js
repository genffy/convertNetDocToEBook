/**
 * Created by genffy on 15/9/13.
 */
var http = require("http"),
    https = require("https"),
    fs = require("fs"),
    path = require("path");

var baseUrl = "laravel.com",
    basePath = "/docs/5.1",
    paths = [],
    htmlSrc = __dirname +"/html_src/";

var opt = {
    host: baseUrl,
    path: basePath
};

function callback(response){
    var str = "";

    response.on("data", function(chunk){
        str+=chunk;
    });

    response.on("end", function(){
        // 写到html原始文档里
        var stat = fs.statSync(htmlSrc+opt.host);
        if(stat.isDirectory()){
            var filename = JSON.stringify(/<title>.*<\/title>/gi.exec(str)[0]).replace(/<\/*title>/g,'')+".txt";
            fs.stat(htmlSrc+opt.host +"/" +filename, function(err, stat){
                if(err == null) {
                    console.log('File exists');
                } else if(err.code == 'ENOENT') {
                    fs.writeFile(htmlSrc+opt.host +"/" +filename, str, function(err){
                        if(err) throw err;
                        console.log("It's saved!");
                    });
                } else {
                    console.log('Some other error: ', err.code);
                }
            });
        }else{
            fs.mkdir(htmlSrc+opt.host, 0755, function(err){
                if(err) throw err;
                var filename = JSON.stringify(/<title>.*<\/title>/gi.exec(str)[0]).replace(/<\/*title>/g,'')+".txt";
                fs.stat(htmlSrc+opt.host +"/" +filename, function(err, stat){
                    if(err == null) {
                        console.log('File exists');
                    } else if(err.code == 'ENOENT') {
                        fs.writeFile(htmlSrc+opt.host +"/" +filename, str, function(err){
                            if(err) throw err;
                            console.log("It's saved!");
                        });
                    } else {
                        console.log('Some other error: ', err.code);
                    }
                });
            });
        }
    });
};

var request = http.get(opt, callback);
request.on("error", function (error) {
    console.log(error);
});
request.end();