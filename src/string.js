define(['./core.js', './md5.js'], function(ZU, md5) {

    // ***获取随机的字符串，常常用在接口调用的时候，附带随机字符串*** //
    // length:字符串的长度，默认为15
    ZU.getNonceString = function(length) {
        length = length || 15;
        return Math.random().toString(36).substr(2, length);
    };

    // ***获得MD5加密后的字符串，支持多参数传入*** //
    // arguments：字符串，传入多个字符串的话，拼接了以后md5
    ZU.getMD5String = function() {
        var args = arguments;

        if (args.length <= 0) {
            return '';
        }

        var tempstr = '';

        for (var i in args) {
            tempstr += args[i];
        }

        var result = new md5().hex_md5(tempstr);

        return result;
    };

    // ***获得html编码后的字符串*** //
    // str：编码前的字符串
    ZU.htmlEncode = function(str) {
        var div = document.createElement('div');
        div.appendChild(document.createTextNode(str));
        return div.innerHTML;
    };

    // ***获得html解码后的字符串*** //
    // str：解码前的字符串
    ZU.htmlDecode = function(str) {
        var div = document.createElement('div');
        div.innerHTML = str;
        return div.innerText || div.textContent;
    };

    // ***删除首尾空字符*** //
    // str：字符串
    ZU.trim = function(str) {
        return str.replace(/(^\s*)|(\s*$)/g, '');
    };

    // ***删除左边空字符*** //
    // str：字符串
    ZU.trimLeft = function(str) {
        return str.replace(/(^\s*)/g, '');
    };

    // ***删除右边空字符*** //
    // str：字符串
    ZU.trimRight = function(str) {
        return str.replace(/(\s*$)/g, '');
    };


    // ***判断是否是空字符串*** //
    // str：字符串
    ZU.isNullString = function(str) {

        if (str == undefined || str == null || str == '' || ZU.trim(str) == '') {
            return true;
        }

        return false;
    };

    // ***验证是否是合法的身份证号码*** //
    // code：身份证号码
    ZU.verifyICNumber = function(code) {
        var city = {
            11: '北京',
            12: '天津',
            13: '河北',
            14: '山西',
            15: '内蒙古',
            21: '辽宁',
            22: '吉林',
            23: '黑龙江 ',
            31: '上海',
            32: '江苏',
            33: '浙江',
            34: '安徽',
            35: '福建',
            36: '江西',
            37: '山东',
            41: '河南',
            42: '湖北 ',
            43: '湖南',
            44: '广东',
            45: '广西',
            46: '海南',
            50: '重庆',
            51: '四川',
            52: '贵州',
            53: '云南',
            54: '西藏 ',
            61: '陕西',
            62: '甘肃',
            63: '青海',
            64: '宁夏',
            65: '新疆',
            71: '台湾',
            81: '香港',
            82: '澳门',
            91: '国外 '
        };

        var tip = '';
        var pass = true;

        if (!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)) {
            tip = '身份证号格式错误';
            pass = false;
        } else if (!city[code.substr(0, 2)]) {
            tip = '地址编码错误';
            pass = false;
        } else {
            // 18位身份证需要验证最后一位校验位
            if (code.length == 18) {
                code = code.split('');
                // ∑(ai×Wi)(mod 11)
                // 加权因子
                var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
                // 校验位
                var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
                var sum = 0;
                var ai = 0;
                var wi = 0;
                for (var i = 0; i < 17; i++) {
                    ai = code[i];
                    wi = factor[i];
                    sum += ai * wi;
                }
                var last = parity[sum % 11];

                if (last == 'X') {
                    if (last != code[17].toUpperCase()) {
                        tip = '校验位错误';
                        pass = false;
                    }
                } else {
                    if (parity[sum % 11] != code[17]) {
                        tip = '校验位错误';
                        pass = false;
                    }
                }
            }
        }
        // if(!pass) alert(tip);
        return pass;
    };

    // ***验证是否是合法的手机号码*** //
    // str：手机号码
    ZU.verifyMobile = function(str) {
        var pattern = /^1[23456789]\d{9}$/;

        if (pattern.test(str)) {
            return true;
        }

        return false;
    };

    // ***匹配国内电话号码(0511-4405222 或 021-87888822) *** //
    // str：固定电话号码
    ZU.verifyTelephone = function(str) {
        var result = str.match(/\d{3}-\d{8}|\d{4}-\d{7}/);

        if (result == null) {
            return false;
        }

        return true;
    };

    // ***判断输入是否是有效的电子邮件*** //
    // str：电子邮箱地址
    ZU.verifyEmail = function(str) {
        var result = str.match(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/);

        if (result == null) {
            return false;
        }

        return true;
    };

    // ***字符串超出省略*** //
    // str：字符串
    // len: 保留的位数
    ZU.cutString = function(str, len) {
        var wlength = str.replace(/[^\x00-\xff]/g, '**').length;

        if (wlength > len) {
            for (var k = len / 2; k < str.length; k++) {
                if (str.substr(0, k).replace(/[^\x00-\xff]/g, '**').length >= len) {
                    str = str.substr(0, k) + '...';
                    break;
                }
            }
        }

        return str;
    };

    // ***字符串替换全部*** //
    // str：字符串
    // s1: 需要替换的词
    // s2：替换后的词
    ZU.stringReplaceAll = function(str, s1, s2) {
        return str.replace(new RegExp(s1, 'gm'), s2);
    };


    // ***判断是否为网址*** //
    // strUrl：网址字符串
    ZU.isURLString = function(strUrl) {
        var regular = /^\b(((https?|ftp):\/\/)?[-a-z0-9]+(\.[-a-z0-9]+)*\.(?:com|edu|gov|int|mil|net|org|biz|info|name|museum|asia|coop|aero|[a-z][a-z]|((25[0-5])|(2[0-4]\d)|(1\d\d)|([1-9]\d)|\d))\b(\/[-a-z0-9_:\@&?=+,.!\/~%\$]*)?)$/i;

        if (regular.test(strUrl)) {
            return true;
        } else {
            return false;
        }
    };

    // ***获取字符串数值部分*** //
    // str：字符串
    ZU.getNumberFromString = function(str) {
        var value = str.replace(/[^(0-9).]/ig, '');
        return parseFloat(value);
    };

    return ZU;
});
