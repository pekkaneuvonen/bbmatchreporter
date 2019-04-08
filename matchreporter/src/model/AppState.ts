import { observable } from "mobx";
import { Kvalue } from "../types/Kvalue";
import { Injury } from "./Injury";
import { Player } from "./Player";
import { Report } from "./Report";
import { Team } from "./Team";

import { Reports } from '../services/Reports';
import { WeatherType, WeatherDescription } from "./Weather";

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
  
  @observable public selectedReport: Report | undefined;
  @observable public report!: Report;
  @observable public homeTeam!: Team;
  @observable public awayTeam!: Team;

  @observable public inducementValueOverride?: Kvalue;
  
  public defaultTimerValue: number = 300000; // 5 min = 5 * 60000
  @observable public setTimerTotal: number = 0;
  @observable public currentTimerProgress: number = 0;

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
  public updateWeather = (weather: any) => {
    this.report.weather[0] = weather;
    this.updateReport();
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

  public addInjury(team: Team, playerNum: string, injury: Injury): void {
    if (this.report && (team === this.homeTeam || team === this.awayTeam)) {
      if (!team.injureds) {
        team.injureds = [];
      }
      let player: Player = new Player({name: playerNum});
      player.injuries = [injury];
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

  public addCasualty(team: Team, inflicterNum: string, injuredNum: string, injury: Injury): void {
    if (this.report && (team === this.homeTeam || team === this.awayTeam)) {
      if (!team.inflicters) {
        team.inflicters = [];
      }
      let inflicter: Player = new Player({name: inflicterNum});
      inflicter.casualties = [injury.type];
      team.inflicters.push(inflicter);
      
      if (!team.injureds) {
        team.injureds = [];
      }
      let injured: Player = new Player({name: injuredNum});
      injured.injuries = [injury.effect];
      team.injureds.push(injured);
    }
  }

  public updateReport(): void {
    Reports
    .update(this.report.id, this.report)
    .then(changedReport => {
        console.log(" report on server updated ? :", changedReport);
    })
    .catch(error => {
        console.log(" error on updating current report!");
    })
  }
}



export enum Screens {
  Home = "/",
  Prematch = "/prematch",
  Match = "/match",
  Postmatch = "/postmatch",
}
