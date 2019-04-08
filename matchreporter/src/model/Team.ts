import { observable } from "mobx";
import { Kvalue } from "../types/Kvalue";
import { Player } from "./Player";
import { Injury, CasualtyType } from "./Injury";

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
    public scorers: number[] = [];
    public inflicters: Player[] = [];
    public injureds: Player[] = [];
    public completions: number[] = [];
    public intercepts: number[] = [];
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
       this.scorers = props.scorers ? props.scorers : [];
       console.log("props.scorers ", props.scorers ? props.scorers.length : "(no scorers)");
       this.inflicters = props.inflicters ? props.inflicters : [];
       this.injureds = props.injureds ? props.injureds : [];
       this.completions = props.completions ? props.completions : [];
       this.intercepts = props.intercepts ? props.intercepts : [];
       this.improvements = props.improvements ? props.improvements : [];
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
    /*
    public get badlyHurts():number {
        return 0;
    }
    public get seriousInjuries():number {
        return 0;
    }
    public get kills():number {
        return 0;
    }
    */
    public get completionsString(): string {
        let cString: string = "";
        console.log("this.completions ", this.completions.length);
        for (let i = 0; i < this.completions.length; i++) {
            console.log("add ", this.completions[i]);
            cString = cString.concat(this.completions[i].toString());
        }
        return cString;
    }
    public get scorersString(): string {
        let vString: string = "";
        console.log("this.scorers ", this.scorers.length);
        for (let i = 0; i < this.scorers.length; i++) {
            console.log("[" + i + "] ", this.scorers[i].toString());
            vString = vString.concat(this.scorers[i].toString());
        }
        return vString;
    }
    public get interceptsString(): string {
        let vString: string = "";
        console.log("this.intercepts ", this.intercepts.length);
        for (let i = 0; i < this.intercepts.length; i++) {
            vString = vString.concat(this.intercepts[i].toString());
        }
        return vString;
    }
    public get badlyHurtsString(): string {
        let vString: string = "";
        for (let i = 0; i < this.inflicters.length; i++) {
            for (let j = 0; j < this.inflicters[i].casualties.length; j++) {
                if (Injury.getType(this.inflicters[i].casualties[j]) === CasualtyType.BadlyHurt) {
                    vString = vString.concat(this.inflicters[i].name.toString());
                }
            }
        }
        return vString;
    }
    public get seriousInjuriesString(): string {
        let vString: string = "";
        for (let i = 0; i < this.inflicters.length; i++) {
            for (let j = 0; j < this.inflicters[i].casualties.length; j++) {
                if (Injury.getType(this.inflicters[i].casualties[j]) === CasualtyType.SeriousInjury) {
                    vString = vString.concat(this.inflicters[i].name.toString());
                }
            }
        }
        return vString;
    }
    public get killsString(): string {
        let vString: string = "";
        for (let i = 0; i < this.inflicters.length; i++) {
            for (let j = 0; j < this.inflicters[i].casualties.length; j++) {
                if (Injury.getType(this.inflicters[i].casualties[j]) === CasualtyType.Kill) {
                    vString = vString.concat(this.inflicters[i].name.toString());
                }
            }
        }
        return vString;
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
