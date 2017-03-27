define(['./core.js','./md5.js'], function(ZU,md5) {

    /***获取随机的字符串，常常用在接口调用的时候，附带随机字符串***/
    //length:字符串的长度，默认为15
    ZU.getNonceString = function(length = 15) {
        return Math.random().toString(36).substr(2, length);
    };

    /***获得MD5加密后的字符串，支持多参数传入***/
    //arguments：字符串，传入多个字符串的话，拼接了以后md5
    ZU.getMD5String = function() {
        var args = arguments;
        if(args.length<=0)
            return '';

        var tempStr = '';
        for(i in args){
            tempStr+=args[i];
        }

        var result = new md5().hex_md5(tempStr);
        return result;
    };







    return ZU;
});
