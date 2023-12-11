import { EDITOR } from 'cc/env';
if (!EDITOR) {
    /**
     * 时间格式化 1990-01-02 1:1:1
     * new Date().format('yyyy-MM-dd h:m:s')
     */
    Date.prototype.format = function (format) {
        let hours = this.getHours()
        let month = this.getMonth()
        var date = {
            "M+": month + 1,
            "d+": this.getDate(),
            "i+": hours % 12,
            "h+": hours,
            "m+": this.getMinutes(),
            "s+": this.getSeconds(),
            "q+": Math.floor((month + 3) / 3),
            "S+": this.getMilliseconds()
        };
        if (/(y+)/i.test(format)) {
            format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
        }
        for (var k in date) {
            if (new RegExp("(" + k + ")").test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length == 1
                    ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
            }
        }
        if (/(p+)/i.test(format)) {
            format = format.replace(RegExp.$1, hours >= 12 ? 'pm' : 'am');
        }
        if (/(P+)/i.test(format)) {
            format = format.replace(RegExp.$1, hours >= 12 ? 'PM' : 'AM');
        }
        return format;
    }
}

declare global {
    namespace globalThis {
        interface Date {
            format: (format: string) => string
        }
    }
}