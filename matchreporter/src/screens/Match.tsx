import * as React from 'react';
import { IAppProps } from "../App";
import Navigator from '../components/Navigator';
import TimePiece from '../components/TimePiece';
import {Screens} from "../model/AppState";
import { EventDescription, EventType } from '../model/MatchEvent';

import bgMatch from '../img/backgrounds/GRASS_1PM.jpg';
/*
import casualtyButton from '../img/buttons/CASUALTY_active.png';
import completionButton from '../img/buttons/COMPLETION_active.png';
import goalButton from '../img/buttons/GOAL_active.png';
import injuryButton from '../img/buttons/INJURY_active.png';
import interceptButton from '../img/buttons/INTERCEPT_active.png';
*/
import eventButtons from '../img/match/eventButtons.png';
import eventButtons_disabled from '../img/match/eventButtons_disabled.png';
import eventConfirmButton from '../img/event/confirmButton.png';

import eventTitleDiv from '../img/event/titleDiv.png';
import teamselectorBG from '../img/event/teamselector.png';
import playerselectorBG from '../img/event/playerSelector.png';
import injuredselectorBG from '../img/event/injuredSelector.png';
import inflictorselectorBG from '../img/event/inflictorSelector.png';
import injuryselectorBG from '../img/event/injurySelector.png';
import injuryComboSelectorBG from '../img/event/injuryComboSelector.png';
import team1Chosen from '../img/event/teamline_chosen1.png';
import team2Chosen from '../img/event/teamline_chosen2.png';
import player1Chosen from '../img/event/playerline_chosen1.png';
import player2Chosen from '../img/event/playerline_chosen2.png';
import player1ChosenNarrow from '../img/event/playerline_chosenNarrow1.png';
import player2ChosenNarrow from '../img/event/playerline_chosenNarrow2.png';

import { Team } from '../model/Team';
import '../css/Match.css';

const bgStyle = {
  backgroundImage: `url(${bgMatch})`
};
interface IMatchState {
    activePlayer: string,
    passivePlayer: string,
    currentInjuryThrow: number,
    eventInputActive: boolean,
    currentEventType: EventType,
    currentSelectedTeam?: Team,
}
class Match extends React.Component<IAppProps, IMatchState> {

    public constructor (props: any) {
        super(props);
        this.state = {
            activePlayer: "-",
            currentEventType: 0,
            currentInjuryThrow: 0,
            eventInputActive: false,
            passivePlayer: "-",
        }
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
    public componentWillMount() {
        this.props.appState.screen = Screens.Match;
    }
    public render() {
        if (!this.props.appState.homeTeam || !this.props.appState.awayTeam) {
            window.location.href = "/";
        }
        return <div className="Match" style={bgStyle}>
            <Navigator appState={this.props.appState}/>
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
        </div>;
    };
    private teamSelector = () => {
        const selectorBG = {
            backgroundImage: `url(${teamselectorBG})`,
            backgroundPosition: 'center',
            backgroundRepeat  : 'no-repeat',
        };
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

        return <div style={selectorBG} className="eventTeamSelector">
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

        let playerChosenStyle = {
            backgroundPosition: 'center',
            backgroundRepeat  : 'no-repeat',
        } as React.CSSProperties;

        if (this.state.currentSelectedTeam === this.props.appState.report.home) {
            playerChosenStyle.backgroundImage = `url(${player1Chosen})`;
        } else if (this.state.currentSelectedTeam === this.props.appState.report.away) {
            playerChosenStyle.backgroundImage = `url(${player2Chosen})`;
        }

        return <div style={selectorBG} className="eventPlayerSelector">
            <div className="eventPlayerSlot" style={playerChosenStyle} >
                <form onSubmit={this.addPlayerValue}>
                    <input className="eventPlayerInput" type="text" pattern="[0-9:]*" value={this.state.activePlayer} onChange={this.handleActivePlayerChange} />
                </form>
            </div>
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
    private handleActivePlayerChange = (event: any) => {
        console.log("handleActivePlayerChange :", event.target.value);
        this.setState({
            activePlayer: event.target.value,
        })
    }

/*
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
            <img className="eventTitlediv" src={eventTitleDiv}/>
            <div className="eventTeamSelector"/>
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
    <div className="eventInputContainer">
        <div className="eventInputTeamSelector">
            <div className={this.state.currentSelectedTeam === this.props.appState.homeTeam ? activeTeamStyles : teamStyles} onClick={this.teamSelectHandler(this.props.appState.homeTeam)}>{this.props.appState.homeTeam ? this.props.appState.homeTeam.name : "no name"}</div>
            <div className={this.state.currentSelectedTeam === this.props.appState.awayTeam ? activeTeamStyles : teamStyles} onClick={this.teamSelectHandler(this.props.appState.awayTeam)}>{this.props.appState.awayTeam ? this.props.appState.awayTeam.name : "no name"}</div>
        </div>
        {this.eventInputRow("activePlayer")}
        {this.state.currentEventType === EventType.Casualty ? this.eventInputRow("passivePlayer") : null}
    </div>
*/
    private teamSelectHandler = (team: Team | undefined) => {
        return (event: any) => {
            this.setState({currentSelectedTeam: team});
        }
    }
    private addPlayerValue = (event: any) => {
        console.log("addPlayerValue ", event.target.value);
        this.insertActivePlayer(event.target.value);
    }
    private insertActivePlayer = (player: string) => {
        console.log("insertActivePlayer ", player);
        if (this.state.currentSelectedTeam) {
            switch (this.state.currentEventType) {
                case EventType.Goal:
                    this.props.appState.addScorer(this.state.currentSelectedTeam, player)
                    break;
                case EventType.Completion:
                    this.props.appState.addThrower(this.state.currentSelectedTeam, player)
                    break;
                case EventType.Casualty:
                    // this.props.appState.addCasualty(this.state.currentSelectedTeam, player)
                    break;
                case EventType.Intercept:
                    this.props.appState.addIntercept(this.state.currentSelectedTeam, player)
                    break;
                case EventType.Injury:
                    // this.props.appState.addInjury(this.state.currentSelectedTeam, player)
                    break;
            }
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
        if (this.state.activePlayer && this.state.activePlayer !== "-"
        && this.state.currentSelectedTeam && this.state.currentSelectedTeam !== undefined
        && (this.state.currentEventType !== EventType.Casualty || this.state.passivePlayer && this.state.passivePlayer !== "-" && this.state.currentInjuryThrow && this.state.currentInjuryThrow !== 0)
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
            activePlayer: "-", 
            currentEventType: 0, 
            currentInjuryThrow: 0,
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
                    currentInjuryThrow: 0,
                    currentSelectedTeam: undefined,
                    eventInputActive: true,
                    passivePlayer: "-",
                })
            }
        }
    }
}
export default Match;