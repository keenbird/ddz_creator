declare module "cc" {
    namespace native {
        namespace fileUtils {
            /**
             * 解压zip
             * @param inFilePath zip文件路径
             * @param outFilePath 解压存放路径
             */
            function doUncompress(inFilePath: string, outFilePath: string): boolean
            /**
             * 压缩gz
             * @param inFilePath 文件路径
             * @param outFilePath 压缩存放路径
             */
            function doCompress(inFilePath: string, outFilePath: string): boolean
            /**
             * 写文件
             * @param fileData 二进制数据
             * @param filePath 文件路径
             */
            function writeDataToFile(fileData: Int8Array | Int16Array | Int32Array, filePath: string): boolean
            /**
             * 获取文件数据
             * @param filePath 文件路径
             */
            function getDataFromFile(filePath: string): ArrayBuffer
        }
    }
}

declare namespace jsb {
    namespace device {
        function setKeepScreenOn(keepScreenOn: boolean): void
    }
}