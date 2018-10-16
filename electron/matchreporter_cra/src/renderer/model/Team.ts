import { observable } from "mobx";
import { Kvalue } from "../types/Kvalue";
import { Player } from "./Player";


export class Team {
    // prematch
    public name: string = "-";
    public teamValue: number;
    public rerolls: number;
    public notes: string;
    @observable public inducements: string;
    public fanFactor: number;
    public gateValue: number

    @observable public tv: Kvalue;
    @observable public gate: Kvalue;

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
        this.tv = props.tv ? new Kvalue(props.tv) : new Kvalue(0);
        this.rerolls = props.rerolls ? props.rerolls : 0;
        this.notes = props.notes ? props.notes : "-";
        this.inducements = props.inducements ? props.inducements : "-";
        this.fanFactor = props.fanFactor ? props.fanFactor : 0;
        this.gate = props.gate ? new Kvalue(props.gate) : new Kvalue(0);
    }
}
