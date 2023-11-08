import { _decorator, Color, EventMouse, Graphics, macro, Node, sys, systemEvent, SystemEvent, UITransform } from 'cc';
import MapGameData from "../MapGameData";


export default class MapEditor {
    private mouseDown: number;
    public async init(mapNode: Node, mapData) {
        mapNode.active = false;
        var width = MapGameData.GameCellWidth;
        var height = MapGameData.GameCellHeight;
        let uiTransform=mapNode.getComponent(UITransform)
        var blocks = mapData.blocks;
        for (let j = 0; j < blocks.length; j++) {
            for (let i = 0; i < blocks[j].length; i++) {
                let node = new Node();
                mapNode.addChild(node);
                node.setPosition(
                        -uiTransform.width / 2 + i * width + width / 2,
                 uiTransform.height / 2 - j * height - height / 2);
                // log(j + "," + i + "," + node.x + "," + node.y);
             let _ui=   node.addComponent(UITransform);
             _ui. width = width;
             _ui.height = height;

                if (blocks[j][i] == 0) {
                    this.setBlock(node, true);
                }

                node.on(Node.EventType.MOUSE_DOWN, (event: EventMouse) => {
                    this.mouseDown = event.getButton();
                    blocks[j][i] = this.mouseDown == EventMouse.BUTTON_LEFT ? 0 : 1;
                    this.setBlock(node, blocks[j][i] == 0);
                }, this);

                node.on(Node.EventType.MOUSE_UP, (event) => {
                    this.mouseDown = -1;
                }, this);

                node.on(Node.EventType.MOUSE_ENTER, (event) => {
                    if (this.mouseDown >= 0) {
                        blocks[j][i] = this.mouseDown == EventMouse.BUTTON_LEFT ? 0 : 1;
                        this.setBlock(node, blocks[j][i] == 0);
                    }
                }, this);

                node.on(Node.EventType.TOUCH_MOVE, function (event) {
                    event.stopPropagation();
                }, this);
            }
        }
        systemEvent.on(SystemEvent.EventType.KEY_DOWN, function (event) {
            if (event.keyCode == macro.KEY.i) {
                mapNode.active = !mapNode.active;
            }
            else if (event.keyCode == macro.KEY.w) {
                if (sys.isBrowser) {
                    let textFileAsBlob = new Blob([JSON.stringify(mapData)], { type: 'application/json' });
                    let downloadLink = document.createElement("a");
                    downloadLink.download = "data.json";
                    downloadLink.innerHTML = "Download File";
                    if (window.webkitURL != null) {
                        downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
                    }
                    downloadLink.click();
                }
            }
        }, this);
    }

    public setBlock(node: Node, block: boolean) {
        let graphics = node.getComponent(Graphics);
        if (!graphics) {
            graphics = node.addComponent(Graphics);
        }
        graphics.clear();
        if (block) {
            // 设置矩形的颜色
            var color = new Color(255, 0, 0, 128); // 使用RGBA颜色表示，最后一个参数是透明度
            graphics.fillColor = color;
            // 绘制矩形
            let uiTransform=node.getComponent(UITransform);
            graphics.fillRect(-uiTransform.width / 2, -uiTransform.height / 2, uiTransform.width - 1, uiTransform.height - 1);
            // 确认绘制
            graphics.fill();
        }
    }
}
