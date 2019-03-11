import { observer } from "mobx-react";
import * as React from 'react';
// import { Link } from 'react-router-dom';
import '../css/Reports.css';
import { AppState,  } from "../model/AppState";
import Report from '../model/Report';
import { Reports } from '../services/Reports';
import StringFormatter from '../utils/StringFormatter';
// import TeamTitleInput from './TeamTitleInput';

// import bgActive from '../img/backgrounds/ActiveAreaBgBox.png';
// import readyBtn from '../img/buttons/ready.png';
import reportBox from '../img/load/report.png';
import reportBoxChosen from '../img/load/reportChosen.png';
// import teamsField from '../img/reportList/teamtitles.png';
// import activeTeamsField from '../img/reportList/teamtitles_active.png';
// import { Team } from "../model/Team";

// tslint:disable:no-console
interface IReportListState {
    inputTitle1: string;
    inputTitle2: string;
}

@observer
class ReportsList extends React.Component<{appState: AppState, openReport: (report: Report) => void}, IReportListState> {
    constructor(props: any) {
        super(props);

        this.state = {
            inputTitle1: "",
            inputTitle2: ""
        };
    }
    
    public componentWillMount() {
        /*
        Reports
            .getReport("0")
            .then(this.openReport)
            .catch(error => {
                console.log(error);
            });
        */
        Reports
            .getReports()
            .then(this.buildReportList)
            .catch(error => {
                console.log(error);
        });
    }

    public render() {
        /*
        let chooserHeight: number;
        if (this.props.appState.reportsList && this.props.appState.reportsList.length > 0) {
            chooserHeight = 500;
        } else {
            chooserHeight = window.innerHeight - this.props.yPos;
        }
        const bgStyle = {
            backgroundImage: `url(${bgActive})`,
            height: chooserHeight,
        };
        */
        return (
            <div id="container" className="reportChooser">
                {this.listContent()}
            </div>
        );
    }
    private listContent = () =>  {
        if (!this.props.appState.reportsList || this.props.appState.reportsList.length < 1) {
            return <div className="no_reportList">
                Create new report or load from archive. 
            </div>;
        } else {
            return <ul className="reportList">
                {this.props.appState.reportsList.map(
                    (report) => {
                        const teamBgStyle = {
                            backgroundImage: `url(${reportBox})`,
                            backgroundRepeat  : 'no-repeat',
                            color: "#242424",
                        };
                        const dateStyles = ["reportDateSlot", "controlRow", "enabledControls"]
                        const openStyles = ["reportOpenSlot", "controlRow"]
                        const deleteStyles = ["reportDeleteSlot", "controlRow"]

                        if (this.props.appState.report && report.id === this.props.appState.report.id) {
                            teamBgStyle.backgroundImage = `url(${reportBoxChosen})`;
                            teamBgStyle.color = "#F2F0EE";
                            openStyles.push("enabledControls");
                            deleteStyles.push("enabledControls");
                        }

                        return <div key={report.id} style={teamBgStyle} className="reportRow">
                            <div className="reportSlot">
                                <div className="reportControls">
                                    <div className={dateStyles.join(" ")}>
                                        {report.date ? StringFormatter.formatDate(report.date) : "unknown date"}
                                    </div>
                                    <div className={openStyles.join(" ")}onClick={this.reportClicked(report.id)} >
                                        open
                                    </div>
                                    <div className={deleteStyles.join(" ")} onClick={this.deleteClicked(report.id)}>
                                        delete
                                    </div>
                                </div>
                                <div className="reportTeams" 
                                    onClick={this.reportClicked(report.id)}>
                                    <div className="teamName">
                                        {report.home.name}
                                    </div>
                                    <div className="teamName">
                                        {report.away.name}
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                )}
            </ul>
        }
    }
    /*

                            return <Link key={report.id} 
                            to={Screens.Prematch} 
                            style={{textDecoration: "none"}}>
                            <div style={teamBgStyle} className="reportRow">
                                <div className="reportSlot">
                                    <div className="reportDate">
                                        {report.date ? StringFormatter.formatDate(report.date) : "unknown date"}
                                    </div>
                                    <div className="reportTeams" 
                                        onClick={this.reportClicked(report.id)}>
                                        <div className="teamName">
                                            {report.home.name}
                                        </div>
                                        <div className="teamName">
                                            {report.away.name}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>


                        
    private toggleReportDetails = (listType: string) => {
        console.log("listType " + listType);
        if (listType === "new") {
            const defaultTitle1: string = "team 1";
            const defaultTitle2: string = "team 2";

            return <div>
                <TeamTitleInput 
                    titleChangeHandler={this.handleTeamNameChange} 
                    title1Default={defaultTitle1} 
                    title2Default={defaultTitle2} 
                    activityOverride={true}/>
                <Link to={Screens.Prematch}>
                    <div onClick={this.createReport("go")}>
                        <img className={"bottomButton"} src={readyBtn}/>
                    </div>
                </Link>
            </div>
        } else if (listType === "load") {
            if (!this.props.appState.reportsList || this.props.appState.reportsList.length < 1) {
                return <div className="no_reportList">No reports in database.</div>
            } else {
                return <ul className="reportList">
                    {this.props.appState.reportsList.map(
                        (report) => {
                            const teamBgStyle = {
                                backgroundImage: `url(${(this.props.appState.report && report.id === this.props.appState.report.id) ? activeTeamsField : teamsField})`,
                                backgroundPosition: 'center',
                                backgroundRepeat  : 'no-repeat'
                            };
                            const titleStyles: string[] = ["teamTitle", "reportRowSlot"];
                            if (this.props.appState.report && report.id === this.props.appState.report.id) {
                                titleStyles.push("newTeamTitle");
                            }
                            return <Link key={report.id} 
                                to={Screens.Prematch} 
                                style={{textDecoration: "none"}}>
                                <div style={teamBgStyle} className="reportRow">
                                    <div className="reportDate">
                                        {StringFormatter.formatDate(report.date)}
                                    </div>
                                    <div className="teamsRow" 
                                        onClick={this.reportClicked(report.id)}>
                                        <div className={titleStyles.join(' ')}>
                                            {report.home.name}
                                        </div>
                                        <div className={titleStyles.join(' ')}>
                                            {report.away.name}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        }
                    )}
                </ul>
            }
        } else {
            return <div className="no_reportList">
                        Create new report or load from archive. 
                    </div>;
        }
    }
    */

    /*
    private updateReport = (tempId: string, report: Report) => {
        console.log("updating report ", tempId, report);
        const updatedReport = this.props.appState.reportsList.find(r => r.id === tempId);
        if (updatedReport) {
            updatedReport.date = report.date;
            updatedReport.id = report.id;
        }
    }
    */
    private buildReportList = (reportsData: object[]) => {
        // console.log("complete reports data : ", reportsData);
        this.props.appState.reportsList = reportsData.map(data => {
            return new Report(data);
        })
        console.log("parsed reportList ", this.props.appState.reportsList)
    }
    /*
    private handleTeamNameChange = (titles: any) => {
        this.setState({inputTitle1: titles.title1, inputTitle2: titles.title2})
    }
    private createReport = (message: string) => {
        return () => {
            if (this.state.inputTitle1 && this.state.inputTitle2) {
                if (!this.props.appState.createdReportsCount) {
                    this.props.appState.createdReportsCount = 0;
                }
                const reportTempId: string = "temp_created_report" + this.props.appState.createdReportsCount;
                this.props.appState.createdReportsCount++;

                const homeTeam: Team = new Team({name: this.state.inputTitle1});
                const awayTeam: Team = new Team({name: this.state.inputTitle2});
                const reportTemplate: Report = new Report({id:reportTempId, title:reportTempId, home:homeTeam, away:awayTeam});
                this.props.appState.reportsList.push(reportTemplate);
                
                this.openReport(reportTemplate);

                Reports
                .createReport(reportTemplate)
                .then((newReport: Report) => {
                    this.updateReport(reportTempId, newReport);
                  });
            }
        };
    }
    */
    private reportClicked = (reportId: string) => {
        return () => {
            const report = this.props.appState.reportsList.find(r => r.id === reportId);
            if (report) {
                 this.props.openReport(report);
            }
        }
    }
    private deleteClicked = (reportId: string) => {
        return () => {
            const report = this.props.appState.reportsList.find(r => r.id === reportId);
            if (report && this.props.appState.report === report) {
                console.log("delete report ? " + reportId);
            }
        }
    }
}
export default ReportsList;