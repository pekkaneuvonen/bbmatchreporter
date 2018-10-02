import { observable } from "mobx";
import { Report } from "./Report";
import { Team } from "./Team";

/**
 * Application state / root state manager.
 */
export class AppState {
  @observable public screen: string;
  @observable public prevTab: string;
  @observable public showTabNavigator: boolean;
  @observable public showTab: boolean;
  @observable public reportType: string;
  @observable public reportsList: Report[] = [];
  
  @observable public report: Report;
  @observable public homeTeam: Team;
  @observable public awayTeam: Team;

  @observable public windowWidth: number = 640;
  
  constructor() {
    this.screen = Screens.Home;
    this.showTabNavigator = false;
    this.showTab = false;
  }
}

export enum Screens {
  Home = "/",
  Prematch = "/prematch",
  Match = "/match",
  Postmatch = "/postmatch",
}
