/**
 * Created by genffy on 15/9/13.
 */
var http = require("http"),
    https = require("https"),
    fs = require("fs"),
    path = require("path"),
    phantom = require("phantom"),
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
    var $dom = $(html).find(".sidebar"), urls = [];
    $dom.find(">ul>li").each(function(){
        var _$li = $(this), title = _$li.text();
        $(this).find("a").each(function(){
            var _$a = $(this), __obj = {
                title: title,
                subTitle: _$a.text(),
                host: baseUrl,
                path: _$a.attr("href"),
                status:0
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
    var filename = JSON.stringify(/<title>.*<\/title>/gi.exec(content)[0])
            .replace(/<\/*title>/g,'')
            .replace("\"","")
            .replace("\/","_")
            .replace(" ","_").split('-')[0]+".txt";
    fs.stat(htmlSrc+baseUrl +"/" +filename, function(err, stat){
        if(err == null) {
            console.log('File exists');
        } else if(err.code == 'ENOENT') {
            fs.writeFile(htmlSrc+baseUrl +"/" +filename, content, function(err){
                if(err) console.log(err);
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
        var stat = fs.statSync(htmlSrc+baseUrl);
        if(stat.isDirectory()){
            saveContent(opt, str);
        }else{
            fs.mkdir(htmlSrc+baseUrl, 0755, function(err){
                if(err) throw err;
                saveContent(opt, str);
            });
        }
        console.log(paths.length);
        //for(var i=0, len = paths.length; i<len; i++){
        //    (function(opt){
        //        http.get(opt, function(res){
        //            var html = "";
        //            res.on("data", function(chunk){
        //                html+=chunk;
        //            });
        //            res.on("end", function(){
        //                saveContent(opt, html);
        //            });
        //        });
        //    })(paths[i]);
        //}
    });
}

var request = http.get(opt, callback);
request.on("error", function (error) {
    console.log(error);
});
request.end();

var count = 0, interVal = setInterval(function(){
    if(paths.length){
        clearInterval(interVal);
        count = paths.length
        for(var i=0, len = paths.length; i<len; i++){
            if(!paths[i].status){
                (function(opt){
                    phantom.create(function(ph){
                        ph.createPage(function(page) {
                            page.open(opt.host+opt.path, function(status) {
                                if(status === "success"){
                                    var title = page.evaluate(function() {
                                        return document.title;
                                    });
                                    page.render(title+'.pdf', function(){
                                        console.log('Page Rendered');
                                        opt.status = 1;
                                        ph.exit();
                                    });
                                }
                            });
                        });
                    });
                })(paths[i]);
            }else{
                continue;
            }
        }
    }
}, 1000);