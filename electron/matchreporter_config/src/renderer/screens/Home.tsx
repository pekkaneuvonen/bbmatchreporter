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
class Home extends React.Component<IAppProps, {chooserPos: number}> {
    constructor(props: any) {
        super(props);
        console.log("Home : ", this.props.appState.screen);

        this.state = {
            chooserPos: 0,
        };
    }
    public componentWillMount() {
        this.props.appState.screen = Screens.Home;
    }
    public render() {
        console.log("this.props.appState.reportType : ", this.props.appState.reportType);

        return <div className="App" style={bgStyle}>
            <Screentitle src={title}/>
            <div className="mainChooser">
                <LineThrough 
                    colour="black"
                    thickness="3px"
                    parentHeight="89px"/>
                <div className="parallelChooserCircles">
                    <CircleButton89 
                        chosen={this.props.appState.reportType === "new"} 
                        label={"NEW MATCH"} 
                        onClickHandler={this.toggleReportType("new")}/>
                    <CircleButton89 
                        chosen={this.props.appState.reportType === "load"} 
                        label={"LOAD MATCH"} 
                        onClickHandler={this.toggleReportType("load")}/>
                </div>
            </div>
            <div id="chooser" ref={(chooser) => this.calcChooserHeight(chooser)}>
            <ReportsList appState={this.props.appState} yPos={this.state.chooserPos}/>
            </div>
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
    private calcChooserHeight(chooser: any): void {
        const chooserPos: {x: number, y: number} = this.getPosition(chooser);
        if (chooser && chooserPos.y && (!this.state.chooserPos || this.state.chooserPos !== chooserPos.y)) {
            this.setState({
                chooserPos: chooserPos.y
            });
        }
        
    }
    private getPosition(element: any) {
        let xPosition = 0;
        let yPosition = 0;
        
        while (element) {
            if (element.getBoundingClientRect) {
                const boundingBox = element.getBoundingClientRect();
                xPosition += boundingBox.x;
                yPosition += boundingBox.y;
            } else {
                xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
                yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
            }
            element = element.offsetParent;
        }
        return { x: xPosition, y: yPosition };
    }

}
export default Home;