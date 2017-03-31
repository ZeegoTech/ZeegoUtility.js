/**
* 网页，浏览器相关的操作库
*
* @class ZU.Page
*/

define(['./core.js'], function(ZU) {

    /**
    * 从网页地址里获取地址参数的值
    *
    * @method getQueryString
    * @param {string} name 参数的名字
    * @return {string} 参数的值
    */
    ZU.getQueryString = function(name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
        var r = window.location.search.substr(1).match(reg);

        if (r != null) {
            return decodeURIComponent(r[2]);
        } else {
            return null;
        }
    };

    /**
    * 加入收藏夹
    *
    * @method addFavorite
    * @param {string} sURL 收藏链接地址
    * @param {string} sTitle 收藏标题
    * @return {void} 加入失败会alert
    */
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

    /**
    * 设为首页
    *
    * @method setHomepage
    * @param {string} homeurl 链接地址
    * @return {void} 加入失败会alert
    */
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

    /**
    * 判断是否移动设备访问
    *
    * @method isMobileDevice
    * @return {boolean}
    */
    ZU.isMobileDevice = function () {
        return (/iphone|ipod|android.*mobile|windows.*phone|blackberry.*mobile/i.test(window.navigator.userAgent.toLowerCase()));
    };


    return ZU;
});
