import { _decorator, Component, Label } from 'cc';
import Log from './Core/Log/Log';
import Instance from './Core/Utils/Instance';
const {ccclass, property} = _decorator;

@ccclass('Helloworld')
export default class Helloworld extends Component {
    @property(Label)
    label: Label | null = null;
    @property
    text: string = 'hello';

    start() {
       // init logic
        // this.label.string = this.text;
        Instance.get(Log,1).log(11111+"")
    }
}



