import * as React from 'react';
import '../css/Reports.css';

import vsBitmap from '../img/reportList/propcircle_vs.png';
import inputField from '../img/reportList/teamtitle_input.png';
import bg from '../img/reportList/teamtitles.png';

interface ITeamTitleInput {
    title1Default: string;
    title2Default: string;
    activityOverride?: boolean;
    titleChangeHandler: ({}) => void;
}
interface IReportListState {
    title1: string;
    title1active: boolean;
    title2: string;
    title2active: boolean;
}


class TeamTitleInput extends React.Component<ITeamTitleInput, IReportListState> {
    private bgStyle = {
        backgroundImage: `url(${bg})`,
        backgroundPosition: 'center',
        backgroundRepeat  : 'no-repeat'
    };
    private inputStyle = {
        backgroundImage: `url(${inputField})`,
        backgroundPosition: 'center',
        backgroundRepeat  : 'no-repeat',
        height: "52px",
    };
    constructor(props: any) {
        super(props);
        this.state = {
            title1: props.title1Default,
            title1active: false,
            title2: props.title2Default,
            title2active: false,
        }
    };


    public render() {
        const activeStyles:string = "teamTitle newTeamTitle reportRowSlot";
        const inactiveStyles:string = "teamTitle reportRowSlot";
        const input1Active: boolean = this.props.activityOverride ? this.props.activityOverride : this.state.title1active;
        const input2Active: boolean = this.props.activityOverride ? this.props.activityOverride : this.state.title2active;
        return <div style={this.bgStyle} className={"reportRow"}>
            <form onSubmit={this.addTeamName}>
                <input style={input1Active ? this.inputStyle : undefined} className={input1Active ? activeStyles : inactiveStyles} value={this.state.title1} onChange={this.handleTeamName1Change} onFocus={this.onTitleFocusIn("title1")} onBlur={this.onTitleFocusOut("title1")}/>
            </form>
            <div className={"vs"}>
                <img src={vsBitmap}/>
            </div>/>    
            <form onSubmit={this.addTeamName}>
                <input style={input2Active ? this.inputStyle : undefined} className={input2Active ? activeStyles : inactiveStyles} value={this.state.title2} onChange={this.handleTeamName2Change} onFocus={this.onTitleFocusIn("title2")} onBlur={this.onTitleFocusOut("title2")}/>
            </form>
        </div>;
    };
    private onTitleFocusIn = (field: string) => {
        if (field === "title1") {
            return (event: any) => {
                this.setState({title1active: true});
            };
        } else {
            return (event: any) => {
                this.setState({title2active: true});
            };
        }
    }
    private onTitleFocusOut = (field: string) => {
        if (field === "title1") {
            return (event: any) => {
                this.setState({title1active: false});
            };
        } else {
            return (event: any) => {
                this.setState({title2active: false});
            };
        }
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





