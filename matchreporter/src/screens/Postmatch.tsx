import * as React from 'react';
import { IAppProps, IScreenState } from "../App";
import Navigator from '../components/Navigator';
import {Screens} from "../model/AppState";
import { Team } from '../model/Team';
import { Injury, InjuryEffect, InjuryCode } from '../model/Injury';

import { Transition } from 'react-transition-group';
import { TweenLite } from "gsap";

import SwipeItem, { SwipeDirection } from '../components/SwipeItem';
import history from "./history";

import '../css/Postmatch.css';
import bgPostmatch from '../img/backgrounds/GRASS_9PM.jpg';

import teamsContainerBG from '../img/postmatch/teamsContainer.png';
import generalTableBG from '../img/postmatch/generalTableContainer.png';
import achievementTableBG from '../img/postmatch/achievementTableContainer.png';

import injuriesTableTitle from '../img/postmatch/injuriesTableTitle.png';
import injurySlotHome from '../img/postmatch/injurySlotHome.png';
import injurySlotAway from '../img/postmatch/injurySlotAway.png';
import injurySlotBHHome from '../img/postmatch/injurySlotNoEffectHome.png';
import injurySlotBHAway from '../img/postmatch/injurySlotNoEffectAway.png';

import improvementsTableTitle from '../img/postmatch/improvementsTableTitle.png';
import improvementSlotHome from '../img/postmatch/improvementSlotHome.png';
import improvementSlotAway from '../img/postmatch/improvementSlotAway.png';
import addImprovementHome from '../img/postmatch/addLineHome.png';
import addImprovementAway from '../img/postmatch/addLineAway.png';

import deleteRowHome from '../img/postmatch/deleteRowHome.png';
import deleteRowAway from '../img/postmatch/deleteRowAway.png';

import { report_field_divider } from '../utils/StringFormatter';

import { GameEvent } from '../model/GameEvent';


interface IPostmatchState extends IScreenState {
    winningsHome: string,
    winningsAway: string,
    ffChangeHome: string,
    ffChangeAway: string,
    mvpHome: string;
    mvpAway: string;
    improvementsHome: GameEvent[];
    improvementsAway: GameEvent[];
    selectedEvent: GameEvent | undefined;
    // improvementLines: {home: GameEvent, away: GameEvent}[],
}

class Postmatch extends React.Component<IAppProps, IPostmatchState> {
    rowPressTimer: NodeJS.Timeout;
    private bgContainer: React.RefObject<HTMLDivElement>;
    private tableContainer: React.RefObject<HTMLDivElement>;

    private bgStyle = {
        backgroundImage: `url(${bgPostmatch})`,
        paddingBottom: "32px",
        height: "2048px" // will be updated in componentDidUpdate to fit reportList height 
    };

    constructor(props: any) {
        super(props);
        this.bgContainer = React.createRef();
        this.tableContainer = React.createRef();

        this.state = {
            swipeEnabled: true,
            winningsHome: this.props.appState.homeTeam ? this.props.appState.homeTeam.winnings : "-",
            winningsAway: this.props.appState.awayTeam ? this.props.appState.awayTeam.winnings : "-",
            
            ffChangeHome: this.props.appState.homeTeam ? this.props.appState.homeTeam.fanFactorModifier : "-",
            ffChangeAway: this.props.appState.awayTeam ? this.props.appState.awayTeam.fanFactorModifier : "-",
            
            mvpHome: this.props.appState.homeTeam ? this.props.appState.homeTeam.mvp : "-",
            mvpAway: this.props.appState.awayTeam ? this.props.appState.awayTeam.mvp : "-",
            
            improvementsHome: this.props.appState.homeTeam ? this.props.appState.homeTeam.improvements : [],
            improvementsAway: this.props.appState.awayTeam ? this.props.appState.awayTeam.improvements : [],
            
            selectedEvent: undefined,
        };
        this.props.appState.prevscreen = this.props.appState.screen;
        this.props.appState.screen = Screens.Postmatch;

        this.bgStyle = {
            backgroundImage: `url(${bgPostmatch})`,
            paddingBottom: "32px",
            height: `${this.tableContainer.current ? this.tableContainer.current.scrollHeight + 80: 2048}px`,
        };
    }

    /*
    private constructInitialImprovementRows = (home: Team, away: Team) => {
        let initialImprovements: {home: GameEvent, away: GameEvent}[] = [];
        if (home) {
            for (let hi: number = 0; hi < home.improvements.length; hi++) {
                initialImprovements.push({home:home.improvements[hi], away: new GameEvent({player: "-"})})
            }
        }
        if (away) {
            for (let ai: number = 0; ai < away.improvements.length; ai++) {
                if (initialImprovements.length > ai) {
                    initialImprovements[ai].away = away.improvements[ai];
                } else {
                    initialImprovements.push({home: new GameEvent({player: "-"}), away:away.improvements[ai]})
                }
            }
        }
        return initialImprovements;
    }
    */

    public render() {
        if (!this.props.appState.homeTeam || !this.props.appState.awayTeam
        || this.props.appState.report.id === "empty") {
            window.location.href = "/";
        }

        const show: boolean = this.props.appState.screen === Screens.Postmatch;
        let fromX: number = show ? window.innerWidth : 0;
        let toX: number = show ? 0 : window.innerWidth;
        console.log("fromX ", fromX);

        const startState = { autoAlpha: 0, x: fromX};

        return <div className="Postmatch">
            <Navigator appState={this.props.appState}/>

            <Transition
                in={show}
                mountOnEnter
                timeout={1000}
                onEnter={node => TweenLite.set(node, startState)}
                onExit={node => TweenLite.set(node, startState)}
                addEndListener={ (node, done) => {
                    TweenLite.fromTo(node, 0.25, {
                        autoAlpha: !show ? 1 : 0, ease:"Quad.easeIn",
                        x: fromX,
                    }, {
                    autoAlpha: show ? 1 : 0,
                    x: toX, ease:"Quad.easeOut",
                    onComplete: done
                    });
                }}
            >  
            <SwipeItem 
                enabled={this.state.swipeEnabled} 
                actionThreshold={0.5} 
                offsetWidth={320} 
                swipeDirs={[SwipeDirection.Right]} 
                onSwipe={this.onSwipe}
                onScrollHandler={this.scrollHandler}
            >

                <div ref={this.bgContainer} className="postmatchBackgroundField" >
                    <div style={this.bgStyle}/>
                </div>
                <div ref={this.tableContainer} onScroll={this.scrollHandler} className="postmatchTablecontent">

                    <div style={this.getBackgroundFor(teamsContainerBG)} className="teams">
                        <div className="reportTeam reportTeam1">{this.props.appState.homeTeam.name}</div>
                        <div className="reportTeam reportTeam2">{this.props.appState.awayTeam.name}</div>
                    </div>
                    <div style={this.getBackgroundFor(generalTableBG)} className="generalTable"
                    onClick={this.clearSelectedRow}>
                        <div className="reportTableField gate">{this.props.appState.report.totalGate.asString}</div>
                        <div className="tableRow">
                            <div className="reportTableField reportTableField1">{this.props.appState.homeTeam.scorers.split(report_field_divider).length}</div>
                            <div className="reportTableField reportTableField2">{this.props.appState.awayTeam.scorers.split(report_field_divider).length}</div>
                        </div>
                        <div id="winnings" className="tableRow">
                            <div className="reportTableInputSlot">
                                <form onSubmit={this.addWinningsHandler(this.props.appState.homeTeam)}>
                                    <input className="reportTableInputField " type="text" value={this.state.winningsHome} onChange={this.changeWinningsHandler(this.props.appState.homeTeam)} onFocus={this.selectorOnFocus} onBlur={this.selectorOutFocus}/>
                                </form>
                            </div>
                            <div className="reportTableInputSlot">
                                <form onSubmit={this.addWinningsHandler(this.props.appState.awayTeam)}>
                                    <input className="reportTableInputField " type="text" value={this.state.winningsAway} onChange={this.changeWinningsHandler(this.props.appState.awayTeam)} onFocus={this.selectorOnFocus} onBlur={this.selectorOutFocus}/>
                                </form>
                            </div>
                        </div>
                        <div id="fanfactorChange" className="tableRow">
                            <div className="reportTableInputSlot">
                                <form onSubmit={this.addFFchangeHandler(this.props.appState.homeTeam)}>
                                    <input className="reportTableInputField " type="text" value={this.state.ffChangeHome} onChange={this.changeFFchangeHandler(this.props.appState.homeTeam)} onFocus={this.selectorOnFocus} onBlur={this.selectorOutFocus}/>
                                </form>
                            </div>
                            <div className="reportTableInputSlot">
                                <form onSubmit={this.addFFchangeHandler(this.props.appState.awayTeam)}>
                                    <input className="reportTableInputField " type="text" value={this.state.ffChangeAway} onChange={this.changeFFchangeHandler(this.props.appState.awayTeam)} onFocus={this.selectorOnFocus} onBlur={this.selectorOutFocus}/>
                                </form>
                            </div>
                        </div>
                        <div id="casualties" className="tableRow">
                            <div className="reportTableField reportTableField1">{this.props.appState.homeTeam.casualtiesinflicted}</div>
                            <div className="reportTableField reportTableField2">{this.props.appState.awayTeam.casualtiesinflicted}</div>
                        </div>
                        <div id="fame" className="tableRow">
                            <div className="reportTableField reportTableField1">{this.props.appState.report.fame > 0 ? "-" : "+" + Math.abs(this.props.appState.report.fame)}</div>
                            <div className="reportTableField reportTableField2">{this.props.appState.report.fame < 0 ? "-" : "+" + Math.abs(this.props.appState.report.fame)}</div>
                        </div>
                        <div id="tv" className="tableRow">
                            <div className="reportTableField reportTableField1">{this.props.appState.homeTeam.tvString}</div>
                            <div className="reportTableField reportTableField2">{this.props.appState.awayTeam.tvString}</div>
                        </div>
                    </div>
                    <div style={this.getBackgroundFor(achievementTableBG, "top")} className="achievementTable"
                    onClick={this.clearSelectedRow}>
                        <div id="mvp" className="achievementRow">
                            <form onSubmit={this.addMVPHandler(this.props.appState.homeTeam)} className="achievementInputSlot">
                                <input className="invisible-scrollbar reportTableInputField reportAchievementField1 reportAchievementInputField" type="text" value={this.state.mvpHome} onChange={this.changeMVPHandle(this.props.appState.homeTeam)} onFocus={this.selectorOnFocus} onBlur={this.selectorOutFocus}/>
                            </form>
                            <form onSubmit={this.addMVPHandler(this.props.appState.awayTeam)} className="achievementInputSlot">
                                <input className="invisible-scrollbar reportTableInputField reportAchievementField2 reportAchievementInputField" type="text" value={this.state.mvpAway} onChange={this.changeMVPHandle(this.props.appState.awayTeam)} onFocus={this.selectorOnFocus} onBlur={this.selectorOutFocus}/>
                            </form>
                        </div>
                        <div id="cp" className="achievementRow">
                            <div className="invisible-scrollbar reportTableField reportAchievementField1">{this.props.appState.homeTeam.completions}</div>
                            <div className="invisible-scrollbar reportTableField reportAchievementField2">{this.props.appState.awayTeam.completions}</div>
                        </div>
                        <div id="td" className="achievementRow">
                            <div className="invisible-scrollbar reportTableField reportAchievementField1">{this.props.appState.homeTeam.scorers}</div>
                            <div className="invisible-scrollbar reportTableField reportAchievementField2">{this.props.appState.awayTeam.scorers}</div>
                        </div>
                        <div id="int" className="achievementRow">
                            <div className="invisible-scrollbar reportTableField reportAchievementField1">{this.props.appState.homeTeam.intercepts}</div>
                            <div className="invisible-scrollbar reportTableField reportAchievementField2">{this.props.appState.awayTeam.intercepts}</div>
                        </div>
                        <div id="bh" className="achievementRow">
                            <div className="invisible-scrollbar reportTableField reportAchievementField1">{this.props.appState.homeTeam.badlyhurts}</div>
                            <div className="invisible-scrollbar reportTableField reportAchievementField2">{this.props.appState.awayTeam.badlyhurts}</div>
                        </div>
                        <div id="si" className="achievementRow">
                            <div className="invisible-scrollbar reportTableField reportAchievementField1">{this.props.appState.homeTeam.seriousinjuries}</div>
                            <div className="reportTableField reportAchievementField2">{this.props.appState.awayTeam.seriousinjuries}</div>
                        </div>
                        <div id="kill" className="achievementRow">
                            <div className="invisible-scrollbar reportTableField reportAchievementField1">{this.props.appState.homeTeam.kills}</div>
                            <div className="invisible-scrollbar reportTableField reportAchievementField2">{this.props.appState.awayTeam.kills}</div>
                        </div>
                    </div>
                    {this.injuryTable()}
                    {this.improvementTable()}
                </div>
            </SwipeItem>
            </Transition>
        </div>;
    };
    private onSwipe = (dir: string) => {
        if (dir === "right") {
            history.push(Screens.Match);
        }
    }
    private scrollHandler = (event:any) => {
        if (this.bgContainer.current && this.tableContainer.current) {
            this.bgContainer.current.scrollTop = this.tableContainer.current.scrollTop / 9;
        }
    }
    private injuryTable = () => {
        return <div style={this.getBackgroundFor(injuriesTableTitle, "top")} className="reportInjuryTable" >
            <div className="reportTableColumn">
                {this.props.appState.homeTeam.sufferedinjuries.length > 0 ?
                    this.props.appState.homeTeam.sufferedinjuries.map((injury: GameEvent, index) => {
                        const effect: InjuryEffect = Injury.getEffect(injury.injury);
                        const type: InjuryCode = Injury.getInjuryCode(injury.injury);
                        const playerStyles: string = effect === InjuryEffect.BH ? "invisible-scrollbar reportTableField reportTableInjuredPlayer reportTableInjuredNoEffect" : "invisible-scrollbar reportTableField reportTableInjuredPlayer"
                        const descrStyles: string = effect === InjuryEffect.BH ? "reportTableInjuryDescription reportTableInjuredNoEffect" : "reportTableInjuryDescription"
                        const numberStyles: string = effect === InjuryEffect.BH ? "reportTableInjuryNumber reportTableInjuredNoEffectNumber" : "reportTableInjuryNumber"


                        return <div key={index} style={effect === InjuryEffect.BH ? this.getBackgroundFor(injurySlotBHHome, "left top") : this.getBackgroundFor(injurySlotHome, "left top")} className="reportTableInjurySlot"
                        onClick={this.getSelectRowHandlerFor(injury)}>
                            <div className={playerStyles}>
                                {injury.player}
                            </div>
                            <div className="invisible-scrollbar reportTableField reportTableInjuryDescriptionRow ">
                                <div className={numberStyles}>{type}</div>
                                <div className={descrStyles}>{effect}</div>
                            </div>
                            {this.state.selectedEvent === injury ?
                                <button className={"deleteButton"} style={this.getBackgroundFor(deleteRowHome, "left top")} onClick={this.getInjuryDeletionHandler(this.props.appState.homeTeam)}/>
                            :
                                null
                            }
                        </div>
                    })
                : null}
            </div>
            <div className="reportTableColumn2">
                {this.props.appState.awayTeam.sufferedinjuries.length > 0 ?
                    this.props.appState.awayTeam.sufferedinjuries.map((injury: GameEvent, index) => {
                        const effect: InjuryEffect = Injury.getEffect(injury.injury);
                        const type: InjuryCode = Injury.getInjuryCode(injury.injury);
                        const playerStyles: string = effect === InjuryEffect.BH ? "invisible-scrollbar reportTableField reportTableInjuredPlayer reportTableInjuredPlayer2 reportTableInjuredNoEffect" : "invisible-scrollbar reportTableField reportTableInjuredPlayer reportTableInjuredPlayer2"
                        const descrStyles: string = effect === InjuryEffect.BH ? "reportTableInjuryDescription reportTableInjuryDescription2 reportTableInjuredNoEffect" : "reportTableInjuryDescription reportTableInjuryDescription2"
                        const numberStyles: string = effect === InjuryEffect.BH ? "reportTableInjuryNumber reportTableInjuredNoEffectNumber" : "reportTableInjuryNumber"


                        return <div key={index} style={effect === InjuryEffect.BH ? this.getBackgroundFor(injurySlotBHAway, "right top") : this.getBackgroundFor(injurySlotAway, "right top")} className="reportTableInjurySlot reportTableInjurySlot2"
                        onClick={this.getSelectRowHandlerFor(injury)}>
                            <div className={playerStyles}>
                                {injury.player}
                            </div>
                            <div className="invisible-scrollbar reportTableField reportTableInjuryDescriptionRow reportTableInjuryDescriptionRow2">
                                <div className={descrStyles}>{effect}</div>
                                <div className={numberStyles}>{type}</div>
                            </div>
                            {this.state.selectedEvent === injury ?
                                <button className={"deleteButton"} style={this.getBackgroundFor(deleteRowAway, "left top")} onClick={this.getInjuryDeletionHandler(this.props.appState.awayTeam)}/>
                            :
                                null
                            }
                        </div>
                    })
                : null}
            </div>
        </div>
    }

    private improvementTable = () => {
        return <div style={this.getBackgroundFor(improvementsTableTitle, "center top")} className="improvementTable">
            <div className="tableColumn">
                {this.state.improvementsHome.length > 0 ?
                    this.state.improvementsHome.map((improvement: GameEvent, index) => {
                        return <div key={index} style={this.getBackgroundFor(improvementSlotHome)} className="improvementSlotContainer"
                        onTouchStart={this.getRowPressHandlerFor(improvement)} 
                        onTouchEnd={this.getRowReleaseHandlerFor(improvement)} 
                        onMouseDown={this.getRowPressHandlerFor(improvement)} 
                        onMouseUp={this.getRowReleaseHandlerFor(improvement)} 
                        onMouseLeave={this.getRowReleaseHandlerFor(improvement)}>
                            <div className="improvementSlot">
                                <form onSubmit={this.editImprovementHandler(improvement, this.props.appState.homeTeam)}>
                                    <input className="invisible-scrollbar reportImprovementField reportImprovementPlayerField" 
                                        type="text" 
                                        value={improvement.player} 
                                        onFocus={this.selectorOnFocus} 
                                        onBlur={this.improOnBlurHandler} 
                                        onChange={this.changeImprovementPlayerHandle(improvement, this.props.appState.homeTeam)} />
                                </form>
                                <form onSubmit={this.editImprovementHandler(improvement, this.props.appState.homeTeam)}>
                                    <input className="reportImprovementField reportImprovementThrowField" 
                                        type="text" 
                                        value={improvement.improvementThrow1} 
                                        onFocus={this.selectorOnFocus} 
                                        onBlur={this.improOnBlurHandler} 
                                        onChange={this.changeImprovementThrowHandle(1, improvement, this.props.appState.homeTeam)} />
                                    <input className="reportImprovementField reportImprovementThrowField" 
                                        type="text" 
                                        value={improvement.improvementThrow2} 
                                        onFocus={this.selectorOnFocus} 
                                        onBlur={this.improOnBlurHandler} 
                                        onChange={this.changeImprovementThrowHandle(2, improvement, this.props.appState.homeTeam)} />
                                </form>
                                {this.state.selectedEvent === improvement ?
                                    <button className={"deleteButton"} style={this.getBackgroundFor(deleteRowHome, "left top")} onClick={this.getImprovementDeletionHandler(this.props.appState.homeTeam)}/>
                                :
                                    null
                                }
                            </div>
                        </div>
                    })
                : null}
                <div style={this.getBackgroundFor(addImprovementHome, "center top")} className="improvementAddLine" onClick={this.addImprovementLine("home")}></div>
            </div>
            <div className="tableColumn tableColumn2">
            {this.state.improvementsAway.length > 0 ?
                    this.state.improvementsAway.map((improvement: GameEvent, index) => {
                        return <div key={index} style={this.getBackgroundFor(improvementSlotAway)} className="improvementSlotContainer"
                        onTouchStart={this.getRowPressHandlerFor(improvement)} 
                        onTouchEnd={this.getRowReleaseHandlerFor(improvement)} 
                        onMouseDown={this.getRowPressHandlerFor(improvement)} 
                        onMouseUp={this.getRowReleaseHandlerFor(improvement)} 
                        onMouseLeave={this.getRowReleaseHandlerFor(improvement)}>
                            <div className="improvementSlot improvementSlot2">
                                <form onSubmit={this.editImprovementHandler(improvement, this.props.appState.awayTeam)}>
                                    <input className="invisible-scrollbar reportImprovementField reportImprovementPlayerField reportImprovementPlayerField2" 
                                        type="text" 
                                        value={improvement.player} 
                                        onFocus={this.selectorOnFocus} 
                                        onBlur={this.improOnBlurHandler} 
                                        onChange={this.changeImprovementPlayerHandle(improvement, this.props.appState.awayTeam)} />
                                </form>
                                <form onSubmit={this.editImprovementHandler(improvement, this.props.appState.awayTeam)}>
                                    <input className="reportImprovementField reportImprovementThrowField reportImprovementThrowField2" 
                                        type="text" 
                                        value={improvement.improvementThrow1} 
                                        onFocus={this.selectorOnFocus} 
                                        onBlur={this.improOnBlurHandler} 
                                        onChange={this.changeImprovementThrowHandle(1, improvement, this.props.appState.awayTeam)} />
                                    <input className="reportImprovementField reportImprovementThrowField reportImprovementThrowField2" 
                                        type="text" 
                                        value={improvement.improvementThrow2} 
                                        onFocus={this.selectorOnFocus} 
                                        onBlur={this.improOnBlurHandler} 
                                        onChange={this.changeImprovementThrowHandle(2, improvement, this.props.appState.awayTeam)} />
                                </form>
                                {this.state.selectedEvent === improvement ?
                                    <button className={"deleteButton"} style={this.getBackgroundFor(deleteRowAway, "left top")} onClick={this.getImprovementDeletionHandler(this.props.appState.awayTeam)}/>
                                :
                                    null
                                }
                            </div>
                        </div>
                    })
                : null}
                <div style={this.getBackgroundFor(addImprovementAway, "center top")} className="improvementAddLine" onClick={this.addImprovementLine("away")}></div>
            </div>
        </div>
    }

    private getSelectRowHandlerFor = (gameEvent: GameEvent) => {
        return (event:any) => {
            this.setState({selectedEvent: gameEvent});
        }
    }
    private getRowReleaseHandlerFor = (gameEvent: GameEvent) => {
        return (event:any) => {
            if (this.rowPressTimer) {
                clearTimeout(this.rowPressTimer);
            }
        }
    }
    private getRowPressHandlerFor = (gameEvent: GameEvent) => {
        return (event: any) => {
            if (this.state.selectedEvent && this.state.selectedEvent !== gameEvent) {
                this.clearSelectedRow(event);
            }
            this.rowPressTimer = setTimeout(() => {
                if (document.activeElement) {
                    // how to lose focus from currently active input form ?
                    // document.activeElement.blur();
                }
                this.setState({selectedEvent: gameEvent});
            }, 1500);
        }
    }
    private clearSelectedRow = (event: any) => {
        if (this.state.selectedEvent) {
            this.setState({selectedEvent: undefined});
        }
    }
    private getInjuryDeletionHandler = (side: Team) => {
        return (event: any) => {
            if (this.state.selectedEvent) {
                console.log("deleteSelectedInjury ", this.state.selectedEvent);
                let newInjuries: GameEvent[] = [...side.sufferedinjuries];
                const currentIndex : number = newInjuries.indexOf(this.state.selectedEvent);
                if (currentIndex !== -1) {
                    newInjuries.splice(currentIndex, 1);
                    side.sufferedinjuries = newInjuries;
                }
            }
        }
    }

    private getImprovementDeletionHandler = (side: Team) => {
        return (event: any) => {
            if (this.state.selectedEvent) {
                console.log("deleteSelectedImprovement ", this.state.selectedEvent);
                let newImprovements: GameEvent[] = [...side.improvements];
                const currentIndex: number = newImprovements.indexOf(this.state.selectedEvent);

                if (currentIndex !== -1) {
                    newImprovements.splice(currentIndex, 1);
                    if (side === this.props.appState.homeTeam) { 
                        this.setState({improvementsHome: newImprovements});
                        this.props.appState.homeTeam.improvements = newImprovements;
                    } else {
                        this.setState({improvementsAway: newImprovements});
                        this.props.appState.awayTeam.improvements = newImprovements;
                    }
                }
            }
        }
    }


    private addImprovementLine = (side: string) => {
        return (event: any) => {
            console.log("addImprovementLine for ", side);
            let newImprovements: GameEvent[] = side === "home" ?[...this.state.improvementsHome] : [...this.state.improvementsAway];

            newImprovements.push(new GameEvent({player: "-"}));
            side === "home" ? 
                this.setState({improvementsHome: newImprovements})
            :
                this.setState({improvementsAway: newImprovements})
            ;
        }
    }
    private editImprovementHandler = (improvementEvent: GameEvent, team: Team) => {
        return (event: any) => {
            console.log("editImprovementHandler ", improvementEvent);
            this.updateImprovement(improvementEvent, team);
            this.props.appState.updateReport();
        }
    }
    private selectorOnFocus = (event: any) => {
        console.log("selectorOnFocus ");
        this.setState({swipeEnabled: false})
    }
    private selectorOutFocus = (event: any) => {
        console.log("selectorOutFocus ");
        this.setState({swipeEnabled: true})
    }
    private improOnBlurHandler = (event: any) => {
        console.log("improOnBlurHandler ");
        this.props.appState.updateReport();
        this.setState({swipeEnabled: true})
    }
    private changeImprovementPlayerHandle = (improvementEvent: GameEvent, team: Team) => {
        return (event: any) => {
            improvementEvent.player = event.target.value;
            this.updateImprovement(improvementEvent, team);
        }
    }
    private changeImprovementThrowHandle = (die: number, improvementEvent: GameEvent, team: Team) => {
        return (event: any) => {
            const value: number = parseInt(event.target.value);
            die === 1 ? improvementEvent.improvementThrow1 = value : improvementEvent.improvementThrow2 = value;
            this.updateImprovement(improvementEvent, team);
        }
    }
    private updateImprovement = (improvementEvent: GameEvent, team: Team) => {
        let side: string = "home";
        let improList: GameEvent[] = this.state.improvementsHome;
        if (team === this.props.appState.awayTeam) {
            side = "away";
            improList = this.state.improvementsAway;
        }
        const currentIndex: number = improList.indexOf(improvementEvent);
        console.log("updateImprovement :", side, currentIndex);
        let newImproList: GameEvent[] = [...improList];
        if (currentIndex !== -1) {
            newImproList.splice(currentIndex, 1, improvementEvent);
        } else {
            newImproList.push(improvementEvent);
        }
        if (team === this.props.appState.homeTeam) { 
            this.setState({improvementsHome: newImproList});
            this.props.appState.homeTeam.improvements = newImproList;
        } else {
            this.setState({improvementsAway: newImproList});
            this.props.appState.awayTeam.improvements = newImproList;
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