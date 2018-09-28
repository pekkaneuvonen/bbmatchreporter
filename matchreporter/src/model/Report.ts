import { Kvalue } from "../types/Kvalue";
import {Team} from "./Team";
// tslint:disable:no-console

export class Report {
    public id: number;
    public title: string = "-";
    public totalGate: Kvalue = new Kvalue(0);
    public home: Team;
    public away: Team;

    constructor (props: any) {

        // console.log('new report title: ', props.title);
        this.id = props.id;
        this.title = props.title;
        this.home = new Team(props.home);
        this.away = new Team(props.away);

        // console.log(' home gate ', this.home.gate.asString, this.home.gate.value);

        this.totalGate = new Kvalue(this.home.gate.value + this.away.gate.value);
        // console.log(' report totalGate: ', this.totalGate.asString);

    }
}
export default Report;