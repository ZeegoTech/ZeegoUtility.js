define(['./core.js'], function(ZU) {

    // ***格式化日期 formatDate('yyyy_MM_dd hh:mm:ss:SS 星期w 第q季度')*** //
    // format：格式'yyyy_MM_dd hh:mm:ss:SS 星期w 第q季度'
    // date：要转化的日期，留空则为当前日期
    ZU.formatDate = function(format, date) {

        if (!date) {
            date = new Date();
        }

        var Week = ['日', '一', '二', '三', '四', '五', '六'];
        var o = {
            'y+': date.getYear(), // year
            'M+': date.getMonth() + 1, // month
            'd+': date.getDate(), // day
            'h+': date.getHours(), // hour
            'H+': date.getHours(), // hour
            'm+': date.getMinutes(), // minute
            's+': date.getSeconds(), // second
            'q+': Math.floor((date.getMonth() + 3) / 3), // quarter
            'S': date.getMilliseconds(), // millisecond
            'w': Week[date.getDay()]
        }

        if (/(y+)/.test(format)) {
            format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
        }

        for (var k in o) {

            if (new RegExp('(' + k + ')').test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
            }

        }

        return format;
    };

    return ZU;
});
