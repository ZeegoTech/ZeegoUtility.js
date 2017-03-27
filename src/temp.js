/*!
 * 公用的工具方法
 * @Zeego Tech
 */

//生成随机数
function _getNonceStr() {
    return Math.random().toString(36).substr(2, 15);
}

//按照密钥计算数据交互签名
function _getPostSignature(urlStr) {
    var key = "o0Tm2RIisKv6Ywug";
    var tempStr = urlStr + key;
    //console.log(tempStr);
    tempStr = new md5().hex_md5(tempStr);
    //console.log(tempStr);
    return tempStr;
}

//把数据交互的数据加上签名然后返回给前端
function _getSecureParams(params) {
    params['noncestr'] = _getNonceStr();
    var names = new Array();
    var extras = new Array();
    var tempStr = "";
    for (var name in params) {
        if (name != null && name.indexOf("extraValue")<0) {
            names.push(name);
        }
        if(name.indexOf("extraValue")>=0){
            extras.push(name);
        }
    }
    names.sort();
    for (var i = 0; i < names.length; i++) {
        if(i!=0)
            tempStr+="&";
        tempStr += names[i] + "=" + params[names[i]];
    }
    //tempStr += "&sign="+_getPostSignature(tempStr);

    for(var i in extras){
        tempStr += ("&"+extras[i]+"="+ params[extras[i]]);
    }

    return tempStr;
}

// 通用的网络传输方法
var tokenExpireCounter = 0;
var Cid="";
var HTTPRequestFunc = function(method, url, data, onLoad, onError){
    var xhr;
    if (PlatformInfo.name=="app") {
        xhr = new plus.net.XMLHttpRequest();
        Cid = plus.push.getClientInfo().clientid;
        xhr.timeout = 5000;
    }
    else{
        xhr = new XMLHttpRequest();
    }
    xhr.onabort = function(){
        onError(xhr.status, "网络错误,请稍候重试");
    };
    xhr.onerror = function(){
        onError(xhr.status, "当前网络状态异常");
    };
    xhr.onload = function(){
        //这里需要加一些逻辑处理token过期等情况
        console.log(url+":"+xhr.responseText);

        if((xhr.responseText.indexOf("令牌过期")>=0 || xhr.responseText.indexOf("令牌验证错误")>=0) && tokenExpireCounter==0){
            tokenExpireCounter = 1;

            var User = _getUser();

            console.log(JSON.stringify(User));

            HTTPRequestFunc(
            "post",
            AppBaseConfig.apiURI+"UserHandler.ashx?api=relogin",
            {
                userId: User.id,
                hashCode: User.hashCode,
                cid: Cid
            },
            function(resultData){
                console.log(resultData);

                resultData = JSON.parse(resultData);
                if(resultData.status==0){
                    var item = resultData.data.client;
                    User.id = item.ID;
                    User.GUID = item.GUID;
                    User.name = item.Name;
                    User.mobile = item.Mobile;
                    User.userType = item.UserType;
                    User.sex = item.Sex;
                    User.IsRenZheng = item.IsRenZheng;
                    User.token = resultData.data.token;
                    User.hashCode = resultData.data.hashCode;

                    _storeObject(StorageKeys.UserInfo, User);
                    data["token"] = resultData.data.token;
                    console.log(JSON.stringify(User));
                    tokenExpireCounter = 0;
                    HTTPRequestFunc(method,url,data,onLoad,onError);
                }
                else{
                    onError(xhr.status, "登录失效，请重新登录");
                    if (PlatformInfo.name=="app")
                        plus.webview.getLaunchWebview().evalJS("openLogin()");
                }
            },
            function(status, info){
                onError(xhr.status, "登录失效，请重新登录");
                if (PlatformInfo.name=="app")
                    plus.webview.getLaunchWebview().evalJS("openLogin()");
            });
        }
        else
            onLoad(xhr.responseText);
    };
    xhr.ontimeout = function(){
        onError(xhr.status, "网络超时，请检查网络");
    };
    indata = _getSecureParams(data);

    url += "&randomx="+_getNonceStr();

    if(method=="get"){
//      console.log(url+"&"+indata);
        xhr.open( method, url+"&"+indata );
        // 发送HTTP请求
        xhr.send();
    }
    else{
        xhr.open(method, url);
        xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');

        // 发送HTTP请求
        xhr.send(indata);
    }
};

// 本地存储对象
function _storeObject(key, value){
    if(PlatformInfo.name=="app")
        plus.storage.setItem(key,JSON.stringify(value));
    else
        localStorage.setItem(key,JSON.stringify(value));
}
// 本地存储字符串
function _storeString(key, value){
    if(PlatformInfo.name=="app")
        plus.storage.setItem(key, value);
    else
        localStorage.setItem(key, value);
}
// 本地存储删除
function _delStorage(key){
    if(PlatformInfo.name=="app")
        plus.storage.removeItem(key);
    else
        localStorage.removeItem(key);
}
// 本地存储获取对象
function _retrieveObject(key){
    var objStr;
    if(PlatformInfo.name=="app")
        objStr = plus.storage.getItem(key);
    else
        objStr = localStorage.getItem(key);

    if(objStr==null)
        return null;
    return JSON.parse(objStr);
}
// 本地存储获取字符串
function _retrieveString(key){
    if(PlatformInfo.name=="app")
        return plus.storage.getItem(key);
    else
        return localStorage.getItem(key);
}

// HTML Encode
function _htmlencode(s){
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(s));
    return div.innerHTML;
}
// HTML Decode
function _htmldecode(s){
    var div = document.createElement('div');
    div.innerHTML = s;
    return div.innerText || div.textContent;
}

// 删除首尾空字符
function _trim(str) {
    return str.replace(/(^\s*)|(\s*$)/g, "");
}

// 判断是否是空字符串
function _isNullString(str){
    if(str==undefined || str==null || str=="" || _trim(str)=="")
        return true;
    return false;
}

// 验证是否是合法的身份证号码
function _IdentityCodeValid(code) {
    var city={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江 ",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北 ",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏 ",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外 "};
    var tip = "";
    var pass= true;

    if(!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)){
        tip = "身份证号格式错误";
        pass = false;
    }

   else if(!city[code.substr(0,2)]){
        tip = "地址编码错误";
        pass = false;
    }
    else{
        //18位身份证需要验证最后一位校验位
        if(code.length == 18){
            code = code.split('');
            //∑(ai×Wi)(mod 11)
            //加权因子
            var factor = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ];
            //校验位
            var parity = [ 1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2 ];
            var sum = 0;
            var ai = 0;
            var wi = 0;
            for (var i = 0; i < 17; i++)
            {
                ai = code[i];
                wi = factor[i];
                sum += ai * wi;
            }
            var last = parity[sum % 11];
            if(last=='X'){
                if(last != code[17].toUpperCase()){
                    tip = "校验位错误";
                    pass =false;
                }
            }
            else{
                if(parity[sum % 11] != code[17]){
                    tip = "校验位错误";
                    pass =false;
                }
            }
        }
    }
    //if(!pass) alert(tip);
    return pass;
}

// 验证是否是合法的手机号码
function _ValidateMobile(str) {
    var pattern = /^1[23456789]\d{9}$/;
    if (pattern.test(str)) {
        return true;
    }
    return false;
}

// 打开新闻详情页面
function _openNews(id){

    if(PlatformInfo.name!="app"){
        _storeString(StorageKeys.Nid,id);
    }

    _OpenWebview({
        url:"newsDetail.html",
        id:"newsDetail",
        extras:{nid:id},
        show:{
            autoShow: false
        },
        styles:{
            scrollIndicator: 'none'
        }
    });
}

function _BindPageLoad(func){
    if(PlatformInfo.name=="app"){
        mui.plusReady(function(){
            if(mui.os.ios && plus.navigator.isImmersedStatusbar()){
                if(mui("header")[0]){
                    h = plus.navigator.getStatusbarHeight();
                    th = parseInt(h)+44;
                    mui("header")[0].style.paddingTop = (h+'px');
                    mui("header")[0].style.height = (th+'px');
                    if(mui('.mui-bar-nav~.mui-content')[0]){
                        mui('.mui-bar-nav~.mui-content')[0].style.paddingTop = (th+'px');
                    }
                }

                if(mui('.mui-views .mui-view')[0]){
                    h = plus.navigator.getStatusbarHeight();
                    mui('.mui-views .mui-view')[0].style.marginTop = (h+'px');
                }

                if(mui('.floatHeader')[0]){
                    h = plus.navigator.getStatusbarHeight();
                    th = parseInt(h)+44;
                    mui('.floatHeader')[0].style.top = (th+'px');
                }

                if(mui('.floatContent2')[0]){
                    h = plus.navigator.getStatusbarHeight();
                    th = parseInt(h)+85;
                    mui('.floatContent2')[0].style.paddingTop = (th+'px');
                }
            }

            func();
        });
    }
    else{
        User = _getUser();

//      if(location.href.indexOf('index.html')<0 && User.id=="-1"){
//          location.href = "index.html";
//      }

        func();
    }
}

function _PageInit(obj){
    if(PlatformInfo.name=="app"){
        mui.init(obj);
    }
    else{
        if(obj.subpages!=undefined && obj.subpages[0].url != undefined){
            var elm = document.createElement("iframe");
            elm.setAttribute("src",obj.subpages[0].url);
            elm.style.top = obj.subpages[0].styles.top;
            elm.style.width = "100%";
            elm.style.height = window.innerHeight-parseInt(obj.subpages[0].styles.top)+"px";
            elm.style.border = "none";
            document.body.appendChild(elm);
        }
    }
}

function _OpenWebview(obj){
    if(PlatformInfo.name=="app"){
        if(obj.extras==undefined)
            obj.extras = {};
        mui.openWindow(obj);
    }
    else{
        if( obj.url != undefined){
            if(window.parent)
                window.parent.location.href=obj.url+"?random=201609061731";
            else
                location.href=obj.url+"?random=201609061731";
        }
    }
}
function _ShowWaiting(){
    if(PlatformInfo.name=="app"){
        plus.nativeUI.showWaiting();
    }
    else{
        if(document.getElementById("systemLoading")==null){
            var d = document.createElement("div");
            d.id = "systemLoading";
            document.body.appendChild(d);
            d.innerHTML = "<img src=\"img/loading2.gif\" width=\"62px\" height=\"62px\" style=\"position: absolute; z-index: 998; top: 50%; left: 50%; margin-left: -31px; margin-top: -31px;\"/>";
        }
    }
}

function _CloseWaiting(){
    if(PlatformInfo.name=="app"){
        plus.nativeUI.closeWaiting();
    }
    else{
        if(document.getElementById("systemLoading")!=null){
            document.body.removeChild(document.getElementById("systemLoading"));
        }
    }
}

var wxTitle = "一帮爸爸，您的健康生活管家";//分享标题
var wxDesc = '其实您不用花钱买一台净水机，签约即享VIP净水服务';
var wxlink = 'http://v1.ebbaba.com/Mobile/join_weifu.aspx';//分享链接
var wxImgUrl ='http://mobile.ebbaba.com/img/140.jpg';//分享图片地址，必须是绝对地址

/*微信分享*/
function InitWX(t,d,l,i){
    if(t!=null && t!=undefined)
        wxTitle = t;

    if(d!=null && d!=undefined)
        wxDesc = d;

    if(l!=null && l!=undefined)
        wxlink = l;

    if(i!=null && i!=undefined)
        wxImgUrl = i;

    if(PlatformInfo.name=="app"){
        return;
    }

    HTTPRequestFunc(
    "get",
    AppBaseConfig.apiURI+"WXMPHandler.ashx?api=jsPackage",
    {url:encodeURIComponent(location.href).split('?')[0]},
    function(data){
        data = JSON.parse(data);
        var params = {
            debug: false,
            appId: data.data[0],
            timestamp: data.data[1],
            nonceStr: data.data[2],
            signature: data.data[3],
            jsApiList: ['onMenuShareAppMessage', 'onMenuShareTimeline']
        };


        wx.config(params);
        wx.ready(function () {
            setTimeout(wxshare, 500);
        });

        wx.error(function (res) {
            if (res.err_msg == "onMenuShareAppMessage:ok") {
                //alert("ok");
            }
            else if (res.err_msg == "onMenuShareAppMessage:cancel") {

            }
            else {
                //alert("shibai");
            }
        });
    },
    function(status, info){
        _CloseWaiting();
        mui.toast("系统错误，请稍候重试", {verticalAlign:"center", duration:"long"});
    });
}

function wxshare(){
    User = _getUser();

    var tempLink = wxlink;
    if(tempLink.indexOf('?')>=0){
        tempLink = wxlink+"&inviterId="+User.mobile;
    }
    else{
        tempLink = wxlink+"?inviterId="+User.mobile;
    }

    wx.onMenuShareTimeline({
        title: wxTitle,
        link: tempLink,
        imgUrl: wxImgUrl,
        trigger: function (res) {

        },
        success: function (res) {

        },
        cancel: function (res) {

        }
    });

    wx.onMenuShareAppMessage({
        title: wxTitle, // 分享标题
        desc: wxDesc, // 分享描述
        link: tempLink,
        imgUrl: wxImgUrl, // 分享图标
        type: 'link', // 分享类型,music、video或link，不填默认为link
        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
        success: function () {

        },
        cancel: function () {
            // 用户取消分享后执行的回调函数
            }
        });
    }

/*APP分享*/
function _InitPlusShare(){

    var ids = [{
        id: "weixin",
        ex: "WXSceneSession"
    }, {
        id: "weixin",
        ex: "WXSceneTimeline"
    },
//  {
//      id: "sinaweibo"
//  },
//  {
//      id: "tencentweibo"
//  },
    {
        id: "qq"
    }],/*弹出框信息*/
    bts = [{
        title: "发送给微信好友"
    }, {
        title: "分享到微信朋友圈"
    },
//  {
//      title: "分享到新浪微博"
//  },
//  {
//      title: "分享到腾讯微博"
//  },
    {
        title: "分享到QQ"
    }];/*弹出框文字*/


    plus.nativeUI.actionSheet({
        cancel: "取消",
        buttons: bts
    }, function(e) {
        var i = e.index;
        if (i > 0) {
            var s_id = ids[i - 1].id;
            var share = shares[s_id];
            if (share) {
                if (share.authenticated) {
                    shareMessage(share, ids[i - 1].ex);
                } else {
                    share.authorize(function() {
                        shareMessage(share, ids[i - 1].ex);
                    }, function(e) {
                        console.log("认证授权失败：" + e.code + " - " + e.message);
                    });
                }
            } else {
                mui.toast("无法获取分享服务，请检查manifest.json中分享插件参数配置，并重新打包")
            }
        }
    });
}
/*APP分享内容以及跳转*/
function shareMessage(share, ex) {

    var msg = {
        extra: {
            scene: ex
        }
    };
    User = _getUser();

    var tempLink = wxlink;
    if(tempLink.indexOf('?')>=0){
        tempLink = wxlink+"&inviterId="+User.mobile;
    }
    else{
        tempLink = wxlink+"?inviterId="+User.mobile;
    }

    msg.href = tempLink;
    msg.title = wxTitle;
    msg.content = wxDesc;
    if (~share.id.indexOf('weibo')) {
        msg.content += "；体验地址："+tempLink;
    }

    msg.thumbs = ["_www/img/180.png"];

    share.send(msg, function() {
        console.log("分享到\"" + share.description + "\"成功！ ");
    }, function(e) {
        console.log("分享到\"" + share.description + "\"失败: " + e.code + " - " + e.message);
    });
}

function _openProduct(id){
    _storeString(StorageKeys.Pid,id);
    _OpenWebview({
        url:"ProductDetail.html",
        id:"ProductDetail",
        extras:{pid:id},
        show:{
            autoShow: false
        },
        styles:{
            scrollIndicator: 'none',
            softinputMode:'adjustResize'
        }
    });
}

function _fixSubPageStatusBar(){
    if(PlatformInfo.name=="app"){
        if(plus.navigator.isImmersedStatusbar()){
            if(mui('.mui-content')[0]){
                mui('.mui-content')[0].style.paddingTop = (plus.navigator.getStatusbarHeight()+'px');
            }
        }
    }
}

function _checkLogin(){
    User = _getUser();

    if(User.id=="-1"){
        mui.confirm("访问此功能需先登录系统","微服",["去登录","先等等"],function(e){
            if(e.index==0){
                _OpenWebview({
                    id:'loginRegV2',
                    url:'loginRegV2.html',
                    show:{
                        autoShow:true
                    },
                    styles:{
                        scrollIndicator: 'none'
                    }
                });
                return false;
            }
            else{
                return false;
            }
        });
    }
    else{
        return true;
    }
}

function GetQueryString(name)
{
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)
        return  decodeURIComponent(r[2]);
    else
        return null;
}

function _APPGeoDetection(Callback){

    if(PlatformInfo.name!='app')
        return;

    var h8Obj = _getH8Object();

    if(h8Obj.city==''){
        //Callback('');

        plus.geolocation.getCurrentPosition( function ( p ) {
            console.log("success");
            h8Obj.city = p.address.city;

            _saveH8Object(h8Obj);
            Callback(h8Obj.city);
        },
        function ( e ) {
            mui.toast("定位失败，请手动选择城市");
            console.log("fail");
            _OpenWebview({
                url:'CityList.html',
                id:'CityList',
                styles:{
                    scrollIndicator: 'none'
                }
            });
        }, {timeout:3000});
    }
    else{
        Callback(h8Obj.city);
    }
}

function _WXGeoDetection(pageName, Callback){

    if(PlatformInfo.name!='web')
        return;

    var h8Obj = _getH8Object();

    if(h8Obj.city==''){
        Callback('');

        navigator.geolocation.getCurrentPosition(function(position){
            var lng = position.coords.longitude;
            var lat = position.coords.latitude;

            HTTPRequestFunc(
            "get",
            AppBaseConfig.apiURI+"AppHandler.ashx?api=geoDecode",
            {
                lat:lat,
                lng:lng
            },
            function(data){
                data = JSON.parse(data);
                if(data.status==0){
                    h8Obj.city = data.data;
                    _saveH8Object(h8Obj);
                    Callback(h8Obj.city);
                }
                else{
                    _storeString(StorageKeys.Temp, pageName);
                    location.href = "CityList.html";
                }
            },
            function(status, info){
                _storeString(StorageKeys.Temp, pageName);
                location.href = "CityList.html";
            });
        },
        function(error){
            _storeString(StorageKeys.Temp, pageName);
            location.href = "CityList.html";
        });
    }
    else{
        Callback(h8Obj.city);
    }
}

