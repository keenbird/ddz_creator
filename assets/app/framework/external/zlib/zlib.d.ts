declare global {
    namespace globalThis {
        namespace Zlib {
            /**
             * @description
             * zip压缩
             * @example
             * var zip = new Zlib.Zip();
             * zip.addFile(Uint8ArrayData1, {
             *     filename: app.func.stringToByteArray(`foo.txt`)
             * });
             * zip.addFile(Uint8ArrayData2, {
             *     filename: app.func.stringToByteArray(`tt/foo.txt`)
             * });
             * var compressed = zip.compress();
             * //文件夹路径是否存在，不存在需要手动创建
             * native.fileUtils.writeDataToFile(compressed, native.fileUtils.getWritablePath() + `example/example.zip`)
             */
            class Zip {
                /**
                 * 添加一个压缩文件
                 */
                addFile: (fileData: Array<number> | Uint8Array, option: { filename: Array<number> | Uint8Array }) => void
                /**
                 * 压缩当前内容
                 * @returns 压缩有的Uint8Array数据
                 */
                compress: () => Uint8Array
            }
            /**
             * @description
             * zip解压
             * @example
             * var writablePath = native.fileUtils.getWritablePath();
             * var fileData = native.fileUtils.getDataFromFile(writablePath + `example.zip`);
             * var unzip = new Zlib.Unzip(new Uint8Array(fileData));
             * unzip.getFilenames().forEach(element => {
             *     var uint8ArrayData = unzip.decompress(element);
             *     //文件夹路径是否存在，不存在需要手动创建
             *     native.fileUtils.writeDataToFile(uint8ArrayData, writablePath + element);
             * });
             */
            class Unzip {
                /**
                 * 通过为进制数据构建
                 * @param data 
                 */
                constructor(data: Array<number> | Uint8Array)
                /**
                 * 获取压缩文件的文件列表
                 */
                getFilenames(): Array<string>
                /**
                 * 解压指定文件名
                 */
                decompress: (filename: string) => Array<number> | Uint8Array
            }
            /**
             * @description
             * 当前命名空间下并没有实现该函数，以下提供参考
             * @example
             * public stringToByteArray(str: string): Array<number> {
             *     var array = new Array(str.length);
             *     for (let i = 0, il = str.length; i < il; ++i) {
             *         array[i] = str.charCodeAt(i) & 0xff;
             *     }
             *     return array;
             * }
             */
            const stringToByteArray: (str: string) => Array<number>
        }
    }
}

export { }