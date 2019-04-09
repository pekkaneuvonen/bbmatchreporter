import { observable } from "mobx";

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
}
