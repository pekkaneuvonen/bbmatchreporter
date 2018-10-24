import { observable } from "mobx";
import { Kvalue } from "../types/Kvalue";
import { Player } from "./Player";


export class Team {
    // prematch
    public name: string = "-";
    public rerolls: number;
    public notes: string;
    @observable public inducements: string;
    public fanFactor: number;

    @observable public teamValue: number;
    @observable public gateValue: number;

    // postmatch
    public scorers: Player[];
    public cInflicted: Player[];
    public cSuffered: Player[];
    public injured: Player[];
    public completions: Player[];
    public intercepts: Player[];

    constructor (props: any) {
        // console.log('new team name: ', props.name);
        
        this.name = props.name;
        this.teamValue = props.teamValue ? props.teamValue : 0;
        this.rerolls = props.rerolls ? props.rerolls : 0;
        this.notes = props.notes ? props.notes : "-";
        this.inducements = props.inducements ? props.inducements : "-";
        this.fanFactor = props.fanFactor ? props.fanFactor : 0;
        this.gateValue = props.gateValue ? props.gateValue : 0;
    }
    public get gateString(): string {
        return new Kvalue(this.gateValue).asString;
    }
    public get tvString(): string {
        return new Kvalue(this.teamValue).asString;
    }
}
