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
    public scorers: Player[] = [];
    public inflicters: Player[] = [];
    public injureds: Player[] = [];
    public completions: Player[] = [];
    public intercepts: Player[] = [];
    public winnings: string;
    public fanFactorModifier: string;
    public mvp: string;
    public improvements: Player[] = [];


    constructor (props: any) {
        /*
        console.log('new team name: ', props.name);
        console.log('props.winnings: ', props.winnings);
        console.log('props.fanFactorModifier: ', props.fanFactorModifier);
        console.log('props.mvp: ', props.mvp);
        */
        this.name = props.name;
        this.teamValue = props.teamValue ? props.teamValue : 0;
        this.rerolls = props.rerolls ? props.rerolls : 0;
        this.notes = props.notes ? props.notes : "-";
        this.inducements = props.inducements ? props.inducements : "-";
        this.fanFactor = props.fanFactor ? props.fanFactor : 0;
        this.gateValue = props.gateValue ? props.gateValue : 0;
        this.winnings = props.winnings ? props.winnings : "-";
        this.fanFactorModifier = props.fanFactorModifier ? props.fanFactorModifier : "-";
        this.mvp = props.mvp ? props.mvp : "-";
    }
    public get gateString(): string {
        return new Kvalue(this.gateValue).asString;
    }
    public get tvString(): string {
        return new Kvalue(this.teamValue).asString;
    }
    public get badlyHurts():number {
        return 0;
    }
    public get seriousInjuries():number {
        return 0;
    }
    public get kills():number {
        return 0;
    }
    /*
    public get sppResults(): Player[] {
        const sppList: Player[] = [];
        if (this.scorers && this.scorers.length > 0) {
            for (const scorer of this.scorers) {
                let player: Player | undefined = sppList.find((pl: Player) => {
                    return pl.name === scorer;
                });
                if (!player) {
                    player = new Player({name: scorer})
                }
                player.goals++;
            }
        }
        return sppList;
    }
    */
}
