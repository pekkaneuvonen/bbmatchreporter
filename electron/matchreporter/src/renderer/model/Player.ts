import { observable } from "mobx";
import { Casualty } from "./Casualty";

export class Player {
    public name: number;
    @observable public goals: number;
    @observable public casualties: Casualty[];
    @observable public completions: number;
    @observable public intercepts: number;
    @observable public injuries: Casualty;

    constructor (props: any) {
        this.name = props.name;
    }
}
