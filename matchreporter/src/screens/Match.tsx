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
import inflicterselectorBG from '../img/event/inflicterSelector.png';
import injuryselectorBG from '../img/event/injurySelector.png';
import injuryComboSelectorBG from '../img/event/injuryComboSelector.png';
import team1Chosen from '../img/event/teamline_chosen1.png';
import team2Chosen from '../img/event/teamline_chosen2.png';
import player1Chosen from '../img/event/playerline_chosen1.png';
import player2Chosen from '../img/event/playerline_chosen2.png';
import player1ChosenNarrow from '../img/event/playerline_chosenNarrow1.png';
import player2ChosenNarrow from '../img/event/playerline_chosenNarrow2.png';

import { Team } from '../model/Team';
import { Injury } from '../model/Injury';
import '../css/Match.css';
import { number } from 'prop-types';

const bgStyle = {
  backgroundImage: `url(${bgMatch})`
};
interface IMatchState {
    activePlayer: string,
    passivePlayer: string,
    currentInjuryThrow: string,
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
            currentInjuryThrow: "-",
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
        if (!this.props.appState.homeTeam || !this.props.appState.awayTeam
        || this.props.appState.report.id === "empty") {
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
                <div className="injuryDescription">{`${this.currentInjury.result} : ${this.currentInjury.effect}`}</div>
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
        let doer: number = this.state.activePlayer ? parseInt(this.state.activePlayer) : -1;
        let target: number = this.state.passivePlayer ? parseInt(this.state.passivePlayer) : -1;
        let injury: number = this.state.currentInjuryThrow ? parseInt(this.state.currentInjuryThrow) : -1;
        /*
        console.log("team ", this.state.currentSelectedTeam);
        console.log("doer ", doer);
        console.log("target ", target);
        console.log("injury ", injury);
        */
        if (this.state.currentSelectedTeam && this.state.currentSelectedTeam !== undefined
        && doer !== NaN
        && (this.state.currentEventType !== EventType.Casualty 
            || target !== NaN && injury !== NaN)
        && (this.state.currentEventType !== EventType.Injury 
            || injury !== NaN)) {
            switch (this.state.currentEventType) {
                case EventType.Goal:
                    this.props.appState.addScorer(this.state.currentSelectedTeam, doer);
                    break;
                case EventType.Completion:
                    this.props.appState.addThrower(this.state.currentSelectedTeam, doer);
                    break;
                case EventType.Casualty:
                    if (this.currentInjury) {
                        this.props.appState.addCasualty(this.state.currentSelectedTeam, doer, target, injury);
                    }
                    break;
                case EventType.Injury:
                    if (this.currentInjury) {
                        this.props.appState.addInjury(this.state.currentSelectedTeam, doer, injury);
                    }
                    break;
                case EventType.Intercept:
                    this.props.appState.addIntercept(this.state.currentSelectedTeam, doer);
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