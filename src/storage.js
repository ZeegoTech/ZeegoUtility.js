define(['./core.js'], function(ZU) {

    // ***存储JS对象到本地存储*** //
    // key:存储的key
    // value:存储的对象
    ZU.storeObject = function(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    };

    // ***存储字符串到本地存储*** //
    // key:存储的key
    // value:存储的对象
    ZU.storeString = function(key, value) {
        localStorage.setItem(key, value);
    };

    // ***删除本地存储*** //
    // key:存储的key
    ZU.removeStorage = function(key) {
        localStorage.removeItem(key);
    };

    // ***从本地存储获取JS对象*** //
    // key:存储的key
    ZU.retrieveObject = function(key) {
        var objStr = localStorage.getItem(key);

        if (objStr === null) {
            return null;
        }

        return JSON.parse(objStr);
    };

    // ***从本地存储获取字符串*** //
    // key:存储的key
    ZU.retrieveString = function(key) {
        return localStorage.getItem(key);
    };

    return ZU;
});
