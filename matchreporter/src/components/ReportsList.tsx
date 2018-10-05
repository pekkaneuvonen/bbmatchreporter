import { observer } from "mobx-react";
import * as React from 'react';
import { Link } from 'react-router-dom';
import '../css/Reports.css';
import { AppState, Screens } from "../model/AppState";
import Report from '../model/Report';
import { Reports } from '../services/Reports';
import TeamTitleInput from './TeamTitleInput';

import bgActive from '../img/backgrounds/ActiveAreaBgBox.png';
import readyBtn from '../img/buttons/ready.png';
import teamsField from '../img/reportList/teamtitles.png';
import activeTeamsField from '../img/reportList/teamtitles_active.png';
import { Team } from "../model/Team";

// tslint:disable:no-console
interface IReportListState {
    inputTitle1: string;
    inputTitle2: string;
}

@observer
class ReportsList extends React.Component<{appState: AppState}, IReportListState> {

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
            const defaultTitle1: string = this.props.appState.homeTeam ? this.props.appState.homeTeam.name : "team 1";
            const defaultTitle2: string = this.props.appState.awayTeam ? this.props.appState.awayTeam.name : "team 2";

            return <div>
                <TeamTitleInput titleChangeHandler={this.handleTeamNameChange} title1Default={defaultTitle1} title2Default={defaultTitle2} activityOverride={true}/>
                <Link to={Screens.Prematch}>
                    <div onClick={this.reportCreated("go")}>
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
                                backgroundRepeat  : 'no-repeat',
                            };
                            const titleStyles: string[] = ["teamTitle", "reportRowSlot"];
                            if (this.props.appState.report && report.id === this.props.appState.report.id) {
                                titleStyles.push("newTeamTitle");
                            }
                            return <Link key={report.id} to={Screens.Prematch} style={{textDecoration: "none"}}><div style={teamBgStyle} className="reportRow" onClick={this.reportClicked(report.id)}>
                                <div className={titleStyles.join(' ')}>
                                    {report.home.name}
                                </div>
                                <div className={titleStyles.join(' ')}>
                                    {report.away.name}
                                </div>
                            </div>
                            </Link>
                        }
                    )}
                </ul>
            }
        } else {
            return null;
        }
    }
    private openReport = (report: Report) => {
        console.log("opening report ", report);
        this.props.appState.report = report;
        this.props.appState.homeTeam = report.home;
        this.props.appState.awayTeam = report.away;
    }
    private buildReportList = (reportsData: object[]) => {
        // console.log("complete reports data : ", reportsData);
        this.props.appState.reportsList = reportsData.map(data => {
            return new Report(data);
        })
        console.log("parsed reportList ", this.props.appState.reportsList)
    }
    private handleTeamNameChange = (titles: any) => {
        this.setState({inputTitle1: titles.title1, inputTitle2: titles.title2})
    }
    private reportCreated = (message: string) => {
        return () => {
            const homeTeam: Team = new Team({name: this.state.inputTitle1});
            const awayTeam: Team = new Team({name: this.state.inputTitle2});
            const report: Report = new Report({id:"temp_created_report", title:"temp_created_report", home:homeTeam, away:awayTeam});
            if (report) {
                this.openReport(report);
            }
        };
    }
    private reportClicked = (reportId: number) => {
        return () => {
            const report = this.props.appState.reportsList.find(r => r.id === reportId);
            if (report) {
                 this.openReport(report);
            }
        }
    }
}
export default ReportsList;