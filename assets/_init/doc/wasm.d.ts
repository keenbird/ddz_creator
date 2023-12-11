// WASM 相关
// 环境配置：
// git clone https://github.com/emscripten-core/emsdk.git
// cd emsdk
// git pull
// ./emsdk install latest
// ./emsdk activate latest
// ./emsdk_env.bat
// emcc -v
// emcc --help

// 编译
// .\emcc .\test.c -Os -s WASM=1 -s SIDE_MODULE=1 -o test.wasm
// 优化级别：
// -O0：无优化。保持源代码结构，方便调试。
// -O1：基本优化。简单的优化，可以提升执行速度。
// -O2：更高级的优化。更深层次的代码优化，但可能会增加编译时间。
// -O3：最高级的优化。可能会引入更多优化，但也可能增加编译时间。

// 代码尺寸优化：
// -Os：优化代码尺寸，以便在减小文件大小方面表现良好。

// 内存设置：
// -s TOTAL_MEMORY=X：设置模块的内存大小，适当大小可提高性能。

// 异步加载：
// -s ASYNCIFY=1：启用异步加载支持，优化模块加载和执行。

// 禁用浮点数优化：
// -s NO_EXIT_RUNTIME=1：禁用对浮点数操作的某些优化，有时可避免精度问题。

// 独立模块：
// -s SIDE_MODULE=1：生成独立的 Wasm 模块，适用于创建可以通过异步加载的小模块。

// 导出函数：
// -s EXPORTED_FUNCTIONS=["_functionName"]：指定要从模块导出的函数，供 JavaScript 调用。

// 内存对齐：
// -s ALIGN_MEMORY=1：启用内存对齐，可能提升内存操作效率。

// 忽略无效的导入：
// -s ERROR_ON_UNDEFINED_SYMBOLS=0：忽略无效的导入，适用于避免一些错误。

// 优化布局：
// -s WASM_OBJECT_FILES=0：优化 Wasm 模块的布局，可提升加载效率。

// 启用 SIMD：
// -s SIMD=1：启用 SIMD（单指令、多数据）支持，适用于处理大量数据。

// 自定义模块名称：
// -s MODULARIZE=1 -s EXPORT_NAME="MyModule"：为模块指定自定义名称，使其更易于在 JavaScript 中使用。

// 禁用压缩：
// -s BINARYEN_ASYNC_COMPILATION=0 -s BINARYEN_METHOD="'native-wasm'"：禁用压缩，以便分析模块。

// 导入模块：
// -s IMPORTED_MEMORY=1 -s IMPORTED_TABLE=1 -s "EXTRA_EXPORTED_RUNTIME_METHODS=['cwrap', 'addFunction']"：导入外部模块，用于与其他代码进行交互。

// 使用：
// this.loadBundleRes(fw.BundleConfig.update.res[`selectServer/test`], BufferAsset, async (response: BufferAsset) => {
//     if (response) {
//         // Step 1: 加载 Wasm 文件
//         const wasmBinary = response.buffer();
//         // 在这里提供模块需要导入的函数或变量
//         const imports = {
//             wasi_snapshot_preview1: new Proxy({}, {
//                 get(target: any, p: string, receiver: any): any {
//                     let value = Reflect.get(target, p, receiver);
//                     if (value == undefined) {
//                         value = (...data: any[]) => {
//                             fw.print(...data);
//                         };
//                         Reflect.set(target, p, value);
//                     }
//                     return value;
//                 }
//             }),
//             env: new Proxy({
//                 /**内存对象 */
//                 memory: new WebAssembly.Memory({ initial: 256, maximum: 256 }),
//                 /**内存偏移量 */
//                 __memory_base: 0,
//                 /**表格对象 */
//                 table: new WebAssembly.Table({ initial: 0, maximum: 0, element: 'anyfunc' }),
//                 /**表格偏移量 */
//                 __table_base: 0,
//                 /**终止函数 */
//                 abort: () => console.error('WebAssembly program aborted'),
//             }, {
//                 get(target: any, p: string, receiver: any): any {
//                     let value = Reflect.get(target, p, receiver);
//                     if (value == undefined) {
//                         value = (...data: any[]) => {
//                             fw.print(...data);
//                         };
//                         Reflect.set(target, p, value);
//                     }
//                     return value;
//                 }
//             }),
//         };
//         // Step 2: 实例化 Wasm 模块
//         const wasmModule = await WebAssembly.instantiate(wasmBinary, imports);
//         // Step 3: 获取导出函数
//         const wasmExports: any = wasmModule.instance.exports;
//         // Step 4: 调用 Wasm 函数
//         const result = wasmExports.add();
//         // 打印结果
//         fw.print(result);
//     }
// });