import { observable } from "mobx";
import { Kvalue } from "../types/Kvalue";
import { GameEvent } from "./GameEvent";
import { Report } from "./Report";
import { Team } from "./Team";

import { Reports } from '../services/Reports';
import { Injury, CasualtyType } from "./Injury";
import { report_field_divider } from '../utils/StringFormatter';

/**
 * Application state / root state manager.
 */
export class AppState {

  @observable public screen: string;
  public prevscreen: string | undefined;
  
  @observable public prevTab?: string;
  @observable public showTabNavigator: boolean;
  @observable public showTab: boolean;
  @observable public reportType?: string;
  @observable public reportsList: Report[] = [];
  public brandNewReport: Report | null = null;
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
  public openReport = (report: Report) => {
    console.log("opening report ", report);
    this.report = report;
    this.homeTeam = report.home;
    this.awayTeam = report.away;
    this.currentWeather = report.weather ? report.weather[0] : "null";
  }
  public createdReport = (newReport: Report) => {
    this.brandNewReport = newReport;
    this.reportsList.push(newReport);
    return newReport;
  }
  public updateWeather = (weather: any) => {
    this.report.weather[0] = weather;
    this.updateReport();
  }
  public addScorer(team: Team, player: string): void {
    if (this.report && (team === this.homeTeam || team === this.awayTeam)) {
      if (team.scorers === "") {
        team.scorers = team.scorers.concat(player);
      } else {
        team.scorers = team.scorers.concat(report_field_divider+player);
      }
      team.goals++;
      // let player: Player  = new Player({name: playerNum});
      this.updateReport();
    }
  }

  public addThrower(team: Team, player: string): void {
    if (this.report && (team === this.homeTeam || team === this.awayTeam)) {
      if (team.completions === "") {
        team.completions = team.completions.concat(player);
      } else {
        team.completions = team.completions.concat(report_field_divider+player);
      }
      // team.completions.push(player);
      this.updateReport();
    }
  }

  public addInjury(team: Team, player: string, injuryNum: number): void {
    if (this.report && (team === this.homeTeam || team === this.awayTeam)) {
      if (!team.sufferedinjuries) {
        team.sufferedinjuries = [];
      }
      let injuryEvent: GameEvent = new GameEvent({player: player});
      injuryEvent.injury = injuryNum;
      team.sufferedinjuries.push(injuryEvent);

      // casualtiesinflicted is in fact total team casualties every injury is added to the total
      const opposingTeam: Team = team === this.homeTeam ? this.awayTeam : this.homeTeam;
      opposingTeam.casualtiesinflicted++;

      this.updateReport();
    }
  }

  public addIntercept(team: Team, player: string): void {
    if (this.report && (team === this.homeTeam || team === this.awayTeam)) {
      if (team.intercepts === "") {
        team.intercepts = team.intercepts.concat(player);
      } else {
        team.intercepts = team.intercepts.concat(report_field_divider+player);
      }
      // team.intercepts.push(player);
      this.updateReport();
    }
  }

  public addCasualty(team: Team, inflicter: string, injured: string, injuryNum: number): void {
    if (this.report && (team === this.homeTeam || team === this.awayTeam)) {
      let casualtyEvent: GameEvent = new GameEvent({player: inflicter});
      casualtyEvent.casualty = injuryNum;
      team.casualtiesinflicted++;
      const casCategory: CasualtyType = Injury.getCasualtyType(injuryNum);
      switch (casCategory) {
        case CasualtyType.BadlyHurt:
          if (team.badlyhurts === "") {
            team.badlyhurts = team.badlyhurts.concat(inflicter);
          } else {
            team.badlyhurts = team.badlyhurts.concat(report_field_divider+inflicter);
          }
          break;
        case CasualtyType.SeriousInjury:
          if (team.seriousinjuries === "") {
            team.seriousinjuries = team.seriousinjuries.concat(inflicter);
          } else {
            team.seriousinjuries = team.seriousinjuries.concat(report_field_divider+inflicter);
          }
          break;
        case CasualtyType.Kill:
          if (team.kills === "") {
            team.kills = team.kills.concat(inflicter);
          } else {
            team.kills = team.kills.concat(report_field_divider+inflicter);
          }
          break;
      }
    
      const opposingTeam: Team = team === this.homeTeam ? this.awayTeam : this.homeTeam;
      if (!opposingTeam.sufferedinjuries) {
        opposingTeam.sufferedinjuries = [];
      }
      let injuryEvent: GameEvent = new GameEvent({player: injured});
      injuryEvent.injury = injuryNum;
      opposingTeam.sufferedinjuries.push(injuryEvent);
      this.updateReport();
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
