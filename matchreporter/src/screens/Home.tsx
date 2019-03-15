import { observer } from "mobx-react";
import * as React from 'react';
import { IAppProps } from "../App";
import NewReportButton from '../components/buttons/NewReportButton';

import ReportsList from "../components/ReportsList";
import Screentitle from '../components/Screentitle';
import {Screens} from "../model/AppState";
import Report from '../model/Report';
import { Team } from "../model/Team";
import { Reports } from '../services/Reports';

import '../css/App.css';

import bgHome from '../img/backgrounds/GRASS_9AM.jpg';
import decolines from '../img/load/decolines1.png';
import newButton from '../img/load/newrepButton.png';
import title from '../img/load/title1.png';
import history from "./history";


const bgStyle = {
  backgroundImage: `url(${bgHome})`
};
@observer
class Home extends React.Component<IAppProps, {chooserPos: number}> {
    constructor(props: any) {
        super(props);
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
            <img className="decorativeLines" src={decolines}/>
            <div className="newRepcontainer">
                <NewReportButton source={newButton} onClickHandler={this.createNewReport}/>
            </div>

            <ReportsList appState={this.props.appState} openReport={this.openReport}/>
        </div>;
    };

    private createNewReport = () => {
        const defaultTitle1: string = "team 1";
        const defaultTitle2: string = "team 2";
        if (!this.props.appState.createdReportsCount) {
            this.props.appState.createdReportsCount = 0;
        }
        const reportTempId: string = "temp_created_report" + this.props.appState.createdReportsCount;
        this.props.appState.createdReportsCount++;

        const homeTeam: Team = new Team({name: defaultTitle1});
        const awayTeam: Team = new Team({name: defaultTitle2});
        const reportTemplate: Report = new Report({id:reportTempId, title:reportTempId, home:homeTeam, away:awayTeam});
        
        Reports
        .createReport(reportTemplate)
        .then((newReport: Report) => this.props.appState.createdReport(newReport))
        .then((newReport: Report) => {
            this.openReport(newReport);
            history.push(Screens.Prematch);
        });
    }
    /*
        .then((newReport: Report) => {
            this.props.appState.createdReport(newReport);
            return newReport;
        })
        Reports
        .createReport(reportTemplate)
        .then((newReport: Report) => {
            // this.receivedNewReport(newReport);
            this.props.appState.brandNewReport = true;
            this.props.appState.reportsList.push(newReport);
            this.openReport(newReport);
            history.push(Screens.Prematch);
        });
    private receivedNewReport = (report: Report) => {
        if (report) {
            this.props.appState.reportsList.push(report);
            this.openReport(report);
            history.push(Screens.Prematch);
        }
    }
    private updateReport = (tempId: string, report: Report) => {
        console.log("updating report ", tempId, report);
        const updatedReport = this.props.appState.reportsList.find(r => r.id === tempId);
        if (updatedReport) {
            updatedReport.date = report.date;
            updatedReport.id = report.id;
            this.openReport(updatedReport);
        }
    }
    */
    private openReport = (report: Report) => {
        if (this.props.appState.report === report) {
            console.log("opening report ", report);
            history.push(Screens.Prematch);
        } else {
            this.props.appState.report = report;
            this.props.appState.homeTeam = report.home;
            this.props.appState.awayTeam = report.away;
            this.props.appState.currentWeather = report.weather ? report.weather[0] : "null";
        }

        // this.props.appState.reportType = "load";
    }
/*
            <div id="chooser" ref={(chooser) => this.calcChooserHeight(chooser)}>

            </div>


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
    */

    /*
    private calcChooserHeight(chooser: any): void {
        const chooserPos: {x: number, y: number} = this.getPosition(chooser);
        if (chooser && chooserPos.y && (!this.state.chooserPos || this.state.chooserPos !== chooserPos.y)) {
            this.setState({
                chooserPos: chooserPos.y
            });
        }
        
    }
    */
   /*
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
    */
}
export default Home;