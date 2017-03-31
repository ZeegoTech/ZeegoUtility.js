/**
* 数组相关的操作库
*
* @class ZU.Array
*/

define(['./core.js'], function(ZU) {

    /**
    * 删除数组中存在重复的元素
    *
    * @method getUniqueArray
    * @param {Array} someArray 数组
    * @return {Array} 删除重复后的数组
    */
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

    /**
    * 判断数组中是否存在重复的元素
    *
    * @method ifRepeatInArray
    * @param {Array} someArray 数组
    * @return {boolean} 是否存在重复
    */
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

    /**
    * 判断某个值是否在数组中
    *
    * @method isInArray
    * @param {Array} someArray 数组
    * @param {object} value 值
    * @return {boolean} 是否在数组中
    */
    ZU.isInArray = function (someArray, value) {

        for (var i = 0; i < someArray.length; i++) {

            if (someArray[i] == value) {
                return true;
            }
        }

        return false;
    };

    /**
    * 判断某个值在数组中的位置
    *
    * @method indexInArray
    * @param {Array} someArray 数组
    * @param {object} value 值
    * @return {number} 在数组中的位置
    */
    ZU.indexInArray = function (someArray, value) {

        for (var i = 0; i < someArray.length; i++) {

            if (someArray[i] == value) {
                return i;
            }
        }

        return -1;
    };




    return ZU;
});
