
// import { Base64 } from './Base64'

// /**加密算法 */
// export class Encrypt {
//     /**
//      * 加密
//      * @param plaintext 加密的内容
//      * @param password 加密的秘钥
//      * @param nBits 加密位数 128/192/256
//      * @returns 
//      */
//     public static encrypt(plaintext: string, password: string, nBits: number) {
//         let blockSize = 16;
//         if (!(nBits == 128 || nBits == 192 || nBits == 256)) return '';
//         plaintext = decodeURI(encodeURIComponent(plaintext));
//         password = decodeURI(encodeURIComponent(password));
//         let nBytes = nBits / 8;
//         let pwBytes = new Array(nBytes);
//         for (let i = 0; i < nBytes; i++) {
//             pwBytes[i] = isNaN(password.charCodeAt(i)) ? 0 : password.charCodeAt(i);
//         }
//         let key = Encrypt.cipher(pwBytes, Encrypt.keyExpansion(pwBytes));
//         key = key.concat(key.slice(0, nBytes - 16));
//         let counterBlock = new Array(blockSize);
//         let nonce = (new Date()).getTime();
//         let nonceMs = nonce % 1000;
//         let nonceSec = Math.floor(nonce / 1000);
//         let nonceRnd = Math.floor(Math.random() * 0xffff);
//         for (let i = 0; i < 2; i++) counterBlock[i] = (nonceMs >>> i * 8) & 0xff;
//         for (let i = 0; i < 2; i++) counterBlock[i + 2] = (nonceRnd >>> i * 8) & 0xff;
//         for (let i = 0; i < 4; i++) counterBlock[i + 4] = (nonceSec >>> i * 8) & 0xff;
//         let ctrTxt = '';
//         for (let i = 0; i < 8; i++) ctrTxt += String.fromCharCode(counterBlock[i]);
//         let keySchedule = Encrypt.keyExpansion(key);
//         let blockCount = Math.ceil(plaintext.length / blockSize);
//         let ciphertxt = new Array(blockCount);
//         for (let b = 0; b < blockCount; b++) {
//             for (let c = 0; c < 4; c++) counterBlock[15 - c] = (b >>> c * 8) & 0xff;
//             for (let c = 0; c < 4; c++) counterBlock[15 - c - 4] = (b / 0x100000000 >>> c * 8);
//             let cipherCntr = Encrypt.cipher(counterBlock, keySchedule);
//             let blockLength = b < blockCount - 1 ? blockSize : (plaintext.length - 1) % blockSize + 1;
//             let cipherChar = new Array(blockLength);
//             for (let i = 0; i < blockLength; i++) {
//                 cipherChar[i] = cipherCntr[i] ^ plaintext.charCodeAt(b * blockSize + i);
//                 cipherChar[i] = String.fromCharCode(cipherChar[i]);
//             }
//             ciphertxt[b] = cipherChar.join('');
//         }
//         let ciphertext = ctrTxt + ciphertxt.join('');
//         ciphertext = Base64.encode(ciphertext);
//         return ciphertext;
//     }

//     /**
//      * 解密
//      * @param ciphertext 解密的内容
//      * @param password 解密的秘钥
//      * @param nBits 解密位数 128/192/256
//      * @returns 
//      */
//     public static decrypt(ciphertext: string, password: string, nBits: number) {
//         let blockSize = 16;
//         if (!(nBits == 128 || nBits == 192 || nBits == 256)) return '';
//         ciphertext = Base64.decode(ciphertext);
//         password = decodeURI(encodeURIComponent(password));
//         let nBytes = nBits / 8;
//         let pwBytes = new Array(nBytes);
//         for (let i = 0; i < nBytes; i++) {
//             pwBytes[i] = isNaN(password.charCodeAt(i)) ? 0 : password.charCodeAt(i);
//         }
//         let key = Encrypt.cipher(pwBytes, Encrypt.keyExpansion(pwBytes));
//         key = key.concat(key.slice(0, nBytes - 16));
//         let counterBlock = new Array(8);
//         let ctrTxt = ciphertext.slice(0, 8);
//         for (let i = 0; i < 8; i++) counterBlock[i] = ctrTxt.charCodeAt(i);
//         let keySchedule = Encrypt.keyExpansion(key);
//         let nBlocks = Math.ceil((ciphertext.length - 8) / blockSize);
//         let ct = new Array(nBlocks);
//         for (let b = 0; b < nBlocks; b++) ct[b] = ciphertext.slice(8 + b * blockSize, 8 + b * blockSize + blockSize);
//         let plaintxt = new Array(ct.length);
//         for (let b = 0; b < nBlocks; b++) {
//             for (let c = 0; c < 4; c++) counterBlock[15 - c] = ((b) >>> c * 8) & 0xff;
//             for (let c = 0; c < 4; c++) counterBlock[15 - c - 4] = (((b + 1) / 0x100000000 - 1) >>> c * 8) & 0xff;
//             let cipherCntr = Encrypt.cipher(counterBlock, keySchedule);
//             let plaintxtByte = new Array(ct[b].length);
//             for (let i = 0; i < ct[b].length; i++) {
//                 plaintxtByte[i] = cipherCntr[i] ^ ct[b].charCodeAt(i);
//                 plaintxtByte[i] = String.fromCharCode(plaintxtByte[i]);
//             }
//             plaintxt[b] = plaintxtByte.join('');
//         }
//         let plaintext = plaintxt.join('');
//         try {
//             plaintext = decodeURIComponent(escape(plaintext));
//         } catch (e) {
//             return plaintext;
//         }
//         return plaintext;
//     }

//     private static sBox = [
//         0x63, 0x7c, 0x77, 0x7b, 0xf2, 0x6b, 0x6f, 0xc5, 0x30, 0x01, 0x67, 0x2b, 0xfe, 0xd7, 0xab, 0x76,
//         0xca, 0x82, 0xc9, 0x7d, 0xfa, 0x59, 0x47, 0xf0, 0xad, 0xd4, 0xa2, 0xaf, 0x9c, 0xa4, 0x72, 0xc0,
//         0xb7, 0xfd, 0x93, 0x26, 0x36, 0x3f, 0xf7, 0xcc, 0x34, 0xa5, 0xe5, 0xf1, 0x71, 0xd8, 0x31, 0x15,
//         0x04, 0xc7, 0x23, 0xc3, 0x18, 0x96, 0x05, 0x9a, 0x07, 0x12, 0x80, 0xe2, 0xeb, 0x27, 0xb2, 0x75,
//         0x09, 0x83, 0x2c, 0x1a, 0x1b, 0x6e, 0x5a, 0xa0, 0x52, 0x3b, 0xd6, 0xb3, 0x29, 0xe3, 0x2f, 0x84,
//         0x53, 0xd1, 0x00, 0xed, 0x20, 0xfc, 0xb1, 0x5b, 0x6a, 0xcb, 0xbe, 0x39, 0x4a, 0x4c, 0x58, 0xcf,
//         0xd0, 0xef, 0xaa, 0xfb, 0x43, 0x4d, 0x33, 0x85, 0x45, 0xf9, 0x02, 0x7f, 0x50, 0x3c, 0x9f, 0xa8,
//         0x51, 0xa3, 0x40, 0x8f, 0x92, 0x9d, 0x38, 0xf5, 0xbc, 0xb6, 0xda, 0x21, 0x10, 0xff, 0xf3, 0xd2,
//         0xcd, 0x0c, 0x13, 0xec, 0x5f, 0x97, 0x44, 0x17, 0xc4, 0xa7, 0x7e, 0x3d, 0x64, 0x5d, 0x19, 0x73,
//         0x60, 0x81, 0x4f, 0xdc, 0x22, 0x2a, 0x90, 0x88, 0x46, 0xee, 0xb8, 0x14, 0xde, 0x5e, 0x0b, 0xdb,
//         0xe0, 0x32, 0x3a, 0x0a, 0x49, 0x06, 0x24, 0x5c, 0xc2, 0xd3, 0xac, 0x62, 0x91, 0x95, 0xe4, 0x79,
//         0xe7, 0xc8, 0x37, 0x6d, 0x8d, 0xd5, 0x4e, 0xa9, 0x6c, 0x56, 0xf4, 0xea, 0x65, 0x7a, 0xae, 0x08,
//         0xba, 0x78, 0x25, 0x2e, 0x1c, 0xa6, 0xb4, 0xc6, 0xe8, 0xdd, 0x74, 0x1f, 0x4b, 0xbd, 0x8b, 0x8a,
//         0x70, 0x3e, 0xb5, 0x66, 0x48, 0x03, 0xf6, 0x0e, 0x61, 0x35, 0x57, 0xb9, 0x86, 0xc1, 0x1d, 0x9e,
//         0xe1, 0xf8, 0x98, 0x11, 0x69, 0xd9, 0x8e, 0x94, 0x9b, 0x1e, 0x87, 0xe9, 0xce, 0x55, 0x28, 0xdf,
//         0x8c, 0xa1, 0x89, 0x0d, 0xbf, 0xe6, 0x42, 0x68, 0x41, 0x99, 0x2d, 0x0f, 0xb0, 0x54, 0xbb, 0x16
//     ]

//     private static rCon = [
//         [0x00, 0x00, 0x00, 0x00],
//         [0x01, 0x00, 0x00, 0x00],
//         [0x02, 0x00, 0x00, 0x00],
//         [0x04, 0x00, 0x00, 0x00],
//         [0x08, 0x00, 0x00, 0x00],
//         [0x10, 0x00, 0x00, 0x00],
//         [0x20, 0x00, 0x00, 0x00],
//         [0x40, 0x00, 0x00, 0x00],
//         [0x80, 0x00, 0x00, 0x00],
//         [0x1b, 0x00, 0x00, 0x00],
//         [0x36, 0x00, 0x00, 0x00]
//     ]

//     private static cipher(input: Array<number>, w: Array<Array<number>>) {
//         const Nb = 4;
//         const Nr = w.length / Nb - 1;
//         let state = [[], [], [], []];
//         for (let i = 0; i < 4 * Nb; i++) state[i % 4][Math.floor(i / 4)] = input[i];
//         state = Encrypt.addRoundKey(state, w, 0, Nb);

//         for (let round = 1; round < Nr; round++) {
//             state = Encrypt.subBytes(state, Nb);
//             state = Encrypt.shiftRows(state, Nb);
//             state = Encrypt.mixColumns(state, Nb);
//             state = Encrypt.addRoundKey(state, w, round, Nb);
//         }

//         state = Encrypt.subBytes(state, Nb);
//         state = Encrypt.shiftRows(state, Nb);
//         state = Encrypt.addRoundKey(state, w, Nr, Nb);

//         let output = new Array(4 * Nb);
//         for (let i = 0; i < 4 * Nb; i++) output[i] = state[i % 4][Math.floor(i / 4)];

//         return output;
//     }

//     private static subBytes(s: Array<Array<number>>, Nb: number) {
//         for (let r = 0; r < 4; r++) {
//             for (let c = 0; c < Nb; c++) s[r][c] = Encrypt.sBox[s[r][c]];
//         }
//         return s;
//     }

//     private static addRoundKey(state: Array<Array<number>>, w: Array<Array<number>>, rnd: number, Nb: number) {
//         for (let r = 0; r < 4; r++) {
//             for (let c = 0; c < Nb; c++) state[r][c] ^= w[rnd * 4 + c][r];
//         }
//         return state;
//     }

//     private static shiftRows(s: Array<Array<number>>, Nb: number) {
//         let t = new Array(4);
//         for (let r = 1; r < 4; r++) {
//             for (let c = 0; c < 4; c++) t[c] = s[r][(c + r) % Nb];
//             for (let c = 0; c < 4; c++) s[r][c] = t[c];
//         }
//         return s;
//     }

//     private static mixColumns(s: Array<Array<number>>, Nb: number) {
//         for (let c = 0; c < 4; c++) {
//             let a = new Array(4);
//             let b = new Array(4);
//             for (let i = 0; i < 4; i++) {
//                 a[i] = s[i][c];
//                 b[i] = s[i][c] & 0x80 ? s[i][c] << 1 ^ 0x011b : s[i][c] << 1;
//             }
//             s[0][c] = b[0] ^ a[1] ^ b[1] ^ a[2] ^ a[3];
//             s[1][c] = a[0] ^ b[1] ^ a[2] ^ b[2] ^ a[3];
//             s[2][c] = a[0] ^ a[1] ^ b[2] ^ a[3] ^ b[3];
//             s[3][c] = a[0] ^ b[0] ^ a[1] ^ a[2] ^ b[3];
//         }
//         return s;
//     }

//     private static keyExpansion(key: Array<number>) {
//         let Nb = 4;
//         let Nk = key.length / 4;
//         let Nr = Nk + 6;

//         let w = new Array(Nb * (Nr + 1));
//         let temp = new Array(4);

//         for (let i = 0; i < Nk; i++) {
//             let r = [key[4 * i], key[4 * i + 1], key[4 * i + 2], key[4 * i + 3]];
//             w[i] = r;
//         }

//         for (let i = Nk; i < (Nb * (Nr + 1)); i++) {
//             w[i] = new Array(4);
//             for (let t = 0; t < 4; t++) temp[t] = w[i - 1][t];
//             if (i % Nk == 0) {
//                 temp = Encrypt.subWord(Encrypt.rotWord(temp));
//                 for (let t = 0; t < 4; t++) temp[t] ^= Encrypt.rCon[i / Nk][t];
//             } else if (Nk > 6 && i % Nk == 4) {
//                 temp = Encrypt.subWord(temp);
//             }
//             for (let t = 0; t < 4; t++) w[i][t] = w[i - Nk][t] ^ temp[t];
//         }

//         return w;
//     }

//     private static subWord(w: Array<number>) {
//         for (let i = 0; i < 4; i++) {
//             w[i] = Encrypt.sBox[w[i]]
//         }
//         return w;
//     }

//     private static rotWord(w: Array<number>) {
//         let tmp = w[0];
//         for (let i = 0; i < 3; i++) w[i] = w[i + 1];
//         w[3] = tmp;
//         return w;
//     }
// }

// window['Encrypt'] = Encrypt;