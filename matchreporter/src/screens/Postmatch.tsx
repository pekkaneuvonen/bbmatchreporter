import * as React from 'react';
import { IAppProps } from "../App";
import Navigator from '../components/Navigator';
import {Screens} from "../model/AppState";


import '../css/Postmatch.css';
import bgPostmatch from '../img/backgrounds/GRASS_9PM.jpg';

import teamsContainerBG from '../img/postmatch/teamsContainer.png';
import generalTableBG from '../img/postmatch/generalTableContainer.png';
import achievementRow from '../img/postmatch/achievementLine.png';
import improvementRow from '../img/postmatch/improvementLine.png';
import injuryRow from '../img/postmatch/injuryLine.png';
import addRow from '../img/postmatch/addLine1.png';


const bgStyle = {
  backgroundImage: `url(${bgPostmatch})`
};

class Postmatch extends React.Component<IAppProps, {}> {
    public componentWillMount() {
        this.props.appState.screen = Screens.Postmatch;
    }
    public render() {
        if (!this.props.appState.homeTeam || !this.props.appState.awayTeam) {
            window.location.href = "/";
        }

        return <div className="Postmatch" style={bgStyle}>
            <Navigator appState={this.props.appState}/>
            <div style={this.getBackgroundFor(teamsContainerBG)} className="teams">
                <div className="reportTeam reportTeam1">{this.props.appState.homeTeam.name}</div>
                <div className="reportTeam reportTeam2">{this.props.appState.awayTeam.name}</div>
            </div>
            <div style={this.getBackgroundFor(generalTableBG)} className="generalTable">
                <div className="reportTable gate">{this.props.appState.report.totalGate.asString}</div>
                <div className="tableRow">
                    <div className="reportTable">{this.props.appState.homeTeam.scorers.length}</div>
                    <div className="reportTable">{this.props.appState.awayTeam.scorers.length}</div>
                </div>
                <div className="tableRow">
                    <div className="reportTable">{this.props.appState.homeTeam.winningsString}</div>
                    <div className="reportTable">{this.props.appState.awayTeam.winningsString}</div>
                </div>
                <div className="tableRow">
                    <div className="reportTable">{this.props.appState.homeTeam.fanFactorModifier}</div>
                    <div className="reportTable">{this.props.appState.homeTeam.fanFactorModifier}</div>
                </div>
                <div className="tableRow">
                    <div className="reportTable">{this.props.appState.homeTeam.inflicters.length}</div>
                    <div className="reportTable">{this.props.appState.awayTeam.inflicters.length}</div>
                </div>
                <div className="tableRow">
                    <div className="reportTable">{this.props.appState.report.fame > 0 ? "-" : "+" + Math.abs(this.props.appState.report.fame)}</div>
                    <div className="reportTable">{this.props.appState.report.fame < 0 ? "-" : "+" + Math.abs(this.props.appState.report.fame)}</div>
                </div>
                <div className="tableRow">
                    <div className="reportTable">{this.props.appState.homeTeam.tvString}</div>
                    <div className="reportTable">{this.props.appState.awayTeam.tvString}</div>
                </div>
            </div>
        </div>;
    };

    private getBackgroundFor = (img: any): any => {
        return {
            backgroundImage: `url(${img})`,
            backgroundPosition: 'left',
            backgroundRepeat  : 'no-repeat',
        }
    }
}
export default Postmatch;