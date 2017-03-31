/**
* 本地存储相关的操作库
*
* @class ZU.Storage
*/

define(['./core.js'], function(ZU) {

    /**
    * 存储JS对象到本地存储
    *
    * @method storeObject
    * @param {string} key 存储的key
    * @param {object} value 存储的对象
    */
    ZU.storeObject = function(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    };

    /**
    * 存储字符串到本地存储
    *
    * @method storeString
    * @param {string} key 存储的key
    * @param {string} value 存储的对象
    */
    ZU.storeString = function(key, value) {
        localStorage.setItem(key, value);
    };

    /**
    * 删除本地存储
    *
    * @method removeStorage
    * @param {string} key 存储的key
    */
    ZU.removeStorage = function(key) {
        localStorage.removeItem(key);
    };

    /**
    * 从本地存储获取JS对象
    *
    * @method retrieveObject
    * @param {string} key 存储的key
    * @return {object} JS对象
    */
    ZU.retrieveObject = function(key) {
        var objStr = localStorage.getItem(key);

        if (objStr === null) {
            return null;
        }

        return JSON.parse(objStr);
    };

    /**
    * 从本地存储获取字符串
    *
    * @method retrieveString
    * @param {string} key 存储的key
    * @return {string} 字符串
    */
    ZU.retrieveString = function(key) {
        return localStorage.getItem(key);
    };

    /**
    * 设置cookie值
    *
    * @method setCookie
    * @param {string} name cookie的名字
    * @param {string} value cookie的值
    * @param {number} hours 保存时间，小时
    * @param {string} domain 所在域名：例:zeego.cn
    */
    ZU.setCookie = function(name, value, hours, domain) {
        var d = new Date();
        var offset = 8;
        var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
        var nd = utc + (3600000 * offset);
        var exp = new Date(nd);
        exp.setTime(exp.getTime() + hours * 60 * 60 * 1000);
        document.cookie = name + '=' + escape(value) + ';path=/;expires=' + exp.toGMTString() + ';domain=' + domain + ';'
    };

    /**
    * 获取cookie值
    *
    * @method getCookie
    * @param {string} name cookie的名字
    * @return {string} cookie值
    */
    ZU.getCookie = function(name) {
        var arr = document.cookie.match(new RegExp('(^| )' + name + '=([^;]*)(;|$)'));

        if (arr != null) {
            return unescape(arr[2]);
        }

        return null;
    };

    return ZU;
});
