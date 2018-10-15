import { Kvalue } from "../types/Kvalue";
import {Team} from "./Team";
// tslint:disable:no-console

export class Report {
    public id: string;
    public date: Date;
    public title: string = "-";
    public totalGate: Kvalue = new Kvalue(0);
    public totalGateValue: number = 0;
    public home: Team;
    public away: Team;
    public weather: string[] = [];

    constructor (props: any) {

        // console.log('new report title: ', props.title);
        this.id = props.id;
        this.title = props.title;
        this.home = new Team(props.home);
        this.away = new Team(props.away);

        if (props.date) {
            // console.log(' date ', props.date);
            this.date = new Date(props.date)
            // console.log(' day ', this.date.getDate());
        }
        try {
            this.totalGate = new Kvalue(this.home.gate.value + this.away.gate.value);
            // console.log(' report totalGate: ', this.totalGate.asString);
        } catch (error) {
            console.log(' unable to calculate report totalGate.');
        }
    }
}
export default Report;