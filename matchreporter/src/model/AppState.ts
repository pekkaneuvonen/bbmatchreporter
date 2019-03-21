import { observable } from "mobx";
import { Kvalue } from "../types/Kvalue";
import { Casualty } from "./Casualty";
import { Player } from "./Player";
import { Report } from "./Report";
import { Team } from "./Team";

/**
 * Application state / root state manager.
 */
export class AppState {
  @observable public screen: string;
  @observable public prevTab?: string;
  @observable public showTabNavigator: boolean;
  @observable public showTab: boolean;
  @observable public reportType?: string;
  @observable public reportsList: Report[] = [];
  public brandNewReport: boolean = false;
  public createdReportsCount: number = 0;
  @observable public currentWeather: string = "";
  
  @observable public report!: Report;
  @observable public homeTeam!: Team;
  @observable public awayTeam!: Team;

  @observable public inducementValueOverride?: Kvalue;
  
  public defaultTimerValue: number = 300000; // 5 min = 5 * 60000
  @observable public setTimerValue: number = 0;
  @observable public currentTimerValue: number = 0;

  @observable public eventsblocked: boolean = false;

  @observable public windowWidth: number = 640;

  constructor() {
    this.screen = Screens.Home;
    this.showTabNavigator = false;
    this.showTab = false;
  }

  public createdReport = (newReport: Report) => {
    this.brandNewReport = true;
    this.reportsList.push(newReport);
    return newReport;
  }

  public addScorer(team: Team, playerNum: string): void {
    if (this.report && (team === this.homeTeam || team === this.awayTeam)) {
      if (!team.scorers) {
        team.scorers = [];
      }
      let player: Player  = new Player({name: playerNum});
      team.scorers.push(player);
    }
  }

  public addThrower(team: Team, playerNum: string): void {
    if (this.report && (team === this.homeTeam || team === this.awayTeam)) {
      if (!team.completions) {
        team.completions = [];
      }
      let player: Player = new Player({name: playerNum});
      team.completions.push(player);
    }
  }

  public addInjury(team: Team, playerNum: string, injury: number): void {
    if (this.report && (team === this.homeTeam || team === this.awayTeam)) {
      if (!team.injureds) {
        team.injureds = [];
      }
      let player: Player = new Player({name: playerNum});
      player.injuries = [new Casualty({D68: injury})];
      team.injureds.push(player);
    }
  }

  public addIntercept(team: Team, playerNum: string): void {
    if (this.report && (team === this.homeTeam || team === this.awayTeam)) {
      if (!team.intercepts) {
        team.intercepts = [];
      }
      let player: Player = new Player({name: playerNum});
      team.intercepts.push(player);
    }
  }

  public addCasualty(team: Team, inflicterNum: string, injuredNum: string, injury: number): void {
    if (this.report && (team === this.homeTeam || team === this.awayTeam)) {
      if (!team.inflicters) {
        team.inflicters = [];
      }
      let inflicter: Player = new Player({name: inflicterNum});
      inflicter.casualties = [new Casualty({D68: injury})];
      team.inflicters.push(inflicter);
      
      if (!team.injureds) {
        team.injureds = [];
      }
      let injured: Player = new Player({name: injuredNum});
      injured.injuries = [new Casualty({D68: injury})];
      team.injureds.push(injured);
    }
  }
}

export enum Screens {
  Home = "/",
  Prematch = "/prematch",
  Match = "/match",
  Postmatch = "/postmatch",
}
