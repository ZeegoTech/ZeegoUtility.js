define(['./core.js'], function(ZU) {

    // ***从网页地址里获取地址参数的值*** //
    // name：参数的名字
    ZU.getQueryString = function(name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
        var r = window.location.search.substr(1).match(reg);

        if (r != null) {
            return decodeURIComponent(r[2]);
        } else {
            return null;
        }
    };

    // ***设置cookie值*** //
    // name：cookie的名字
    // value：cookie的值
    // hours：保存时间，小时
    // domain：所在域名：例:zeego.cn
    ZU.setCookie = function(name, value, hours, domain) {
        var d = new Date();
        var offset = 8;
        var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
        var nd = utc + (3600000 * offset);
        var exp = new Date(nd);
        exp.setTime(exp.getTime() + hours * 60 * 60 * 1000);
        document.cookie = name + '=' + escape(value) + ';path=/;expires=' + exp.toGMTString() + ';domain=' + domain + ';'
    };

    // ***获取cookie值*** //
    // name：cookie的名字
    ZU.getCookie = function(name) {
        var arr = document.cookie.match(new RegExp('(^| )' + name + '=([^;]*)(;|$)'));

        if (arr != null) {
            return unescape(arr[2]);
        }

        return null;
    };

    // ***加入收藏夹*** //
    // sURL：收藏链接地址
    // sTitle：收藏标题
    ZU.addFavorite = function(sURL, sTitle) {
        try {
            window.external.addFavorite(sURL, sTitle);
        } catch (e) {
            try {
                window.sidebar.addPanel(sTitle, sURL, '');
            } catch (e) {
                alert('加入收藏失败，请使用Ctrl+D进行添加');
            }
        }
    };

    // ***设为首页*** //
    // homeurl：链接地址
    ZU.setHomepage = function(homeurl) {

        if (document.all) {
            document.body.style.behavior = 'url(#default#homepage)';
            document.body.setHomePage(homeurl);
        } else if (window.sidebar) {

            if (window.netscape) {
                try {
                    netscape.security.PrivilegeManager.enablePrivilege('UniversalXPConnect');
                } catch (e) {
                    alert('该操作被浏览器拒绝，如果想启用该功能，请在地址栏内输入about:config,然后将项 signed.applets.codebase_principal_support 值该为true');
                }
            }

            var prefs = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch);
            prefs.setCharPref('browser.startup.homepage', homeurl);
        }
    };

    // ***判断是否移动设备访问*** //
    ZU.isMobileDevice = function () {
        return (/iphone|ipod|android.*mobile|windows.*phone|blackberry.*mobile/i.test(window.navigator.userAgent.toLowerCase()));
    };


    return ZU;
});
