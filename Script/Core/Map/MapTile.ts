import { _decorator, Asset, ImageAsset, log, resources, Sprite, SpriteFrame, Texture2D, view } from 'cc';
import MapGameData from "./MapGameData";


export default class MapTile extends Sprite {
    public col: number;
    public row: number;
    private tileResKey: string;

    public constructor() {
        super();
    }

    public init(mapId: number, col: number, row: number) {
        this.col = col;
        this.row = row;
        // 获取屏幕大小
        const screenSize = view.getVisibleSize();
        // 获取屏幕宽度
        const screenWidth = screenSize.width;
        // 获取屏幕高度
        const screenHeight = screenSize.height;
       let x = this.col * MapGameData.GameTileWidth - screenWidth / 2 + MapGameData.GameTileWidth / 2;
       let y = screenHeight / 2 - this.row * MapGameData.GameTileHeight - MapGameData.GameTileHeight / 2;
        this.node.setPosition(x,y)
        var tileResName: string = row + "_" + col;
        var tileResPath: string = "/map/" + mapId + "/" + tileResName;
        this.tileResKey = tileResPath;//"map_" + mapId + "_" + tileResName;

        var that = this;
        //异步加载
        resources.load(tileResPath, (error: Error, asset: Asset) => {
            if (error) {
                log(error.message);
                return;
            }
            that.spriteFrame =  SpriteFrame.createWithImage(asset as ImageAsset);
        });
    }

    public destory(): void {
        resources.release(this.tileResKey);
        // App.DisplayUtils.removeFromParent(this);
        // RES.destroyRes(this.tileResKey);
        // this.texture = null;
    }
}
