import { _decorator, Component, Node, log, director, Director, warn, CCString } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SceneManager')
export default class SceneManager extends Component {
    @property(Node)
    private loadingScreen: Node = null; // 加载界面节点

    private currentScene: string = ""; // 当前场景名称
    private isLoading: boolean = false; // 是否正在加载场景

    // 预加载的场景名称列表
    @property([String])
    private preloadScenes: string[] = [];

    onLoad() {
        director.addPersistRootNode(this.node);
        // 注册一个场景加载完成的回调
        director.on(Director.EVENT_AFTER_SCENE_LAUNCH, this.onSceneLoaded, this);

        // 预加载所有场景
        this.preloadScenes.forEach((sceneName) => {
            director.preloadScene(sceneName, () => {
                log(`预加载场景: ${sceneName} 完成`);
            });
        });
    }

    onDestroy() {
        director.off(Director.EVENT_AFTER_SCENE_LAUNCH, this.onSceneLoaded, this);
    }

    // 切换到指定场景
    public async changeScene(sceneName: string) {
        if (this.isLoading) {
            warn("正在加载场景，请稍候...");
            return;
        }

        if (sceneName === this.currentScene) {
            warn(`当前已经在场景 ${sceneName} 中`);
            return;
        }

        this.isLoading = true;
        this.loadingScreen.active = true;

        await this.waitTwoSeconds();

        // 加载新场景
        director.loadScene(sceneName);
    }

    async waitTwoSeconds(): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, 2000); // 2000毫秒等于2秒
        });
    }

    // 场景加载完成后的回调
    private onSceneLoaded(event: /**Event.EventCustom*/any) {
        this.isLoading = false;
        this.loadingScreen.active = false;

        const newSceneName: string = director.getScene().name;
        log(`切换到场景: ${newSceneName}`);

        this.currentScene = newSceneName;
    }
}
