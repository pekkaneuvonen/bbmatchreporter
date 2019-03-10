
export default class DLAsset {
    public uid: string;
    public type: string;
    public url: string;
    public localDirPath: string;
    public size: number;
    public received: number;
    public engine: string;
    private _DLprogress: number;
    public dlProgressCallback: (DLprogress: number) => void;

    constructor (uid: string, type: string, size: number, url: string, localDirPath: string) {
        this.uid = uid;
        this.type = type;
        this.url = url;
        this.size = size;
        this.localDirPath = localDirPath;
        this.received = 0;
        // this.progress = 0;
    }
    
    public set DLprogress(p: number) {
        this._DLprogress = p;
        if (this.dlProgressCallback) {
            this.dlProgressCallback(this._DLprogress);
        }
    }
    public get DLprogress(): number {
        return this._DLprogress;
    }
}