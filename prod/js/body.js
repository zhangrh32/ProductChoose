if (window.localStorage.userinfo != undefined){
    try{

        var userinfo ='';
        userinfo=JSON.parse(localStorage.userinfo);
    } catch (e) {
        console.log("用户登录信息出错了，登录信息将被清空" + e);
        delete window.localStorage.userinfo;
    }
}
//存储上一个页面和本页的URL
var surl=location.pathname+location.search;
if(localStorage.p1+localStorage.b1!=surl){
    localStorage.p2=localStorage.p1;//上页URL
    localStorage.b2=localStorage.b1;
}
if(location.pathname && typeof(location.pathname)!="undefined"){
    localStorage.p1=location.pathname;//本页URL
}else{
    localStorage.p1='';//本页URL
}
if(location.search && typeof(location.search)!="undefined"){
    localStorage.b1=location.search;//本页URL
}else{
    localStorage.b1='';//本页URL
}
function checkRsC(){
	//获取本页面的url
	var abc = window.location.href;
    if(!userinfo){
        showMessage("请先登录");
        location.href="/a/login?abc="+abc;
    }
}
//获取URL后的参数
(function ($) {
    $.getQuery = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURI(r[2]); return null;
    }
})(jQuery);
//弹框确定、取消
function PopupSure(msg1,msg2,msg3,conf){
    var box = $('<div class="Popup flex lineC downC"></div>');
    var mb = $('<div class="Popupmb"></div>');
    var boxcon = $('<div class="Popupcon"></div>');
    var text = $('<p id="Popcon">'+msg1+'</p>');
    var btn = $('<ul class="flex"></ul>');
    var remove = $('<li class="flex widthA lineC" id="remove">'+msg2+'</li>');
    var sure = $('<li class="flex widthA lineC" id="sure">'+msg3+'</li>');
    btn.append(remove);
    btn.append(sure);
    boxcon.append(text);
    boxcon.append(btn);
    box.append(mb);
    box.append(boxcon);
    $("#bodyContent").append(box);
    remove.click(function(){
        box.remove();
    });
    sure.click(function(){
        box.remove();
        conf.confirm();
    });
}
//弹框确定、取消(换行)
 function PopupSureB(msg,msg1,msg2,msg3,conf){
	var box = $('<div class="Popup flex lineC downC"></div>');
	var mb = $('<div class="Popupmb"></div>');
	var boxcon = $('<div class="Popupcon"></div>');
	var pormpt = $('<p class="Poppormpt">'+msg+'</p>')
	var text = $('<span id="Popconn">'+msg1+'</span>');
	var btn = $('<ul class="flex"></ul>');
	var remove = $('<li class="flex widthA lineC" id="remove">'+msg2+'</li>');
	var sure = $('<li class="flex widthA lineC" id="sure">'+msg3+'</li>');
	btn.append(remove);
	btn.append(sure);
	boxcon.append(pormpt);
	boxcon.append(text);
	boxcon.append(btn);
	box.append(mb);
	box.append(boxcon);
	$("#bodyContent").append(box);
	remove.click(function(){
		box.remove();
	});
	sure.click(function(){
		box.remove();
		conf.confirm();
	});
}
//弹出提示
function showMessage(msg){
    var box = $('<div class="showMessage flex lineC"></div>');
    var message = '<span>'+msg+'</span>';
    box.append(message);
    $("#bodyContent").append(box);
    setTimeout(function(){
        box.remove();
    },2000);
}
//弹出编辑页面
function Write(title,sure,con,conf){
    var boxw = $('<div class="writeMessage"></div>');
    var top = '<header><a><i class="goCloseW iconfont icon-shanchuanniu"></i></a><span id="title">'+title+'</span><span class="rightbtn"><button id="messageSure">'+sure+'</button></span></header>';
    var con = '<div><textarea id="conW" placeholder="'+con+'"></textarea></div>';
    boxw.append(top);
    boxw.append(con);
    $("body").append(boxw);
    $(".goCloseW").click(function(){
        boxw.remove();
    });
    $("#messageSure").click(function(){
        conf.confirm();
    });
}
/**
 * 判断是否是微信浏览器
 */
function isWeiXin() {
    var ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == 'micromessenger') {
        return true;
    } else {
        return false;
    }
}