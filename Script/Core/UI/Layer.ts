import { _decorator, Node, UITransform } from 'cc';

export default class Layer extends Node {
    constructor(name: string) {
        super(name);
    }

    public addUI(node: Node): void {
        if (node.parent) {
            node.removeFromParent();
        }
        node.getComponent(UITransform). setAnchorPoint(0.5, 0.5);
        this.addChild(node);
    }

    public removeUI(node: Node): void {
        if (node.isChildOf(this)) {
            node.removeFromParent();
            node.destroy();
        }
    }
}
