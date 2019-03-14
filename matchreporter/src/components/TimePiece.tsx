import * as React from 'react';
import '../css/Timepiece.css';

import base from '../img/timepiece/base.png';
import basecenter from '../img/timepiece/baseCenter.png';
import degrees from '../img/timepiece/degrees.png';

import progresshalf_1 from '../img/timepiece/progresshalf1.png';
import progresshalf_2 from '../img/timepiece/progresshalf2.png';

import { AppState } from '../model/AppState';
import resetButton from '../img/timepiece/resetbutton.png';
import setButton from '../img/timepiece/setbutton.png';

const secondInterval: number = 1000;
const minuteInterval: number = 60000;

interface ItimepieceState {
    // minutes: number,
    // seconds: number,
    ticking: boolean;
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
            time: this.formatTimerDisplayFromMilliseconds(newlySetValue),
            timer: setInterval(this.setProgress, secondInterval),
            timerInput: false,
        }
    }
    public componentWillUnmount(): void {
        clearInterval(this.state.timer);
    }
    public render() {
        return <div className="timepiece">
            <div className="facecontainer" onClick={this.toggleticking}>
                <img src={basecenter} className="center"/>
                <img src={degrees} className="degrees"/>
                <img src={progresshalf_1} className={"progresshalves"}/>
                <img src={progresshalf_2} className={"progresshalves"}/>
                <img src={base} className="base"/>
                {this.state.timerInput ? 
                    <form className={"timerinputcontainer"} onSubmit={this.timerValueSubmit}>
                        <input className={"timerinput"} type="text" pattern="[0-9:]*" value={this.state.time} onChange={this.changeTimerValue}/>
                    </form>
                    :
                    <div className={"timer"}>{this.state.time}</div>
                }
                <div className="timerpaused">{this.state.ticking && !this.props.pauseOverride ? "..." : "PAUSED"}</div>
            </div>
            <div className="timerbuttons">
                <button className={"timerbutton resetbutton"}>
                    <img src={resetButton} onClick={this.resetButtonHandler}/>
                </button>
                <button className={"timerbutton setbutton"} onClick={this.setButtonHandler}>
                    <img src={setButton}/>
                </button>
            </div>
        </div>;
    }
    
    private changeTimerValue = (event: any) => {
        const newTime: {minutes: number, seconds: number} = this.formatTimerInput(event.target.value);
        const newValue: number = this.getCurrentTimerValueInMilliseconds(newTime.minutes, newTime.seconds);
        this.props.appState.setTimerValue = newValue;
        this.props.appState.currentTimerValue = newValue;

        this.setState({
            // minutes: newTime.minutes,
            // seconds: newTime.seconds,
            time: (newTime.minutes + ":" + (newTime.seconds === 0 ? "00" : newTime.seconds)),
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
            this.confirmTimerValueSubmit(-1, -1, this.props.appState.currentTimerValue);
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
            time: (confirmMinutes + ":" + (confirmSeconds === 0 ? "00" : confirmSeconds)), 
            timerInput: false,
        });
        this.props.appState.eventsblocked = false;
    }
    private resetButtonHandler = (event: any) => {
        if (this.state.timerInput) {
            this.confirmTimerValueSubmit(-1, -1, this.props.appState.currentTimerValue);
        } else {
            this.props.appState.currentTimerValue = this.props.appState.setTimerValue;
            this.setState({ticking: false, time: this.formatTimerDisplayFromMilliseconds(this.props.appState.setTimerValue)})
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
