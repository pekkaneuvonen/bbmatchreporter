import * as React from 'react';
import '../css/Timepiece.css';

import basecenter from '../img/timepiece/baseCenter.png';

import progresshalf_1 from '../img/timepiece/progresshalf1.png';
import progresshalf_2 from '../img/timepiece/progresshalf2.png';

import { AppState } from '../model/AppState';
import resetButton from '../img/timer/resetButton2.png';
import setButton from '../img/timer/setButton2.png';
import resetButton_disabled from '../img/timer/resetButton_disabled.png';
import setButton_active from '../img/timer/setButton.png';

import base from '../img/timer/base.png';
import degrees from '../img/timer/degrees.png';
import timepiece from '../img/timer/timepiece.png';
import paused from '../img/timer/paused.png';
import timepiece_paused from '../img/timer/timepiece_paused.png';
import timepiece_setup from '../img/timer/timepiece_setup.png';




const secondInterval: number = 1000;
const minuteInterval: number = 60000;

interface ItimepieceState {
    // minutes: number,
    // seconds: number,
    ticking: boolean;
    setupTime: number;
    time: string;
    timer: NodeJS.Timer;
    timerInput: boolean;
}
export interface ITimerProps {
    appState: AppState,
    pauseOverride: boolean,
    defautlTimerValue?: number,
  }
  

class TimePiece extends React.Component<ITimerProps, ItimepieceState> {

    constructor (props:any) {
        super(props);
        let newlySetValue: number = props.defautlTimerValue ? props.defautlTimerValue : 0;

        console.log("timePiece constructor : ", this.props.appState.setTimerValue, this.props.appState.currentTimerValue);
        if (!this.props.appState.setTimerValue) {
            this.props.appState.setTimerValue = newlySetValue;
        }
        if (!this.props.appState.currentTimerValue) {
            this.props.appState.currentTimerValue = newlySetValue;
        } else {
            newlySetValue = this.props.appState.currentTimerValue;
        }
        this.state = {
            // minutes: this.getWholeMinutes(newlySetValue),
            // seconds: this.getWholeSeconds(newlySetValue),
            ticking: false,
            setupTime: newlySetValue,
            time: this.formatTimerDisplayFromMilliseconds(newlySetValue),
            timer: setInterval(this.setProgress, secondInterval),
            timerInput: false,
        }
    }
    public componentWillUnmount(): void {
        clearInterval(this.state.timer);
    }
    public render() {
        const timerPaused: boolean = (!this.state.ticking || this.props.pauseOverride) && !this.state.timerInput;
        let timerBGsrc: string = timerPaused ? timepiece_paused : timepiece;
        if (this.state.timerInput) {
            timerBGsrc = timepiece_setup;
        }
        const setButtonStyle = {
            backgroundImage: `url(${this.state.timerInput ? setButton_active : setButton})`,
            backgroundPosition: 'center',
            backgroundRepeat  : 'no-repeat',
        };
        const resetButtonStyle = {
            backgroundImage: `url(${this.state.timerInput ? resetButton_disabled : resetButton})`,
            backgroundPosition: 'center',
            backgroundRepeat  : 'no-repeat',
        };
        const cancelButtonStyle = {
            backgroundImage: `url(${this.state.timerInput ? resetButton_disabled : resetButton})`,
            backgroundPosition: 'center',
            backgroundRepeat  : 'no-repeat',
        };
        let timerStyles: string = timerPaused ? "timerTextcontent timerTextcontent_paused" : "timerTextcontent";
        const setupValue: string = this.formatTimerDisplayFromMilliseconds(this.state.setupTime);

        return <div className="timepieceContainer">
            <div className="facecontainer" onClick={this.state.timerInput ? (event:any) => { console.log("timer input prevented play/pause toggling") } : this.toggleticking}>
                <img src={base} className="base"/>
                <img src={degrees} className="degrees"/>
                <img src={timerBGsrc} className="face"/>
                <div className="timerTextContainer">
                    {this.state.timerInput ? 
                        <form onSubmit={this.timerValueSubmit}>
                            <input className={"timerinput"} type="text" pattern="[0-9:]*" value={setupValue} onChange={this.changeTimerValue}/>
                        </form>
                        :
                        <div className={timerStyles}>{this.state.time}</div>
                    }
                </div>
                {timerPaused ? <img src={paused} className="timerpausedGraphics"/> : null}
                {this.state.timerInput ? 
                    <button className={"cancelbutton"} onClick={this.cancelSetupHandler}/> 
                    : 
                    null
                }
            </div>
            <div className="timerbuttons">
                <button style={resetButtonStyle} className={"timerbutton resetbutton"} onClick={this.resetButtonHandler}/>
                <button style={setButtonStyle} className={"timerbutton setbutton"} onClick={this.setButtonHandler}/>
            </div>
        </div>;
    }

    private changeTimerValue = (event: any) => {
        const newTime: {minutes: number, seconds: number} = this.formatTimerInput(event.target.value);
        const newValue: number = this.getCurrentTimerValueInMilliseconds(newTime.minutes, newTime.seconds);
        // this.props.appState.setTimerValue = newValue;
        // this.props.appState.currentTimerValue = newValue;

        this.setState({
            // minutes: newTime.minutes,
            // seconds: newTime.seconds,
            setupTime: newValue,
            // time: this.formatTimerDisplayFromMilliseconds(newValue),
        });
    }

    private timerValueSubmit = (event: any) => {
        event.preventDefault();
        const value0: string = event.target[0].value;
        const newTime: {minutes: number, seconds: number} = this.formatTimerInput(value0);
        this.confirmTimerValueSubmit(newTime.minutes, newTime.seconds);
    }
    private setButtonHandler = (event: any) => {
        if (this.state.timerInput) {
            this.confirmTimerValueSubmit(-1, -1, this.state.setupTime);
        } else {
            this.setState({ticking: false, timerInput: true});
            this.props.appState.eventsblocked = true;
        }
    }

    private confirmTimerValueSubmit(confirmMinutes: number, confirmSeconds:number, value?: number): void {
        if (value) {
            confirmMinutes = this.getWholeMinutes(value);
            confirmSeconds = this.getWholeSeconds(value);
        }
        if (confirmSeconds > 59) {
            confirmMinutes++;
            confirmSeconds = 0;
        }
        if (confirmMinutes > 9) {
            confirmMinutes = 9;
        }

        const newValue: number = this.getCurrentTimerValueInMilliseconds(confirmMinutes, confirmSeconds);
        this.props.appState.setTimerValue = newValue;
        this.props.appState.currentTimerValue = newValue;

        this.setState({
            // minutes: confirmMinutes,
            // seconds: confirmSeconds,
            ticking: false, 
            setupTime: newValue,
            time: this.formatTimerDisplayFromMilliseconds(newValue), 
            timerInput: false,
        });
        this.props.appState.eventsblocked = false;
    }
    private resetButtonHandler = (event: any) => {
        if (this.state.timerInput) {
            this.props.appState.currentTimerValue = this.props.appState.setTimerValue;
            this.setState({ticking: false, time: this.formatTimerDisplayFromMilliseconds(this.props.appState.setTimerValue)})
        }
    }
    private cancelSetupHandler = (event: any) => {
        if (this.state.timerInput) {
            this.setState({
                ticking: false, 
                timerInput: false,
                setupTime: this.props.appState.setTimerValue,
            });
            this.props.appState.eventsblocked = false;
        }
    }
    private toggleticking = (event: any) => {
        if (!this.props.appState.eventsblocked) {
            if (this.state.ticking) {
                this.pause();
            } else {
                this.play();
            }
        }
    }


    private pause = () => {
        this.setState({ticking: false});
    }
    private play = () => {
        this.setState({ticking: true});
    }
    private setProgress = () => {
        if (this.state.ticking && !this.props.pauseOverride) {
            if (this.props.appState.currentTimerValue > 0) {
                let newValue: number = this.props.appState.currentTimerValue - secondInterval;
                if (newValue < 0) {
                    newValue = 0;
                }
                const newTime: string = this.formatTimerDisplayFromMilliseconds(newValue);
                this.props.appState.currentTimerValue = newValue;
                this.setState({
                    time: newTime,
                })
            } else {
                this.timerDone();
            }
        }
    }
    private timerDone(): void {
        console.log(" BLING ! ");
        this.pause();
    }
    




    private getWholeMinutes(value: number): number {
        return Math.floor(value / minuteInterval);
    }
    private getWholeSeconds(value: number): number {
        const wholeminutes: number = this.getWholeMinutes(value);
        const spareseconds: number = Math.floor((value - wholeminutes*minuteInterval) / secondInterval);
        return spareseconds;
    }
    private getCurrentTimerValueInMilliseconds(overrideMinutes: number = -1, overrideSeconds: number = -1): number {
        let valueInMilliseconds: number = 0;
        if (overrideMinutes !== -1) {
            valueInMilliseconds += overrideMinutes * minuteInterval;
        /*} else if (this.state.minutes >= 0) {
            valueInMilliseconds += this.state.minutes * minuteInterval;*/
        }
        if (overrideSeconds !== -1) {
            valueInMilliseconds += overrideSeconds * secondInterval;
        /*} else if (this.state.seconds >= 0) {
            valueInMilliseconds += this.state.seconds * secondInterval;*/
        }
        return valueInMilliseconds;
    }
    private formatTimerDisplayFromMilliseconds(value: number): string {
        const wholeminutes: number = this.getWholeMinutes(value);
        const spareseconds: number = this.getWholeSeconds(value);
        const secondsString: string = spareseconds.toString();

        const newTime: string = wholeminutes.toString() + ":" + (secondsString.length > 1 ? secondsString : "0" + secondsString);
        return newTime;
    }
    private formatTimerInput(display: string): {minutes: number, seconds: number} {
        const displaysections: string[] = display.split(":");
        const timeString: string = displaysections.join("");

        let minutesString: string = "0";
        let secondsString: string = "00";
        if (timeString.length > 2) {
            secondsString = timeString.substr(timeString.length - 2);
            minutesString = timeString.substr(0, timeString.length - 2);
        } else {
            secondsString = timeString;
        }
        if (minutesString.length > 1) {
            minutesString = minutesString.substr(minutesString.length - 1);
        }

        const newMinutes: number = parseInt(minutesString, 10);
        const newSeconds: number = parseInt(secondsString, 10);

        return {minutes: newMinutes, seconds: newSeconds};
    }
}
export default TimePiece;
