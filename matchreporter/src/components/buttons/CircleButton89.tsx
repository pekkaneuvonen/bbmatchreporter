import * as React from 'react';

import '../../css/App.css';
import activebg from '../../img/circles/propcircle_89_active.png';
import chosenbg from '../../img/circles/propcircle_89_visited.png';
import downarrow from '../../img/circles/propcircleTriangle.png';

// {chosen: boolean, arrow: boolean, label: string, toggleReportType: () => void}, {}
interface ICircleButtonProps {
    chosen: boolean;
    arrowOverride?: boolean;
    label: string;
    toggleReportType: () => void;
}

class CircleButton89 extends React.Component<ICircleButtonProps, {}> {
    
    public render() {
        const circleStyle = {
            backgroundImage: `url(${this.props.chosen ? chosenbg : activebg})`,
        };
        console.log("this.props.chosen : " + this.props.chosen);
        return <div className="circlebutton89">
            <button className="circlebutton89_button" style={circleStyle} onClick={this.props.toggleReportType}>{this.props.label}</button>
            {this.props.arrowOverride || this.props.chosen ? <img className="circlebutton89_arrow" src={downarrow}/> : null}
        </div>;
    };
    // <button onClick={toggleImportance}>{label}</button>
}
export default CircleButton89;