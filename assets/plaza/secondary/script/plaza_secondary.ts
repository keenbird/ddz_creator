import { Node as ccNode, UITransform, _decorator, v3,  } from 'cc';
import { plaza_main } from '../../plaza/script/plaza_main';
const { ccclass, property } = _decorator;



/**二级界面类型 */
export enum SecondaryType {
	/**游戏二级界面 */
	Game
}

@ccclass('plaza_secondary')
export class plaza_secondary extends (fw.FWComponent) {
	gameBtn:ccNode[];
	protected doLifeFunc(): void {
	
		
		//正常逻辑
		super.doLifeFunc();
	}
	initData() {
		this.initGameList()
	}
	initGameList() {
		if(center.game.room.m_RoomInfo == null){
			return
		}
		this.Items.gameListScrollView.Items.content.removeAllChildren()
		this.gameBtn = []
		for(var i=0;i<center.game.room.m_RoomInfo.typeList.length;i++){
			let data = center.game.room.m_RoomInfo.typeList[i]
			let item = this.Items.gameListItem.clone()
			this.Items.gameListScrollView.Items.content.addChild(item)
			item.active = true
			item.Items.lab_nolmal.string = data.typeName
			item.Items.spr_click_txt.string = data.typeName
			item.onClickAndScale(() => {
				app.file.setStringForKey("gameRoomChose"+center.game.room.m_RoomInfo.gameType, data.roomType+'', { all: false }) 
				this.choseType(data.roomType)
			});
			item["roomType"] = data.roomType
			this.gameBtn.push(item)
		}
		let gameRoomChose = app.file.getStringForKey("gameRoomChose"+center.game.room.m_RoomInfo.gameType, "", { all: false }) 
		if(gameRoomChose!= ""){
			this.choseType( app.func.toNumber(gameRoomChose))	
		}else{
			this.choseType(center.game.room.m_RoomInfo.defaultGroupType)
		}
		
	}
	choseType(roomType:number){
		for(var i=0;i<this.gameBtn.length;i++){
			if(roomType == this.gameBtn[i]["roomType"]){
				this.gameBtn[i].Items.spr_click.active = true
				this.initRoomList(roomType)
			}else{
				this.gameBtn[i].Items.spr_click.active = false
			}
		}
	}
	initRoomList(roomType:number) {
		let data = null
		for(let i=0;i<center.game.room.m_RoomInfo.typeList.length;i++){
			if(roomType == center.game.room.m_RoomInfo.typeList[i].roomType){
				data = center.game.room.m_RoomInfo.typeList[i].roomList
				break;
			}
		}
		this.hideAllRoomItem()
		if(data){
			for(let i=0;i<data.length;i++){
				if(!fw.isNull(this.Items.room_layout.Items["room_"+ (data[i].roomLevel)])){
					let node  = this.Items.room_layout.Items["room_"+ (data[i].roomLevel)]
					node.active = true
					node.Items.base_coin.string = data[i].baseScore
					let min_str = "准入"
					min_str = min_str + app.func.FormatNumber(data[i].enterMin)
					if(data[i].enterMax>0){
						min_str = min_str +"-"+ app.func.FormatNumber(data[i].enterMax)
					}
					node.Items.min_coin.string = min_str
					node.onClickAndScale(() => {
						center.game.room.sendBEFORE_MATCH_REQ(data[i].roomId)
					});
				}
			}
		}
	}
	hideAllRoomItem() {
		for(var i=0;i<6;i++){
			this.Items.room_layout.Items["room_"+ (i+1)].active = false
		}
	}
	onClickClose() {
		this.node.removeFromParent(true)
		app.popup.getMain().getComponent("plaza_main").setPlazaNodeShowup(true)
	}
	protected initView(): boolean | void {

		
		//适配
		this.fitSceneNode();
		
	}
	protected fitSceneNode(){
		// if(app.isIphoneX){
		// 	this.scheduleOnce(()=>{
		// 		// this.Items.Node_activitys.setPosition(v3(this.Items.Node_activitys.getPosition().x+66,this.Items.Node_activitys.getPosition().y,1))
		
		// 	},0)
		// 	}
	}
	protected initBtns(): boolean | void {
		this.Items.btn_close.onClickAndScale(() => {
			this.onClickClose()
		});
	}
	protected initEvents(): boolean | void {
		//返回键事件
		this.bindEvent({
			eventName: app.event.CommonEvent.Keyback,
			callback: () => {
				//未显示时，不处理
				if (!this.node.activeInHierarchy) {
					return true;
				}
				
			}
		});

		this.bindEvent({
			eventName: `ReceiveRoomInfo`,
			callback: () => {
				this.initData()
			}
		});
		
	}
	onViewEnter() {
		
	}

	


	onViewDestroy() {
		super.onViewDestroy();
		
	}
}

