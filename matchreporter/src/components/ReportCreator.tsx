import { observer } from "mobx-react";
import * as React from 'react';
import { IAppProps } from "../App";
import '../css/Reports.css';
// import Report from '../model/Report';
import bgActive from '../img/backgrounds/ActiveAreaBgBox.png';

@observer
class ReportCreator extends React.Component<IAppProps, {}> {
    private bgStyle = {
        backgroundImage: `url(${bgActive})`
    };
    public render() {
        return (
            <div className="reportCreator" style={this.bgStyle}/>
        )
    }
}
export default ReportCreator;