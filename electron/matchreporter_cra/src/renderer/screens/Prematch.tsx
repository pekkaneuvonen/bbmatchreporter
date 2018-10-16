import { observer } from "mobx-react";
import * as React from 'react';
import { IAppProps } from "../App";
import CircleInput79 from '../components/buttons/CircleInput79';
import Navigator from '../components/Navigator';
import TeamTitleInput from '../components/TeamTitleInput';
import {Screens} from "../model/AppState";

import CircleInput59 from '../components/buttons/CircleInput59';
import WeatherChooserRow from "../components/WeatherChooserRow";
import '../css/Prematch.css';
import bgPrematch from '../img/backgrounds/prematch.png';
import { Team } from "../model/Team";
import { WeatherType } from "../model/Weather";
import { Kvalue } from '../types/Kvalue';

const bgStyle = {
  backgroundImage: `url(${bgPrematch})`,
  backgroundRepeat  : 'no-repeat'
};

interface IscreenState {
    // inducementsValue: Kvalue;
    // induced: any;
    // homeInducementContent: string;
    // awayInducementContent: string;
    weather: number;
}

@observer
class Prematch extends React.Component<IAppProps, IscreenState> {

    constructor(props: any) {
        super(props);
        
        this.state = {
            /*awayInducementContent: "away teams inducements",
            homeInducementContent: "home teams inducements",
            induced: this.inducedSide,
            inducementsValue: this.inducementValue,*/
            weather: 0
        }
    };

    public componentWillMount() {
        this.props.appState.screen = Screens.Prematch;
    }
    public componentDidMount() {
        console.log("prematch fame value : ", this.fame);
    }
    public render() {
        if (!this.props.appState.homeTeam || !this.props.appState.awayTeam) {
            window.location.href = "/";
        }

        const induced: any = this.inducedSide;
        let inducementString:string = "+" + this.inducementValue.asString;
        let inducementStyles:string = "inducementValue";
        if (induced === this.props.appState.homeTeam) {
            inducementStyles = inducementStyles.concat(" homeinduced");
        } else if (induced === this.props.appState.awayTeam) {
            inducementStyles = inducementStyles.concat(" awayinduced");
        } else {
            inducementString = "even";
        }
        let fameString:string = "+" + Math.abs(this.fame);
        let fameStyles:string = "fameValue";
        if (this.fame < 0) {
            fameStyles = fameStyles.concat(" homefame");
        } else if (this.fame > 0) {
            fameStyles = fameStyles.concat(" awayfame");
        } else {
            fameString = "no F.A.M.E.";
        }

        return <div className="Prematch" style={bgStyle}>
            <Navigator appState={this.props.appState}/>
            <div className="teamtitles">
                <TeamTitleInput 
                    titleChangeHandler={this.handleTeamNameChange} title1Default={this.props.appState.homeTeam.name} title2Default={this.props.appState.awayTeam.name}/>
            </div>
            <div className="teamvalues">
                <CircleInput79 
                    activityOverride={true} 
                    value={this.props.appState.homeTeam.tv.asString} 
                    valueChangeHandler={this.handleTeamValueChange("home")}
                    arrowOverride={induced === this.props.appState.homeTeam}/>
                <CircleInput79 
                    activityOverride={true} 
                    value={this.props.appState.awayTeam.tv.asString} 
                    valueChangeHandler={this.handleTeamValueChange("away")} 
                    arrowOverride={induced === this.props.appState.awayTeam}/>
            </div>
            <div className={inducementStyles}>
                <CircleInput59 
                    value={inducementString}
                    valueChangeHandler={this.handleInducementValueChange}/>
            </div>
            <div className="inducements">
                <textarea 
                    name="homeinducements"
                    className="inducementsBox homeInducements"
                    onChange={this.handleInducementChange("home")}
                    value={this.props.appState.homeTeam.inducements}/>
                <textarea 
                    name="awayinducements"
                    className="inducementsBox awayInducements"
                    onChange={this.handleInducementChange("away")}
                    value={this.props.appState.awayTeam.inducements}/>
            </div>
            <div className="gate">
                <CircleInput79 
                    activityOverride={true} 
                    value={this.props.appState.homeTeam.gate.asString} 
                    valueChangeHandler={this.handleTeamGateChange("home")}
                    arrowOverride={this.fame < 0}/>
                <CircleInput79 
                    activityOverride={true} 
                    value={this.props.appState.awayTeam.gate.asString} 
                    valueChangeHandler={this.handleTeamGateChange("away")} 
                    arrowOverride={this.fame > 0}/>
            </div>
            <div className={fameStyles}>
                <CircleInput59 
                    value={fameString}
                    valueChangeHandler={this.handleFameValueChange}/>
            </div>
            <div className="weatherChooser">
                {this.createWeatherTable()};
            </div>
        </div>;
    };
    private createWeatherTable = () => {
        const table = [];
    
        const weatherTypeCount: number = Object.keys(WeatherType).length / 2
        for (let i = 0; i < weatherTypeCount; i++) {
          table.push(
          <WeatherChooserRow key={i} chosen={this.props.appState.weather === WeatherType[i]} value={i} clickHandler={this.weatherClickHandler(i)}/>
          );
        }
        return table
      }
    private weatherClickHandler = (value: number) => {
        return (event: any) => {
            this.props.appState.weather = WeatherType[value];
        }
    }
    private get inducementValue(): Kvalue {
        if (this.props.appState.inducementValueOverride) {
            return this.props.appState.inducementValueOverride;
        }
        let rawInducements: Kvalue;
        if (this.props.appState.homeTeam && this.props.appState.awayTeam) {
            rawInducements = new Kvalue(this.props.appState.homeTeam.tv.value - this.props.appState.awayTeam.tv.value);
        } else {
            rawInducements = new Kvalue(0);
        }
        return rawInducements;
    }
    private get inducedSide(): Team {
        const rawInducements: Kvalue = this.inducementValue;
        let smallertv: any;
        if (rawInducements.value < 0) {
            smallertv = this.props.appState.homeTeam;
        } else if (rawInducements.value > 0) {
            smallertv = this.props.appState.awayTeam;
        } else {
            smallertv = null;
        }
        return smallertv;
    }
    private get fame(): number {
        let gateDifference: number = 0;
        if (this.props.appState.homeTeam.gate.value > 0 && this.props.appState.awayTeam.gate.value > 0) {
            if (this.props.appState.awayTeam.gate.value >= this.props.appState.homeTeam.gate.value * 2) {
                gateDifference = 2;
            } else if (this.props.appState.awayTeam.gate.value > this.props.appState.homeTeam.gate.value) {
                gateDifference = 1;
            } else if (this.props.appState.homeTeam.gate.value >= this.props.appState.awayTeam.gate.value * 2) {
                gateDifference = -2;
            } else if (this.props.appState.homeTeam.gate.value > this.props.appState.awayTeam.gate.value) {
                gateDifference = -1;
            }
        }
        return gateDifference;
    }
    private handleTeamNameChange = (titles: any) => {
        if (!this.props.appState.homeTeam || !this.props.appState.awayTeam) {
            window.location.href = "/";
        }
        this.props.appState.homeTeam.name = titles.title1;
        this.props.appState.awayTeam.name = titles.title2;
    }
    private handleInducementValueChange = (value: string) => {
        console.log("Trying to override calculated inducement value !");
        // this.props.appState.inducementValueOverride = value;
    }
    private handleFameValueChange = (value: string) => {
        console.log("Trying to override calculated fame value !");
        // this.props.appState.inducementValueOverride = value;
    }
    private handleTeamValueChange = (team: string) => {
        if (team === "home") {
            return (value: string) => {
                const splitValue: string[] = value.split("k");
                let numericValue: number = parseInt(splitValue.join(""), 10);
                numericValue *= 1000;
                const kValue: Kvalue = new Kvalue(numericValue);
                this.props.appState.homeTeam.tv = kValue;
            }
        } else {
            return (value: string) => {
                const splitValue: string[] = value.split("k");
                let numericValue: number = parseInt(splitValue.join(""), 10);
                numericValue *= 1000;
                const kValue: Kvalue = new Kvalue(numericValue);
                this.props.appState.awayTeam.tv = kValue;
            }
        }
    }
    private handleInducementChange = (team: string) => {
        if (team === "home") {
            return (event: any) => {
                this.props.appState.homeTeam.inducements = event.target.value;
            }
        } else {
            return (event: any) => {
                this.props.appState.awayTeam.inducements = event.target.value;
            }
        }
    }
    private handleTeamGateChange = (team: string) => {
        if (team === "home") {
            return (value: string) => {
                const splitValue: string[] = value.split("k");
                let numericValue: number = parseInt(splitValue.join(""), 10);
                numericValue *= 1000;
                const kValue: Kvalue = new Kvalue(numericValue);
                this.props.appState.homeTeam.gate = kValue;
            }
        } else {
            return (value: string) => {
                const splitValue: string[] = value.split("k");
                let numericValue: number = parseInt(splitValue.join(""), 10);
                numericValue *= 1000;
                const kValue: Kvalue = new Kvalue(numericValue);
                this.props.appState.awayTeam.gate = kValue;
            }
        }
    }
}
export default Prematch;