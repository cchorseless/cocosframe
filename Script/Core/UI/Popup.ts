import { _decorator } from 'cc';
const { ccclass, property } = _decorator;

import View from "./UI";

@ccclass('Popup')
export default class Popup extends View {
    public async _open(...param: any[]): Promise<void> {
        await super._open(...param);
    }

    public async _close(): Promise<void> {
        return new Promise((complete: Function) => {
            super._close();
            complete();
        });
    }
}
