import { _decorator } from 'cc';
import { EVENT_ID, report_event_name, report_event_type } from '../../../config/EventConfig';
import { MODULE_NAME } from '../../../config/ModuleConfig';
import { ModuleBase } from '../ModuleBase';
import { FWHttpPostParams } from '../../manager/FWHttpManager';
import { EventParam } from '../../manager/FWEventManager';

const { ccclass } = _decorator;

export const shareSceneKey = [
    'mbr_s1',
    'mbr_s2',
]

export interface links {
    scene:string;
    link:string;
    linkPt:string;
}

interface CommonInfo {
    pkg:string,
    pvc:number,
    svc:number,
    aid:string,
    fid:string,
    gaid:string,
    pvn:string,
    osv:string,
    pn:string,
    pc:string
}

export abstract class LeoBase extends ModuleBase {
    m_bShowRedPoint: boolean;
    mCheckUpdateCallback: (isOk:boolean)=>void;
    mLeoShareSceneInfo: Map<string, links>;
    mCommonInfo: CommonInfo;
    misIosDev: boolean;
    mLeoShareInfo: {
        img?:string,
        descriptions?:string,
        shareOptionData?:{
            shareOption:string,
            name:string,
            img:string,
        }[]
    };

    initData(): void {
        super.initData();
        this.m_bShowRedPoint = false;
        this.misIosDev = true;
        this.mLeoShareSceneInfo = new Map()
        this.mCheckUpdateCallback = null;
        this.mLeoShareInfo = {};
        this.mLeoShareInfo.img = ""
        this.mLeoShareInfo.descriptions = ""
        this.mLeoShareInfo.shareOptionData = [
            {
                shareOption : "WHATSAPP",
                name : "WhatApp",
                img : "",
            },
            {
                shareOption : "FACEBOOK",
                name : "facebook",
                img : "",
            },
            //  {
            //      shareOption = "YOUTUBE",
            //      name = "youtube",
            //      img = "",
            //  },
            {
                shareOption : "MORE",
                name : "more",
                img : "",
            },
        ]
    }

    initModule() {
        this._module_name = MODULE_NAME.leo;
    }
    
    onInit(params) {
        super.onInit(params);
        this.getLeoConfig();
    }

    abstract getLeoConfig();
    abstract leoCheck(callback);
    abstract startWebViewPage(uid?: string,key?:string);
    abstract shareWithOption(shareOption: string);
    abstract startWebViewPageShare();
    abstract openPolicy();
    abstract openTHC();
    abstract setGameUid(uid:string);

        
    getLeoShareInfo() {
        return this.mLeoShareInfo
    }

    extraLoginParams(params:{extra:{pkginfo?:{}}}) {
        if(this.mCommonInfo) {
            params.extra.pkginfo = this.mCommonInfo
        }
    }
    
    updateLeoShareInfo(str) {
        try {
            let data = JSON.safeParse(str)
            if (data) {
                this.mLeoShareInfo.img = data.img
                this.mLeoShareInfo.descriptions = data.descriptions
                this.mLeoShareInfo.shareOptionData = [
                    {
                        shareOption : "WHATSAPP",
                        name : "WhatApp",
                        img : data.waIcon,
                    },
                    {
                        shareOption : "FACEBOOK",
                        name : "facebook",
                        img : data.fbIcon,
                    },
                    //  {
                    //      shareOption : "YOUTUBE",
                    //      name : "youtube",
                    //      img : data.ybIcon,
                    //  },
                    {
                        shareOption : "MORE",
                        name : "more",
                        img : data.more,
                    },
                ]
            }
        } catch (error) {
            fw.printError(error)
        }
    }

    updateLeoInfo(data) {
        let { commonInfo,leoShareInfo,actionStr } = data
        this.mCommonInfo = JSON.safeParse(commonInfo ?? "")
        this.updateLeoShareInfo(leoShareInfo ?? "")
        this.updateLeoAction(actionStr ?? "")
        this.misIosDev = data.iosDev == true
    }

    doExitGame() {
        app.sdk.doExitGame()
    }

    onLeoActionInfo(params: any) {
        let { actionStr } = params;
        this.updateLeoAction(actionStr);
    }

    onLeoConfig(params: any) {
        this.updateLeoInfo(params)
    }

    getGAID() {
        if(this.mCommonInfo) {
            return this.mCommonInfo.gaid
        }
        return ""
    }

    requestShareInfo() {
        if(!this.mCommonInfo) return
        let params ={
            uid:center.login.getUserDBID(),
            channel:app.native.device.getOperatorsSubID(),
            pkg:this.mCommonInfo.pkg,
            aid:this.mCommonInfo.aid,
            gaid:this.mCommonInfo.gaid,
            lang:app.native.device.getLanguage(),
        }
        let postData:FWHttpPostParams = {
            url: "https://abc/scene/share_config",
            body:JSON.stringify(params),
            content_type:"application/json",
            callback:(bSuccess: boolean, response:any)=>{
                if(bSuccess&&response.code == 0) {
                    this.mLeoShareSceneInfo.clear()
                    let links:links[] = response.data.links;
                    links.forEach(v=>{
                        this.mLeoShareSceneInfo.set(v.scene,v);
                    })
                }
            }
        }
        app.http.post(postData,false)
    }

    getShareLinkUrl(shareScene:number,language) {
        let shareKey = shareSceneKey[shareScene];
        if (!this.mLeoShareSceneInfo.has(shareKey)) return "";
        let data = this.mLeoShareSceneInfo.get(shareKey);
        let shareUrl = ""
        if(language == fw.LanguageType.brasil) {
            shareUrl = data.linkPt ?? "";
        } else {
            shareUrl = data.link ?? "";
        }
        let params = {
            uid : center.login.getUserDBID(),
            scene : shareKey,
            channel : app.native.device.getOperatorsSubID(),
        }
        return `${shareUrl}?${app.http.splicingParams(params)}`
    }


    updateLeoAction(actionStr) {
        let jsonData = JSON.safeParse(actionStr)
        if(jsonData && jsonData.isEntranceHint) {
            this.m_bShowRedPoint = (parseInt(jsonData.isEntranceHint) > 0)
            app.event.dispatchEvent(EventParam.FWDispatchEventParam(EVENT_ID.EVENT_GETFREEBONUSTIPSLEO))
        }
    }

    isShowRedPoint() {
        return this.m_bShowRedPoint;
    }
    
    isIosDev() {
        return this.misIosDev == true
    }
}