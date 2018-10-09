import { observer } from "mobx-react";
import * as React from 'react';
import { IAppProps } from "../App";
import CircleInput79 from '../components/buttons/CircleInput79';
import Navigator from '../components/Navigator';
import TeamTitleInput from '../components/TeamTitleInput';
import {Screens} from "../model/AppState";

import CircleInput59 from '../components/buttons/CircleInput59';
import '../css/Prematch.css';
import bgPrematch from '../img/backgrounds/prematch.png';
import { Team } from "../model/Team";
import { Kvalue } from '../types/Kvalue';

const bgStyle = {
  backgroundImage: `url(${bgPrematch})`,
  backgroundRepeat  : 'no-repeat'
};

interface IscreenState {
    inducements: Kvalue;
    induced: any;
}

@observer
class Prematch extends React.Component<IAppProps, IscreenState> {

    constructor(props: any) {
        super(props);
        
        this.state = {
            induced: this.inducedSide,
            inducements: this.inducementValue,
        }
    };

    public componentWillMount() {
        this.props.appState.screen = Screens.Prematch;
    }
    public componentDidMount() {
        console.log("prematch inducement value : ", new Kvalue(this.props.appState.homeTeam.tv.value - this.props.appState.awayTeam.tv.value).asString);
    }
    public render() {
        if (!this.props.appState.homeTeam || !this.props.appState.awayTeam) {
            window.location.href = "/";
        }

        const homeName: string = this.props.appState.homeTeam.name;
        const awayName: string = this.props.appState.awayTeam.name;
        const homeValue: Kvalue = this.props.appState.homeTeam.tv;
        const awayValue: Kvalue = this.props.appState.awayTeam.tv;

        let inducementString:string = "+" + this.state.inducements.asString;
        let inducementStyles:string = "inducements";
        if (this.state.induced === this.props.appState.homeTeam) {
            inducementStyles = inducementStyles.concat(" homeinduced");
        } else if (this.state.induced === this.props.appState.awayTeam) {
            inducementStyles = inducementStyles.concat(" awayinduced");
        } else {
            inducementString = "even";
        }
        return <div className="Prematch" style={bgStyle}>
            <Navigator appState={this.props.appState}/>
            <div className="teamtitles">
                <TeamTitleInput titleChangeHandler={this.handleTeamNameChange} title1Default={homeName} title2Default={awayName}/>
            </div>
            <div className="teamvalues">
                <CircleInput79 activityOverride={true} value={homeValue} valueChangeHandler={this.handleTeamValueChange("home")} arrowOverride={this.state.induced === this.props.appState.homeTeam}/>
                <CircleInput79 activityOverride={true} value={awayValue} valueChangeHandler={this.handleTeamValueChange("away")} arrowOverride={this.state.induced === this.props.appState.awayTeam}/>
            </div>
            <div className={inducementStyles}>
                <CircleInput59 value={inducementString}valueChangeHandler={this.handleInducementValueChange}/>
            </div>
        </div>;
    };
    private get inducementValue(): Kvalue {
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
    private handleTeamNameChange = (titles: any) => {
        if (!this.props.appState.homeTeam || !this.props.appState.awayTeam) {
            window.location.href = "/";
        }
        this.props.appState.homeTeam.name = titles.title1;
        this.props.appState.awayTeam.name = titles.title2;
        console.log('submitted team names ', this.props.appState.homeTeam.name + " vs. ", this.props.appState.awayTeam.name);
    }
    private handleInducementValueChange = (value: Kvalue) => {
        console.log('handleInducementValueChange ', value);
        this.setState({inducements: value});
    }
    private handleTeamValueChange = (team: string) => {
        if (team === "home") {
            return (value: number) => {

                const numericValue: number = value * 1000;
                const kValue: Kvalue = new Kvalue(numericValue);

                this.props.appState.homeTeam.tv = kValue;
                this.setState({inducements: this.inducementValue, induced: this.inducedSide});
            }
        } else {
            return (value: number) => {
                const numericValue: number = value * 1000;
                const kValue: Kvalue = new Kvalue(numericValue);

                this.props.appState.awayTeam.tv = kValue;
                this.setState({inducements: this.inducementValue, induced: this.inducedSide});
            }
        }
    }
}
export default Prematch;