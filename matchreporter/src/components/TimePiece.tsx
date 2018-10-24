import * as React from 'react';
import '../css/Timepiece.css';

import base from '../img/timepiece/base.png';
import basecenter from '../img/timepiece/baseCenter.png';
import degrees from '../img/timepiece/degrees.png';

import progresshalf_1 from '../img/timepiece/progresshalf1.png';
import progresshalf_2 from '../img/timepiece/progresshalf2.png';

import resetButton from '../img/timepiece/resetbutton.png';
import setButton from '../img/timepiece/setbutton.png';

import casualtyButton from '../img/buttons/CASUALTY_active.png';
import completionButton from '../img/buttons/COMPLETION_active.png';
import goalButton from '../img/buttons/GOAL_active.png';
import injuryButton from '../img/buttons/INJURY_active.png';
import interceptButton from '../img/buttons/INTERCEPT_active.png';

const secondInterval: number = 1000;
const minuteInterval: number = 60000;

interface ItimepieceState {
    minutes: number,
    seconds: number,
    setValue: number;
    eventsblocked: boolean;
    ticking: boolean;
    time: string;
    timer: NodeJS.Timer;
    timerInput: boolean;
    timerValue: number;
}


class TimePiece extends React.Component<{ticking: boolean, defautlTimerValue?: number}, ItimepieceState> {

    constructor (props:any) {
        super(props);
        const newlySetValue: number = props.defautlTimerValue ? props.defautlTimerValue : 0;
        this.state = {
            eventsblocked: false,
            minutes: this.getWholeMinutes(newlySetValue),
            seconds: this.getWholeSeconds(newlySetValue),
            setValue: newlySetValue,
            ticking: props.ticking,
            time: this.formatTimerDisplayFromMilliseconds(newlySetValue),
            timer: setInterval(this.setProgress, secondInterval),
            timerInput: false,
            timerValue: newlySetValue,
        }
    }
    public componentDidMount(): void {
        console.log(" minutes: " + this.state.minutes);
        console.log(" seconds: " + this.state.seconds);
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
                <div className="timerpaused">{this.state.ticking ? "..." : "PAUSED"}</div>
            </div>
            <div className="timerbuttons">
                <button className={"timerbutton resetbutton"}>
                    <img src={resetButton} onClick={this.resetButtonHandler}/>
                </button>
                <button className={"timerbutton setbutton"} onClick={this.setButtonHandler}>
                    <img src={setButton}/>
                </button>
            </div>
            <div className="eventbuttons">
                <button className={"eventbutton"}>
                    <img src={goalButton}/>
                </button>
                <button className={"eventbutton"}>
                    <img src={completionButton}/>
                </button>
                <button className={"eventbutton"}>
                    <img src={injuryButton}/>
                </button>
                <button className={"eventbutton"}>
                    <img src={casualtyButton}/>
                </button>
                <button className={"eventbutton"}>
                    <img src={interceptButton}/>
                </button>
            </div>
        </div>;
    }
    
    private changeTimerValue = (event: any) => {
        console.log("changeTimerValue ", event.target.value);
        const newTime: {minutes: number, seconds: number} = this.formatTimerInput(event.target.value);
        console.log("timerContent " + newTime);
        const newValue: number = this.getCurrentTimerValueInMilliseconds(newTime.minutes, newTime.seconds);

        this.setState({
            minutes: newTime.minutes,
            seconds: newTime.seconds,
            setValue: newValue, 
            time: (newTime.minutes + ":" + (newTime.seconds === 0 ? "00" : newTime.seconds)),
            timerValue: newValue, 
        });
    }

    private timerValueSubmit = (event: any) => {
        event.preventDefault();
        const value0: string = event.target[0].value;
        console.log("timer Values on Submit ", value0);
        const newTime: {minutes: number, seconds: number} = this.formatTimerInput(value0);
        this.confirmTimerValueSubmit(newTime.minutes, newTime.seconds);
    }
    private setButtonHandler = (event: any) => {
        if (this.state.timerInput) {
            this.confirmTimerValueSubmit(this.state.minutes, this.state.seconds);
        } else {
            this.setState({ticking: false, timerInput: true, eventsblocked: true});
        }
    }

    private confirmTimerValueSubmit(confirmMinutes: number, confirmSeconds:number): void {
        console.log("confirmTimerValueSubmit " + confirmMinutes + ", " + confirmSeconds);

        if (confirmSeconds > 59) {
            confirmMinutes++;
            confirmSeconds = 0;
        }
        if (confirmMinutes > 9) {
            confirmMinutes = 9;
        }
        console.log("modified " + confirmMinutes + ", " + confirmSeconds);

        const newValue: number = this.getCurrentTimerValueInMilliseconds(confirmMinutes, confirmSeconds);
        console.log("newValue " + newValue);

        this.setState({
            eventsblocked: false,
            minutes: confirmMinutes,
            seconds: confirmSeconds,
            setValue: newValue, 
            time: (confirmMinutes + ":" + (confirmSeconds === 0 ? "00" : confirmSeconds)), 
            timerInput: false,
            timerValue: newValue,
        });
    }
    private resetButtonHandler = (event: any) => {
        if (this.state.timerInput) {
            this.confirmTimerValueSubmit(this.state.minutes, this.state.seconds);
        } else {
            this.setState({ticking: false, timerValue: this.state.setValue, time: this.formatTimerDisplayFromMilliseconds(this.state.setValue)})
        }
    }
    private toggleticking = (event: any) => {
        if (!this.state.eventsblocked) {
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
        if (this.state.ticking) {
            if (this.state.timerValue > 0) {
                let newValue: number = this.state.timerValue - secondInterval;
                if (newValue < 0) {
                    newValue = 0;
                }
                const newTime: string = this.formatTimerDisplayFromMilliseconds(newValue);
                this.setState({
                    time: newTime,
                    timerValue: newValue,
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
        } else if (this.state.minutes >= 0) {
            valueInMilliseconds += this.state.minutes * minuteInterval;
        }
        if (overrideSeconds !== -1) {
            valueInMilliseconds += overrideSeconds * secondInterval;
        } else if (this.state.seconds >= 0) {
            valueInMilliseconds += this.state.seconds * secondInterval;
        }
        return valueInMilliseconds;
    }
    private formatTimerDisplayFromMilliseconds(value: number): string {
        const wholeminutes: number = this.getWholeMinutes(value);
        const spareseconds: number = this.getWholeSeconds(value);
        const newTime: string = wholeminutes.toString() + ":" + (spareseconds > 0 ? spareseconds.toString() : "00");
        return newTime;
    }
    private formatTimerInput(display: string): {minutes: number, seconds: number} {
        const displaysections: string[] = display.split(":");
        const timeString: string = displaysections.join("");
        console.log("raw timeString " + timeString)

        let minutesString: string = "0";
        let secondsString: string = "00";
        if (timeString.length > 2) {
            secondsString = timeString.substr(timeString.length - 2);
            minutesString = timeString.substr(0, timeString.length - 2);
            console.log("modified minutes [" + minutesString + "]")
        } else {
            secondsString = timeString;
        }
        console.log("modified seconds [" + secondsString + "]");
        if (minutesString.length > 1) {
            minutesString = minutesString.substr(minutesString.length - 1);
        }
        console.log("trimmed minutes [" + minutesString + "]");

        const newMinutes: number = parseInt(minutesString, 10);
        const newSeconds: number = parseInt(secondsString, 10);

        return {minutes: newMinutes, seconds: newSeconds};
    }
}
export default TimePiece;
