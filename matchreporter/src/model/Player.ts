import { observable } from "mobx";
import { Injury } from "./Injury";

export class Player {
    public name: number;
    @observable public goals: number = 0;
    @observable public casualties: number[] = [];
    @observable public completions: number = 0;
    @observable public intercepts: number = 0;
    @observable public injuries: number[] = [];

    constructor (props: any) {
        this.name = props.name;
    }
}
