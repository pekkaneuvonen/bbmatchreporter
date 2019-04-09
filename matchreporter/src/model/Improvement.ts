export class Improvement {
    public D66: number;

    constructor (props: any) {
        this.D66 = props.D66;
    }
    public static getImprovementType(D66: number): ImprovementType {
        if (D66 < 60 && D66 >= 40) {
            return ImprovementType.SeriousInjury;
        } else if (D66 >= 60) {
            return ImprovementType.Kill;
        } else {
            return ImprovementType.BadlyHurt;
        }
    }
}
export enum ImprovementType {
    BadlyHurt = "Badly Hurt",
    SeriousInjury = "Serious Injury",
    Kill = "Kill"
}