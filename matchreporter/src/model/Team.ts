import { observable } from "mobx";
import { Kvalue } from "../types/Kvalue";
import { GameEvent } from "./GameEvent";

export class Team {
    // prematch
    public name: string = "-";

    @observable public teamValue: number;
    public rerolls: number;
    public notes: string;
    @observable public inducements: string;
    public fanFactor: number;
    @observable public gateValue: number;
    /*
        teamValue: Number,
        rerolls: Number,
        notes: String,
        inducements: String,
        fanFactor: Number,
        gateValue: Number,
        goals: Number,
        winnings: String,
        fanFactorModifier: String,
        casualtiesinflicted: Number,
        mvp: String,
        completions: String,
        scorers: String,
        intercepts: String,
        badlyhurts: String,
        seriousinjuries: String,
        kills: String,
        sufferedinjuries: [GameEvent],
        improvements: [GameEvent], 
    */
    // postmatch
    public goals: number;
    public winnings: string;
    public fanFactorModifier: string;
    public casualtiesinflicted: number;
    public mvp: string;
    public completions: string;
    public scorers: string;
    public intercepts: string;
    public badlyhurts: string;
    public seriousinjuries: string;
    public kills: string;
    public sufferedinjuries: GameEvent[] = [];
    public improvements: GameEvent[] = [];


    constructor (props: any) {
        
        this.name = props.name;
        this.teamValue = props.teamValue ? props.teamValue : 0;
        this.rerolls = props.rerolls ? props.rerolls : 0;
        this.notes = props.notes ? props.notes : "-";
        this.inducements = props.inducements ? props.inducements : "-";
        this.fanFactor = props.fanFactor ? props.fanFactor : 0;
        this.gateValue = props.gateValue ? props.gateValue : 0;

        this.goals = props.goals ? props.goals : 0;
        this.winnings = props.winnings ? props.winnings : "-";
        this.fanFactorModifier = props.fanFactorModifier ? props.fanFactorModifier : "-";
        this.casualtiesinflicted = props.casualtiesinflicted ? props.casualtiesinflicted : 0;
        this.mvp = props.mvp ? props.mvp : "-";
        this.completions = props.completions ? props.completions : "";
        this.scorers = props.scorers ? props.scorers : "";
        this.intercepts = props.intercepts ? props.intercepts : "";
        this.badlyhurts = props.badlyhurts ? props.badlyhurts : "";
        this.seriousinjuries = props.seriousinjuries ? props.seriousinjuries : "";
        this.kills = props.kills ? props.kills : "";
        
        this.sufferedinjuries = props.sufferedinjuries ? props.sufferedinjuries : [];
        this.improvements = props.improvements ? props.improvements : [];

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
        let vString: string = "";
        for (let i = 0; i < this.completions.length; i++) {
            if (i > 0) {
                vString = vString.concat(", ");
            }
            vString = vString.concat(this.completions[i].toString());
        }
        return vString;
    }
    public get scorersString(): string {
        let vString: string = "";
        for (let i = 0; i < this.scorers.length; i++) {
            if (i > 0) {
                vString = vString.concat(", ");
            }
            vString = vString.concat(this.scorers[i].toString());
        }
        return vString;
    }
    /*
    public get interceptsString(): string {
        let vString: string = "";
        for (let i = 0; i < this.intercepts.length; i++) {
            if (i > 0) {
                vString = vString.concat(", ");
            }
            vString = vString.concat(this.intercepts[i].toString());
        }
        return vString;
    }
    public get badlyHurtsString(): string {
        let vString: string = "";
        let casCount: number = 0;
        for (let i = 0; i < this.casualties.length; i++) {
            if (Injury.getCasualtyType(this.casualties[i].casualty) === CasualtyType.BadlyHurt) {
                if (casCount > 0) {
                    vString = vString.concat(", ");
                }
                vString = vString.concat(this.casualties[i].player);
                casCount++;
            }
        }
        return vString;
    }
    public get seriousInjuriesString(): string {
        let vString: string = "";
        let casCount: number = 0;
        for (let i = 0; i < this.casualties.length; i++) {
            if (Injury.getCasualtyType(this.casualties[i].casualty) === CasualtyType.SeriousInjury) {
                if (casCount > 0) {
                    vString = vString.concat(", ");
                }
                vString = vString.concat(this.casualties[i].player);
                casCount++;
            }
        }
        return vString;
    }
    public get killsString(): string {
        let vString: string = "";
        let casCount: number = 0;
        for (let i = 0; i < this.casualties.length; i++) {
            if (Injury.getCasualtyType(this.casualties[i].casualty) === CasualtyType.Kill) {
                if (casCount > 0) {
                    vString = vString.concat(", ");
                }
                vString = vString.concat(this.casualties[i].player);
                casCount++;
            }
        }
        return vString;
    }
    */
}
