
import { _decorator, Component, Node as ccNode, ScrollView, UITransform, instantiate, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

export class FWAnimationEvent extends Component {
    declare public onAnimEvent:(...params: any[])=> void;
}