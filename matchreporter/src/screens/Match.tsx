import * as React from 'react';
import { IAppProps } from "../App";
import Navigator from '../components/Navigator';
import TimePiece from '../components/TimePiece';
import {Screens} from "../model/AppState";
import { EventDescription, EventType } from '../model/MatchEvent';

import bgMatch from '../img/backgrounds/GRASS_1PM.jpg';
import casualtyButton from '../img/buttons/CASUALTY_active.png';
import completionButton from '../img/buttons/COMPLETION_active.png';
import goalButton from '../img/buttons/GOAL_active.png';
import injuryButton from '../img/buttons/INJURY_active.png';
import interceptButton from '../img/buttons/INTERCEPT_active.png';

import { Team } from '../model/Team';
import '../css/Match.css';

const bgStyle = {
  backgroundImage: `url(${bgMatch})`
};
interface IMatchState {
    activePlayer: number,
    passivePlayer: number,
    currentInjuryThrow: number,
    eventInputActive: boolean,
    currentEventType: EventType,
    currentSelectedTeam?: Team,
}
class Match extends React.Component<IAppProps, IMatchState> {

    public constructor (props: any) {
        super(props);
        this.state = {
            activePlayer: 0,
            currentEventType: 0,
            currentInjuryThrow: 0,
            eventInputActive: false,
            passivePlayer: 0,
        }
    }

    public componentWillMount() {
        this.props.appState.screen = Screens.Match;
    }
    public render() {
        if (!this.props.appState.homeTeam || !this.props.appState.awayTeam) {
            window.location.href = "/";
        }
        return <div className="Match" style={bgStyle}>
            <Navigator appState={this.props.appState}/>
            <div className="timerContainer">
                <TimePiece appState={this.props.appState} pauseOverride={this.state.eventInputActive} defautlTimerValue={this.props.appState.defaultTimerValue}/>
            </div>
            <div className="eventbuttons">
                <button className={"eventbutton"} onClick={this.eventButtonHandlerFactory(EventType.Goal)}>
                    <img src={goalButton}/>
                </button>
                <button className={"eventbutton"} onClick={this.eventButtonHandlerFactory(EventType.Completion)}>
                    <img src={completionButton}/>
                </button>
                <button className={"eventbutton"} onClick={this.eventButtonHandlerFactory(EventType.Injury)}>
                    <img src={injuryButton}/>
                </button>
                <button className={"eventbutton"} onClick={this.eventButtonHandlerFactory(EventType.Casualty)}>
                    <img src={casualtyButton}/>
                </button>
                <button className={"eventbutton"} onClick={this.eventButtonHandlerFactory(EventType.Intercept)}>
                    <img src={interceptButton}/>
                </button>
            </div>
            {this.state.eventInputActive ? this.eventDetails() : null}
        </div>;
    };

    private eventDetails() {
        const teamStyles: string = "teamSelectorTeam";
        const activeTeamStyles: string = "teamSelectorTeam teamSelectorActiveTeam";
        console.log("this.state.currentEventType : " + this.state.currentEventType);
        console.log("EventDescription[] : " + EventDescription[this.state.currentEventType]);

        // EventDescription[EventType[this.state.currentEventType]]
        return <div className="eventContainer">
            <div className="eventTitle">
                {EventDescription[this.state.currentEventType]}
            </div>
            <div className="eventInputSeparator"/>
            <div className="eventInputContainer">
                <div className="eventInputTeamSelector">
                    <div className={this.state.currentSelectedTeam === this.props.appState.homeTeam ? activeTeamStyles : teamStyles} onClick={this.teamSelectHandler(this.props.appState.homeTeam)}>{this.props.appState.homeTeam ? this.props.appState.homeTeam.name : "no name"}</div>
                    <div className={this.state.currentSelectedTeam === this.props.appState.awayTeam ? activeTeamStyles : teamStyles} onClick={this.teamSelectHandler(this.props.appState.awayTeam)}>{this.props.appState.awayTeam ? this.props.appState.awayTeam.name : "no name"}</div>
                </div>
                {this.eventInputRow("activePlayer")}
                {this.state.currentEventType === EventType.Casualty ? this.eventInputRow("passivePlayer") : null}
            </div>
            <div className="confirmButtonContainer">
                <button className="confirmButton" onClick={this.eventDoneHandler}>
                    DONE
                </button>
                <button className="confirmButton" onClick={this.eventCancelHandler}>
                    CANCEL
                </button>
            </div>
        </div>
    }
    private teamSelectHandler = (team: Team | undefined) => {
        return (event: any) => {
            this.setState({currentSelectedTeam: team});
        }
    }
    private eventInputRow = (actor: string) => {
        let label: string = "";
        let stateVar: string = this.state.activePlayer.toString();
        if (actor === "passivePlayer") {
            stateVar = this.state.passivePlayer.toString();
        }
        switch (this.state.currentEventType) {
            case EventType.Goal:
                label = "scorer:";
                break;
            case EventType.Completion:
                label = "thrower:";
                break;
            case EventType.Casualty:
                if (actor === "passivePlayer") {
                    label = "injured:";
                } else {
                    label = "inflicter:";
                }
                break;
            case EventType.Injury:
                label = "injured:";
                break;
            case EventType.Intercept:
                label = "interceptor:";
                break;
            default:
                break;
        }
        return <div className="eventInputRow">
                <div className="eventInputLabel">{label}</div>
                <input className="eventInputField" value={stateVar} type="text" pattern="[0-9:]*" maxLength={2} onChange={this.eventInputHandlerFactory(actor)}/>
                {label === "injured:" ? 
                    <input className="eventInputField" value={this.state.currentInjuryThrow} type="text" pattern="[0-9:]*" maxLength={2} onChange={this.eventInputHandlerFactory("currentInjuryThrow")}/>
                    :
                    null
                }
            </div>
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
        if (this.state.activePlayer && this.state.activePlayer !== 0
        && this.state.currentSelectedTeam && this.state.currentSelectedTeam !== undefined
        && (this.state.currentEventType !== EventType.Casualty || this.state.passivePlayer && this.state.passivePlayer !== 0 && this.state.currentInjuryThrow && this.state.currentInjuryThrow !== 0)
        && (this.state.currentEventType !== EventType.Injury || this.state.currentInjuryThrow && this.state.currentInjuryThrow !== 0)) {
            switch (this.state.currentEventType) {
                case EventType.Goal:
                    this.props.appState.addScorer(this.state.currentSelectedTeam, this.state.activePlayer);
                    break;
                case EventType.Completion:
                    this.props.appState.addThrower(this.state.currentSelectedTeam, this.state.activePlayer);
                    break;
                case EventType.Casualty:
                    this.props.appState.addCasualty(this.state.currentSelectedTeam, this.state.activePlayer, this.state.passivePlayer, this.state.currentInjuryThrow);
                    break;
                case EventType.Injury:
                    this.props.appState.addInjury(this.state.currentSelectedTeam, this.state.activePlayer, this.state.currentInjuryThrow);
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
            activePlayer: 0, 
            currentEventType: 0, 
            currentInjuryThrow: 0,
            currentSelectedTeam: undefined,
            eventInputActive: false, 
            passivePlayer: 0,
        });
    }
    private eventButtonHandlerFactory = (matchEvent: EventType) => {
        return (event: any) => {
            if (!this.props.appState.eventsblocked) {
                this.setState({
                    activePlayer: 0, 
                    currentEventType: matchEvent,
                    currentInjuryThrow: 0,
                    currentSelectedTeam: undefined,
                    eventInputActive: true,
                    passivePlayer: 0,
                })
            }
        }
    }
}
export default Match;