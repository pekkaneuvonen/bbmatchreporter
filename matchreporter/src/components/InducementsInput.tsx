import * as React from 'react';
import '../css/Prematch.css';
import { Team } from "../model/Team";

import valuesBG from '../img/prematch/teamTVs.png';
import valuesBG_input from '../img/prematch/teamTVs_input.png';

interface IInducementsInput {
    inducementsValue: string;
    team: Team;
    activityOverride?: boolean;
    inducementsDescriptions: string;
    descriptionsChangeHandler: ({}) => void;
}
interface IInducementsState {
    inputActive: boolean;
    inducementsDescriptions: string;
}


class InducementsInput extends React.Component<IInducementsInput, IInducementsState> {
    private bgStyle = {
        backgroundImage: `url(${valuesBG})`,
        backgroundPosition: 'left',
        backgroundRepeat  : 'no-repeat',
    };
    private inputStyle = {
        backgroundImage: `url(${valuesBG_input})`,
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
        const valueStyles:string  = inputActive ? ["teamValue", "teamValue_input"].join(" ") : "teamValue";

        return <div style={inputActive ? this.inputStyle : this.bgStyle} className={"teamValues"}>
            <div className="valueContainer">
                <form onSubmit={this.addTeamValue}>
                    <input className={valueStyles} value={this.state.value1} onChange={this.handleTeamValue1Change} onFocus={this.onFormFocusIn} onBlur={this.onFormFocusOut}/>
                </form>
                <form onSubmit={this.addTeamValue}>
                    <input className={valueStyles} value={this.state.value2} onChange={this.handleTeamValue2Change} onFocus={this.onFormFocusIn} onBlur={this.onFormFocusOut}/>
                </form>
            </div>
        </div>;
    };
    private onFormFocusIn = () => {
        this.setState({inputActive: true});
    }
    private onFormFocusOut = () => {
        this.setState({inputActive: false});
    }
    private addTeamValue = (event: any) => {
        event.preventDefault();
        this.props.valueChangeHandler({value1:this.state.value1, value2:this.state.value2});
    }
    private handleTeamValue1Change = (event: any) => {
        this.props.valueChangeHandler({value1:event.target.value, value2:this.state.value2});

        this.setState({ value1: event.target.value });
    }
    private handleTeamValue2Change = (event: any) => {
        this.props.valueChangeHandler({value1:this.state.value1, value2:event.target.value});

        this.setState({ value2: event.target.value });
    }
}
export default InducementsInput;





