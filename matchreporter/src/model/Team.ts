import { observable } from "mobx";
import { Kvalue } from "../types/Kvalue"

export class Team {
    public name: string = "-";
    @observable public tv: Kvalue;
    public rerolls: number;
    public notes: string;
    @observable public inducements: string;
    public fanFactor: number;
    @observable public gate: Kvalue;

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
