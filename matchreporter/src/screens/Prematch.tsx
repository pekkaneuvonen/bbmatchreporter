import { observer } from "mobx-react";
import * as React from 'react';
import { IAppProps } from "../App";
import Navigator from '../components/Navigator';
import TeamTitleInput from '../components/TeamTitleInput';
import TeamValueInput from '../components/TeamValueInput';
import InducementsInput from '../components/InducementsInput';
import GatesInput from '../components/GatesInput';

import {Screens} from "../model/AppState";
import { Reports } from '../services/Reports';

import bgHome from '../img/backgrounds/GRASS_9AM_grid.jpg';
import doneButton from '../img/prematch/doneButton.png';
import WeatherChooserRow from "../components/WeatherChooserRow";
import '../css/Prematch.css';
import { Team } from "../model/Team";
import { WeatherType } from "../model/Weather";
import { Kvalue } from '../types/Kvalue';
import StringFormatter from "../utils/StringFormatter";

const bgStyle = {
  backgroundImage: `url(${bgHome})`,
};

interface IscreenState {
    // inducementsValue: Kvalue;
    // induced: any;
    // homeInducementContent: string;
    // awayInducementContent: string;
    newReport: boolean,
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
            newReport: this.props.appState.brandNewReport,
            weather: 0
        }
    };

    public componentWillMount() {
        this.props.appState.screen = Screens.Prematch;
    }
    public render() {
        if (!this.props.appState.homeTeam || !this.props.appState.awayTeam
        || this.props.appState.report.id === "empty") {
            window.location.href = "/";
        }

        let induced: string = "even";
        if (this.inducedSide === this.props.appState.homeTeam) {
            induced = "home";
        } else if (this.inducedSide === this.props.appState.awayTeam) {
            induced = "away";
        }
        let inducementString:string = "+" + this.inducementValue.asString;


        /*
        let inducementStyles:string = "inducementValue";
        if (induced === this.props.appState.homeTeam) {
            inducementStyles = inducementStyles.concat(" homeinduced");
        } else if (induced === this.props.appState.awayTeam) {
            inducementStyles = inducementStyles.concat(" awayinduced");
        } else {
            inducementString = "even";
        }
        
        let fameString:string = "+" + Math.abs(this.fame);
        if (this.fame < 0) {
            fameStyles = fameStyles.concat(" homefame");
        } else if (this.fame > 0) {
            fameStyles = fameStyles.concat(" awayfame");
        } else {
            fameString = "no F.A.M.E.";
        }
        */
       
        return <div className="Prematch" style={bgStyle}>
            <Navigator appState={this.props.appState}/>
            <div className="teamtitles">
                <TeamTitleInput 
                    activityOverride={this.state.newReport}
                    titleChangeHandler={this.handleTeamNameChange} 
                    title1Default={this.props.appState.homeTeam.name} 
                    title2Default={this.props.appState.awayTeam.name}/>
            </div>
            <div className="teamTVs">
                <TeamValueInput
                    activityOverride={this.state.newReport}
                    valueChangeHandler={this.handleTeamValueChange} 
                    value1={this.props.appState.homeTeam.tvString} 
                    value2={this.props.appState.awayTeam.tvString}/>
            </div>
            <div className="inducementsContainer">
                <InducementsInput
                    activityOverride={this.state.newReport}
                    inducementsValue={inducementString} 
                    side={induced} 
                    inducementsDescriptions={this.inducedSide ? this.inducedSide.inducements : "-"} 
                    descriptionsChangeHandler={this.inducementDescriptionChange()} />
            </div>
            <div className="gateContainer">
                <GatesInput
                    activityOverride={this.state.newReport}
                    gateValue1={this.props.appState.homeTeam.gateValue} 
                    gateValue2={this.props.appState.awayTeam.gateValue} 
                    gatesChangeHandler={this.handleTeamGateChange} />
            </div>
            <div className="weatherChooserContainer">
                {this.createWeatherTable()};
            </div>
            {this.state.newReport ? 
                <div onClick={this.doneButtonHandler}>
                    <img className={"bottomButton"} src={doneButton}/>
                </div>
            : null}
        </div>;
    };
    private doneButtonHandler = (event: any) => {
        this.props.appState.brandNewReport = false;
        this.setState({newReport: false});
    }
    private createWeatherTable = () => {
        const table = [];
        console.log("currentWeather : " + this.props.appState.currentWeather);

        const weatherTypeCount: number = Object.keys(WeatherType).length / 2
        for (let i = 0; i < weatherTypeCount; i++) {
          table.push(
            <WeatherChooserRow key={i} chosen={this.props.appState.currentWeather === WeatherType[i]} value={i} clickHandler={this.weatherClickHandler(i)}/>
          );
        }
        return table
      }
    private weatherClickHandler = (value: number) => {
        return (event: any) => {
            this.props.appState.currentWeather = WeatherType[value];
            this.props.appState.updateWeather(WeatherType[value]);
        }
    }
    private get inducementValue(): Kvalue {
        if (this.props.appState.inducementValueOverride) {
            return this.props.appState.inducementValueOverride;
        }
        let rawInducements: Kvalue;
        if (this.props.appState.homeTeam && this.props.appState.awayTeam) {
            rawInducements = new Kvalue(this.props.appState.homeTeam.teamValue - this.props.appState.awayTeam.teamValue);
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


    private handleTeamNameChange = (titles: any) => {
        if (!this.props.appState.homeTeam || !this.props.appState.awayTeam) {
            window.location.href = "/";
        }
        this.props.appState.homeTeam.name = titles.title1;
        this.props.appState.awayTeam.name = titles.title2;
        this.props.appState.updateReport();
    }

    private handleTeamValueChange = (values: any) => {
        if (!this.props.appState.homeTeam || !this.props.appState.awayTeam) {
            window.location.href = "/";
        }

        this.props.appState.homeTeam.teamValue = StringFormatter.convertKvalueStringToNumeric(values.value1);
        this.props.appState.awayTeam.teamValue = StringFormatter.convertKvalueStringToNumeric(values.value2);
        this.props.appState.updateReport();
    }

    private inducementDescriptionChange = () => {
        return (description: string) => {
            // console.log(" update inducementDescriptionChange : " + description);
            this.inducedSide.inducements = description;
            this.props.appState.updateReport();
        }
    }
    private handleTeamGateChange = (gates: any) => {
        if (!this.props.appState.homeTeam || !this.props.appState.awayTeam) {
            window.location.href = "/";
        }

        if (gates.value1) {
            let split1: string[] = gates.value1.split("k");
            let numericValue1: number = parseInt(split1.join(""), 10);
            numericValue1 *= 1000;
            this.props.appState.homeTeam.gateValue = numericValue1;
        }

        if (gates.value2) {
            let split2: string[] = gates.value2.split("k");
            let numericValue2: number = parseInt(split2.join(""), 10);
            numericValue2 *= 1000;
            this.props.appState.awayTeam.gateValue = numericValue2;
        }
        this.props.appState.report.totalGateValue = this.props.appState.homeTeam.gateValue + this.props.appState.awayTeam.gateValue;
        this.props.appState.report.totalGate = new Kvalue(this.props.appState.report.totalGateValue);
        this.props.appState.updateReport();
    }

}
export default Prematch;