export class Base64 {
    /**加密键值 */
    public static _keyStr: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

    /**加密 */
    public static encode(str: string) {
        let output: string = "";
        let chr1: number, chr2: number, chr3: number, enc1: number, enc2: number, enc3: number, enc4: number;
        let i: number = 0;
        str = Base64._utf8_encode(str);
        while (i < str.length) {
            chr1 = str.charCodeAt(i++);
            chr2 = str.charCodeAt(i++);
            chr3 = str.charCodeAt(i++);
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }
            output = output +
                Base64._keyStr.charAt(enc1) + Base64._keyStr.charAt(enc2) +
                Base64._keyStr.charAt(enc3) + Base64._keyStr.charAt(enc4);
        }
        return output;
    }

    /**解密 */
    public static decode(str: string) {
        let output: string = "";
        let chr1: number, chr2: number, chr3: number, enc1: number, enc2: number, enc3: number, enc4: number;
        let i: number = 0;
        str = str.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while (i < str.length) {
            enc1 = Base64._keyStr.indexOf(str.charAt(i++));
            enc2 = Base64._keyStr.indexOf(str.charAt(i++));
            enc3 = Base64._keyStr.indexOf(str.charAt(i++));
            enc4 = Base64._keyStr.indexOf(str.charAt(i++));
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
            output = output + String.fromCharCode(chr1);
            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }
        }
        output = Base64._utf8_decode(output);
        return output;
    }

    public static _utf8_encode(string: string) {
        string = string.replace(/\r\n/g, "\n");
        let utftext: string = "";
        for (let n = 0; n < string.length; n++) {
            let c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }
        return utftext;
    }

    public static _utf8_decode(utftext: string) {
        let string = "";
        let i = 0;
        let c = 0, c1 = 0, c2 = 0;
        while (i < utftext.length) {
            c = utftext.charCodeAt(i);
            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            } else if ((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            } else {
                c2 = utftext.charCodeAt(i + 1);
                c1 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c1 & 63));
                i += 3;
            }
        }
        return string;
    }
}
