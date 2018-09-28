export class Kvalue {
    protected prValue: number;

    constructor (initValue?: number) {
        this.prValue = initValue ? initValue : 0;
    }

    public set value (v: number) {
        this.prValue = v; 
    }
    public get value(): number {
        return this.prValue;
    }

    public get asString(): string {
        return String(this.prValue/1000) + " k";
    }
}