import { ByteStream } from "../lib/NetInterface";

// 类型定义, 顺序不可变!!
enum EInetType {
    eInetSInt8,			// normal
    eInetUInt8,
    eInetSInt16,
    eInetUInt16,
    eInetSInt32,
    eInetUInt32,
    eInetSInt64,
    eInetUInt64,
    eInetBool,
    eInetFloat,
    eInetDouble,
    eInetString,
    eInetWString,
    eInetStruct,

    eInetSInt8Array,   // array
    eInetUInt8Array,
    eInetSInt16Array,
    eInetUInt16Array,
    eInetSInt32Array,
    eInetUInt32Array,
    eInetSInt64Array,
    eInetUInt64Array,
    eInetBoolArray,
    eInetFloatArray,
    eInetDoubleArray,
    eInetStringArray,
    eInetWStringArray,
    eInetStructArray,

    eInetSInt8InfiniteArray,   // infinite array
    eInetUInt8InfiniteArray,
    eInetSInt16InfiniteArray,
    eInetUInt16InfiniteArray,
    eInetSInt32InfiniteArray,
    eInetUInt32InfiniteArray,
    eInetSInt64InfiniteArray,
    eInetUInt64InfiniteArray,
    eInetBoolInfiniteArray,
    eInetFloatInfiniteArray,
    eInetDoubleInfiniteArray,
    eInetStringInfiniteArray,
    eInetWStringInfiniteArray,
    eInetStructInfiniteArray,

    eInetSInt8DynamicArray,   // dynamic array
    eInetUInt8DynamicArray,
    eInetSInt16DynamicArray,
    eInetUInt16DynamicArray,
    eInetSInt32DynamicArray,
    eInetUInt32DynamicArray,
    eInetSInt64DynamicArray,
    eInetUInt64DynamicArray,
    eInetBoolDynamicArray,
    eInetFloatDynamicArray,
    eInetDoubleDynamicArray,
    eInetStringDynamicArray,
    eInetWStringDynamicArray,
    eInetStructDynamicArray,

    eInetTypeMax,
};

class SMember {
    eType: EInetType;// 类型
    strName: string;// 名称
}

class SStruct {
    strName: string; // 结构体名称
    vecMember: SMember[] = [];// 成员列表
    mapStructName: Map<string, string> = new Map(); // 成员 -> 结构体名称映射表
    mapDynamicKeyName: Map<string, string> = new Map(); // 成员 -> 动态数组key映射表
    mapArrayLen: Map<string, number> = new Map(); // 成员 -> 数组长度映射表
}
export type SInetByteStream = ByteStream
export type FunHandle = (pStruct: SStruct, pMember: SMember, pStream: SInetByteStream, params?, tab?) => any;

function stringToByte(str) {
    var bytes = new Array();
    var len, c;
    len = str.length;
    for (var i = 0; i < len; i++) {
        c = str.charCodeAt(i);
        if (c >= 0x010000 && c <= 0x10FFFF) {
            bytes.push(((c >> 18) & 0x07) | 0xF0);
            bytes.push(((c >> 12) & 0x3F) | 0x80);
            bytes.push(((c >> 6) & 0x3F) | 0x80);
            bytes.push((c & 0x3F) | 0x80);
        } else if (c >= 0x000800 && c <= 0x00FFFF) {
            bytes.push(((c >> 12) & 0x0F) | 0xE0);
            bytes.push(((c >> 6) & 0x3F) | 0x80);
            bytes.push((c & 0x3F) | 0x80);
        } else if (c >= 0x000080 && c <= 0x0007FF) {
            bytes.push(((c >> 6) & 0x1F) | 0xC0);
            bytes.push((c & 0x3F) | 0x80);
        } else {
            bytes.push(c & 0xFF);
        }
    }
    return bytes;
}

function stringToWCharByte(str) {
    var bytes = new Array();
    var len, c;
    len = str.length;
    for (var i = 0; i < len; i++) {
        c = str.charCodeAt(i);
        if (c >= 0x010000 && c <= 0x10FFFF) {
            bytes.push(((c >> 18) & 0x07) | 0xF0);
            bytes.push(((c >> 12) & 0x3F) | 0x80);
            bytes.push(((c >> 6) & 0x3F) | 0x80);
            bytes.push((c & 0x3F) | 0x80);
        } else if (c >= 0x000800 && c <= 0x00FFFF) {
            bytes.push(0)
            bytes.push(((c >> 12) & 0x0F) | 0xE0);
            bytes.push(((c >> 6) & 0x3F) | 0x80);
            bytes.push((c & 0x3F) | 0x80);
        } else if (c >= 0x000080 && c <= 0x0007FF) {
            bytes.push(((c >> 6) & 0x1F) | 0xC0);
            bytes.push((c & 0x3F) | 0x80);
        } else {
            bytes.push(0)
            bytes.push(c & 0xFF);
        }
    }
    return bytes;
}

function byteToString(arr) {
    if (typeof arr === 'string') {
        return arr;
    }
    var str = '',
        _arr = arr;
    for (var i = 0; i < _arr.length; i++) {
        var one = _arr[i].toString(2),
            v = one.match(/^1+?(?=0)/);
        if (v && one.length == 8) {
            var bytesLength = v[0].length;
            var store = _arr[i].toString(2).slice(7 - bytesLength);
            for (var st = 1; st < bytesLength; st++) {
                store += _arr[st + i].toString(2).slice(2);
            }
            str += String.fromCharCode(parseInt(store, 2));
            i += bytesLength - 1;
        } else {
            str += String.fromCharCode(_arr[i]);
        }
    }
    return str;
}
// utf-8
function wCharbyteToString(arr) {
    if (typeof arr === 'string') {
        return arr;
    }
    var str = '',
        _arr = arr;
    for (var i = 0; i < _arr.length; i++) {
        if (_arr[i] == 0) continue;
        var one = _arr[i].toString(2),
            v = one.match(/^1+?(?=0)/);
        if (v && one.length == 8) {
            var bytesLength = v[0].length;
            var store = _arr[i].toString(2).slice(7 - bytesLength);
            for (var st = 1; st < bytesLength; st++) {
                store += _arr[st + i].toString(2).slice(2);
            }
            str += String.fromCharCode(parseInt(store, 2));
            i += bytesLength - 1;
        } else {
            str += String.fromCharCode(_arr[i]);
        }
    }
    return str;
}

// unicode
function wCharbyteUnicodeToString(arr) {
    if (typeof arr === 'string') {
        return arr;
    }
    var str = '',
        _arr = arr;
    for (var i = 0; i < _arr.length; i += 2) {
        var bytesLength = 2;
        var store = _arr[i].toString(16);
        for (var st = 1; st < bytesLength; st++) {
            store += _arr[st + i].toString(16);
        }
        str += String.fromCharCode(parseInt(store, 16));
    }
    return str;
}


export class InetStruct {
    m_mapStruct: Map<string, SStruct> = new Map();;
    m_pEntryStruct: SStruct;
    m_handleFunRead: FunHandle[] = [];
    m_handleFunWrite: FunHandle[] = [];

    constructor() {
        // read
        this.m_handleFunRead[EInetType.eInetSInt8] = this.ReadSInt8ToTable.bind(this);
        this.m_handleFunRead[EInetType.eInetUInt8] = this.ReadUInt8ToTable.bind(this);
        this.m_handleFunRead[EInetType.eInetSInt16] = this.ReadSInt16ToTable.bind(this);
        this.m_handleFunRead[EInetType.eInetUInt16] = this.ReadUInt16ToTable.bind(this);
        this.m_handleFunRead[EInetType.eInetSInt32] = this.ReadSInt32ToTable.bind(this);
        this.m_handleFunRead[EInetType.eInetUInt32] = this.ReadUInt32ToTable.bind(this);
        this.m_handleFunRead[EInetType.eInetSInt64] = this.ReadSInt64ToTable.bind(this);
        this.m_handleFunRead[EInetType.eInetUInt64] = this.ReadUInt64ToTable.bind(this);
        this.m_handleFunRead[EInetType.eInetBool] = this.ReadBoolToTable.bind(this);
        this.m_handleFunRead[EInetType.eInetFloat] = this.ReadFloatToTable.bind(this);
        this.m_handleFunRead[EInetType.eInetDouble] = this.ReadDoubleToTable.bind(this);
        this.m_handleFunRead[EInetType.eInetString] = this.ReadStringToTable.bind(this);
        this.m_handleFunRead[EInetType.eInetWString] = this.ReadWStringToTable.bind(this);
        this.m_handleFunRead[EInetType.eInetStruct] = this.ReadStructToTable.bind(this);

        this.m_handleFunRead[EInetType.eInetSInt8Array] = this.ReadSInt8ArrayToTable.bind(this);
        this.m_handleFunRead[EInetType.eInetUInt8Array] = this.ReadUInt8ArrayToTable.bind(this);
        this.m_handleFunRead[EInetType.eInetSInt16Array] = this.ReadSInt16ArrayToTable.bind(this);
        this.m_handleFunRead[EInetType.eInetUInt16Array] = this.ReadUInt16ArrayToTable.bind(this);
        this.m_handleFunRead[EInetType.eInetSInt32Array] = this.ReadSInt32ArrayToTable.bind(this);
        this.m_handleFunRead[EInetType.eInetUInt32Array] = this.ReadUInt32ArrayToTable.bind(this);
        this.m_handleFunRead[EInetType.eInetSInt64Array] = this.ReadSInt64ArrayToTable.bind(this);
        this.m_handleFunRead[EInetType.eInetUInt64Array] = this.ReadUInt64ArrayToTable.bind(this);
        this.m_handleFunRead[EInetType.eInetBoolArray] = this.ReadBoolArrayToTable.bind(this);
        this.m_handleFunRead[EInetType.eInetFloatArray] = this.ReadFloatArrayToTable.bind(this);
        this.m_handleFunRead[EInetType.eInetDoubleArray] = this.ReadDoubleArrayToTable.bind(this);
        this.m_handleFunRead[EInetType.eInetStringArray] = this.ReadStringArrayToTable.bind(this);
        this.m_handleFunRead[EInetType.eInetWStringArray] = this.ReadWStringArrayToTable.bind(this);
        this.m_handleFunRead[EInetType.eInetStructArray] = this.ReadStructArrayToTable.bind(this);

        this.m_handleFunRead[EInetType.eInetSInt8InfiniteArray] = this.ReadSInt8InfiniteArrayToTable.bind(this);
        this.m_handleFunRead[EInetType.eInetUInt8InfiniteArray] = this.ReadUInt8InfiniteArrayToTable.bind(this);
        this.m_handleFunRead[EInetType.eInetSInt16InfiniteArray] = this.ReadSInt16InfiniteArrayToTable.bind(this);
        this.m_handleFunRead[EInetType.eInetUInt16InfiniteArray] = this.ReadUInt16InfiniteArrayToTable.bind(this);
        this.m_handleFunRead[EInetType.eInetSInt32InfiniteArray] = this.ReadSInt32InfiniteArrayToTable.bind(this);
        this.m_handleFunRead[EInetType.eInetUInt32InfiniteArray] = this.ReadUInt32InfiniteArrayToTable.bind(this);
        this.m_handleFunRead[EInetType.eInetSInt64InfiniteArray] = this.ReadSInt64InfiniteArrayToTable.bind(this);
        this.m_handleFunRead[EInetType.eInetUInt64InfiniteArray] = this.ReadUInt64InfiniteArrayToTable.bind(this);
        this.m_handleFunRead[EInetType.eInetBoolInfiniteArray] = this.ReadBoolInfiniteArrayToTable.bind(this);
        this.m_handleFunRead[EInetType.eInetFloatInfiniteArray] = this.ReadFloatInfiniteArrayToTable.bind(this);
        this.m_handleFunRead[EInetType.eInetDoubleInfiniteArray] = this.ReadDoubleInfiniteArrayToTable.bind(this);
        this.m_handleFunRead[EInetType.eInetStringInfiniteArray] = this.ReadStringInfiniteArrayToTable.bind(this);
        this.m_handleFunRead[EInetType.eInetWStringInfiniteArray] = this.ReadWStringInfiniteArrayToTable.bind(this);
        this.m_handleFunRead[EInetType.eInetStructInfiniteArray] = this.ReadStructInfiniteArrayToTable.bind(this);

        this.m_handleFunRead[EInetType.eInetSInt8DynamicArray] = this.ReadSInt8DynamicArrayToTable.bind(this);
        this.m_handleFunRead[EInetType.eInetUInt8DynamicArray] = this.ReadUInt8DynamicArrayToTable.bind(this);
        this.m_handleFunRead[EInetType.eInetSInt16DynamicArray] = this.ReadSInt16DynamicArrayToTable.bind(this);
        this.m_handleFunRead[EInetType.eInetUInt16DynamicArray] = this.ReadUInt16DynamicArrayToTable.bind(this);
        this.m_handleFunRead[EInetType.eInetSInt32DynamicArray] = this.ReadSInt32DynamicArrayToTable.bind(this);
        this.m_handleFunRead[EInetType.eInetUInt32DynamicArray] = this.ReadUInt32DynamicArrayToTable.bind(this);
        this.m_handleFunRead[EInetType.eInetSInt64DynamicArray] = this.ReadSInt64DynamicArrayToTable.bind(this);
        this.m_handleFunRead[EInetType.eInetUInt64DynamicArray] = this.ReadUInt64DynamicArrayToTable.bind(this);
        this.m_handleFunRead[EInetType.eInetBoolDynamicArray] = this.ReadBoolDynamicArrayToTable.bind(this);
        this.m_handleFunRead[EInetType.eInetFloatDynamicArray] = this.ReadFloatDynamicArrayToTable.bind(this);
        this.m_handleFunRead[EInetType.eInetDoubleDynamicArray] = this.ReadDoubleDynamicArrayToTable.bind(this);
        this.m_handleFunRead[EInetType.eInetStringDynamicArray] = this.ReadStringDynamicArrayToTable.bind(this);
        this.m_handleFunRead[EInetType.eInetWStringDynamicArray] = this.ReadWStringDynamicArrayToTable.bind(this);
        this.m_handleFunRead[EInetType.eInetStructDynamicArray] = this.ReadStructDynamicArrayToTable.bind(this);

        // write
        this.m_handleFunWrite[EInetType.eInetSInt8] = this.WriteSInt8ToByteStream.bind(this);
        this.m_handleFunWrite[EInetType.eInetUInt8] = this.WriteUInt8ToByteStream.bind(this);
        this.m_handleFunWrite[EInetType.eInetSInt16] = this.WriteSInt16ToByteStream.bind(this);
        this.m_handleFunWrite[EInetType.eInetUInt16] = this.WriteUInt16ToByteStream.bind(this);
        this.m_handleFunWrite[EInetType.eInetSInt32] = this.WriteSInt32ToByteStream.bind(this);
        this.m_handleFunWrite[EInetType.eInetUInt32] = this.WriteUInt32ToByteStream.bind(this);
        this.m_handleFunWrite[EInetType.eInetSInt64] = this.WriteSInt64ToByteStream.bind(this);
        this.m_handleFunWrite[EInetType.eInetUInt64] = this.WriteUInt64ToByteStream.bind(this);
        this.m_handleFunWrite[EInetType.eInetBool] = this.WriteBoolToByteStream.bind(this);
        this.m_handleFunWrite[EInetType.eInetFloat] = this.WriteFloatToByteStream.bind(this);
        this.m_handleFunWrite[EInetType.eInetDouble] = this.WriteDoubleToByteStream.bind(this);
        this.m_handleFunWrite[EInetType.eInetString] = this.WriteStringToByteStream.bind(this);
        this.m_handleFunWrite[EInetType.eInetWString] = this.WriteWStringToByteStream.bind(this);
        this.m_handleFunWrite[EInetType.eInetStruct] = this.WriteStructToByteStream.bind(this);

        this.m_handleFunWrite[EInetType.eInetSInt8Array] = this.WriteSInt8ArrayToByteStream.bind(this);
        this.m_handleFunWrite[EInetType.eInetUInt8Array] = this.WriteUInt8ArrayToByteStream.bind(this);
        this.m_handleFunWrite[EInetType.eInetSInt16Array] = this.WriteSInt16ArrayToByteStream.bind(this);
        this.m_handleFunWrite[EInetType.eInetUInt16Array] = this.WriteUInt16ArrayToByteStream.bind(this);
        this.m_handleFunWrite[EInetType.eInetSInt32Array] = this.WriteSInt32ArrayToByteStream.bind(this);
        this.m_handleFunWrite[EInetType.eInetUInt32Array] = this.WriteUInt32ArrayToByteStream.bind(this);
        this.m_handleFunWrite[EInetType.eInetSInt64Array] = this.WriteSInt64ArrayToByteStream.bind(this);
        this.m_handleFunWrite[EInetType.eInetUInt64Array] = this.WriteUInt64ArrayToByteStream.bind(this);
        this.m_handleFunWrite[EInetType.eInetBoolArray] = this.WriteBoolArrayToByteStream.bind(this);
        this.m_handleFunWrite[EInetType.eInetFloatArray] = this.WriteFloatArrayToByteStream.bind(this);
        this.m_handleFunWrite[EInetType.eInetDoubleArray] = this.WriteDoubleArrayToByteStream.bind(this);
        this.m_handleFunWrite[EInetType.eInetStringArray] = this.WriteStringArrayToByteStream.bind(this);
        this.m_handleFunWrite[EInetType.eInetWStringArray] = this.WriteWStringArrayToByteStream.bind(this);
        this.m_handleFunWrite[EInetType.eInetStructArray] = this.WriteStructArrayToByteStream.bind(this);

        this.m_handleFunWrite[EInetType.eInetSInt8InfiniteArray] = this.WriteSInt8InfiniteArrayToByteStream.bind(this);
        this.m_handleFunWrite[EInetType.eInetUInt8InfiniteArray] = this.WriteUInt8InfiniteArrayToByteStream.bind(this);
        this.m_handleFunWrite[EInetType.eInetSInt16InfiniteArray] = this.WriteSInt16InfiniteArrayToByteStream.bind(this);
        this.m_handleFunWrite[EInetType.eInetUInt16InfiniteArray] = this.WriteUInt16InfiniteArrayToByteStream.bind(this);
        this.m_handleFunWrite[EInetType.eInetSInt32InfiniteArray] = this.WriteSInt32InfiniteArrayToByteStream.bind(this);
        this.m_handleFunWrite[EInetType.eInetUInt32InfiniteArray] = this.WriteUInt32InfiniteArrayToByteStream.bind(this);
        this.m_handleFunWrite[EInetType.eInetSInt64InfiniteArray] = this.WriteSInt64InfiniteArrayToByteStream.bind(this);
        this.m_handleFunWrite[EInetType.eInetUInt64InfiniteArray] = this.WriteUInt64InfiniteArrayToByteStream.bind(this);
        this.m_handleFunWrite[EInetType.eInetBoolInfiniteArray] = this.WriteBoolInfiniteArrayToByteStream.bind(this);
        this.m_handleFunWrite[EInetType.eInetFloatInfiniteArray] = this.WriteFloatInfiniteArrayToByteStream.bind(this);
        this.m_handleFunWrite[EInetType.eInetDoubleInfiniteArray] = this.WriteDoubleInfiniteArrayToByteStream.bind(this);
        this.m_handleFunWrite[EInetType.eInetStringInfiniteArray] = this.WriteStringInfiniteArrayToByteStream.bind(this);
        this.m_handleFunWrite[EInetType.eInetWStringInfiniteArray] = this.WriteWStringInfiniteArrayToByteStream.bind(this);
        this.m_handleFunWrite[EInetType.eInetStructInfiniteArray] = this.WriteStructInfiniteArrayToByteStream.bind(this);

        this.m_handleFunWrite[EInetType.eInetSInt8DynamicArray] = this.WriteSInt8DynamicArrayToByteStream.bind(this);
        this.m_handleFunWrite[EInetType.eInetUInt8DynamicArray] = this.WriteUInt8DynamicArrayToByteStream.bind(this);
        this.m_handleFunWrite[EInetType.eInetSInt16DynamicArray] = this.WriteSInt16DynamicArrayToByteStream.bind(this);
        this.m_handleFunWrite[EInetType.eInetUInt16DynamicArray] = this.WriteUInt16DynamicArrayToByteStream.bind(this);
        this.m_handleFunWrite[EInetType.eInetSInt32DynamicArray] = this.WriteSInt32DynamicArrayToByteStream.bind(this);
        this.m_handleFunWrite[EInetType.eInetUInt32DynamicArray] = this.WriteUInt32DynamicArrayToByteStream.bind(this);
        this.m_handleFunWrite[EInetType.eInetSInt64DynamicArray] = this.WriteSInt64DynamicArrayToByteStream.bind(this);
        this.m_handleFunWrite[EInetType.eInetUInt64DynamicArray] = this.WriteUInt64DynamicArrayToByteStream.bind(this);
        this.m_handleFunWrite[EInetType.eInetBoolDynamicArray] = this.WriteBoolDynamicArrayToByteStream.bind(this);
        this.m_handleFunWrite[EInetType.eInetFloatDynamicArray] = this.WriteFloatDynamicArrayToByteStream.bind(this);
        this.m_handleFunWrite[EInetType.eInetDoubleDynamicArray] = this.WriteDoubleDynamicArrayToByteStream.bind(this);
        this.m_handleFunWrite[EInetType.eInetStringDynamicArray] = this.WriteStringDynamicArrayToByteStream.bind(this);
        this.m_handleFunWrite[EInetType.eInetWStringDynamicArray] = this.WriteWStringDynamicArrayToByteStream.bind(this);
        this.m_handleFunWrite[EInetType.eInetStructDynamicArray] = this.WriteStructDynamicArrayToByteStream.bind(this);

        let pStructNull = new SStruct();
        pStructNull.strName = "null";
        this.m_mapStruct.set("null", pStructNull);


        this.m_pEntryStruct = new SStruct();
        let member = new SMember();
        member.eType = EInetType.eInetStruct;
        member.strName = "member1";
        this.m_pEntryStruct.vecMember.push(member);
    }

    // 注册结构体
    registerStruct(strName, luaTable) {
        if (!this.RegisterStructSub(strName, luaTable)) {
            return false;
        }

        if (!this.IsValidStruct(this.m_mapStruct.get(strName))) {
            this.unregisterStruct(strName);
            return false;
        }
        return true;
    }
    // 注册结构体，带继承
    registerInheritanceStruct(strName, luaTable, strInheritanceStructName: string) {
        if (!this.m_mapStruct.has(strInheritanceStructName)) {
            fw.printError(`register: error inheritance struct:'${strInheritanceStructName}' didn't find`);
            return false;
        }

        if (!this.RegisterStructSub(strName, luaTable)) {
            return false;
        }

        let pStructInheritance = this.m_mapStruct.get(strInheritanceStructName);
        let pStruct = this.m_mapStruct.get(strName);

        pStruct.vecMember = pStructInheritance.vecMember.concat(pStruct.vecMember)

        for (let [key, val] of pStructInheritance.mapArrayLen.entries()) {
            pStruct.mapArrayLen.set(key, val);
        }
        for (let [key, val] of pStructInheritance.mapDynamicKeyName.entries()) {
            pStruct.mapDynamicKeyName.set(key, val);
        }
        for (let [key, val] of pStructInheritance.mapStructName.entries()) {
            pStruct.mapStructName.set(key, val);
        }

        if (!this.IsValidStruct(pStruct)) {
            this.unregisterStruct(strName);
            return false;
        }

        return true;
    }

    readTableFromByteStream(strName: string, pByteStream: SInetByteStream) {
        let pMember = this.m_pEntryStruct.vecMember[0];
        this.m_pEntryStruct.mapStructName.set(pMember.strName, strName);
        let ret = this.ReadStructToTable(this.m_pEntryStruct, pMember, pByteStream);
        if (ret == null) {
            fw.printError(`read: error struct:'${strName}'`);
            return null;
        }
        return ret;
    }

    writeTableToByteStream(strName: string, luaTable, pByteStream) {

        let pMember = this.m_pEntryStruct.vecMember[0];
        this.m_pEntryStruct.mapStructName.set(pMember.strName, strName);
        let bSuccess = this.WriteStructToByteStream(this.m_pEntryStruct, pMember, pByteStream, luaTable);
        if (bSuccess == false) {
            fw.printError(`write: error struct:'${strName}'`);
        }
        return bSuccess;
    }

    RegisterStructSub(strName, luaTable: Array<any>) {
        if (this.m_mapStruct.has(strName)) {
            fw.printError(`register: error the type '${strName}' already exit!!!!`);
            return false;
        }
        let pStruct = new SStruct();
        pStruct.strName = strName;
        let bIsError = false;
        let nMemberCount = luaTable.length;
        for (let i = 0; i < nMemberCount && bIsError == false; ++i) {
            // 成员名称
            let strMemberName = "";
            if (bIsError == false) {
                strMemberName = luaTable[i][1];
            }
            // 成员类型
            let eInetType = EInetType.eInetTypeMax;
            if (bIsError == false) {
                let tmp = luaTable[i][0];
                if (typeof tmp === 'number') {
                    eInetType = tmp as EInetType;
                    if (eInetType < EInetType.eInetSInt8 || eInetType > EInetType.eInetWString) {
                        bIsError = true;
                        fw.printError(`register: error struct:'${strName}', member:'${strMemberName}', index:${i}, unknown type!`);
                    }
                } else if (typeof tmp === 'string') {
                    eInetType = EInetType.eInetStruct;
                    let strStructName = tmp;
                    pStruct.mapStructName.set(strMemberName, strStructName);
                    if (!this.m_mapStruct.has(strStructName)) {
                        bIsError = true;
                        fw.printError(`register: error struct:'${strName}', index:${i}, substruct '${strStructName}' didn't exist!`);
                    }
                } else {
                    bIsError = true;
                    fw.printError(`register: error struct:'${strName}', index:${i}, unknown type!`);
                }
            }
            // 数组
            if (bIsError == false) {
                let tmp = luaTable[i][2];
                if (tmp != null) {
                    if (typeof tmp === 'number') {
                        let nArrayLen = tmp;
                        if (nArrayLen == -1) {		// 无限数组
                            eInetType = EInetType.eInetSInt8InfiniteArray + eInetType;
                        }
                        else {						// 常规数组
                            eInetType = EInetType.eInetSInt8Array + eInetType;
                            pStruct.mapArrayLen.set(strMemberName, nArrayLen);
                        }
                    }
                    else if (typeof tmp === 'string') { // 动态数组
                        eInetType = (EInetType.eInetSInt8DynamicArray + eInetType);
                        let strDynamicKeyName = tmp;
                        pStruct.mapDynamicKeyName.set(strMemberName, strDynamicKeyName);
                        if (!this.IsValidDynamicArrayKey(pStruct.vecMember, strDynamicKeyName)) {
                            fw.printError(`register: error struct:'${strName}', member:'${strMemberName}', the key:'${strDynamicKeyName}' didn't find or invalid!`);
                            bIsError = true;
                        }
                    }
                    else {
                        fw.printError(`register: error struct:'${strName}', member:'${strMemberName}', unknown type index == 3 !`);
                        bIsError = true;
                    }
                }
            }

            let singleMember = new SMember();
            singleMember.eType = eInetType;
            singleMember.strName = strMemberName;
            pStruct.vecMember.push(singleMember);
        }

        if (bIsError == false) {
            this.m_mapStruct.set(strName, pStruct);
        }
        return !bIsError;
    }

    IsValidDynamicArrayKey(vecMember: SMember[], strKey: string) {
        for (let index = 0; index < vecMember.length; index++) {
            const it = vecMember[index];
            if (it.strName == strKey) {
                return it.eType >= EInetType.eInetSInt8 && it.eType <= EInetType.eInetSInt32;
            }
        }

        return false;
    }

    unregisterStruct(strName: string) {
        if (this.m_mapStruct.has(strName)) {
            this.m_mapStruct.delete(strName);
        }
        return true;
    }

    IsValidStruct(pStruct: SStruct) {
        let mapMemberName: Map<string, number> = new Map();
        for (let i = 0; i < pStruct.vecMember.length; ++i) {
            let member = pStruct.vecMember[i];
            mapMemberName[member.strName] += 1;

            if (mapMemberName[member.strName] > 1)			// 重名
            {
                fw.printError(`check: error struct:'${pStruct.strName}', member:'${member.strName}', must be unique!`);
                return false;
            }

            // -1
            if (member.eType >= EInetType.eInetSInt8InfiniteArray && member.eType <= EInetType.eInetStructInfiniteArray) {
                if (i != pStruct.vecMember.length - 1) {
                    fw.printError(`check: error struct:'${pStruct.strName}', member:'${member.strName}', the -1 must be in the end of the struct!`);
                    return false;
                }
            }

            // string
            if (member.eType == EInetType.eInetString) {
                fw.printError(`register: error struct:'${pStruct.strName}', member:'${member.strName}', type string must be array!`);
                return false;
            }
        }

        return true;
    }

    ReadSInt8ToTable(pStruct: SStruct, pMember: SMember, pStream: SInetByteStream) {
        return pStream.readSInt8()
    }
    ReadUInt8ToTable(pStruct: SStruct, pMember: SMember, pStream: SInetByteStream) {
        return pStream.readUInt8()
    }
    ReadSInt16ToTable(pStruct: SStruct, pMember: SMember, pStream: SInetByteStream) {
        return pStream.readSInt16()
    }
    ReadUInt16ToTable(pStruct: SStruct, pMember: SMember, pStream: SInetByteStream) {
        return pStream.readUInt16()
    }
    ReadSInt32ToTable(pStruct: SStruct, pMember: SMember, pStream: SInetByteStream) {
        return pStream.readSInt32()
    }
    ReadUInt32ToTable(pStruct: SStruct, pMember: SMember, pStream: SInetByteStream) {
        return pStream.readUInt32()
    }
    ReadSInt64ToTable(pStruct: SStruct, pMember: SMember, pStream: SInetByteStream) {
        return pStream.readSInt64()
    }
    ReadUInt64ToTable(pStruct: SStruct, pMember: SMember, pStream: SInetByteStream) {
        return pStream.readUInt64()
    }
    ReadBoolToTable(pStruct: SStruct, pMember: SMember, pStream: SInetByteStream) {
        return pStream.readBool()
    }
    ReadFloatToTable(pStruct: SStruct, pMember: SMember, pStream: SInetByteStream) {
        return pStream.readFloat()
    }
    ReadDoubleToTable(pStruct: SStruct, pMember: SMember, pStream: SInetByteStream) {
        return pStream.readDouble()
    }
    ReadStringToTable(pStruct: SStruct, pMember: SMember, pStream: SInetByteStream) {
        fw.printError(`read: error the type:'${pMember.strName}' didn't support string!`);
        return null;
    }
    ReadWStringToTable(pStruct: SStruct, pMember: SMember, pStream: SInetByteStream) {
        fw.printError(`read: error the type:'${pMember.strName}' didn't support wstring!`);
        return null;
    }

    ReadStructToTable(pStruct: SStruct, pMember: SMember, pStream: SInetByteStream) {
        let pSubStruct = this.m_mapStruct.get(pStruct.mapStructName.get(pMember.strName));
        if (pSubStruct == null) {
            fw.printError(`read: error struct:'${pStruct.mapStructName.get(pMember.strName)}' didn't find`);
            return null;
        }
        let tab = {};
        let bIsError = false;
        for (let i = 0; i < pSubStruct.vecMember.length && bIsError == false; ++i) {
            let pSubMember = pSubStruct.vecMember[i];
            let key = pSubMember.strName;
            let val = this.m_handleFunRead[pSubMember.eType](pSubStruct, pSubMember, pStream, tab);
            if (val == null)		// 函数内部 push_value()
            {
                fw.printError(`read: error member:'${pSubMember.strName}'!`);
                bIsError = true;
            } else {
                tab[key] = val;
            }
        }
        if (bIsError == true) {
            return null;
        }

        return tab;
    }
    ReadSInt8ArrayToTable(pStruct: SStruct, pMember: SMember, pStream: SInetByteStream) {
        let nArrayLen = pStruct.mapArrayLen.get(pMember.strName);
        let size = 1;
        if (pStream.curIndex + nArrayLen * size > pStream.totalSize) {
            return null
        }
        let ret = [];
        for (let nIndex = 0; nIndex < nArrayLen; ++nIndex) {
            ret.push(pStream.readSInt8());
        }
        return ret;
    }
    ReadUInt8ArrayToTable(pStruct: SStruct, pMember: SMember, pStream: SInetByteStream) {
        let nArrayLen = pStruct.mapArrayLen.get(pMember.strName);
        let size = 1;
        if (pStream.curIndex + nArrayLen * size > pStream.totalSize) {
            return null
        }
        let ret = [];
        for (let nIndex = 0; nIndex < nArrayLen; ++nIndex) {
            ret.push(pStream.readUInt8());
        }
        return ret;
    }
    ReadSInt16ArrayToTable(pStruct: SStruct, pMember: SMember, pStream: SInetByteStream) {
        let nArrayLen = pStruct.mapArrayLen.get(pMember.strName);
        let size = 2;
        if (pStream.curIndex + nArrayLen * size > pStream.totalSize) {
            return null
        }
        let ret = [];
        for (let nIndex = 0; nIndex < nArrayLen; ++nIndex) {
            ret.push(pStream.readSInt16());
        }
        return ret;
    }
    ReadUInt16ArrayToTable(pStruct: SStruct, pMember: SMember, pStream: SInetByteStream) {
        let nArrayLen = pStruct.mapArrayLen.get(pMember.strName);
        let size = 2;
        if (pStream.curIndex + nArrayLen * size > pStream.totalSize) {
            return null
        }
        let ret = [];
        for (let nIndex = 0; nIndex < nArrayLen; ++nIndex) {
            ret.push(pStream.readUInt16());
        }
        return ret;
    }
    ReadSInt32ArrayToTable(pStruct: SStruct, pMember: SMember, pStream: SInetByteStream) {
        let nArrayLen = pStruct.mapArrayLen.get(pMember.strName);
        let size = 4;
        if (pStream.curIndex + nArrayLen * size > pStream.totalSize) {
            return null
        }
        let ret = [];
        for (let nIndex = 0; nIndex < nArrayLen; ++nIndex) {
            ret.push(pStream.readSInt32());
        }
        return ret;
    }
    ReadUInt32ArrayToTable(pStruct: SStruct, pMember: SMember, pStream: SInetByteStream) {
        let nArrayLen = pStruct.mapArrayLen.get(pMember.strName);
        let size = 4;
        if (pStream.curIndex + nArrayLen * size > pStream.totalSize) {
            return null
        }
        let ret = [];
        for (let nIndex = 0; nIndex < nArrayLen; ++nIndex) {
            ret.push(pStream.readUInt32());
        }
        return ret;
    }
    ReadSInt64ArrayToTable(pStruct: SStruct, pMember: SMember, pStream: SInetByteStream) {
        let nArrayLen = pStruct.mapArrayLen.get(pMember.strName);
        let size = 8;
        if (pStream.curIndex + nArrayLen * size > pStream.totalSize) {
            return null
        }
        let ret = [];
        for (let nIndex = 0; nIndex < nArrayLen; ++nIndex) {
            ret.push(pStream.readSInt64());
        }
        return ret;
    }
    ReadUInt64ArrayToTable(pStruct: SStruct, pMember: SMember, pStream: SInetByteStream) {
        let nArrayLen = pStruct.mapArrayLen.get(pMember.strName);
        let size = 8;
        if (pStream.curIndex + nArrayLen * size > pStream.totalSize) {
            return null
        }
        let ret = [];
        for (let nIndex = 0; nIndex < nArrayLen; ++nIndex) {
            ret.push(pStream.readUInt64());
        }
        return ret;
    }
    ReadBoolArrayToTable(pStruct: SStruct, pMember: SMember, pStream: SInetByteStream) {
        let nArrayLen = pStruct.mapArrayLen.get(pMember.strName);
        let size = 1;
        if (pStream.curIndex + nArrayLen * size > pStream.totalSize) {
            return null
        }
        let ret = [];
        for (let nIndex = 0; nIndex < nArrayLen; ++nIndex) {
            ret.push(pStream.readBool());
        }
        return ret;
    }
    ReadFloatArrayToTable(pStruct: SStruct, pMember: SMember, pStream: SInetByteStream) {
        let nArrayLen = pStruct.mapArrayLen.get(pMember.strName);
        let size = 4;
        if (pStream.curIndex + nArrayLen * size > pStream.totalSize) {
            return null
        }
        let ret = [];
        for (let nIndex = 0; nIndex < nArrayLen; ++nIndex) {
            ret.push(pStream.readFloat());
        }
        return ret;
    }
    ReadDoubleArrayToTable(pStruct: SStruct, pMember: SMember, pStream: SInetByteStream) {
        let nArrayLen = pStruct.mapArrayLen.get(pMember.strName);
        let size = 8;
        if (pStream.curIndex + nArrayLen * size > pStream.totalSize) {
            return null
        }
        let ret = [];
        for (let nIndex = 0; nIndex < nArrayLen; ++nIndex) {
            ret.push(pStream.readDouble());
        }
        return ret;
    }
    ReadStringArrayToTable(pStruct: SStruct, pMember: SMember, pStream: SInetByteStream) {
        let nArrayLen = pStruct.mapArrayLen.get(pMember.strName);
        let size = 1;
        if (pStream.curIndex + nArrayLen * size > pStream.totalSize) {
            return null
        }
        let arr: number[] = [];
        let realLen = nArrayLen * size;
        let fixLen = false
        for (let nIndex = 0; nIndex < nArrayLen; ++nIndex) {
            let val = pStream.readUInt8();
            arr.push(val);
            if (!fixLen && val == 0) {
                realLen = nIndex
                fixLen = true
            }
        }
        return byteToString(arr.slice(0, realLen));
    }
    ReadWStringArrayToTable(pStruct: SStruct, pMember: SMember, pStream: SInetByteStream) {
        let nArrayLen = pStruct.mapArrayLen.get(pMember.strName);
        let size = 2;
        if (pStream.curIndex + nArrayLen * size > pStream.totalSize) {
            return null
        }
        let arr: number[] = [];
        let realLen = nArrayLen * size;
        let fixLen = false
        for (let nIndex = 0; nIndex < nArrayLen; ++nIndex) {
            let left = pStream.readUInt8()
            let right = pStream.readUInt8()
            arr.push(right);
            arr.push(left);
            if (!fixLen && right == 0 && left == 0) {
                realLen = nIndex * 2
                fixLen = true
            }
        }
        try {
            return wCharbyteUnicodeToString(arr.slice(0, realLen));
        } catch (error) {

        }
    }

    ReadStructArrayToTable(pStruct: SStruct, pMember: SMember, pStream: SInetByteStream) {
        let nArrayLen = pStruct.mapArrayLen.get(pMember.strName);
        let ret = [];
        for (let nIndex = 0; nIndex < nArrayLen; ++nIndex) {
            let val = this.ReadStructToTable(pStruct, pMember, pStream);
            ret.push(val);
        }
        return ret;
    }
    ReadSInt8InfiniteArrayToTable(pStruct: SStruct, pMember: SMember, pStream: SInetByteStream) {
        let nLeftLen = pStream.totalSize - pStream.curIndex;
        let size = 1;
        if (nLeftLen % size != 0) {
            return null;
        }
        pStruct.mapArrayLen.set(pMember.strName, nLeftLen / size)
        return this.ReadSInt8ArrayToTable(pStruct, pMember, pStream);
    }
    ReadUInt8InfiniteArrayToTable(pStruct: SStruct, pMember: SMember, pStream: SInetByteStream) {
        let nLeftLen = pStream.totalSize - pStream.curIndex;
        let size = 1;
        if (nLeftLen % size != 0) {
            return null;
        }
        pStruct.mapArrayLen.set(pMember.strName, nLeftLen / size)
        return this.ReadUInt8ArrayToTable(pStruct, pMember, pStream);
    }
    ReadSInt16InfiniteArrayToTable(pStruct: SStruct, pMember: SMember, pStream: SInetByteStream) {
        let nLeftLen = pStream.totalSize - pStream.curIndex;
        let size = 2;
        if (nLeftLen % size != 0) {
            return null;
        }
        pStruct.mapArrayLen.set(pMember.strName, nLeftLen / size)
        return this.ReadSInt16ArrayToTable(pStruct, pMember, pStream);
    }
    ReadUInt16InfiniteArrayToTable(pStruct: SStruct, pMember: SMember, pStream: SInetByteStream) {
        let nLeftLen = pStream.totalSize - pStream.curIndex;
        let size = 2;
        if (nLeftLen % size != 0) {
            return null;
        }
        pStruct.mapArrayLen.set(pMember.strName, nLeftLen / size)
        return this.ReadUInt16ArrayToTable(pStruct, pMember, pStream);
    }
    ReadSInt32InfiniteArrayToTable(pStruct: SStruct, pMember: SMember, pStream: SInetByteStream) {
        let nLeftLen = pStream.totalSize - pStream.curIndex;
        let size = 4;
        if (nLeftLen % size != 0) {
            return null;
        }
        pStruct.mapArrayLen.set(pMember.strName, nLeftLen / size)
        return this.ReadSInt32ArrayToTable(pStruct, pMember, pStream);
    }
    ReadUInt32InfiniteArrayToTable(pStruct: SStruct, pMember: SMember, pStream: SInetByteStream) {
        let nLeftLen = pStream.totalSize - pStream.curIndex;
        let size = 4;
        if (nLeftLen % size != 0) {
            return null;
        }
        pStruct.mapArrayLen.set(pMember.strName, nLeftLen / size)
        return this.ReadUInt32ArrayToTable(pStruct, pMember, pStream);
    }
    ReadSInt64InfiniteArrayToTable(pStruct: SStruct, pMember: SMember, pStream: SInetByteStream) {
        let nLeftLen = pStream.totalSize - pStream.curIndex;
        let size = 8;
        if (nLeftLen % size != 0) {
            return null;
        }
        pStruct.mapArrayLen.set(pMember.strName, nLeftLen / size)
        return this.ReadSInt64ArrayToTable(pStruct, pMember, pStream);
    }
    ReadUInt64InfiniteArrayToTable(pStruct: SStruct, pMember: SMember, pStream: SInetByteStream) {
        let nLeftLen = pStream.totalSize - pStream.curIndex;
        let size = 8;
        if (nLeftLen % size != 0) {
            return null;
        }
        pStruct.mapArrayLen.set(pMember.strName, nLeftLen / size)
        return this.ReadUInt64ArrayToTable(pStruct, pMember, pStream);
    }
    ReadBoolInfiniteArrayToTable(pStruct: SStruct, pMember: SMember, pStream: SInetByteStream) {
        let nLeftLen = pStream.totalSize - pStream.curIndex;
        let size = 1;
        if (nLeftLen % size != 0) {
            return null;
        }
        pStruct.mapArrayLen.set(pMember.strName, nLeftLen / size)
        return this.ReadBoolArrayToTable(pStruct, pMember, pStream);
    }
    ReadFloatInfiniteArrayToTable(pStruct: SStruct, pMember: SMember, pStream: SInetByteStream) {
        let nLeftLen = pStream.totalSize - pStream.curIndex;
        let size = 4;
        if (nLeftLen % size != 0) {
            return null;
        }
        pStruct.mapArrayLen.set(pMember.strName, nLeftLen / size)
        return this.ReadFloatArrayToTable(pStruct, pMember, pStream);
    }
    ReadDoubleInfiniteArrayToTable(pStruct: SStruct, pMember: SMember, pStream: SInetByteStream) {
        let nLeftLen = pStream.totalSize - pStream.curIndex;
        let size = 8;
        if (nLeftLen % size != 0) {
            return null;
        }
        pStruct.mapArrayLen.set(pMember.strName, nLeftLen / size)
        return this.ReadDoubleArrayToTable(pStruct, pMember, pStream);
    }
    ReadStringInfiniteArrayToTable(pStruct: SStruct, pMember: SMember, pStream: SInetByteStream) {
        let nLeftLen = pStream.totalSize - pStream.curIndex;
        let size = 1;
        if (nLeftLen % size != 0) {
            return null;
        }
        pStruct.mapArrayLen.set(pMember.strName, nLeftLen / size)
        return this.ReadStringArrayToTable(pStruct, pMember, pStream);
    }
    ReadWStringInfiniteArrayToTable(pStruct: SStruct, pMember: SMember, pStream: SInetByteStream) {
        let nLeftLen = pStream.totalSize - pStream.curIndex;
        let size = 2;
        if (nLeftLen % size != 0) {
            return null;
        }
        pStruct.mapArrayLen.set(pMember.strName, nLeftLen / size)
        return this.ReadWStringArrayToTable(pStruct, pMember, pStream);
    }
    ReadStructInfiniteArrayToTable(pStruct: SStruct, pMember: SMember, pStream: SInetByteStream) {
        fw.printError(`read: error the type:'${pMember.strName}' didn't support -1!`);
        return null;
    }
    ReadSInt8DynamicArrayToTable(pStruct: SStruct, pMember: SMember, pStream: SInetByteStream, tab) {
        pStruct.mapArrayLen.set(pMember.strName, tab[pStruct.mapDynamicKeyName.get(pMember.strName)])
        // pStruct.mapArrayLen.set(pMember.strName, tab[pStruct.mapDynamicKeyName.get(pMember.strName)])
        return this.ReadSInt8ArrayToTable(pStruct, pMember, pStream);
    }
    ReadUInt8DynamicArrayToTable(pStruct: SStruct, pMember: SMember, pStream: SInetByteStream, tab) {
        pStruct.mapArrayLen.set(pMember.strName, tab[pStruct.mapDynamicKeyName.get(pMember.strName)])
        // pStruct.mapArrayLen.set(pMember.strName, tab[pStruct.mapDynamicKeyName.get(pMember.strName)])
        return this.ReadUInt8ArrayToTable(pStruct, pMember, pStream);
    }
    ReadSInt16DynamicArrayToTable(pStruct: SStruct, pMember: SMember, pStream: SInetByteStream, tab) {
        pStruct.mapArrayLen.set(pMember.strName, tab[pStruct.mapDynamicKeyName.get(pMember.strName)])
        // pStruct.mapArrayLen.set(pMember.strName, tab[pStruct.mapDynamicKeyName.get(pMember.strName)])
        return this.ReadSInt16ArrayToTable(pStruct, pMember, pStream);
    }
    ReadUInt16DynamicArrayToTable(pStruct: SStruct, pMember: SMember, pStream: SInetByteStream, tab) {
        pStruct.mapArrayLen.set(pMember.strName, tab[pStruct.mapDynamicKeyName.get(pMember.strName)])
        // pStruct.mapArrayLen.set(pMember.strName, tab[pStruct.mapDynamicKeyName.get(pMember.strName)])
        return this.ReadUInt16ArrayToTable(pStruct, pMember, pStream);
    }
    ReadSInt32DynamicArrayToTable(pStruct: SStruct, pMember: SMember, pStream: SInetByteStream, tab) {
        pStruct.mapArrayLen.set(pMember.strName, tab[pStruct.mapDynamicKeyName.get(pMember.strName)])
        // pStruct.mapArrayLen.set(pMember.strName, tab[pStruct.mapDynamicKeyName.get(pMember.strName)])
        return this.ReadSInt32ArrayToTable(pStruct, pMember, pStream);
    }
    ReadUInt32DynamicArrayToTable(pStruct: SStruct, pMember: SMember, pStream: SInetByteStream, tab) {
        pStruct.mapArrayLen.set(pMember.strName, tab[pStruct.mapDynamicKeyName.get(pMember.strName)])
        // pStruct.mapArrayLen.set(pMember.strName, tab[pStruct.mapDynamicKeyName.get(pMember.strName)])
        return this.ReadUInt32ArrayToTable(pStruct, pMember, pStream);
    }
    ReadSInt64DynamicArrayToTable(pStruct: SStruct, pMember: SMember, pStream: SInetByteStream, tab) {
        pStruct.mapArrayLen.set(pMember.strName, tab[pStruct.mapDynamicKeyName.get(pMember.strName)])
        // pStruct.mapArrayLen.set(pMember.strName, tab[pStruct.mapDynamicKeyName.get(pMember.strName)])
        return this.ReadSInt64ArrayToTable(pStruct, pMember, pStream);
    }
    ReadUInt64DynamicArrayToTable(pStruct: SStruct, pMember: SMember, pStream: SInetByteStream, tab) {
        pStruct.mapArrayLen.set(pMember.strName, tab[pStruct.mapDynamicKeyName.get(pMember.strName)])
        // pStruct.mapArrayLen.set(pMember.strName, tab[pStruct.mapDynamicKeyName.get(pMember.strName)])
        return this.ReadUInt64ArrayToTable(pStruct, pMember, pStream);
    }
    ReadBoolDynamicArrayToTable(pStruct: SStruct, pMember: SMember, pStream: SInetByteStream, tab) {
        pStruct.mapArrayLen.set(pMember.strName, tab[pStruct.mapDynamicKeyName.get(pMember.strName)])
        // pStruct.mapArrayLen.set(pMember.strName, tab[pStruct.mapDynamicKeyName.get(pMember.strName)])
        return this.ReadBoolArrayToTable(pStruct, pMember, pStream);
    }

    ReadFloatDynamicArrayToTable(pStruct: SStruct, pMember: SMember, pStream: SInetByteStream, tab) {
        pStruct.mapArrayLen.set(pMember.strName, tab[pStruct.mapDynamicKeyName.get(pMember.strName)])
        // pStruct.mapArrayLen.set(pMember.strName, tab[pStruct.mapDynamicKeyName.get(pMember.strName)])
        return this.ReadFloatArrayToTable(pStruct, pMember, pStream);
    }

    ReadDoubleDynamicArrayToTable(pStruct: SStruct, pMember: SMember, pStream: SInetByteStream, tab) {
        pStruct.mapArrayLen.set(pMember.strName, tab[pStruct.mapDynamicKeyName.get(pMember.strName)])
        // pStruct.mapArrayLen.set(pMember.strName, tab[pStruct.mapDynamicKeyName.get(pMember.strName)])
        return this.ReadDoubleArrayToTable(pStruct, pMember, pStream);
    }

    ReadStringDynamicArrayToTable(pStruct: SStruct, pMember: SMember, pStream: SInetByteStream, tab) {
        pStruct.mapArrayLen.set(pMember.strName, tab[pStruct.mapDynamicKeyName.get(pMember.strName)])
        // pStruct.mapArrayLen.set(pMember.strName, tab[pStruct.mapDynamicKeyName.get(pMember.strName)])
        return this.ReadStringArrayToTable(pStruct, pMember, pStream);
    }

    ReadWStringDynamicArrayToTable(pStruct: SStruct, pMember: SMember, pStream: SInetByteStream, tab) {
        pStruct.mapArrayLen.set(pMember.strName, tab[pStruct.mapDynamicKeyName.get(pMember.strName)])
        // pStruct.mapArrayLen.set(pMember.strName, tab[pStruct.mapDynamicKeyName.get(pMember.strName)])
        return this.ReadWStringArrayToTable(pStruct, pMember, pStream);
    }

    ReadStructDynamicArrayToTable(pStruct: SStruct, pMember: SMember, pStream: SInetByteStream, tab) {
        pStruct.mapArrayLen.set(pMember.strName, tab[pStruct.mapDynamicKeyName.get(pMember.strName)])
        // pStruct.mapArrayLen.set(pMember.strName, tab[pStruct.mapDynamicKeyName.get(pMember.strName)])
        return this.ReadStructArrayToTable(pStruct, pMember, pStream);
    }

    WriteSInt8ToByteStream(pStruct: SStruct, pMember: SMember, pStream: SInetByteStream, val) {
        return pStream.writeSInt8(val);
    }
    WriteUInt8ToByteStream(pStruct: SStruct, pMember: SMember, pStream: SInetByteStream, val) {
        return pStream.writeUInt8(val);
    }
    WriteSInt16ToByteStream(pStruct: SStruct, pMember: SMember, pStream: SInetByteStream, val) {
        return pStream.writeSInt16(val);
    }
    WriteUInt16ToByteStream(pStruct: SStruct, pMember: SMember, pStream: SInetByteStream, val) {
        return pStream.writeUInt16(val);
    }
    WriteSInt32ToByteStream(pStruct: SStruct, pMember: SMember, pStream: SInetByteStream, val) {
        return pStream.writeSInt32(val);
    }
    WriteUInt32ToByteStream(pStruct: SStruct, pMember: SMember, pStream: SInetByteStream, val) {
        return pStream.writeUInt32(val);
    }
    WriteSInt64ToByteStream(pStruct: SStruct, pMember: SMember, pStream: SInetByteStream, val) {
        return pStream.writeSInt64(val);
    }
    WriteUInt64ToByteStream(pStruct: SStruct, pMember: SMember, pStream: SInetByteStream, val) {
        return pStream.writeUInt64(val);
    }
    WriteBoolToByteStream(pStruct: SStruct, pMember: SMember, pStream: SInetByteStream, val) {
        return pStream.writeBool(val);
    }
    WriteFloatToByteStream(pStruct: SStruct, pMember: SMember, pStream: SInetByteStream, val) {
        return pStream.writeFloat(val);
    }
    WriteDoubleToByteStream(pStruct: SStruct, pMember: SMember, pStream: SInetByteStream, val) {
        return pStream.writeDouble(val);
    }
    WriteStringToByteStream(pStruct: SStruct, pMember: SMember, pStream: SInetByteStream, val) {
        fw.printError(`write: error the type:'${pMember.strName}' didn't support string!`);
        return false;
    }
    WriteWStringToByteStream(pStruct: SStruct, pMember: SMember, pStream: SInetByteStream, val) {
        fw.printError(`write: error the type:'${pMember.strName}' didn't support wstring!`);
        return false;
    }
    WriteStructToByteStream(pStruct: SStruct, pMember: SMember, pStream: SInetByteStream, tab) {
        // let pSubStruct = this.m_mapStruct.get(pStruct.mapStructName.get(pMember.strName));
        // if (pSubStruct == null) {
        //     fw.printError(`write: error struct:'${pStruct.mapStructName.get(pMember.strName)}' didn't find`);
        //     return false;
        // }
        let bIsError = false;
        // for (let i = 0; i < pSubStruct.vecMember.length && bIsError == false; ++i) {
        //     let pSubMember = pSubStruct.vecMember[i];
        //     let strName = pSubMember.strName;
        //     let val = tab[strName]
        //     if (val == null) {
        //         fw.printError(`write: error memeber:'${pSubMember.strName}' didn't assign!`);
        //         bIsError = true;
        //     }
        //     else {
        //         if ((this.m_handleFunWrite[pSubMember.eType])(pSubStruct, pSubMember, pStream, val, tab) != true) {
        //             bIsError = true;
        //         }
        //     }
        // }
        return !bIsError;
    }

    WriteSInt8ArrayToByteStream(pStruct: SStruct, pMember: SMember, pStream: SInetByteStream, tab) {
        if (tab instanceof Array == false && tab instanceof Int8Array == false) {
            fw.printError(`write: error member:'${pMember.strName}' isn't a table!`);
            return false;
        }

        let nArrayLen = pStruct.mapArrayLen.get(pMember.strName);
        let size = 1;
        if (pStream.curIndex + nArrayLen * size > pStream.totalSize) {
            return false;
        }
        for (let nIndex = 0; nIndex < nArrayLen; ++nIndex) {
            let val = tab[nIndex];
            pStream.writeSInt8(val);
        }
        return true;
    }
    WriteUInt8ArrayToByteStream(pStruct: SStruct, pMember: SMember, pStream: SInetByteStream, tab) {
        if (tab instanceof Array == false && tab instanceof Uint8Array == false) {
            fw.printError(`write: error member:'${pMember.strName}' isn't a table!`);
            return false;
        }

        let nArrayLen = pStruct.mapArrayLen.get(pMember.strName);
        let size = 1;
        if (pStream.curIndex + nArrayLen * size > pStream.totalSize) {
            return false;
        }
        for (let nIndex = 0; nIndex < nArrayLen; ++nIndex) {
            let val = tab[nIndex];
            pStream.writeUInt8(val);
        }
        return true;
    }
    WriteSInt16ArrayToByteStream(pStruct: SStruct, pMember: SMember, pStream: SInetByteStream, tab) {
        if (tab instanceof Array == false) {
            fw.printError(`write: error member:'${pMember.strName}' isn't a table!`);
            return false;
        }

        let nArrayLen = pStruct.mapArrayLen.get(pMember.strName);
        let size = 2;
        if (pStream.curIndex + nArrayLen * size > pStream.totalSize) {
            return false;
        }
        for (let nIndex = 0; nIndex < nArrayLen; ++nIndex) {
            let val = tab[nIndex];
            pStream.writeSInt16(val);
        }
        return true;
    }
    WriteUInt16ArrayToByteStream(pStruct: SStruct, pMember: SMember, pStream: SInetByteStream, tab) {
        if (tab instanceof Array == false) {
            fw.printError(`write: error member:'${pMember.strName}' isn't a table!`);
            return false;
        }

        let nArrayLen = pStruct.mapArrayLen.get(pMember.strName);
        let size = 2;
        if (pStream.curIndex + nArrayLen * size > pStream.totalSize) {
            return false;
        }
        for (let nIndex = 0; nIndex < nArrayLen; ++nIndex) {
            let val = tab[nIndex];
            pStream.writeUInt16(val);
        }
        return true;
    }
    WriteSInt32ArrayToByteStream(pStruct: SStruct, pMember: SMember, pStream: SInetByteStream, tab) {
        if (tab instanceof Array == false) {
            fw.printError(`write: error member:'${pMember.strName}' isn't a table!`);
            return false;
        }

        let nArrayLen = pStruct.mapArrayLen.get(pMember.strName);
        let size = 4;
        if (pStream.curIndex + nArrayLen * size > pStream.totalSize) {
            return false;
        }
        for (let nIndex = 0; nIndex < nArrayLen; ++nIndex) {
            let val = tab[nIndex];
            pStream.writeSInt32(val);
        }
        return true;
    }
    WriteUInt32ArrayToByteStream(pStruct: SStruct, pMember: SMember, pStream: SInetByteStream, tab) {
        if (tab instanceof Array == false) {
            fw.printError(`write: error member:'${pMember.strName}' isn't a table!`);
            return false;
        }

        let nArrayLen = pStruct.mapArrayLen.get(pMember.strName);
        let size = 4;
        if (pStream.curIndex + nArrayLen * size > pStream.totalSize) {
            return false;
        }
        for (let nIndex = 0; nIndex < nArrayLen; ++nIndex) {
            let val = tab[nIndex];
            pStream.writeUInt32(val);
        }
        return true;
    }
    WriteSInt64ArrayToByteStream(pStruct: SStruct, pMember: SMember, pStream: SInetByteStream, tab) {
        if (tab instanceof Array == false) {
            fw.printError(`write: error member:'${pMember.strName}' isn't a table!`);
            return false;
        }

        let nArrayLen = pStruct.mapArrayLen.get(pMember.strName);
        let size = 8;
        if (pStream.curIndex + nArrayLen * size > pStream.totalSize) {
            return false;
        }
        for (let nIndex = 0; nIndex < nArrayLen; ++nIndex) {
            let val = tab[nIndex];
            pStream.writeSInt64(val);
        }
        return true;
    }
    WriteUInt64ArrayToByteStream(pStruct: SStruct, pMember: SMember, pStream: SInetByteStream, tab) {
        if (tab instanceof Array == false) {
            fw.printError(`write: error member:'${pMember.strName}' isn't a table!`);
            return false;
        }

        let nArrayLen = pStruct.mapArrayLen.get(pMember.strName);
        let size = 8;
        if (pStream.curIndex + nArrayLen * size > pStream.totalSize) {
            return false;
        }
        for (let nIndex = 0; nIndex < nArrayLen; ++nIndex) {
            let val = tab[nIndex];
            pStream.writeUInt64(val);
        }
        return true;
    }
    WriteBoolArrayToByteStream(pStruct: SStruct, pMember: SMember, pStream: SInetByteStream, tab) {
        if (tab instanceof Array == false) {
            fw.printError(`write: error member:'${pMember.strName}' isn't a table!`);
            return false;
        }

        let nArrayLen = pStruct.mapArrayLen.get(pMember.strName);
        let size = 1;
        if (pStream.curIndex + nArrayLen * size > pStream.totalSize) {
            return false;
        }
        for (let nIndex = 0; nIndex < nArrayLen; ++nIndex) {
            let val = tab[nIndex];
            pStream.writeBool(val);
        }
        return true;
    }
    WriteFloatArrayToByteStream(pStruct: SStruct, pMember: SMember, pStream: SInetByteStream, tab) {
        if (tab instanceof Array == false) {
            fw.printError(`write: error member:'${pMember.strName}' isn't a table!`);
            return false;
        }

        let nArrayLen = pStruct.mapArrayLen.get(pMember.strName);
        let size = 4;
        if (pStream.curIndex + nArrayLen * size > pStream.totalSize) {
            return false;
        }
        for (let nIndex = 0; nIndex < nArrayLen; ++nIndex) {
            let val = tab[nIndex];
            pStream.writeFloat(val);
        }
        return true;
    }
    WriteDoubleArrayToByteStream(pStruct: SStruct, pMember: SMember, pStream: SInetByteStream, tab) {
        if (tab instanceof Array == false) {
            fw.printError(`write: error member:'${pMember.strName}' isn't a table!`);
            return false;
        }

        let nArrayLen = pStruct.mapArrayLen.get(pMember.strName);
        let size = 8;
        if (pStream.curIndex + nArrayLen * size > pStream.totalSize) {
            return false;
        }
        for (let nIndex = 0; nIndex < nArrayLen; ++nIndex) {
            let val = tab[nIndex];
            pStream.writeDouble(val);
        }
        return true;
    }
    WriteStringArrayToByteStream(pStruct: SStruct, pMember: SMember, pStream: SInetByteStream, str) {
        if (typeof str !== 'string') {
            fw.printError(`write: error member:'${pMember.strName}' isn't a table!`);
            return false;
        }

        let nArrayLen = pStruct.mapArrayLen.get(pMember.strName);
        let size = 1;
        if (pStream.curIndex + nArrayLen * size > pStream.totalSize) {
            return false;
        }
        let ByteArray = stringToByte(str);

        for (let nIndex = 0; nIndex < nArrayLen; ++nIndex) {
            if (nIndex < ByteArray.length) {
                pStream.writeUInt8(ByteArray[nIndex]);
            } else {
                pStream.writeUInt8(0);
            }
        }
        return true;
    }

    WriteWStringArrayToByteStream(pStruct: SStruct, pMember: SMember, pStream: SInetByteStream, str) {
        if (typeof str !== 'string') {
            fw.printError(`write: error member:'${pMember.strName}' isn't a table!`);
            return false;
        }
        let nArrayLen = pStruct.mapArrayLen.get(pMember.strName);
        let size = 2;
        if (pStream.curIndex + nArrayLen * size > pStream.totalSize) {
            return false;
        }

        let ByteArray = stringToWCharByte(str);

        for (let nIndex = 0; nIndex < nArrayLen; ++nIndex) {
            if (nIndex < ByteArray.length) {
                pStream.writeUInt16(ByteArray[nIndex * 2] << 8 | ByteArray[nIndex * 2 + 1]);
            } else {
                pStream.writeUInt16(0);
            }
        }

        return true;
    }
    WriteStructArrayToByteStream(pStruct: SStruct, pMember: SMember, pStream: SInetByteStream, tab) {
        if (tab instanceof Array == false) {
            fw.printError(`write: error member:'${pMember.strName}' isn't a table!`);
            return false;
        }
        let nArrayLen = pStruct.mapArrayLen.get(pMember.strName);
        for (let nIndex = 0; nIndex < nArrayLen; ++nIndex) {
            let iTab = tab[nIndex]
            if (this.WriteStructToByteStream(pStruct, pMember, pStream, iTab) != true) {
                return false;
            }
        }
        return true;
    }

    WriteSInt8InfiniteArrayToByteStream(pStruct: SStruct, pMember: SMember, pStream: SInetByteStream, tab) {
        if (tab instanceof Array == false && tab instanceof Int8Array == false) {
            fw.printError(`write: error member:'${pMember.strName}' isn't a table!`);
            return false;
        }

        pStruct.mapArrayLen.set(pMember.strName, (tab as Array<any>).length);
        return this.WriteSInt8ArrayToByteStream(pStruct, pMember, pStream, tab);
    }
    WriteUInt8InfiniteArrayToByteStream(pStruct: SStruct, pMember: SMember, pStream: SInetByteStream, tab) {
        if (tab instanceof Array == false && tab instanceof Uint8Array == false) {
            fw.printError(`write: error member:'${pMember.strName}' isn't a table!`);
            return false;
        }

        pStruct.mapArrayLen.set(pMember.strName, (tab as Array<any>).length);
        return this.WriteUInt8ArrayToByteStream(pStruct, pMember, pStream, tab);
    }
    WriteSInt16InfiniteArrayToByteStream(pStruct: SStruct, pMember: SMember, pStream: SInetByteStream, tab) {
        if (tab instanceof Array == false) {
            fw.printError(`write: error member:'${pMember.strName}' isn't a table!`);
            return false;
        }

        pStruct.mapArrayLen.set(pMember.strName, (tab as Array<any>).length);
        return this.WriteSInt16ArrayToByteStream(pStruct, pMember, pStream, tab);
    }
    WriteUInt16InfiniteArrayToByteStream(pStruct: SStruct, pMember: SMember, pStream: SInetByteStream, tab) {
        if (tab instanceof Array == false) {
            fw.printError(`write: error member:'${pMember.strName}' isn't a table!`);
            return false;
        }

        pStruct.mapArrayLen.set(pMember.strName, (tab as Array<any>).length);
        return this.WriteUInt16ArrayToByteStream(pStruct, pMember, pStream, tab);
    }
    WriteSInt32InfiniteArrayToByteStream(pStruct: SStruct, pMember: SMember, pStream: SInetByteStream, tab) {
        if (tab instanceof Array == false) {
            fw.printError(`write: error member:'${pMember.strName}' isn't a table!`);
            return false;
        }

        pStruct.mapArrayLen.set(pMember.strName, (tab as Array<any>).length);
        return this.WriteSInt32ArrayToByteStream(pStruct, pMember, pStream, tab);
    }
    WriteUInt32InfiniteArrayToByteStream(pStruct: SStruct, pMember: SMember, pStream: SInetByteStream, tab) {
        if (tab instanceof Array == false) {
            fw.printError(`write: error member:'${pMember.strName}' isn't a table!`);
            return false;
        }

        pStruct.mapArrayLen.set(pMember.strName, (tab as Array<any>).length);
        return this.WriteUInt32ArrayToByteStream(pStruct, pMember, pStream, tab);
    }
    WriteSInt64InfiniteArrayToByteStream(pStruct: SStruct, pMember: SMember, pStream: SInetByteStream, tab) {
        if (tab instanceof Array == false) {
            fw.printError(`write: error member:'${pMember.strName}' isn't a table!`);
            return false;
        }

        pStruct.mapArrayLen.set(pMember.strName, (tab as Array<any>).length);
        return this.WriteSInt64ArrayToByteStream(pStruct, pMember, pStream, tab);
    }
    WriteUInt64InfiniteArrayToByteStream(pStruct: SStruct, pMember: SMember, pStream: SInetByteStream, tab) {
        if (tab instanceof Array == false) {
            fw.printError(`write: error member:'${pMember.strName}' isn't a table!`);
            return false;
        }

        pStruct.mapArrayLen.set(pMember.strName, (tab as Array<any>).length);
        return this.WriteUInt64ArrayToByteStream(pStruct, pMember, pStream, tab);
    }
    WriteBoolInfiniteArrayToByteStream(pStruct: SStruct, pMember: SMember, pStream: SInetByteStream, tab) {
        if (tab instanceof Array == false) {
            fw.printError(`write: error member:'${pMember.strName}' isn't a table!`);
            return false;
        }

        pStruct.mapArrayLen.set(pMember.strName, (tab as Array<any>).length);
        return this.WriteBoolArrayToByteStream(pStruct, pMember, pStream, tab);
    }
    WriteFloatInfiniteArrayToByteStream(pStruct: SStruct, pMember: SMember, pStream: SInetByteStream, tab) {
        if (tab instanceof Array == false) {
            fw.printError(`write: error member:'${pMember.strName}' isn't a table!`);
            return false;
        }

        pStruct.mapArrayLen.set(pMember.strName, (tab as Array<any>).length);
        return this.WriteBoolArrayToByteStream(pStruct, pMember, pStream, tab);
    }
    WriteDoubleInfiniteArrayToByteStream(pStruct: SStruct, pMember: SMember, pStream: SInetByteStream, tab) {
        if (tab instanceof Array == false) {
            fw.printError(`write: error member:'${pMember.strName}' isn't a table!`);
            return false;
        }

        pStruct.mapArrayLen.set(pMember.strName, (tab as Array<any>).length);
        return this.WriteDoubleArrayToByteStream(pStruct, pMember, pStream, tab);
    }
    WriteStringInfiniteArrayToByteStream(pStruct: SStruct, pMember: SMember, pStream: SInetByteStream, str) {
        if (str instanceof String == false) {
            fw.printError(`write: error member:'${pMember.strName}' isn't a table!`);
            return false;
        }

        pStruct.mapArrayLen.set(pMember.strName, (str as String).length);
        return this.WriteStringArrayToByteStream(pStruct, pMember, pStream, str);
    }
    WriteWStringInfiniteArrayToByteStream(pStruct: SStruct, pMember: SMember, pStream: SInetByteStream, str) {
        fw.printError(`write: error the type:'${pMember.strName}' didn't support -1!`);
        return false;
    }
    WriteStructInfiniteArrayToByteStream(pStruct: SStruct, pMember: SMember, pStream: SInetByteStream, str) {
        fw.printError(`write: error the type:'${pMember.strName}' didn't support -1!`);
        return false;
    }

    WriteSInt8DynamicArrayToByteStream(pStruct: SStruct, pMember: SMember, pStream: SInetByteStream, params, tab) {
        pStruct.mapArrayLen.set(pMember.strName, tab[pStruct.mapDynamicKeyName.get(pMember.strName)])
        return this.WriteSInt8ArrayToByteStream(pStruct, pMember, pStream, params);
    }
    WriteUInt8DynamicArrayToByteStream(pStruct: SStruct, pMember: SMember, pStream: SInetByteStream, params, tab) {
        pStruct.mapArrayLen.set(pMember.strName, tab[pStruct.mapDynamicKeyName.get(pMember.strName)])
        return this.WriteUInt8ArrayToByteStream(pStruct, pMember, pStream, params);
    }
    WriteSInt16DynamicArrayToByteStream(pStruct: SStruct, pMember: SMember, pStream: SInetByteStream, params, tab) {
        pStruct.mapArrayLen.set(pMember.strName, tab[pStruct.mapDynamicKeyName.get(pMember.strName)])
        return this.WriteSInt16ArrayToByteStream(pStruct, pMember, pStream, params);
    }
    WriteUInt16DynamicArrayToByteStream(pStruct: SStruct, pMember: SMember, pStream: SInetByteStream, params, tab) {
        pStruct.mapArrayLen.set(pMember.strName, tab[pStruct.mapDynamicKeyName.get(pMember.strName)])
        return this.WriteUInt16ArrayToByteStream(pStruct, pMember, pStream, params);
    }
    WriteSInt32DynamicArrayToByteStream(pStruct: SStruct, pMember: SMember, pStream: SInetByteStream, params, tab) {
        pStruct.mapArrayLen.set(pMember.strName, tab[pStruct.mapDynamicKeyName.get(pMember.strName)])
        return this.WriteSInt32ArrayToByteStream(pStruct, pMember, pStream, params);
    }
    WriteUInt32DynamicArrayToByteStream(pStruct: SStruct, pMember: SMember, pStream: SInetByteStream, params, tab) {
        pStruct.mapArrayLen.set(pMember.strName, tab[pStruct.mapDynamicKeyName.get(pMember.strName)])
        return this.WriteUInt32ArrayToByteStream(pStruct, pMember, pStream, params);
    }
    WriteSInt64DynamicArrayToByteStream(pStruct: SStruct, pMember: SMember, pStream: SInetByteStream, params, tab) {
        pStruct.mapArrayLen.set(pMember.strName, tab[pStruct.mapDynamicKeyName.get(pMember.strName)])
        return this.WriteSInt64ArrayToByteStream(pStruct, pMember, pStream, params);
    }
    WriteUInt64DynamicArrayToByteStream(pStruct: SStruct, pMember: SMember, pStream: SInetByteStream, params, tab) {
        pStruct.mapArrayLen.set(pMember.strName, tab[pStruct.mapDynamicKeyName.get(pMember.strName)])
        return this.WriteUInt64ArrayToByteStream(pStruct, pMember, pStream, params);
    }
    WriteBoolDynamicArrayToByteStream(pStruct: SStruct, pMember: SMember, pStream: SInetByteStream, params, tab) {
        pStruct.mapArrayLen.set(pMember.strName, tab[pStruct.mapDynamicKeyName.get(pMember.strName)])
        return this.WriteBoolArrayToByteStream(pStruct, pMember, pStream, params);
    }

    WriteFloatDynamicArrayToByteStream(pStruct: SStruct, pMember: SMember, pStream: SInetByteStream, params, tab) {
        pStruct.mapArrayLen.set(pMember.strName, tab[pStruct.mapDynamicKeyName.get(pMember.strName)])
        return this.WriteFloatArrayToByteStream(pStruct, pMember, pStream, params);
    }

    WriteDoubleDynamicArrayToByteStream(pStruct: SStruct, pMember: SMember, pStream: SInetByteStream, params, tab) {
        pStruct.mapArrayLen.set(pMember.strName, tab[pStruct.mapDynamicKeyName.get(pMember.strName)])
        return this.WriteDoubleArrayToByteStream(pStruct, pMember, pStream, params);
    }

    WriteStringDynamicArrayToByteStream(pStruct: SStruct, pMember: SMember, pStream: SInetByteStream, params, tab) {
        pStruct.mapArrayLen.set(pMember.strName, tab[pStruct.mapDynamicKeyName.get(pMember.strName)])
        return this.WriteStringArrayToByteStream(pStruct, pMember, pStream, params);
    }

    WriteWStringDynamicArrayToByteStream(pStruct: SStruct, pMember: SMember, pStream: SInetByteStream, params, tab) {
        pStruct.mapArrayLen.set(pMember.strName, tab[pStruct.mapDynamicKeyName.get(pMember.strName)])
        return this.WriteWStringArrayToByteStream(pStruct, pMember, pStream, params);
    }

    WriteStructDynamicArrayToByteStream(pStruct: SStruct, pMember: SMember, pStream: SInetByteStream, params, tab) {
        pStruct.mapArrayLen.set(pMember.strName, tab[pStruct.mapDynamicKeyName.get(pMember.strName)])
        return this.WriteStructArrayToByteStream(pStruct, pMember, pStream, params);
    }
}