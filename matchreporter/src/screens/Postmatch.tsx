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
  backgroundImage: `url(${bgPostmatch})`,
  paddingBottom: "32px",
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
    improvementLines: {home: Player, away: Player}[],
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
            improvementLines: this.constructInitialImprovementRows(this.props.appState.homeTeam, this.props.appState.awayTeam),
        };
    }
    private constructInitialImprovementRows = (home: Team, away: Team) => {
        let initialImprovements: {home: Player, away: Player}[] = [];
        if (home) {
            for (let hi: number = 0; hi < home.improvements.length; hi++) {
                initialImprovements.push({home:home.improvements[hi], away: new Player({name: -1})})
            }
        }
        if (away) {
            for (let ai: number = 0; ai < away.improvements.length; ai++) {
                if (initialImprovements.length > ai) {
                    initialImprovements[ai].away = away.improvements[ai];
                } else {
                    initialImprovements.push({home: new Player({name: -1}), away:away.improvements[ai]})
                }
            }
        }
        return initialImprovements;
    }
    public componentWillMount() {
        this.props.appState.screen = Screens.Postmatch;
    }
    public render() {
        if (!this.props.appState.homeTeam || !this.props.appState.awayTeam
        || this.props.appState.report.id === "empty") {
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
                    <div className="reportTableField reportAchievementField1">{this.props.appState.homeTeam.completionsString}</div>
                    <div className="reportTableField">CP</div>
                    <div className="reportTableField reportAchievementField2">{this.props.appState.awayTeam.completionsString}</div>
                </div>
                <div style={this.getBackgroundFor(achievementRow)} className="achievementRow">
                    <div className="reportTableField reportAchievementField1">{this.props.appState.homeTeam.scorersString}</div>
                    <div className="reportTableField">TD</div>
                    <div className="reportTableField reportAchievementField2">{this.props.appState.awayTeam.scorersString}</div>
                </div>
                <div style={this.getBackgroundFor(achievementRow)} className="achievementRow">
                    <div className="reportTableField reportAchievementField1">{this.props.appState.homeTeam.interceptsString}</div>
                    <div className="reportTableField">INT</div>
                    <div className="reportTableField reportAchievementField2">{this.props.appState.awayTeam.interceptsString}</div>
                </div>
                <div style={this.getBackgroundFor(achievementRow)} className="achievementRow">
                    <div className="reportTableField reportAchievementField1">{this.props.appState.homeTeam.badlyHurtsString}</div>
                    <div className="reportTableField">BH</div>
                    <div className="reportTableField reportAchievementField2">{this.props.appState.awayTeam.badlyHurtsString}</div>
                </div>
                <div style={this.getBackgroundFor(achievementRow)} className="achievementRow">
                    <div className="reportTableField reportAchievementField1">{this.props.appState.homeTeam.seriousInjuriesString}</div>
                    <div className="reportTableField">SI</div>
                    <div className="reportTableField reportAchievementField2">{this.props.appState.awayTeam.seriousInjuriesString}</div>
                </div>
                <div style={this.getBackgroundFor(achievementRow)} className="achievementRow">
                    <div className="reportTableField reportAchievementField1">{this.props.appState.homeTeam.killsString}</div>
                    <div className="reportTableField">Kill</div>
                    <div className="reportTableField reportAchievementField2">{this.props.appState.awayTeam.killsString}</div>
                </div>
            </div>
            {this.improvementTable()}
        </div>;
    };

    private improvementTable = () => {
        return <div className="improvementTable">
         {this.state.improvementLines.length > 0 ?
            this.state.improvementLines.map((improvements: {home: Player, away: Player}, index) => {

                return <div key={index} style={this.getBackgroundFor(improvementRow)} className="improvementRow">
                    <form onSubmit={this.editImprovementHandler(improvements.home)}>
                        <input className="reportTableInputField reportImprovementPlayerField1" type="text" value={improvements.home.name} onChange={this.changeImprovementPlayerHandle(improvements.home)} />
                        <input className="reportTableInputField reportImprovementPlayerField1" type="text" value={improvements.home.improvement} onChange={this.changeImprovementThrowHandle(improvements.home)} />
                    </form>
                    <form onSubmit={this.editImprovementHandler(improvements.away)} className="improvementInputSlot2">
                        <input className="reportTableInputField reportImprovementPlayerField2" type="text" value={improvements.away.improvementLine} onChange={this.changeImprovementPlayerHandle(improvements.away)} />
                        <input className="reportTableInputField reportImprovementPlayerField2" type="text" value={improvements.home.improvement} onChange={this.changeImprovementThrowHandle(improvements.away)} />

                    </form>
                </div>
            })
            : null}
            <div style={this.getBackgroundFor(addRow, "center")} className="improvementAddLine" onClick={this.addImprovementLine}></div>
        </div>
    }
    private addImprovementLine = (event: any) => {
        console.log("addImprovementLine");
        let newImprovements: {home: Player, away: Player}[] = [...this.state.improvementLines];

        newImprovements.push({home: new Player({name: -1}), away: new Player({name: -1})})
        this.setState({improvementLines: newImprovements});
    }
    private editImprovementHandler = (player: Player) => {
        return (event: any) => {
            console.log("editImprovementHandler ", player);
        }
    }
    private changeImprovementPlayerHandle = (player: Player) => {
        return (event: any) => {
            console.log("changeImprovementPlayerHandle ", player);
        }
    }
    private changeImprovementThrowHandle = (player: Player) => {
        return (event: any) => {
            console.log("changeImprovementThrowHandle ", player);
        }
    }



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

    private getBackgroundFor = (img: any, position: string = "left"): any => {
        return {
            backgroundImage: `url(${img})`,
            backgroundPosition: position,
            backgroundRepeat  : 'no-repeat',
        }
    }
}
export default Postmatch;