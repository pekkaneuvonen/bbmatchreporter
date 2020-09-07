import * as React from 'react';
import '../css/Prematch.css';
import { Team } from "../model/Team";

import inducementValue_unset from '../img/prematch/inducementValueContainerBlank.png';
import inducementValue1 from '../img/prematch/inducementValueContainer1.png';
import inducementValue2 from '../img/prematch/inducementValueContainer2.png';

import inducementBG_unset from '../img/prematch/inducementDescription1Blank.png';
import inducementBG1 from '../img/prematch/inducementDescription1.png';
import inducementBG2 from '../img/prematch/inducementDescription2.png';
import inducementBG1_input from '../img/prematch/inducementDescription1_input.png';
import inducementBG2_input from '../img/prematch/inducementDescription2_input.png';

interface IInducementsInput {
    inducementsValue: string;
    side: string;
    activityOverride?: boolean;
    inducementsDescriptions: string;
    descriptionsChangeHandler: (description: string) => void;
    onFocusIn?: (event: any) => void,
    onFocusOut?: (event: any) => void,
}
interface IInducementsState {
    inputActive: boolean;
    inducementsDescriptions: string;
}


class InducementsInput extends React.Component<IInducementsInput, IInducementsState> {

    constructor(props: any) {
        super(props);
        this.state = {
            inputActive: false,
            inducementsDescriptions: props.inducementsDescriptions,
        }
    };


    public render() {
        const inputActive: boolean = this.props.activityOverride ? this.props.activityOverride : this.state.inputActive;

        let valueBGStyles = this.getBackgroundFor(inducementValue_unset);
        let valueContentStyles = "inducementsValueBlank";
        if (this.props.side === "home") {
            valueBGStyles = this.getBackgroundFor(inducementValue1);
            valueContentStyles = "inducementsValue1";
        } else if (this.props.side === "away") {
            valueBGStyles = this.getBackgroundFor(inducementValue2);
            valueContentStyles = "inducementsValue2";
        }

        let bgStyles = this.getBackgroundFor(inducementBG_unset);
        const descriptionStyles:string = inputActive ? "inducementsDescriptionInput value_input" : "inducementsDescriptionInput";
        if (this.props.side === "home") {
            bgStyles = this.getBackgroundFor(inputActive ? inducementBG1_input : inducementBG1);
        } else if (this.props.side === "away") {
            bgStyles = this.getBackgroundFor(inputActive ? inducementBG2_input : inducementBG2);
        }
        
        return <div>
            <div style={valueBGStyles} className="inducementsValueContainer">
                <div className={valueContentStyles}>{this.props.inducementsValue}</div>
            </div>
            <div style={bgStyles} className={"inducementsDescrContainer"}>
                <textarea name="inducementDescriptions"
                    className={descriptionStyles}
                    onChange={this.handleInducementDescriptionChange}
                    value={this.state.inducementsDescriptions} onFocus={this.onFormFocusIn} onBlur={this.onFormFocusOut}/>
            </div>
        </div>;
    };
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

    private handleInducementDescriptionChange = (event: any) => {
        this.props.descriptionsChangeHandler(event.target.value);
        this.setState({inducementsDescriptions: event.target.value});
    }
}
export default InducementsInput;





