import * as React from 'react';

import '../../css/App.css';
import bg from '../../img/circles/propcircle_79.png';
import activebg from '../../img/circles/propcircle_79_active.png';
import downarrow from '../../img/circles/propcircleTriangle_white.png';
import { Kvalue } from '../../types/Kvalue';

// {chosen: boolean, arrow: boolean, label: string, toggleReportType: () => void}, {}
interface ICircleButtonProps {
    activityOverride?: boolean;
    arrowOverride?: boolean;
    value: Kvalue;
    valueChangeHandler: (value: number) => void;
}
interface IinputCircleState {
    inputActive: boolean;
}

class CircleInput89 extends React.Component<ICircleButtonProps, IinputCircleState> {
    constructor(props: any) {
        super(props);
        this.state = {
            inputActive: false,
        }
    };
    public render() {
        const circleStyle = {
            backgroundImage: `url(${this.props.activityOverride || this.state.inputActive ? activebg : bg})`,
            backgroundPosition: 'center',
            backgroundRepeat  : 'no-repeat',
        };
        return <div className="circlecontainer">
            <input style={circleStyle} className="circlecontainer79_input" value={this.props.value.asString} onChange={this.handleValueChange} onFocus={this.onFocusIn()} onBlur={this.onFocusOut()}/>
            {this.props.arrowOverride ? <img className="circlecontainer_arrow" src={downarrow}/> : null}
        </div>;
    };

    private onFocusIn = () => {
        return (event: any) => {
            this.setState({inputActive: true});
        };
    }
    private onFocusOut = () => {
        return (event: any) => {
            this.setState({inputActive: false});
        }
    }
    private handleValueChange = (event: any) => {
        const rawValue: string = event.target.value;
        const splitValue: string[] = rawValue.split("k");
        const numericValue: number = parseInt(splitValue.join(""), 10);
        this.props.valueChangeHandler(numericValue);
    }
}
export default CircleInput89;