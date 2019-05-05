import * as React from 'react';
import '../css/Prematch.css';

import teamsBG from '../img/prematch/teamNames.png';
import teamsBG_input from '../img/prematch/teamNames_input.png';

interface ITeamTitleInput {
    title1Default: string;
    title2Default: string;
    activityOverride?: boolean;
    titleChangeHandler: ({}) => void;
    onFocusIn?: (event: any) => void,
    onFocusOut?: (event: any) => void,
}
interface IReportListState {
    inputActive: boolean;
    title1: string;
    title2: string;
}


class TeamTitleInput extends React.Component<ITeamTitleInput, IReportListState> {
    private bgStyle = {
        backgroundImage: `url(${teamsBG})`,
        backgroundPosition: 'center',
        backgroundRepeat  : 'no-repeat',
    };
    private inputStyle = {
        backgroundImage: `url(${teamsBG_input})`,
        backgroundPosition: 'center',
        backgroundRepeat  : 'no-repeat',
    };
    constructor(props: any) {
        super(props);
        this.state = {
            title1: props.title1Default,
            inputActive: false,
            title2: props.title2Default,
        }
    };


    public render() {
        const inputActive: boolean = this.props.activityOverride ? this.props.activityOverride : this.state.inputActive;
        const teamName1:string  = inputActive ? ["teamTitle", "teamTitle1", "value_input"].join(" ") : ["teamTitle", "teamTitle1"].join(" ");
        const teamName2:string  = inputActive ? ["teamTitle", "teamTitle2", "value_input"].join(" ") : ["teamTitle", "teamTitle2"].join(" ");
        return <div style={inputActive ? this.inputStyle : this.bgStyle} className={"teamNames"}>
            <form onSubmit={this.addTeamName}>
                <input className={teamName1} value={this.state.title1} onChange={this.handleTeamName1Change} onFocus={this.onTitleFocusIn("title1")} onBlur={this.onTitleFocusOut("title1")}/>
            </form>
            <form onSubmit={this.addTeamName}>
                <input className={teamName2} value={this.state.title2} onChange={this.handleTeamName2Change} onFocus={this.onTitleFocusIn("title2")} onBlur={this.onTitleFocusOut("title2")}/>
            </form>
        </div>;
    };
    private onTitleFocusIn = (field: string) => {
        return (event: any) => {
            if (this.props.onFocusIn) {
                this.props.onFocusIn(event);
            }
            this.setState({inputActive: true});
        };
    }
    private onTitleFocusOut = (field: string) => {
        return (event: any) => {
            if (this.props.onFocusOut) {
                this.props.onFocusOut(event);
            }
            this.setState({inputActive: false});
        };
    }
    private addTeamName = (event: any) => {
        event.preventDefault();
        this.props.titleChangeHandler({title1:this.state.title1, title2:this.state.title2});
    }
    private handleTeamName1Change = (event: any) => {
        this.props.titleChangeHandler({title1:event.target.value, title2:this.state.title2});

        this.setState({ title1: event.target.value });
    }
    private handleTeamName2Change = (event: any) => {
        this.props.titleChangeHandler({title1:this.state.title1, title2:event.target.value});

        this.setState({ title2: event.target.value });
    }
}
export default TeamTitleInput;





