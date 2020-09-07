import * as React from 'react';
import '../css/Prematch.css';
import { Kvalue } from "../types/Kvalue";

import gateBG from '../img/prematch/gates.png';
import gateBG_input from '../img/prematch/gates_input.png';
import fameEven from '../img/prematch/fameEven.png';
import fameBG1 from '../img/prematch/fame1.png';
import fameBG2 from '../img/prematch/fame2.png';
import StringFormatter from '../utils/StringFormatter';

interface IGatesInput {
    gateValue1: number;
    gateValue2: number;
    activityOverride?: boolean;
    gatesChangeHandler: ({}) => void;
    onFocusIn?: (event: any) => void,
    onFocusOut?: (event: any) => void,
}
interface IGatesState {
    inputActive: boolean;
    gate1: string;
    gate2: string;
}


class GatesInput extends React.Component<IGatesInput, IGatesState> {

    constructor(props: any) {
        super(props);
        this.state = {
            inputActive: false,
            gate1: StringFormatter.formatAsKvalue(props.gateValue1),
            gate2: StringFormatter.formatAsKvalue(props.gateValue2),
        }
    };


    public render() {
        const inputActive: boolean = this.props.activityOverride ? this.props.activityOverride : this.state.inputActive;

        let gateBGStyles = this.getBackgroundFor(inputActive ? gateBG_input : gateBG);
        
        let fameBGStyles = this.getBackgroundFor(fameEven);
        let fameContentStyles = "fameEven";

        const rawFame: number = this.fame;
        let fame: string = rawFame === 0 ? "-" : "+" + Math.abs(rawFame).toString();
        if (rawFame < 0) {
            fameBGStyles = this.getBackgroundFor(fameBG1);
            fameContentStyles = "fameHome";
        } else if (rawFame > 0) {
            fameBGStyles = this.getBackgroundFor(fameBG2);
            fameContentStyles = "fameAway";
        }

        return <div>
            <div style={gateBGStyles} className="gatesContainer">
                <form onSubmit={this.addGateValue}>
                    <input className={inputActive ? "gateValue gateContentHome value_input" : "gateValue gateContentHome"} value={this.state.gate1} onChange={this.handleGateValue1Change} onFocus={this.onFormFocusIn} onBlur={this.onFormFocusOut}/>
                </form>
                <form onSubmit={this.addGateValue}>
                    <input className={inputActive ? "gateValue gateContentAway value_input" : "gateValue gateContentAway"} value={this.state.gate2} onChange={this.handleGateValue2Change} onFocus={this.onFormFocusIn} onBlur={this.onFormFocusOut}/>
                </form>
            </div>
            <div style={fameBGStyles} className={"fameContainer"}>
                <div className={fameContentStyles}>{fame}</div>
            </div>
        </div>;
    };

    private get fame(): number {
        let gateDifference: number = 0;
        if (this.props.gateValue1 > 0 && this.props.gateValue2 > 0) {
            if (this.props.gateValue2 >= this.props.gateValue1 * 2) {
                gateDifference = 2;
            } else if (this.props.gateValue2 > this.props.gateValue1) {
                gateDifference = 1;
            } else if (this.props.gateValue1 >= this.props.gateValue2 * 2) {
                gateDifference = -2;
            } else if (this.props.gateValue1 > this.props.gateValue2) {
                gateDifference = -1;
            }
        }
        return gateDifference;
    }



    private getBackgroundFor = (img: any): any => {
        return {
            backgroundImage: `url(${img})`,
            backgroundPosition: 'left',
            backgroundRepeat  : 'no-repeat',
        }
    }
    private onFormFocusIn = (event: any) => {
        if (this.props.onFocusIn) {
            this.props.onFocusIn(event)
        }
        this.setState({inputActive: true});
    }
    private onFormFocusOut = (event: any) => {
        if (this.props.onFocusOut) {
            this.props.onFocusOut(event)
        }
        this.setState({inputActive: false});
    }
    private addGateValue = (event: any) => {
        event.preventDefault();
        this.props.gatesChangeHandler({value1:this.state.gate1, value2:this.state.gate2});
    }

   private handleGateValue1Change = (event: any) => {
        this.props.gatesChangeHandler({value1:event.target.value, value2:this.state.gate2});
        this.setState({ gate1: StringFormatter.formatAsKvalue(event.target.value) });
    }
    private handleGateValue2Change = (event: any) => {
        this.props.gatesChangeHandler({value1:this.state.gate1, value2:event.target.value});

        this.setState({ gate2: StringFormatter.formatAsKvalue(event.target.value) });
    }
}
export default GatesInput;





