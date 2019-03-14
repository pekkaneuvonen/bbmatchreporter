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

  public addScorer(team: Team, playerNum: number): void {
    if (this.report && this.homeTeam) {
      if (!this.homeTeam.scorers) {
        this.homeTeam.scorers = [];
      }
      let player: Player | undefined = this.homeTeam.scorers.find((pl: Player) => {
          return pl.name === playerNum;
      });
      if (!player) {
          player = new Player({name: playerNum});
          this.homeTeam.scorers.push(player);
      }
      player.goals++;
    }
  }

  public addThrower(team: Team, playerNum: number): void {
    if (this.report && this.homeTeam) {
      if (!this.homeTeam.completions) {
        this.homeTeam.completions = [];
      }
      let player: Player | undefined = this.homeTeam.completions.find((pl: Player) => {
        return pl.name === playerNum;
      });
      if (!player) {
          player = new Player({name: playerNum});
          this.homeTeam.completions.push(player);
      }
      player.completions++;
    }
  }

  public addInjury(team: Team, playerNum: number, injury: number): void {
    if (this.report && this.homeTeam) {
      if (!this.homeTeam.injureds) {
        this.homeTeam.injureds = [];
      }
      let player: Player | undefined = this.homeTeam.injureds.find((pl: Player) => {
        return pl.name === playerNum;
      });
      if (!player) {
          player = new Player({name: playerNum});
          player.injuries = [];
          this.homeTeam.injureds.push(player);
      }
      player.injuries.push(new Casualty({D68: injury}));
    }
  }

  public addIntercept(team: Team, playerNum: number): void {
    if (this.report && this.homeTeam) {
      if (!this.homeTeam.intercepts) {
        this.homeTeam.intercepts = [];
      }
      let player: Player | undefined = this.homeTeam.intercepts.find((pl: Player) => {
        return pl.name === playerNum;
      });
      if (!player) {
          player = new Player({name: playerNum});
          this.homeTeam.intercepts.push(player);
      }
      player.intercepts++;
    }
  }

  public addCasualty(team: Team, inflicterNum: number, injuredNum: number, injury: number): void {
    if (this.report && this.homeTeam) {
      if (!this.homeTeam.inflicters) {
        this.homeTeam.inflicters = [];
      }
      let inflicter: Player | undefined = this.homeTeam.inflicters.find((pl: Player) => {
        return pl.name === inflicterNum;
      });
      if (!inflicter) {
        inflicter = new Player({name: inflicterNum});
        inflicter.casualties = [];
        this.homeTeam.inflicters.push(inflicter);
      }
      inflicter.casualties.push(new Casualty({D68: injury}));

      if (!this.homeTeam.injureds) {
        this.homeTeam.injureds = [];
      }
      let injured: Player | undefined = this.homeTeam.injureds.find((pl: Player) => {
        return pl.name === injuredNum;
      });
      if (!injured) {
        injured = new Player({name: injuredNum});
        injured.injuries = [];
        this.homeTeam.injureds.push(injured);
      }
      injured.injuries.push(new Casualty({D68: injury}));
    }
  }
}

export enum Screens {
  Home = "/",
  Prematch = "/prematch",
  Match = "/match",
  Postmatch = "/postmatch",
}
