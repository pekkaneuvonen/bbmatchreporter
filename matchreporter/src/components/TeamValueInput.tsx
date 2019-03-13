import * as React from 'react';
import '../css/Prematch.css';

import valuesBG from '../img/prematch/teamTVs.png';

interface ITeamValueInput {
    value1: string;
    value2: string;
    valueChangeHandler: ({}) => void;
}
interface ITVState {
    value1: string;
    value2: string;
}


class TeamValueInput extends React.Component<ITeamValueInput, ITVState> {
    private bgStyle = {
        backgroundImage: `url(${valuesBG})`,
        backgroundPosition: 'left',
        backgroundRepeat  : 'no-repeat',
    };

    constructor(props: any) {
        super(props);
        this.state = {
            value1: props.value1,
            value2: props.value2,
        }
    };


    public render() {
        const tv1:string  = ["teamValue", "teamValue1"].join(" ");
        const tv2:string  = ["teamValue", "teamValue2"].join(" ");
        return <div style={this.bgStyle} className={"teamNames"}>
            <form onSubmit={this.addTeamValue}>
                <input className={tv1} value={this.state.value1} onChange={this.handleTeamValue1Change} />
            </form>
            <form onSubmit={this.addTeamValue}>
                <input className={tv2} value={this.state.value2} onChange={this.handleTeamValue2Change} />
            </form>
        </div>;
    };
    /*
    private onTitleFocusIn = (field: string) => {
        if (field === "title1") {
            return (event: any) => {
                this.setState({inputActive: true});
            };
        } else {
            return (event: any) => {
                this.setState({inputActive: true});
            };
        }
    }
    private onTitleFocusOut = (field: string) => {
        if (field === "title1") {
            return (event: any) => {
                this.setState({inputActive: false});
            };
        } else {
            return (event: any) => {
                this.setState({inputActive: false});
            };
        }
    }
    */
    private addTeamValue = (event: any) => {
        event.preventDefault();
        this.props.valueChangeHandler({title1:this.state.value1, title2:this.state.value2});
    }
    private handleTeamValue1Change = (event: any) => {
        this.props.valueChangeHandler({title1:event.target.value, title2:this.state.value2});

        this.setState({ value1: event.target.value });
    }
    private handleTeamValue2Change = (event: any) => {
        this.props.valueChangeHandler({title1:this.state.value1, title2:event.target.value});

        this.setState({ value2: event.target.value });
    }
}
export default TeamValueInput;





