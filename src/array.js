define(['./core.js'], function(ZU) {

    // ***删除数组中存在重复的元素*** //
    // someArray：数组
    ZU.getUniqueArray = function (someArray) {
        var tempArray = someArray.slice(0); // 复制数组到临时数组

        for (var i = 0; i < tempArray.length; i++) {

            for (var j = i + 1; j < tempArray.length;) {

                if (tempArray[j] == tempArray[i])
                    // 后面的元素若和待比较的相同，则删除并计数；
                    // 删除后，后面的元素会自动提前，所以指针j不移动
                {
                    tempArray.splice(j, 1);
                } else {
                    j++;
                }
                // 不同，则指针移动
            }
        }
        return tempArray;
    };

    // ***判断数组中是否存在重复的元素*** //
    // someArray：数组
    ZU.ifRepeatInArray = function (someArray) {
        var tempArray = someArray.slice(0); // 复制数组到临时数组

        for (var i = 0; i < tempArray.length; i++) {

            for (var j = i + 1; j < tempArray.length;) {

                if (tempArray[j] == tempArray[i])
                    // 后面的元素若和待比较的相同，则删除并计数；
                    // 删除后，后面的元素会自动提前，所以指针j不移动
                {
                    return true;
                } else {
                    j++;
                }
                // 不同，则指针移动
            }
        }
        return false;
    }

    // ***判断某个值是否在数组中*** //
    // someArray：数组
    // value: 数组项的值
    ZU.isInArray = function (someArray, value) {

        for (var i = 0; i < someArray.length; i++) {

            if (someArray[i] == value) {
                return true;
            }
        }

        return false;
    };

    // ***判断某个值在数组中的位置*** //
    // someArray：数组
    // value: 数组项的值
    ZU.indexInArray = function (someArray, value) {

        for (var i = 0; i < someArray.length; i++) {

            if (someArray[i] == e) {
                return i;
            }
        }

        return -1;
    };




    return ZU;
});
