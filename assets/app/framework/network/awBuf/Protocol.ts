import { isValid } from "cc";
import { GS_HeadNull_Size, S_GS_HeadNull } from "../../../config/NetConfig";
import { IProtocolHelper } from "../lib/NetInterface";

export class AwBufProtocol implements IProtocolHelper {
    getHeadlen(): number {
        return GS_HeadNull_Size;
    }
    getHearbeat(): ArrayBuffer {
        return isValid(center, true) && center.gateway.getHearbeat();
    }
    checkPackage(buffer: ArrayBuffer): boolean {
        if (buffer.byteLength <= GS_HeadNull_Size)
            return false;
        return true;
    }
    getPackageId(buffer: ArrayBuffer): number {
        let pHead = S_GS_HeadNull;
        pHead.initArrayBuffer(buffer);
        return pHead.RootID;
    }
}