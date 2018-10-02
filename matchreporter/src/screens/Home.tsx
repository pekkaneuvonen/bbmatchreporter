import { observer } from "mobx-react";
import * as React from 'react';
import { IAppProps } from "../App";
import CircleButton89 from '../components/buttons/CircleButton89';
import LineThrough from '../components/LineThrough'
import Navigator from '../components/Navigator';
import ReportsList from "../components/ReportsList";
import Screentitle from '../components/Screentitle';
import {Screens} from "../model/AppState";

import '../css/App.css';
import bgHome from '../img/backgrounds/home.png';
import title from '../img/MATCHREPORTER.png';

const bgStyle = {
  backgroundImage: `url(${bgHome})`
};
@observer
class Home extends React.Component<IAppProps, {}> {

    public componentWillMount() {
        this.props.appState.screen = Screens.Home;
    }
    public render() {
        console.log("this.props.appState.reportType : ", this.props.appState.reportType);
        return <div className="App" style={bgStyle}>
            <Navigator appState={this.props.appState}/>
            <Screentitle src={title}/>
            <div className="mainChooser">
                <LineThrough colour="black" thickness="3px" parentHeight="89px"/>
                <div className="parallelChooserCircles">
                    <CircleButton89 chosen={this.props.appState.reportType === "new"} label={"NEW MATCH"} toggleReportType={this.toggleReportType("new")}/>
                    <CircleButton89 chosen={this.props.appState.reportType === "load"} label={"LOAD MATCH"} toggleReportType={this.toggleReportType("load")}/>
                </div>
            </div>
            <ReportsList appState={this.props.appState}/>
        </div>;
    };

    private toggleReportType = (type: string) => {
        if (type === "new") {
            return () => {
                this.props.appState.reportType = "new";
            }
        } else {
            return () => {
                this.props.appState.reportType = "load";
            }
        }
    }
}
export default Home;