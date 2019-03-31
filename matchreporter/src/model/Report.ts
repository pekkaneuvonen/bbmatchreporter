import { Kvalue } from "../types/Kvalue";
import {Team} from "./Team";
// tslint:disable:no-console

export class Report {
    public id: string;
    public date?: Date;
    public title: string = "-";
    public totalGate: Kvalue = new Kvalue(0);
    public totalGateValue: number = 0;
    public home: Team;
    public away: Team;
    public weather: string[] = [];

    constructor (props: any) {

        // console.log('initialising report : ', props.title);
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
            this.totalGate = new Kvalue(this.home.gateValue + this.away.gateValue);
            // console.log(' report totalGate: ', this.totalGate.asString);
        } catch (error) {
            console.log(' unable to calculate report totalGate.');
        }
        if (props.weather) {
            this.weather = props.weather;
        }
    }
    public get fame(): number {
        let gateDifference: number = 0;
        if (this.home && this.away) {
            if (this.home.gateValue > 0 && this.away.gateValue > 0) {
                if (this.away.gateValue >= this.home.gateValue * 2) {
                    gateDifference = 2;
                } else if (this.away.gateValue > this.home.gateValue) {
                    gateDifference = 1;
                } else if (this.home.gateValue >= this.away.gateValue * 2) {
                    gateDifference = -2;
                } else if (this.home.gateValue > this.away.gateValue) {
                    gateDifference = -1;
                }
            }
        }
        return gateDifference;
    }

}
export default Report;