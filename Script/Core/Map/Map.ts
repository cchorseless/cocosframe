import { _decorator, error, Node, resources } from 'cc';
import MapTiles from "./MapTiles";


export default class Map {
    private tiles: MapTiles;
    private node: Node;
    private mapData: any;

    constructor(node) {
        this.node = node;
    }

    public async init(mapId: number) {
        var that = this;
        await new Promise((complete: Function) => {
            resources.load("/map/" + mapId + "/data", function (err, data:any) {
                if (err) {
                    error(err.message || err);
                    complete();
                }
                var mapData: any = data.json;
                that.mapData = mapData;
                complete();
            });
        });

        this.tiles = new MapTiles(this.node);
        this.tiles.init(mapId, this.mapData);
        this.updateCameraPos(0, 0);
    }

    public updateCameraPos($x: number, $y: number): void {
        // log($x + "," + $y);
        this.tiles.updateCameraPos($x, $y);
    }

    public getMapData() {
        return this.mapData;
    }
}
