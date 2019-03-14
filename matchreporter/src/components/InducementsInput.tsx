import * as React from 'react';
import '../css/Prematch.css';
import { Team } from "../model/Team";

import inducementBG_unset from '../img/prematch/inducements_unset.png';
import inducementBG1 from '../img/prematch/inducements1.png';
import inducementBG2 from '../img/prematch/inducements2.png';
import inducementBG1_input from '../img/prematch/inducements1_input.png';
import inducementBG2_input from '../img/prematch/inducements2_input.png';

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
    private bgBase = {
        backgroundImage: `url(${inducementBG_unset})`,
        backgroundPosition: 'left',
        backgroundRepeat  : 'no-repeat',
    };
    private background1 = {
        backgroundImage: `url(${inducementBG1})`,
        backgroundPosition: 'center',
        backgroundRepeat  : 'no-repeat',
    };
    private background2 = {
        backgroundImage: `url(${inducementBG2})`,
        backgroundPosition: 'center',
        backgroundRepeat  : 'no-repeat',
    };
    private background1_input = {
        backgroundImage: `url(${inducementBG1_input})`,
        backgroundPosition: 'center',
        backgroundRepeat  : 'no-repeat',
    };
    private background2_input = {
        backgroundImage: `url(${inducementBG2_input})`,
        backgroundPosition: 'center',
        backgroundRepeat  : 'no-repeat',
    };

    constructor(props: any) {
        super(props);
        this.state = {
            inputActive: false,
            inducementsDescriptions: props.inducementsDescriptions,
        }
    };


    public render() {
        const inputActive: boolean = this.props.activityOverride ? this.props.activityOverride : this.state.inputActive;
        let bgStyles;
        if (this.props.side === "home") {
            bgStyles = inputActive ? this.background1_input : this.background1;
        } else if (this.props.side === "away") {
            bgStyles = inputActive ? this.background2_input : this.background2;
        }

        return <div style={this.bgBase} className={"inducementsContainer"}>
            <div style={bgStyles}>
            </div>
        </div>;
    };
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
    private addTeamValue = (event: any) => {
        event.preventDefault();
        this.props.descriptionsChangeHandler(this.state.inducementsDescriptions);
    }
    private handleInducementDescriptionChange = (event: any) => {
        this.props.descriptionsChangeHandler(event.target.value);
        this.setState(event.target.value);
    }
}
export default InducementsInput;





