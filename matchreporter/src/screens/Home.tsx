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

import '../css/Home.css';

import bgHome from '../img/backgrounds/GRASS_9AM.jpg';
import decolines from '../img/load/decolines1.png';
import newButton from '../img/load/newrepButton.png';
import title from '../img/load/title1.png';
import history from "./history";


const bgStyle = {
  backgroundImage: `url(${bgHome})`
};

@observer
class Home extends React.Component<IAppProps, {showDeleteAlert: boolean, showTitleHeader: boolean}> {
    // private scrollContainer: React.RefObject<HTMLDivElement>;
    private topScrollTreshold: number = 145;
    constructor(props: any) {
        super(props);
        this.state = {
            showDeleteAlert: false,
            showTitleHeader: false,
        }
        // this.scrollContainer = React.createRef();
        this.buildReportList();
    }
    public componentWillMount() {
        this.props.appState.screen = Screens.Home;
        this.resetReport();
    }

    public render() {
        return <div className="home" style={bgStyle}>
            <div className="content" onScroll={this.scrollContainerHandler}>
                <Screentitle src={title}/>
                <div className="decorativeLines">
                    <img className="linesImage" src={decolines}/>
                </div>
                <div className="version">version 0.40</div>
                <div className="newRepcontainer">
                    <NewReportButton source={newButton} onClickHandler={this.createNewReport}/>
                </div>

                <ReportsList appState={this.props.appState} active={!this.state.showDeleteAlert} openReport={this.openReport} deleteReport={this.deleteReport}/>

            </div>

            {this.state.showDeleteAlert && this.props.appState.selectedReport ? 
            <div className="alertBlock">
                <div className="deleteAlert">
                    <div className="alertTitle">Delete report!</div>
                    <div className="alertMessage">
                        Are you sure you want to delete the match report
                        <div className="alertTeam">{`${this.props.appState.selectedReport.home.name} vs. ${this.props.appState.selectedReport.away.name}`}</div>
                        {` on ${this.formattedDate(this.props.appState.selectedReport.date)}?`}
                    </div>
                    <div className="alertButtons">
                        <div className="alertButton alertOkButton" onClick={this.confirmDelete(this.props.appState.selectedReport)}>OK</div>
                        <div className="alertButton alertCancelButton" onClick={this.cancelDelete}>CANCEL</div>
                    </div>
                </div>
            </div>
            : null
            }
        </div>;
    };
    private scrollContainerHandler = (event: any) => {
        /*
        console.log("scrollContainerHandler");
        console.log("event ", event);
        console.log("event.target ", event.target);
        console.log("scrollTop ", event.target.scrollTop);
        */

        if (event.target.scrollTop >= this.topScrollTreshold && this.state.showTitleHeader === false) {
            console.log("topScrollTreshold reached!");
            this.setState({showTitleHeader: true});
        } else if (event.target.scrollTop < this.topScrollTreshold &&this.state.showTitleHeader === true) {
            this.setState({showTitleHeader: false});
            console.log("topScrollTreshold unreached!");
        }
    }

    private formattedDate = (date: Date | undefined) => {
        return date ? date.toDateString() : "unknown date";
    }

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

    private openReport = (report: Report) => {
        console.log("opening report ", report);
        this.props.appState.report = report;
        this.props.appState.homeTeam = report.home;
        this.props.appState.awayTeam = report.away;
        this.props.appState.currentWeather = report.weather ? report.weather[0] : "null";
        history.push(Screens.Prematch);
    }
    private deleteReport = (deleted: Report) => {
        if (!this.props.appState.selectedReport
        || this.props.appState.selectedReport !== deleted) {
            this.props.appState.selectedReport = deleted;
        }
        this.setState({showDeleteAlert: true});
    }
    private cancelDelete = () => {
        console.log("canceling delete ");
        this.setState({showDeleteAlert: false});
    }
    private confirmDelete = (deleted: Report) => {
        return (event: any) => {
            console.log("deleting report ", deleted.id);
            Reports
            .deleteReport(deleted.id)
            .then((response: any) => {
                this.buildReportList();
                this.setState({showDeleteAlert: false});
            });
        }
    }

    private resetReport = () => {
        console.log("reset report?");
        this.props.appState.brandNewReport = false;
        const emptyReport: Report = this.getEmptyReport();
        this.props.appState.report = emptyReport;
        this.props.appState.homeTeam = emptyReport.home;
        this.props.appState.awayTeam = emptyReport.away;
        this.props.appState.currentWeather = "null";
        this.props.appState.currentTimerProgress = 0;
    }
    private getEmptyReport = () => {
        return new Report({title:"", id:"empty", home:new Team(""), away:new Team("")})
    }

    private buildReportList = () => {
        Reports
        .getReports()
        .then((reportsData: object[]) => {
            // console.log("complete reports data : ", reportsData);
            this.props.appState.reportsList = reportsData.map(data => {
                return new Report(data);
            })
            console.log("parsed reportList ", this.props.appState.reportsList)
        })
        .catch(error => {
            console.log(error);
        });

    }
}
export default Home;