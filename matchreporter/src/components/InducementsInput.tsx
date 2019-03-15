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
        
        
        console.log("inducementsValue : " + this.props.inducementsValue);
        console.log("inducementsDescriptions : " + this.props.inducementsDescriptions);
        console.log("side : " + this.props.side);

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
    /*

    <div className="inducements">
        <textarea 
            name="homeinducements"
            className="inducementsBox homeInducements"
            onChange={this.handleInducementChange("home")}
            value={this.props.appState.homeTeam.inducements}/>
        <textarea 
            name="awayinducements"
            className="inducementsBox awayInducements"
            onChange={this.handleInducementChange("away")}
            value={this.props.appState.awayTeam.inducements}/>
    </div>
    */
    /*
    <div className="valueContainer">
        <form onSubmit={this.addTeamValue}>
            <input className={valueStyles} value={this.state.value1} onChange={this.handleTeamValue1Change} onFocus={this.onFormFocusIn} onBlur={this.onFormFocusOut}/>
        </form>
        <form onSubmit={this.addTeamValue}>
            <input className={valueStyles} value={this.state.value2} onChange={this.handleTeamValue2Change} onFocus={this.onFormFocusIn} onBlur={this.onFormFocusOut}/>
        </form>
    </div>
    */
    private onFormFocusIn = () => {
        this.setState({inputActive: true});
    }
    private onFormFocusOut = () => {
        this.setState({inputActive: false});
    }
    /*
    private addDescriptionValue = (event: any) => {
        event.preventDefault();
        this.props.descriptionsChangeHandler(this.state.inducementsDescriptions);
    }
    */
    private handleInducementDescriptionChange = (event: any) => {
        this.props.descriptionsChangeHandler(event.target.value);
        this.setState({inducementsDescriptions: event.target.value});
    }
}
export default InducementsInput;





