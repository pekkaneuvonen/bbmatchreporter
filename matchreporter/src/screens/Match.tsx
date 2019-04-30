import * as React from 'react';
import { IAppProps } from "../App";
import Navigator from '../components/Navigator';
import TimePiece from '../components/TimePiece';
import {Screens} from "../model/AppState";
import { EventDescription, EventType } from '../model/MatchEvent';

import { Transition } from 'react-transition-group';
import { TweenLite } from "gsap";

import bgMatch from '../img/backgrounds/GRASS_1PM.jpg';
/*
import casualtyButton from '../img/buttons/CASUALTY_active.png';
import completionButton from '../img/buttons/COMPLETION_active.png';
import goalButton from '../img/buttons/GOAL_active.png';
import injuryButton from '../img/buttons/INJURY_active.png';
import interceptButton from '../img/buttons/INTERCEPT_active.png';
*/
import eventButtons from '../img/match/eventButtons.png';
import eventConfirmButton from '../img/event/confirmButton.png';

import eventTitleDiv from '../img/event/titleDiv.png';
import teamselectorBG from '../img/event/teamselector.png';
import playerselectorBG from '../img/event/playerSelector.png';
import injuredselectorBG from '../img/event/injuredSelector.png';
import inflicterselectorBG from '../img/event/inflicterSelector.png';
import injuryselectorBG from '../img/event/injurySelector.png';
import injuryComboSelectorBG from '../img/event/injuryComboSelector.png';
import team1Chosen from '../img/event/teamline_chosen1.png';
import team2Chosen from '../img/event/teamline_chosen2.png';
import player1Chosen from '../img/event/playerline_chosen1.png';
import player2Chosen from '../img/event/playerline_chosen2.png';
import player1ChosenNarrow from '../img/event/playerline_chosenNarrow1.png';
import player2ChosenNarrow from '../img/event/playerline_chosenNarrow2.png';

import SwipeItem, { SwipeDirection } from '../components/SwipeItem';
import history from "./history";

import { Team } from '../model/Team';
import { Injury } from '../model/Injury';
import '../css/Match.css';

interface IMatchState {
    activePlayer: string,
    passivePlayer: string,
    currentInjuryThrow: string,
    eventInputActive: boolean,
    currentEventType: EventType,
    currentSelectedTeam?: Team,
}

class Match extends React.Component<IAppProps, IMatchState> {
    private bgContainer: React.RefObject<HTMLDivElement>;
    private tableContainer: React.RefObject<HTMLDivElement>;

    private bgStyle = {
        backgroundImage: `url(${bgMatch})`,
        height: "2048px" // will be updated in componentDidUpdate to fit reportList height 
    };

    public constructor (props: any) {
        super(props);
        this.bgContainer = React.createRef();
        this.tableContainer = React.createRef();
        this.state = {
            activePlayer: "-",
            currentEventType: 0,
            currentInjuryThrow: "-",
            eventInputActive: false,
            passivePlayer: "-",
        }
        this.props.appState.prevscreen = this.props.appState.screen;
        this.props.appState.screen = Screens.Match;

        this.bgStyle = {
            backgroundImage: `url(${bgMatch})`,
            height: `${this.tableContainer.current ? this.tableContainer.current.scrollHeight + 80: 2048}px`,
        };
    }
    private eventbuttonsBGstyle = {
        backgroundImage: `url(${eventButtons})`,
        backgroundPosition: 'center',
        backgroundRepeat  : 'no-repeat',
    };
    private confirmbuttonBGstyle = {
        backgroundImage: `url(${eventConfirmButton})`,
        backgroundPosition: 'center',
        backgroundRepeat  : 'no-repeat',
    };

    public render() {
        if (!this.props.appState.homeTeam || !this.props.appState.awayTeam
        || this.props.appState.report.id === "empty") {
            window.location.href = "/";
        }

        const show: boolean = this.props.appState.screen === Screens.Match;
        let fromX: number = !show ? 0 : this.props.appState.prevscreen === Screens.Prematch ? window.innerWidth : -window.innerWidth;
        let toX: number = show ? 0 : this.props.appState.screen === Screens.Prematch ? window.innerWidth : -window.innerWidth;

        const startState = { autoAlpha: 0, x: fromX};

        return <div className="Match">
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
            <SwipeItem threshold={0.5} offsetWidth={320} swipeDirs={[SwipeDirection.Left, SwipeDirection.Right]} onSwipe={this.onSwipe}>
                <div ref={this.bgContainer} className="matchBackgroundField" >
                    <div style={this.bgStyle}/>
                </div>
                {this.state.eventInputActive ? 
                    <div className="eventContainer">
                        <div className="eventContainerBG"/>
                        <div className="eventTitle">
                            {EventDescription[this.state.currentEventType]}
                        </div>

                        <img className="eventTitlediv" src={eventTitleDiv}/>
                        {this.teamSelector()}
                        <img className="eventTitlediv" src={eventTitleDiv}/>
                        {this.playerSelector()}
                        {this.state.currentEventType === EventType.Casualty || this.state.currentEventType === EventType.Injury ?
                            <div>
                                <img className="eventTitlediv" src={eventTitleDiv}/>
                                {this.additionalSelector()}
                            </div>
                            :
                            null
                        }

                        <div className="confirmButtonContainer">
                            <button style={this.confirmbuttonBGstyle} className="confirmButton" onClick={this.eventCancelHandler}>
                                CANCEL
                            </button>
                            <button style={this.confirmbuttonBGstyle} className="confirmButton" onClick={this.eventDoneHandler}>
                                DONE
                            </button>
                        </div>
                    </div>
                : null}
                <div ref={this.tableContainer} className="matchTablecontent" onScroll={this.scrollHandler}>
                    <div className="timerContainer">
                        <TimePiece appState={this.props.appState} pauseOverride={this.state.eventInputActive} defautlTimerValue={this.props.appState.defaultTimerValue}/>
                    </div>
                    <div style={this.eventbuttonsBGstyle} className="eventbuttonContainer">
                        <button className={"eventbutton"} onClick={this.eventButtonHandlerFactory(EventType.Completion)}/>
                        <button className={"eventbutton"} onClick={this.eventButtonHandlerFactory(EventType.Goal)}/>
                        <button className={"eventbutton"} onClick={this.eventButtonHandlerFactory(EventType.Casualty)}/>
                        <button className={"eventbutton"} onClick={this.eventButtonHandlerFactory(EventType.Intercept)}/>
                        <button className={"eventbutton"} onClick={this.eventButtonHandlerFactory(EventType.Injury)}/>
                    </div>
                </div>
            </SwipeItem>
            </Transition>
        </div>;
    };
    private onSwipe = (dir: string) => {
        if (dir === "left") {
            history.push(Screens.Postmatch);
        } else if (dir === "right") {
            history.push(Screens.Prematch);
        }
    }
    private scrollHandler = (event:any) => {
        if (this.bgContainer.current && this.tableContainer.current) {
            this.bgContainer.current.scrollTop = this.tableContainer.current.scrollTop / 9;
        }
    }
    private teamSelector = () => {
        const selectorBG = {
            backgroundImage: `url(${teamselectorBG})`,
            backgroundPosition: 'center',
            backgroundRepeat  : 'no-repeat',
        };
        let bgStyles: string = "eventTeamSelector";
        if (this.state.currentEventType === EventType.Casualty || this.state.currentEventType === EventType.Injury) {
            bgStyles = "modifiedTeamSelector";
        }


        const team1ChosenStyle = this.state.currentSelectedTeam === this.props.appState.report.home ? {
            backgroundImage: `url(${team1Chosen})`,
            backgroundPosition: 'center',
            backgroundRepeat  : 'no-repeat',
        } as React.CSSProperties
        : {backgrounnd: "transparent"} as React.CSSProperties;
        
        const team2ChosenStyle = this.state.currentSelectedTeam === this.props.appState.report.away ? {
            backgroundImage: `url(${team2Chosen})`,
            backgroundPosition: 'center',
            backgroundRepeat  : 'no-repeat',
        } as React.CSSProperties
        : {backgrounnd: "transparent"} as React.CSSProperties;

        return <div style={selectorBG} className={bgStyles}>
            <div className="eventTeamSlot eventTeamSlot1" style={team1ChosenStyle} onClick={this.teamSelectHandler(this.props.appState.report.home)}>
                {this.props.appState.report.home.name}
            </div>
            <div className="eventTeamSlot eventTeamSlot2" style={team2ChosenStyle} onClick={this.teamSelectHandler(this.props.appState.report.away)}>
                {this.props.appState.report.away.name}
            </div>
        </div>;
    }
    private playerSelector = () => {
        const selectorBG = {
            backgroundImage: `url(${playerselectorBG})`,
            backgroundPosition: 'center',
            backgroundRepeat  : 'no-repeat',
        };
        let bgStyles: string = "eventPlayerSelector";
        let slotStyles: string = "eventPlayerSlot force-select";

        if (this.state.currentEventType === EventType.Casualty) {
            selectorBG.backgroundImage = `url(${inflicterselectorBG})`;
            bgStyles += " modifiedPlayerSelector";
        } else if (this.state.currentEventType === EventType.Injury) {
            selectorBG.backgroundImage = `url(${injuredselectorBG})`;
            bgStyles += " modifiedPlayerSelector";
        }


        let chosenPlayerStyle = {
            backgroundPosition: 'center',
            backgroundRepeat  : 'no-repeat',
        } as React.CSSProperties;

        if (this.state.currentSelectedTeam === this.props.appState.report.home) {
            chosenPlayerStyle.backgroundImage = `url(${player1Chosen})`;
        } else if (this.state.currentSelectedTeam === this.props.appState.report.away) {
            chosenPlayerStyle.backgroundImage = `url(${player2Chosen})`;
        }

        return <div style={selectorBG} className={bgStyles}>
            <div className={slotStyles} style={chosenPlayerStyle} >
                <form onSubmit={this.addActivePlayerValue}>
                    <input className="eventPlayerInput force-select" type="text" value={this.state.activePlayer} onChange={this.handleActivePlayerChange} />
                </form>
            </div>
        </div>;
    }


    private additionalSelector = () => {
        const selectorBG = {
            backgroundImage: `url(${injuryselectorBG})`,
            backgroundPosition: 'center',
            backgroundRepeat  : 'no-repeat',
        };
        let passivePlayerStyle = {
            backgroundPosition: 'center',
            backgroundRepeat  : 'no-repeat',
        } as React.CSSProperties;


        let narrowStyles: boolean = false;
        let bgStyles: string = "eventAdditionalSelector";
        let slotStyles: string = "eventPlayerSlot";
        let injuryInput: string = "eventPlayerInput force-select";
        if (this.state.currentEventType === EventType.Casualty) {
            selectorBG.backgroundImage = `url(${injuryComboSelectorBG})`;
            slotStyles = "eventAdditionalSlot";
            injuryInput = "narrowInput force-select";
            narrowStyles = true;
        }


        if (this.state.currentSelectedTeam === this.props.appState.report.home) {
            passivePlayerStyle.backgroundImage = `url(${narrowStyles ? player2ChosenNarrow : player2Chosen})`;
        } else if (this.state.currentSelectedTeam === this.props.appState.report.away) {
            passivePlayerStyle.backgroundImage = `url(${narrowStyles ? player1ChosenNarrow : player1Chosen})`;
        }

        return <div style={selectorBG} className={bgStyles}>
            {this.state.currentEventType === EventType.Casualty ? 
                <div className="eventAdditionalSlot modifiedAdditionalSlot" style={passivePlayerStyle} >
                    <form onSubmit={this.addPassivePlayerValue}>
                        <input className={"narrowInput force-select"} type="text" value={this.state.passivePlayer} onFocus={this.selectorOnFocus} onBlur={this.selectorOutFocus} onChange={this.handlePassivePlayerChange} />
                    </form>
                </div>
                : null
            }
            <div className={slotStyles} style={passivePlayerStyle} >
                <form onSubmit={this.addInjuryValue}>
                    <input className={injuryInput} type="text" value={this.state.currentInjuryThrow} onFocus={this.selectorOnFocus} onBlur={this.selectorOutFocus} onChange={this.handleInjuryChange} />
                </form>
            </div>
            {this.currentInjury ? 
                <div className="injuryDescription">{`${this.currentInjury.description} : ${this.currentInjury.effect}`}</div>
                : "-"
            }
        </div>;
    }
    /*
    private handleTeamName1Change = (event: any) => {
        this.props.titleChangeHandler({title1:event.target.value, title2:this.state.title2});

        this.setState({ title1: event.target.value });
    }
    <div className="eventPlayerSlot" style={playerChosenStyle} onClick={this.teamSelectHandler(this.props.appState.report.home)}>
        #{this.state.activePlayer}
    </div>
    */

    private selectorOnFocus = (event: any) => {
        console.log("selectorOnFocus");
    }
    private selectorOutFocus = (event: any) => {
        console.log("selectorOutFocus");
    }
    private teamSelectHandler = (team: Team | undefined) => {
        return (event: any) => {
            this.setState({currentSelectedTeam: team});
        }
    }

    
    private handleInjuryChange = (event: any) => {
        this.setState({
            currentInjuryThrow: event.target.value,
        });
    }
    private addInjuryValue = (event: any) => {
        event.preventDefault();
        // this.insertInjury(event.target.value);
        this.setState({
            currentInjuryThrow: event.target.value,
        });
    }
    private get currentInjury(): Injury | null {
        if (this.state.currentInjuryThrow) {
            return new Injury({D68: this.state.currentInjuryThrow});
        } else {
            return null;
        }
    }

    private handlePassivePlayerChange = (event: any) => {
        this.setState({
            passivePlayer: event.target.value,
        });
    }
    private addPassivePlayerValue = (event: any) => {
        event.preventDefault();
        // this.insertPassivePlayer(event.target.value);
        this.setState({
            passivePlayer: event.target.value,
        });
    }
    

    private handleActivePlayerChange = (event: any) => {
        this.setState({
            activePlayer: event.target.value,
        });
    }
    private addActivePlayerValue = (event: any) => {
        event.preventDefault();
        // this.insertActivePlayer(event.target.value);
        this.setState({
            activePlayer: event.target.value,
        });
    }



    private eventInputHandlerFactory = (eventTargetProperty: string) => {
        return (event: any) => {
            const property: string = eventTargetProperty;
            const value: number = parseInt(event.target.value, 10);
            this.setState((prevState) => ({
                ...prevState,
                [property]: value,
            }));
        }
    }
    private eventCancelHandler = (event: any) => {
        this.clearEvent();
    }
    private eventDoneHandler = (event: any) => {
        console.log("event done!");
        let injury: number = this.state.currentInjuryThrow ? parseInt(this.state.currentInjuryThrow) : -1;
        /*
        console.log("team ", this.state.currentSelectedTeam);
        console.log("doer ", doer);
        console.log("target ", target);
        console.log("injury ", injury);
        */
        if (this.state.currentSelectedTeam && this.state.currentSelectedTeam !== undefined
        && this.state.activePlayer
        && (this.state.currentEventType !== EventType.Casualty 
            || this.state.passivePlayer && injury !== NaN)
        && (this.state.currentEventType !== EventType.Injury 
            || injury !== NaN)) {
            switch (this.state.currentEventType) {
                case EventType.Goal:
                    this.props.appState.addScorer(this.state.currentSelectedTeam, this.state.activePlayer);
                    break;
                case EventType.Completion:
                    this.props.appState.addThrower(this.state.currentSelectedTeam, this.state.activePlayer);
                    break;
                case EventType.Casualty:
                    if (this.currentInjury) {
                        this.props.appState.addCasualty(this.state.currentSelectedTeam, this.state.activePlayer, this.state.passivePlayer, injury);
                    }
                    break;
                case EventType.Injury:
                    if (this.currentInjury) {
                        this.props.appState.addInjury(this.state.currentSelectedTeam, this.state.activePlayer, injury);
                    }
                    break;
                case EventType.Intercept:
                    this.props.appState.addIntercept(this.state.currentSelectedTeam, this.state.activePlayer);
                    break;
                default:
                    break;
            }
            this.clearEvent();
        }
    }
    private clearEvent = () => {
        this.setState({
            activePlayer: "-", 
            currentEventType: 0, 
            currentInjuryThrow: "-",
            currentSelectedTeam: undefined,
            eventInputActive: false, 
            passivePlayer: "-",
        });
    }
    private eventButtonHandlerFactory = (matchEvent: EventType) => {
        return (event: any) => {
            if (!this.props.appState.eventsblocked) {
                this.setState({
                    activePlayer: "-", 
                    currentEventType: matchEvent,
                    currentInjuryThrow: "-",
                    currentSelectedTeam: undefined,
                    eventInputActive: true,
                    passivePlayer: "-",
                })
            }
        }
    }
}
export default Match;