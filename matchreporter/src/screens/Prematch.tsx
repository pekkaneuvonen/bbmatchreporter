import * as React from 'react';
import { IAppProps } from "../App";
import Navigator from '../components/Navigator';
import TeamTitleInput from '../components/TeamTitleInput';
import {Screens} from "../model/AppState";


import '../css/Prematch.css';
import bgPrematch from '../img/backgrounds/prematch.png';

const bgStyle = {
  backgroundImage: `url(${bgPrematch})`,
  backgroundRepeat  : 'no-repeat'
};

class Prematch extends React.Component<IAppProps, {}> {
    public componentWillMount() {
        this.props.appState.screen = Screens.Prematch;
    }
    public componentDidMount() {
        console.log("this.props.appState.report : ", this.props.appState.report);
        console.log("this.props.appState.home : ", this.props.appState.homeTeam);
        console.log("this.props.appState.away : ", this.props.appState.awayTeam);
    }
    public render() {
        const homeName: string = this.props.appState.homeTeam ? this.props.appState.homeTeam.name : "Unnamed hometeam";
        const awayName: string = this.props.appState.awayTeam ? this.props.appState.awayTeam.name : "Unnamed awayteam";

        return <div className="Prematch" style={bgStyle}>
            <Navigator appState={this.props.appState}/>
            <div className="teamtitles">
                <TeamTitleInput titleChangeHandler={this.handleTeamNameChange} title1Default={homeName} title2Default={awayName}/>
            </div>
        </div>;
    };
    private handleTeamNameChange = (titles: any) => {
        this.props.appState.homeTeam.name = titles.title1;
        this.props.appState.awayTeam.name = titles.title2;
        console.log('submitted team names ', this.props.appState.homeTeam.name + " vs. ", this.props.appState.awayTeam.name);
    }
}
export default Prematch;