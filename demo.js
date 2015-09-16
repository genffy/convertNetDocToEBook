/**
 * Created by madao on 2015-09-16.
 */

var phantom = require("phantom"),
    $ = require("jquery")(require("jsdom").jsdom().parentWindow);

phantom.create(function(ph){
    ph.createPage(function(page) {
        page.set('viewportSize', { width: 1040, height: 800 });
        page.open("http://laravel.com/docs/5.1/installation", function(status) {
            if(status === "success"){
                page.getContent(function(ctn){
                    var $dom = $(ctn);
                    $dom.find(".docs-wrapper.container>article").css("margin-left",0);
                    $dom.find(".docs-wrapper.container .sidebar").hide();
                    $dom.find(".docs-wrapper.container #search").hide();
                    $dom.find("nav.main").hide();
                });
                page.render(__dirname + "/ebook/demo.pdf", function(){
                    console.log('Page Rendered');
                    ph.exit();
                });
            }
        });
    });
});