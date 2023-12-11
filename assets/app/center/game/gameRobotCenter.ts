import { ACTOR, INVAL_CHAIRID, INVAL_TABLEID } from "../../config/cmd/ActorCMD";
import proto from "../common";


interface GoldConifg {
    gold: number[],
    probability: number,
}
/**
 * 金币随机配置 2000,50000,50|50001,200000,20|200001,500000,20|500001,1000000,8|1000001,2500000,2
 * 2000,50000,50|  50%概率随机2000~50000金币
 */
interface GameRobotConfig {
    hourCount: number[];
    goldConifgs: GoldConifg[];
    robotAI?:(robot:GameRobot,config:GameRobotConfig)=>void;
}

/**
 * 用于单机游戏创建机器人
 */
export class GameRobotCenter extends (fw.FWComponent) {
    private poolRobot:GameRobot[] = [];
    private config:GameRobotConfig;
    private robots:GameRobot[] = [];
    private robotsCount:number = 0;
    nextUpdateRobotCount: number;
    bInit: boolean = false;

    clean() {
        this.bInit = false;
        this.robots.forEach(v=>{
            this.exitTable(v);
        })
        this.robots.length = 0;
        this.robotsCount = 0;
    }

    setRobotConfig(data:GameRobotConfig) {
        this.config = data;
    }

    newRobot() {
        if(this.poolRobot.length == 0) {
            return GameRobot.getRandomRobot();
        }
        return this.poolRobot.pop();
    }

    delRobot(...obj:GameRobot[]) {
        this.poolRobot.push(...obj);
    }

    getRobotCount() {
        let {hourCount} = this.config;
        let date = new Date()
        let curIndex = date.getHours();
        let nextIndex = curIndex == 23 ? 0 : curIndex+1;
        let curValue = hourCount[curIndex];
        let nextValue = hourCount[nextIndex];
        return Math.ceil(curValue + (nextValue-curValue) * (date.getSeconds() / 60));
    }

    initRobotCount() {
        this.updateRobotCount();
        this.bInit = true;
    }

    updateRobotCount() {
        let getRandomNum = app.func.getRandomNum;
        this.robotsCount = this.getRobotCount();
        this.nextUpdateRobotCount = getRandomNum(1 *1000, 10 * 1000) / 1000;

        while(this.robotsCount > this.robots.length) {
            if(!this.enterTable()) {
                break;
            }
        }

        while(this.robotsCount < this.robots.length && this.robots.length > 0) {
            let robot = this.robots.splice(getRandomNum(0,this.robots.length-1),1)[0];
            this.exitTable(robot)
        }
    }

    randomGold(robot:GameRobot) {
        let {goldConifgs} = this.config;
        let getRandomNum = app.func.getRandomNum;
        let num = getRandomNum(0,100);
        let probabilityCount = 0;
        for(let i=0;i<goldConifgs.length;i++) {
            let {gold,probability} = goldConifgs[i];
            probabilityCount += probability
            if(num <= probabilityCount) {
                robot.gold = getRandomNum(gold[0],gold[1]);
                return;
            }
        }
    }

    private enterTable() {
        let chair_id = gameCenter.room.tableRobot.allocateChairID();
        if(chair_id != -1) {
            let robot = this.newRobot();
            this.randomGold(robot);
            this.robots.push(robot);
            robot.enterTable(chair_id);
            return true;
        }
        return false;
    }

    private exitTable(robot:GameRobot) {
        this.delRobot(robot);
        robot.exitTable();
    }
    
    robotAI(): void {
        if(this.config.robotAI) {
            this.robots.forEach(v=>this.config.robotAI(v,this.config));
        }
    }

    protected update(dt: number): void {
        if(!this.bInit) {
            return;
        }
        this.nextUpdateRobotCount -= dt;
        if(this.nextUpdateRobotCount < 0) {
            this.updateRobotCount();
        }

        this.robotAI();
    }

    getRandomRobot() {
        let getRandomNum = app.func.getRandomNum;
        if(this.robots.length > 0) {
            return this.robots.splice(getRandomNum(0,this.robots.length-1),1)[0];
        }
    }
}
class CDataPool {
    robotID:number = 3000000000;
    getRobotID() {
        return this.robotID++;
    }
    
    namePool = [];
    getName() {
        if(this.namePool.length == 0) {
            return `player_${this.getRandString()}`;
        }
        return this.namePool.pop();
    }

	getRandString() {
		let strRand = ""
		for (let i = 1; i <= 5; i++) {
			let nRand = app.func.getRandomNum(1, 3)
			if (nRand == 1) {
				// --A~Z
				strRand = strRand + String.fromCharCode(app.func.getRandomNum(65, 90))
			} else if (nRand == 2) {
				// --a~z
				strRand = strRand + String.fromCharCode(app.func.getRandomNum(97, 122))
			} else {
				// --0~9
				strRand = strRand + String.fromCharCode(app.func.getRandomNum(48, 57))
			}
		}
		return strRand
	}

    facePool = [];
    getFace() {
        if(this.facePool.length == 0) {
            return "";
        }
        return this.facePool.pop();
    }

    getGold() {
        return app.func.getRandomNum(1000, 100000);
    }
}
var DataPool = new CDataPool()


class GameRobot {/** public_info_s user_id. */
    data: proto.game_actor.public_info_s


    static getRandomRobot() {
        return new GameRobot();
    }

    constructor() {
        this.data = new proto.game_actor.public_info_s();
        this.data.name = DataPool.getName();
        this.data.face = DataPool.getFace();
        this.data.user_id = DataPool.getRobotID(); // 玩家的数据库DBID
        this.data.id = 0; // 用户的全局UID
        this.data.sex = 0; // 用户性别
        this.data.gold = DataPool.getGold(); // 携带金币
        this.data.diamonds = 0; // 携带钻石
        this.data.win_count = 0; // 赢次数
        this.data.lost_count = 0; // 输次数
        this.data.draw_count = 0; // 平次数
        this.data.drop_count = 0; // 逃跑次数
        this.data.score = 0; // 用户的积分值
        this.data.vip_level = 0; // vip等级
        this.data.table_id = INVAL_TABLEID; // 桌号
        this.data.chair_id = INVAL_CHAIRID; // 椅子
        this.data.state = 0; // 状态
        this.data.guest = 0; //是否游客登录
        this.data.practise_score = 0; // 练习场积分
    }
    /**
     * 入桌
     */
    enterTable(chair_id: number) {
        this.data.chair_id = chair_id;
        gameCenter.user.OnRecv_RobotActorPublicInfo(this.data);
    }
    /**
     * 离桌
     */
    exitTable() {
        gameCenter.user.OnRecv_ActorDestory({
            user_id:this.data.user_id
        })
    }

    get gold() {
        return this.data.gold;
    }
    set gold(gold) {
        this.data.gold = gold;
        this.changeActorVariableInfo(ACTOR.ACTOR_PROP_GOLD,gold);
    }

    changeActorVariableInfo(prop_id,value) {
        gameCenter.user.OnRecv_ActorVariableInfo({
            user_id: this.data.user_id,
            info: [{
                prop_id: prop_id,
                value: value
            }]
        })
    }
}