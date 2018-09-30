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
interface IHomeScreenState {
    chosenType: string;
}
@observer
class Home extends React.Component<IAppProps, IHomeScreenState> {
    constructor(props: any) {
        super(props);
        this.state = {
            chosenType: ""
        }
        console.log('constructor');
    }

    public componentWillMount() {
        this.props.appState.screen = Screens.Home;
    }
    public render() {

        console.log("this.state.chosenType : " + this.state.chosenType);
        return <div className="App" style={bgStyle}>
            <Navigator appState={this.props.appState}/>
            <Screentitle src={title}/>
            <div className="mainChooser">
                <LineThrough colour="black" thickness="3px" parentHeight="89px"/>
                <CircleButton89 chosen={this.state.chosenType === "new"} arrow={true} label={"NEW MATCH"} toggleReportType={this.toggleReportType("new")}/>
                <CircleButton89 chosen={this.state.chosenType === "load"} arrow={true} label={"LOAD MATCH"} toggleReportType={this.toggleReportType("load")}/>
            </div>
            <ReportsList appState={this.props.appState} details={this.state.chosenType}/>
        </div>;
    };

    private toggleReportType = (type: string) => {
        if (type === "new") {
            return () => {
                this.setState({chosenType: "new"})
            }
        } else {
            return () => {
                this.setState({chosenType: "load"})
            }
        }
    }
}
export default Home;