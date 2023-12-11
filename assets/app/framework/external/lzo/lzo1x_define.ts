export interface lzo1x_state {
    inputBuffer: number[] | ArrayBuffer,
    outputBuffer: Uint8Array,
}

export interface lzo1x_cfg {
    outputSize?: number | string,
    blockSize?: number | string,
}

export enum lzo1x_ret {
    OK = 0,
    INPUT_OVERRUN = -4,
    OUTPUT_OVERRUN = -5,
    LOOKBEHIND_OVERRUN = -6,
    EOF_FOUND = -999,
}