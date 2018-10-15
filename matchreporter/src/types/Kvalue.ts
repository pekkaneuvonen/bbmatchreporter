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
    public add(addedV: number) {
        this.value += addedV;
    }

    public get asString(): string {
        return this.prValue ? String(Math.abs(this.prValue)/1000) + "k" : "-";
    }
}