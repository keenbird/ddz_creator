
import { default as string } from 'sprintf-js';

String.format = function (formatStr: string, ...params: (number | string)[]) {
    return string.sprintf(formatStr, ...params)
}

JSON.safeParse = function (text: string, reviver?: (this: any, key: string, value: any) => any) {
    try {
        return JSON.parse(text,reviver);
    } catch (error) {
        fw.printError(error);
    }
}

declare global {
    namespace globalThis {
        interface StringConstructor {
            format: (formatStr: string, ...params: (number | string)[]) => string;
        }
        interface JSON {
            safeParse(text: string, reviver?: (this: any, key: string, value: any) => any): any;
        }
    }
}