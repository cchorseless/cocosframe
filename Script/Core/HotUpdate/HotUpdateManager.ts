import { _decorator, Component, Asset, sys, error, log, native } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('HotUpdateManager')
export default class HotUpdateManager extends Component {
   // 用于存储远程manifest文件的URL的cc.Asset
    @property(Asset)
    manifestUrl: Asset | null = null;
   // 存储路径
    private storagePath: string;
   // AssetsManager实例
    private assetsManager: native.AssetsManager;
  
    onLoad() {
        if (!sys.isNative) return;

        // 获取存储路径或使用空字符串作为默认值
        this.storagePath = ((native.fileUtils ? native.fileUtils.getWritablePath() : '/') + 'remote-asset');

        // 创建AssetsManager实例并传入存储路径
        this.assetsManager = new native.AssetsManager('', this.storagePath);

        // 设置版本比较回调函数
        this.assetsManager.setVersionCompareHandle(this.versionCompareHandle.bind(this));

        if (!this.manifestUrl) {
            error('Manifest URL is not set in HotUpdateManager script.');
            return;
        }

        // 加载本地manifest文件
        this.assetsManager.loadLocalManifest(this.manifestUrl.nativeUrl);

        // 设置AssetsManager事件回调
        this.assetsManager.setEventCallback(this.onAssetsManagerEvent);

        // 如果是Android平台，设置最大并发下载任务数
        // if (cc.sys.os === cc.sys.OS_ANDROID) {
        //     this.assetsManager.setMaxConcurrentTask(2);
        // }

        // 检查是否需要更新
        this.checkForUpdate();
    }

    // 自定义版本比较函数
    versionCompareHandle(versionA, versionB) {
        // 在这里编写您自己的版本比较逻辑
        let vA = versionA.split('.');
        let vB = versionB.split('.');
        for (let i = 0; i < vA.length; ++i) {
            let a = parseInt(vA[i]);
            let b = parseInt(vB[i] || '0');
            if (a !== b) {
                return a - b;
            }
        }
        if (vB.length > vA.length) {
            return -1;
        } else {
            return 0;
        }
    }

    // 检查是否需要更新
    checkForUpdate() {
        if (!this.assetsManager.getLocalManifest().isLoaded()) {
            error('Failed to load local manifest.');
            return;
        }

        // 设置检查资源更新的回调函数
        this.assetsManager.setEventCallback(this.onCheckResUpdateCallback.bind(this));

        // 执行检查更新
        this.assetsManager.checkUpdate();
    }

    // 检查资源更新的回调函数
    onCheckResUpdateCallback(event) {
        switch (event.getEventCode()) {
            case native.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                error('No local manifest file found.');
                break;

            case native.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case native.EventAssetsManager.ERROR_PARSE_MANIFEST:
                error('Failed to download or parse the remote manifest file.');
                break;

            case native.EventAssetsManager.ALREADY_UP_TO_DATE:
                log('Already up to date.');
                break;

            case native.EventAssetsManager.NEW_VERSION_FOUND:
                log('New version found. Need to update.');
                this.assetsManager.setEventCallback(null);
                this.updateAssets();
                break;

            default:
                break;
        }
    }

    // 执行资源更新
    updateAssets() {
        if (this.assetsManager.getState() === native.AssetsManager.State.UPDATING) {
            log('Already updating. Please wait...');
            return;
        }

        // 设置AssetsManager事件回调
        this.assetsManager.setEventCallback(this.onAssetsManagerEvent);

        // 执行资源更新
        this.assetsManager.update();
    }

    // 处理AssetsManager事件
    onAssetsManagerEvent(event) {
        switch (event.getEventCode()) {
            case native.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                error('No local manifest file found.');
                break;

            case native.EventAssetsManager.UPDATE_PROGRESSION:
                log(`Update progression: ${event.getPercent()}%`);
                // 更新进度处理
                break;

            case native.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case native.EventAssetsManager.ERROR_PARSE_MANIFEST:
                error('Failed to download or parse the remote manifest file.');
                // 错误处理
                break;

            case native.EventAssetsManager.ALREADY_UP_TO_DATE:
            case native.EventAssetsManager.UPDATE_FINISHED:
                log('Update finished.');
                // 更新完成处理
                break;

            case native.EventAssetsManager.UPDATE_FAILED:
                error('Update failed. ' + event.getMessage());
                // 更新失败处理
                break;

            case native.EventAssetsManager.ERROR_UPDATING:
                error('Asset update error: ' + event.getAssetId() + ', ' + event.getMessage());
                // 更新中的错误处理
                break;

            default:
                break;
        }
    }
}
