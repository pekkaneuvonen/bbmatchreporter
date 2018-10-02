import { observer } from "mobx-react";
import * as React from 'react';
import '../css/Reports.css';
import { AppState, Screens } from "../model/AppState";
import Report from '../model/Report';
import { Reports } from '../services/Reports';

import bgActive from '../img/backgrounds/ActiveAreaBgBox.png';
import teamsField from '../img/reportList/teamtitles.png';
import activeTeamsField from '../img/reportList/teamtitles_active.png';
import teamsInputField from '../img/reportList/teamtitles_input.png';

// tslint:disable:no-console
interface IReportListState {
    title1: string;
    title2: string;
}


@observer
class ReportsList extends React.Component<{appState: AppState}, IReportListState> {
    constructor(props: any) {
        super(props);
        this.state = {
            title1: "team 1",
            title2: "team 2"
        }
        console.log('constructor');
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
    public openReport = (report: Report) => {
        console.log("opening report ", report);

        this.props.appState.report = report;
        this.props.appState.homeTeam = report.home;
        this.props.appState.awayTeam = report.away;

        console.log("NEEDS TO GO ", Screens.Prematch);
    }
    public buildReportList = (reportsData: object[]) => {
        // console.log("complete reports data : ", reportsData);
        this.props.appState.reportsList = reportsData.map(data => {
            return new Report(data);
        })
        console.log("parsed reportList ", this.props.appState.reportsList)
    }
    public render() {
        const bgStyle = {
            backgroundImage: `url(${bgActive})`,
        };

        return (
            <div className="reportChooser" style={bgStyle}>
                {this.toggleReportDetails(this.props.appState.reportType)}
            </div>
        );
    }
    private toggleReportDetails = (listType: string) => {
        console.log("listType " + listType);
        if (listType === "new") {
            const inputBgStyle = {
                backgroundImage: `url(${teamsInputField})`,
                backgroundPosition: 'center',
                backgroundRepeat  : 'no-repeat'
            };
            return <div style={inputBgStyle} className={["reportRow", "newReportRow"].join(' ')}>
                    <form onSubmit={this.addTeamName1}>
                        <input className={["teamTitle", "newTeamTitle"].join(' ')} value={this.state.title1} onChange={this.handleTeamName1Change}/>
                    </form>
                    <form onSubmit={this.addTeamName2}>
                        <input className={["teamTitle", "newTeamTitle"].join(' ')} value={this.state.title2} onChange={this.handleTeamName2Change}/>
                    </form>
                </div>

        } else if (listType === "load") {
            if (!this.props.appState.reportsList || this.props.appState.reportsList.length < 1) {
                return <div className="no_reportList">No reports in database.</div>
            } else {
            return <ul className="reportList">
                        {this.props.appState.reportsList.map(
                            (report) => {
                                console.log("report row " + report.title);
                                const teamBgStyle = {
                                    backgroundImage: `url(${report === this.props.appState.report ? activeTeamsField : teamsField})`,
                                    backgroundPosition: 'center',
                                    backgroundRepeat  : 'no-repeat',
                                };
                                const titleStyles: string[] = ["teamTitle", "reportRowSlot"];
                                if (report === this.props.appState.report) {
                                    titleStyles.push("newTeamTitle");
                                }


                                return <div key={report.id} style={teamBgStyle} className="reportRow" onClick={this.reportClicked(report.id)}>
                                    <div className={titleStyles.join(' ')}>{report.home.name}</div>
                                    <div className={titleStyles.join(' ')}>{report.away.name}</div>
                                </div>
                            }
                        )}
                    </ul>
            }
        } else {
            return null;
        }
    }
    private addTeamName1 = (event: any) => {
        event.preventDefault();
        console.log('submit team name 1 ', this.state.title1);
    }
    private addTeamName2 = (event: any) => {
        event.preventDefault();
        console.log('submit team name 2 ', this.state.title2);
    }
    private handleTeamName1Change = (event: any) => {
        this.setState({ title1: event.target.value });
    }
    private handleTeamName2Change = (event: any) => {
        this.setState({ title2: event.target.value });
    }

    private reportClicked = (reportId: number) => {
        return () => {
            console.log("row reportId : reportId " + reportId);
            const report = this.props.appState.reportsList.find(r => r.id === reportId);
            if (report) {
                 this.openReport(report);
            }
        }
    }
}
export default ReportsList;