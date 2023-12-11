import { Lucky3PattiTypeDef } from './Lucky3PattiTypeDef';
/**
 * Predefined variables
 * Name = Lucky3PattiLogic
 * DateTime = Wed Feb 23 2022 09:40:27 GMT+0800 (中国标准时间)
 * Author = 大禹_Jason
 * FileBasename = Lucky3PattiLogic.ts
 * FileBasenameNoExtension = Lucky3PattiLogic
 * URL = db://assets/game/game_teenpatti/script/Lucky3PattiLogic.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/zh/
 *
 */

export const Lucky3PattiLogic = {

    getLogoString: function (color: number, num: number) {
        if (num >= 0x0B) {
            let logoStr = [];
            logoStr[11] = "J";
            logoStr[12] = "Q";
            logoStr[13] = "K";

            return logoStr[num];
        } else {
            let typeStr = [];
            typeStr[0x00] = "diamond";
            typeStr[0x10] = "club";
            typeStr[0x20] = "heart";
            typeStr[0x30] = "spade";

            return typeStr[color];
        }
    },

    getTypeString: function (nColor: number) {
        let strName = [];
        strName[Lucky3PattiTypeDef.ePokerColor.diamond] = "diamond";
        strName[Lucky3PattiTypeDef.ePokerColor.club] = "club";
        strName[Lucky3PattiTypeDef.ePokerColor.heart] = "heart";
        strName[Lucky3PattiTypeDef.ePokerColor.spade] = "spade";

        return strName[nColor];
    },

    getTypeColor: function (nType: number) {
        let result = "black";
        if (nType == Lucky3PattiTypeDef.ePokerColor.diamond || nType == Lucky3PattiTypeDef.ePokerColor.heart) {
            result = "red";
        }
        return result;
    },

    verification: function (data: number) {
        return Lucky3PattiTypeDef.ePokerData.indexOf(data) >= 0;
    },

    getPokerColor: function (data: number) {
        return data & Lucky3PattiTypeDef.ePokerColorMask;
    },

    getPokerValue: function (data: number) {
        return data & Lucky3PattiTypeDef.ePokerValueMask;
    },

    getPokerFaceValue: function (data: number) {
        let result = Lucky3PattiLogic.getPokerValue(data);
        if (result == 0x01) {
            result += Lucky3PattiTypeDef.ePokerLogicCount;
        }

        return result;
    },

    getSameValueCount: function (data: number[]) {
        let result = 0;
        let len = data.length;

        if (len >= 2) {
            for (let index = 1; index < len; ++index) {
                let curNum = Lucky3PattiLogic.getPokerValue(data[index]);
                let preNum = Lucky3PattiLogic.getPokerValue(data[index - 1]);
                if (curNum == preNum) {
                    ++result;
                }
            }
        }

        return result;
    },

    getSameColorCount: function (data: number[]) {
        let colorArray = [0, 0, 0, 0];
        let result = 0;

        for (let index = 0; index < data.length; index++) {
            let color = Lucky3PattiLogic.getPokerColor(data[index]);
            ++colorArray[color];
        }

        colorArray.sort((a,b)=>a-b);
        result = colorArray[3];

        return result;
    },

    isIncludeA: function (data: number[]) {
        let result = false;

        for (let index = 0; index < data.length; index++) {
            let curNum = Lucky3PattiLogic.getPokerValue(data[index]);
            if (1 == curNum) {
                result = true;
                break;
            }
        }

        return result;
    },

    isLinkPoker: function (data: number[]) {
        let result = true;
        let len = data.length;
        let bSpecial = Lucky3PattiLogic.isIncludeA(data);

        if (bSpecial) {
            if (Lucky3PattiLogic.getPokerValue(data[0]) == 13 && Lucky3PattiLogic.getPokerValue(data[1]) == 12) {
                result = true;
            }
        } else {
            if (3 == len) {
                for (let index = 1; index < data.length; index++) {
                    let curNum = Lucky3PattiLogic.getPokerValue(data[index]);
                    let preNum = Lucky3PattiLogic.getPokerValue(data[index - 1]);
                    if (preNum != (curNum - 1)) {
                        result = false;
                        break;
                    }
                }
            }
        }

        return result;
    },

    sortByFaceValue: function (data: number[]) {
        data.sort(function (lhs: number, rhs: number) {
            let lValue = Lucky3PattiLogic.getPokerFaceValue(lhs);
            let rValue = Lucky3PattiLogic.getPokerFaceValue(rhs);
            if (lValue <= rValue) {
                return 1;
            }
            return -1;
        });
    },

    sortByValue: function (data: number[]) {
        data.sort(function (lhs: number, rhs: number) {
            let lValue = Lucky3PattiLogic.getPokerValue(lhs);
            let rValue = Lucky3PattiLogic.getPokerValue(rhs);
            if (lValue <= rValue) {
                return 1;
            }
            return -1;
        });
    },

    sortByColor: function (data: number[]) {
        data.sort(function (lhs: number, rhs: number) {
            let lColor = Lucky3PattiLogic.getPokerColor(lhs);
            let rColor = Lucky3PattiLogic.getPokerColor(rhs);
            if (lColor <= rColor) {
                return 1;
            }
            return -1;
        });
    },

    sortSingle: function (data: number[]) {
        Lucky3PattiLogic.sortByFaceValue(data);
    },

    sortPair: function (data: number[]) {
        let result = [];

        if (data.length >= 2) {
            for (let index = 1; index < data.length; index++) {
                let curValue = Lucky3PattiLogic.getPokerValue(data[index]);
                let preValue = Lucky3PattiLogic.getPokerValue(data[index - 1]);
                if (curValue == preValue) {
                    result.push(data[index]);
                    result.push(data[index - 1]);
                }
            }

            Lucky3PattiLogic.sortByColor(result);
            for (let index = 0; index < data.length; index++) {
                if (data[index] != result[1] && data[index] != result[2]) {
                    result.push(data[index]);
                }
            }

            data = result;
        }
    },

    sortStraight: function (data: number[]) {
        let bSpecial = Lucky3PattiLogic.isIncludeA(data);
        if (bSpecial) {
            let firstNum = Lucky3PattiLogic.getPokerValue(data[0]);
            let secondNum = Lucky3PattiLogic.getPokerValue(data[1]);
            if (firstNum == 0x0D && secondNum == 0x0C) {
                data = [data[2], data[1], data[0]];
            }
        } else {
            Lucky3PattiLogic.sortByValue(data);
        }
    },

    sortSuit: function (data: number[]) {
        Lucky3PattiLogic.sortByFaceValue(data);
    },

    sortStraightSuit: function (data: number[]) {
        Lucky3PattiLogic.sortStraight(data);
    },

    sortTriplet: function (data: number[]) {
        Lucky3PattiLogic.sortByColor(data);
    },

    sortPokerArray: function (data: number[], nPokerTyp: number) {
        switch (nPokerTyp) {
            case Lucky3PattiTypeDef.ePokerType.Single:
                Lucky3PattiLogic.sortSingle(data);
                break;
            case Lucky3PattiTypeDef.ePokerType.Pair:
                Lucky3PattiLogic.sortPair(data);
                break;
            case Lucky3PattiTypeDef.ePokerType.Straight:
                Lucky3PattiLogic.sortStraight(data);
                break;
            case Lucky3PattiTypeDef.ePokerType.Suit:
                Lucky3PattiLogic.sortSuit(data);
                break;
            case Lucky3PattiTypeDef.ePokerType.StraightSuit:
                Lucky3PattiLogic.sortStraightSuit(data);
                break;
            case Lucky3PattiTypeDef.ePokerType.Triplet:
                Lucky3PattiLogic.sortTriplet(data);
                break;
            default:
                break;
        }
    },

    getPokerType: function (data: number[]) {
        let result = Lucky3PattiTypeDef.ePokerType.Single;
        data.sort(function (lhs, rhs) {
            let lValue = Lucky3PattiLogic.getPokerValue(lhs);
            let rValue = Lucky3PattiLogic.getPokerValue(rhs);

            if (lValue < rValue) {
                return 1;
            }
            return -1;
        });

        let sameValueCount = Lucky3PattiLogic.getSameValueCount(data);
        let sameColorCount = Lucky3PattiLogic.getSameColorCount(data);
        let bLink = Lucky3PattiLogic.isLinkPoker(data);

        if (sameValueCount >= 1) {
            if (sameValueCount == 1) {
                result = Lucky3PattiTypeDef.ePokerType.Pair;
            } else {
                result = Lucky3PattiTypeDef.ePokerType.Triplet;
            }
        } else if (sameColorCount == 3) {
            if (bLink) {
                result = Lucky3PattiTypeDef.ePokerType.StraightSuit;
            } else {
                result = Lucky3PattiTypeDef.ePokerType.Suit;
            }
        } else if (bLink) {
            result = Lucky3PattiTypeDef.ePokerType.Straight;
        }

        Lucky3PattiLogic.sortPokerArray(data, result);
        return result;
    },

    transformCardDataLz: function (data: number[]) {
        for (let index = 0; index < data.length; index++) {
            let nColor = Lucky3PattiLogic.getPokerColor(data[index]);
            if (nColor >= Lucky3PattiTypeDef.eLzMinMask && nColor <= Lucky3PattiTypeDef.eLzMaxMask) {
                data[index] -= Lucky3PattiTypeDef.eLzMinMask;
            }
        }
    },

    isLzCardData: function (data: number) {
        let result = false;
        let nColor = Lucky3PattiLogic.getPokerColor(data);
        let nValue = Lucky3PattiLogic.getPokerValue(data);
        if (nColor >= Lucky3PattiTypeDef.eLzMinMask && nColor <= Lucky3PattiTypeDef.eLzMaxMask) {
            result = true;
        } else if (Lucky3PattiTypeDef.ePokerDataLz.indexOf(nValue) >= 0) {
            result = true;
        }

        return result;
    },

    checkSameCard: function (data: number[]) {
        let countArray = [];
        for (let index = 0; index < data.length; index++) {
            let nColor = Lucky3PattiLogic.getPokerColor(data[index]);
            let nValue = Lucky3PattiLogic.getPokerValue(data[index]);

            if (countArray[nValue].length <= 0) {
                countArray[nValue] = [];
                countArray[Lucky3PattiTypeDef.ePokerColor.diamond] = 0;
                countArray[Lucky3PattiTypeDef.ePokerColor.club] = 0;
                countArray[Lucky3PattiTypeDef.ePokerColor.heart] = 0;
                countArray[Lucky3PattiTypeDef.ePokerColor.spade] = 0;
            }

            if (countArray[nValue][nColor] > 0) {
                for (let nCurColor = Lucky3PattiTypeDef.ePokerColor.diamond; nCurColor <= Lucky3PattiTypeDef.ePokerColor.spade; nCurColor += 0x10) {
                    if (countArray[nValue][nCurColor] <= 0) {
                        data[index] = nCurColor + nValue;
                        ++countArray[nValue][nCurColor];
                        break;
                    }
                }
            } else {
                ++countArray[nValue][nColor];
            }
        }
    },

    isContainLz: function (data: number[]) {
        let result = false;
        for (let index = 0; index < data.length; index++) {
            if (Lucky3PattiLogic.isLzCardData(data[index])) {
                result = true;
                break;
            }
        }
        return result;
    },

    sortCardDataLz: function (dataLz: number[], data: number[]) {
        let pokerData = [];
        for (let index = 0; index < data.length; index++) {
            pokerData.push({
                sortPoker: data[index],
                pokerLz: dataLz[index],
                poker: data[index]
            });
        }

        for (let index = 0; index < pokerData.length; index++) {
            let nColor = Lucky3PattiLogic.getPokerColor(pokerData[index].sortPoker);
            if (nColor >= Lucky3PattiTypeDef.eLzMinMask && nColor <= Lucky3PattiTypeDef.eLzMaxMask) {
                pokerData[index].sortPoker = pokerData[index].sortPoker - Lucky3PattiTypeDef.eLzMinMask;
            }
        }

        let countArray = [];
        for (let index = 0; index < pokerData.length; index++) {
            let bLz = Lucky3PattiLogic.isLzCardData(pokerData[index].pokerLz);
            let nColor = Lucky3PattiLogic.getPokerColor(pokerData[index].sortPoker);
            let nValue = Lucky3PattiLogic.getPokerValue(pokerData[index].sortPoker);

            if (countArray[nValue].length <= 0) {
                countArray[nValue] = [];
                countArray[nValue][Lucky3PattiTypeDef.ePokerColor.diamond] = 0;
                countArray[nValue][Lucky3PattiTypeDef.ePokerColor.club] = 0;
                countArray[nValue][Lucky3PattiTypeDef.ePokerColor.heart] = 0;
                countArray[nValue][Lucky3PattiTypeDef.ePokerColor.spade] = 0;
            }

            if (countArray[nValue][nColor].length > 0 && bLz) {
                for (let nCurColor = Lucky3PattiTypeDef.ePokerColor.diamond; nCurColor <= Lucky3PattiTypeDef.ePokerColor.spade; nCurColor += 0x10) {
                    if (countArray[nValue][nCurColor] <= 0) {
                        pokerData[index].sortPoker = nCurColor + nValue;
                        ++countArray[nValue][nCurColor];
                        break;
                    }
                }
            } else {
                ++countArray[nValue][nColor];
            }
        }

        countArray = [];
        for (let index = (pokerData.length - 1); index >= 0; --index) {
            let bLz = Lucky3PattiLogic.isLzCardData(pokerData[index].pokerLz);
            let nColor = Lucky3PattiLogic.getPokerColor(pokerData[index].sortPoker);
            let nValue = Lucky3PattiLogic.getPokerValue(pokerData[index].sortPoker);

            if (countArray[nValue].length <= 0) {
                countArray[nValue] = [];
                countArray[nValue][Lucky3PattiTypeDef.ePokerColor.diamond] = 0;
                countArray[nValue][Lucky3PattiTypeDef.ePokerColor.club] = 0;
                countArray[nValue][Lucky3PattiTypeDef.ePokerColor.heart] = 0;
                countArray[nValue][Lucky3PattiTypeDef.ePokerColor.spade] = 0;
            }

            if (countArray[nValue][nColor].length > 0 && bLz) {
                for (let nCurColor = Lucky3PattiTypeDef.ePokerColor.diamond; nCurColor <= Lucky3PattiTypeDef.ePokerColor.spade; nCurColor += 0x10) {
                    if (countArray[nValue][nCurColor] <= 0) {
                        pokerData[index].sortPoker = nCurColor + nValue;
                        ++countArray[nValue][nCurColor];
                        break;
                    }
                }
            } else {
                ++countArray[nValue][nColor];
            }
        }

        pokerData.sort(function (lhs, rhs) {
            let lValue = Lucky3PattiLogic.getPokerValue(lhs.sortPoker);
            let rValue = Lucky3PattiLogic.getPokerValue(rhs.sortPoker);
            if (lValue <= rValue) {
                return 1;
            }
            return -1;
        });

        let sameCount = Lucky3PattiLogic.getSameValueCount(dataLz);
        if (2 == sameCount) {
            pokerData.sort(function (lhs, rhs) {
                let lColor = Lucky3PattiLogic.getPokerColor(lhs.sortPoker);
                let rColor = Lucky3PattiLogic.getPokerColor(rhs.sortPoker);
                if (lColor <= rColor) {
                    return 1;
                }
                return -1;
            });
        } else if (1 == sameCount) {
            for (let index = 1; index < pokerData.length; index++) {
                let lValue = Lucky3PattiLogic.getPokerValue(pokerData[index].sortPoker);
                let rValue = Lucky3PattiLogic.getPokerValue(pokerData[index - 1].sortPoker);

                if (lValue == rValue) {
                    let lColor = Lucky3PattiLogic.getPokerColor(pokerData[index].sortPoker);
                    let rColor = Lucky3PattiLogic.getPokerColor(pokerData[index - 1].sortPoker);

                    if (rColor < lColor) {
                        let tmp = pokerData[index];
                        pokerData[index] = pokerData[index - 1];
                        pokerData[index - 1] = tmp;
                    }
                }
            }
        }

        let result = [];
        for (let index = 0; index < pokerData.length; index++) {
            dataLz[index] = pokerData[index].pokerLz;
            data[index] = pokerData[index].poker;
            result[index] = pokerData[index].sortPoker;
        }

        return result;
    },
}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.4/manual/zh/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.4/manual/zh/scripting/decorator.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.4/manual/zh/scripting/life-cycle-callbacks.html
 */
