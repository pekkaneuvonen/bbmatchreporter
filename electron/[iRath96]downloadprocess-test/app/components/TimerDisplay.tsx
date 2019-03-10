import * as React from 'react';

let styles = require('./Home.scss');

interface ITimerProps {
    ticking: boolean,
    storedTimerValue?: number,
    reseted?: boolean,
    timeService: (elapsedTime: string) => void,
}
interface ITimerState {
    time: string;
    timerstartStamp: number,
    currentTimerValue: number,
    storedTimerValue: number,
    timer: any;
}
const secondInterval: number = 1000;
const centsecondInterval: number = 10;
const minuteInterval: number = 60000;
const incrementVal: number = 10;


export default class TimerDisplay extends React.Component <ITimerProps, ITimerState> {
    public constructor(props: any) {
        super(props);
        this.state = {
          time: "0:00:00",
          timer: setInterval(this.setProgress, incrementVal),
          timerstartStamp: 0,
          currentTimerValue: 0,
          storedTimerValue: this.props.storedTimerValue ? this.props.storedTimerValue : 0,
        }
    }
    public componentDidUpdate(prevProps: any, prevState: any): void {
        if (!prevProps.ticking && this.props.ticking) {
            this.setState({timerstartStamp: new Date().getTime()})
        } else if (!this.props.ticking) {
            if (!prevProps.reseted && this.props.reseted) {
                this.setState({storedTimerValue: 0, currentTimerValue: 0, time: "0:00:00"})
            }
        }
    }
    render() {
        return (
            <div className={styles.timeDisplay}>{this.state.time}</div>
        )
    }

    private setProgress = () => {
        if (this.props.ticking) {
            const newValue: number = this.currentValue;
            const newTime: string = this.formatTimerDisplayFromMilliseconds(newValue);
            this.props.timeService(newTime);
            this.setState({
                currentTimerValue: newValue,
                time: newTime,
            })
        }
    }
    private get currentValue(): number {
        const now = new Date();
        const addition: number = (now.getTime() - this.state.timerstartStamp);
        return this.state.storedTimerValue + addition;   
    }
    /*
    private get currentTime(): string {
        return this.formatTimerDisplayFromMilliseconds(this.currentValue);    
    }
    */
    private formatTimerDisplayFromMilliseconds(value: number): string {
        const minutes: number = this.getWholeMinutes(value);
        const seconds: number = this.getWholeSeconds(value % minuteInterval);
        const centSeconds: number = this.getCentSeconds(value % secondInterval);
        const newTime: string = minutes.toString() + ":" + (seconds > 9 ? seconds.toString() : "0" + seconds.toString()) + ":" + (centSeconds > 9 ? centSeconds.toString() : "0" + centSeconds.toString());
        return newTime;
    }
    private getWholeMinutes(value: number): number {
        return Math.floor(value / minuteInterval);
    }
    private getWholeSeconds(value: number): number {
        return Math.floor(value / secondInterval);
    }
    private getCentSeconds(value: number): number {
        return Math.floor(value / centsecondInterval);
    }
}