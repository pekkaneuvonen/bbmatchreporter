import { observable } from "mobx";
import { Improvement } from "./Improvement";

export class Player {
    public name: number;
    @observable public goals: number = 0;
    @observable public casualty: number;
    @observable public completions: number = 0;
    @observable public intercepts: number = 0;
    @observable public injury: number;
    @observable public improvement: number;

    constructor (props: any) {
        this.name = props.name;
    }

    public get improvementLine(): string {
        return this.name + ":" + Improvement.getImprovementType(this.improvement);
    }
}
