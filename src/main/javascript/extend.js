'use strict';
// API组 排序：按tags数组的次序
// TODO: 请填入需要的 tags
var tags = [];

var apisSorter = {
    default: function (a, b) {
        if (tags.indexOf(a.name) > -1 && tags.indexOf(b.name) > -1) {
            if (tags.indexOf(a.name) < tags.indexOf(b.name)) {
                return -1;
            }
            if (tags.indexOf(a.name) > tags.indexOf(b.name)) {
                return 1;
            }
        }
        return 0;
    }
}
