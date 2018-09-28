import { Kvalue } from "../types/Kvalue"

export class Team {
    public name: string = "-";
    public tv: Kvalue = new Kvalue(0);
    public rerolls: number = 0;
    public notes: string = "-";
    public fanFactor: number = 0;
    public gate: Kvalue = new Kvalue(0);

    constructor (props: any) {
        // console.log('new team name: ', props.name);
        
        this.name = props.name;
        this.tv = props.tv;
        this.rerolls = props.rerolls;
        this.notes = props.notes;
        this.fanFactor = props.fanFactor;
        this.gate = new Kvalue(props.gate);
    }
}
