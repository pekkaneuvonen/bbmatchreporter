import { observable } from "mobx";
import { Improvement } from "./Improvement";

interface IPostmatchState {
    player: string,
}
export class GameEvent {
    public player: string;
    @observable public goals: number = 0;
    @observable public casualty: number;
    @observable public completions: number = 0;
    @observable public intercepts: number = 0;
    @observable public injury: number;
    @observable public improvementThrow1: number = 0;
    @observable public improvementThrow2: number = 0;

    constructor (props: IPostmatchState) {
        this.player = props.player;
    }
}
