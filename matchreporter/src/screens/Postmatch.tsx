import * as React from 'react';
import { IAppProps } from "../App";
import Navigator from '../components/Navigator';
import {Screens} from "../model/AppState";
import { Team } from '../model/Team';


import '../css/Postmatch.css';
import bgPostmatch from '../img/backgrounds/GRASS_9PM.jpg';

import teamsContainerBG from '../img/postmatch/teamsContainer.png';
import generalTableBG from '../img/postmatch/generalTableContainer.png';
import achievementRow from '../img/postmatch/achievementLine.png';
import improvementRow from '../img/postmatch/improvementLine.png';
import injuryRow from '../img/postmatch/injuryLine.png';
import addRow from '../img/postmatch/addLine1.png';
import { Player } from '../model/Player';


const bgStyle = {
  backgroundImage: `url(${bgPostmatch})`
};

interface IPostmatchState {
    winningsHome: string,
    winningsAway: string,
    ffChangeHome: string,
    ffChangeAway: string,
    mvpHome: string;
    mvpAway: string;
    improvementsHome: Player[];
    improvementsAway: Player[];
}
class Postmatch extends React.Component<IAppProps, IPostmatchState> {
    constructor(props: any) {
        super(props);
        this.state = {
            winningsHome: this.props.appState.homeTeam ? this.props.appState.homeTeam.winnings : "-",
            winningsAway: this.props.appState.awayTeam ? this.props.appState.awayTeam.winnings : "-",
            ffChangeHome: this.props.appState.homeTeam ? this.props.appState.homeTeam.fanFactorModifier : "-",
            ffChangeAway: this.props.appState.awayTeam ? this.props.appState.awayTeam.fanFactorModifier : "-",
            mvpHome: this.props.appState.homeTeam ? this.props.appState.homeTeam.mvp : "-",
            mvpAway: this.props.appState.awayTeam ? this.props.appState.awayTeam.mvp : "-",
            improvementsHome: this.props.appState.homeTeam ? this.props.appState.homeTeam.improvements : [],
            improvementsAway: this.props.appState.awayTeam ? this.props.appState.awayTeam.improvements : [],
        };
    }
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
                <div className="reportTableField gate">{this.props.appState.report.totalGate.asString}</div>
                <div className="tableRow">
                    <div className="reportTableField reportTableField1">{this.props.appState.homeTeam.scorers.length}</div>
                    <div className="reportTableField reportTableField2">{this.props.appState.awayTeam.scorers.length}</div>
                </div>
                <div className="tableRow">
                    <div className="reportTableInputSlot">
                        <form onSubmit={this.addWinningsHandler(this.props.appState.homeTeam)}>
                            <input className="reportTableInputField reportTableField1" type="text" value={this.state.winningsHome} onChange={this.changeWinningsHandler(this.props.appState.homeTeam)} />
                        </form>
                    </div>
                    <div className="reportTableInputSlot">
                        <form onSubmit={this.addWinningsHandler(this.props.appState.awayTeam)}>
                            <input className="reportTableInputField reportTableField2" type="text" value={this.state.winningsAway} onChange={this.changeWinningsHandler(this.props.appState.awayTeam)} />
                        </form>
                    </div>
                </div>
                <div className="tableRow">
                    <div className="reportTableInputSlot">
                        <form onSubmit={this.addFFchangeHandler(this.props.appState.homeTeam)}>
                            <input className="reportTableInputField reportTableField1" type="text" value={this.state.ffChangeHome} onChange={this.changeFFchangeHandler(this.props.appState.homeTeam)} />
                        </form>
                    </div>
                    <div className="reportTableInputSlot">
                        <form onSubmit={this.addFFchangeHandler(this.props.appState.awayTeam)}>
                            <input className="reportTableInputField reportTableField2" type="text" value={this.state.ffChangeAway} onChange={this.changeFFchangeHandler(this.props.appState.awayTeam)} />
                        </form>
                    </div>
                </div>
                <div className="tableRow">
                    <div className="reportTableField reportTableField1">{this.props.appState.homeTeam.inflicters.length}</div>
                    <div className="reportTableField reportTableField2">{this.props.appState.awayTeam.inflicters.length}</div>
                </div>
                <div className="tableRow">
                    <div className="reportTableField reportTableField1">{this.props.appState.report.fame > 0 ? "-" : "+" + Math.abs(this.props.appState.report.fame)}</div>
                    <div className="reportTableField reportTableField2">{this.props.appState.report.fame < 0 ? "-" : "+" + Math.abs(this.props.appState.report.fame)}</div>
                </div>
                <div className="tableRow">
                    <div className="reportTableField reportTableField1">{this.props.appState.homeTeam.tvString}</div>
                    <div className="reportTableField reportTableField2">{this.props.appState.awayTeam.tvString}</div>
                </div>
            </div>
            <div className="achievementTable">
                <div style={this.getBackgroundFor(achievementRow)} className="achievementRow">
                    <div className="achievementInputSlot">
                        <form onSubmit={this.addMVPHandler(this.props.appState.homeTeam)}>
                            <input className="reportTableInputField reportAchievementField1" type="text" value={this.state.mvpHome} onChange={this.changeMVPHandle(this.props.appState.homeTeam)} />
                        </form>
                    </div>
                    <div className="reportTableField">MVP</div>
                    <div className="achievementInputSlot achievementInputSlot2">
                        <form onSubmit={this.addMVPHandler(this.props.appState.awayTeam)}>
                            <input className="reportTableInputField reportAchievementField2" type="text" value={this.state.mvpAway} onChange={this.changeMVPHandle(this.props.appState.awayTeam)} />
                        </form>
                    </div>
                </div>
            <div style={this.getBackgroundFor(achievementRow)} className="achievementRow">
                <div className="reportTableField reportAchievementField1">{this.props.appState.homeTeam.completions.length}</div>
                <div className="reportTableField">CP</div>
                <div className="reportTableField reportAchievementField2">{this.props.appState.awayTeam.completions.length}</div>
            </div>
            <div style={this.getBackgroundFor(achievementRow)} className="achievementRow">
                <div className="reportTableField reportAchievementField1">{this.props.appState.homeTeam.scorers.length}</div>
                <div className="reportTableField">TD</div>
                <div className="reportTableField reportAchievementField2">{this.props.appState.awayTeam.scorers.length}</div>
            </div>
            <div style={this.getBackgroundFor(achievementRow)} className="achievementRow">
                <div className="reportTableField reportAchievementField1">{this.props.appState.homeTeam.intercepts.length}</div>
                <div className="reportTableField">INT</div>
                <div className="reportTableField reportAchievementField2">{this.props.appState.awayTeam.intercepts.length}</div>
            </div>
            <div style={this.getBackgroundFor(achievementRow)} className="achievementRow">
                <div className="reportTableField reportAchievementField1">{this.props.appState.homeTeam.badlyHurts}</div>
                <div className="reportTableField">BH</div>
                <div className="reportTableField reportAchievementField2">{this.props.appState.awayTeam.badlyHurts}</div>
            </div>
            <div style={this.getBackgroundFor(achievementRow)} className="achievementRow">
                <div className="reportTableField reportAchievementField1">{this.props.appState.homeTeam.seriousInjuries}</div>
                <div className="reportTableField">SI</div>
                <div className="reportTableField reportAchievementField2">{this.props.appState.awayTeam.seriousInjuries}</div>
            </div>
            <div style={this.getBackgroundFor(achievementRow)} className="achievementRow">
                <div className="reportTableField reportAchievementField1">{this.props.appState.homeTeam.kills}</div>
                <div className="reportTableField">Kill</div>
                <div className="reportTableField reportAchievementField2">{this.props.appState.awayTeam.kills}</div>
            </div>
            </div>
        </div>;
    };

    private changeWinningsHandler = (side: Team) => {
        return (event: any) => {
            this.addWinningsHandler(side)(event);
            {side === this.props.appState.homeTeam ?
                this.setState({
                    winningsHome: event.target.value
                })
                :
                this.setState({
                    winningsAway: event.target.value
                })
            }
        }
    }
    private addWinningsHandler = (side: Team) => {
        return (event: any) => {
            event.preventDefault();
            side.winnings = event.target.value;
            console.log("added Winnings ", side.winnings);
            this.props.appState.updateReport();
        }
    }

    private changeFFchangeHandler = (side: Team) => {
        return (event: any) => {
            console.log("changeFFchangeHandler ", event.target.value);
            this.addFFchangeHandler(side)(event);
            {side === this.props.appState.homeTeam ?
                this.setState({
                    ffChangeHome: event.target.value
                })
                :
                this.setState({
                    ffChangeAway: event.target.value
                })
            }
        }
    }
    private addFFchangeHandler = (side: Team) => {
        return (event: any) => {
            event.preventDefault();
            side.fanFactorModifier = event.target.value;
            console.log("added ffModifier ", side.fanFactorModifier);
            this.props.appState.updateReport();
        }
    }


    private changeMVPHandle = (side: Team) => {
        return (event: any) => {
            console.log("changeMVPHandle ", event.target.value);
            this.addMVPHandler(side)(event);
            {side === this.props.appState.homeTeam ?
                this.setState({
                    mvpHome: event.target.value
                })
                :
                this.setState({
                    mvpAway: event.target.value
                })
            }
        }
    }
    private addMVPHandler = (side: Team) => {
        return (event: any) => {
            event.preventDefault();
            side.mvp = event.target.value;
            console.log("added mvp ", side.mvp);
            this.props.appState.updateReport();
        }
    }

    private getBackgroundFor = (img: any): any => {
        return {
            backgroundImage: `url(${img})`,
            backgroundPosition: 'left',
            backgroundRepeat  : 'no-repeat',
        }
    }
}
export default Postmatch;