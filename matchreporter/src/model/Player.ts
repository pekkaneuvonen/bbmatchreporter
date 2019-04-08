import { observable } from "mobx";
import { Casualty } from "./Injury";

export class Player {
    public name: number;
    @observable public goals: number = 0;
    @observable public casualties: Casualty[] = [];
    @observable public completions: number = 0;
    @observable public intercepts: number = 0;
    @observable public injuries: Casualty[] = [];

    constructor (props: any) {
        this.name = props.name;
    }
}
