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

@observer
class ReportsList extends React.Component<{
    appState: AppState, 
    active: boolean,
    openReport: (report: Report) => void
    deleteReport: (report: Report) => void}> {
    
        constructor(props: any) {
        super(props);
    }
    
    public componentDidMount() {
        /*
        Reports
            .getReport("0")
            .then(this.openReport)
            .catch(error => {
                console.log(error);
            });
        */
    }


    public render() {
        console.log(this.props.appState.reportsList ? this.props.appState.reportsList.length : "no reports")
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
                {this.props.appState.reportsList.slice(0).reverse().map(
                    (report) => {
                        const teamBgStyle = {
                            backgroundImage: `url(${reportBox})`,
                            backgroundRepeat  : 'no-repeat',
                            color: "#242424",
                        };
                        const dateStyles = ["reportDateSlot", "controlRow", "enabledControls"]
                        const openStyles = ["reportOpenSlot", "controlRow"]
                        const deleteStyles = ["reportDeleteSlot", "controlRow"]

                        if (this.props.appState.selectedReport && report.id === this.props.appState.selectedReport.id) {
                            teamBgStyle.backgroundImage = `url(${reportBoxChosen})`;
                            teamBgStyle.color = "#F2F0EE";
                            openStyles.push("enabledControls");
                            deleteStyles.push("enabledControls");
                        }

                        return <div key={report.id} style={teamBgStyle} className="reportContainer">
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
                                    <div className="reportRow teamRow">
                                        {report.home.name}
                                    </div>
                                    <div className="reportRow teamRow">
                                        {report.away.name}
                                    </div>
                                </div>
                                <div className="reportScore"
                                    onClick={this.reportClicked(report.id)}>
                                    <div className="reportRow scoreRow">
                                        {report.home.goals}
                                    </div>
                                    <div className="reportRow scoreRow">
                                        {report.away.goals}
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                )}
            </ul>
        }
    }

    private reportClicked = (reportId: string) => {
        return () => {
            if (this.props.active) {
                const report = this.props.appState.reportsList.find(r => r.id === reportId);
                if (report) {
                    console.log("reportClicked : ", report.id);
                    console.log("currently selected : ", this.props.appState.selectedReport ? (this.props.appState.selectedReport.id === report.id) : "no selection");
                    if (this.props.appState.selectedReport
                    && this.props.appState.selectedReport.id === report.id) {
                        this.props.openReport(report);
                    } else {
                        this.props.appState.selectedReport = report;
                    }
                }
            }
        }
    }
    private deleteClicked = (reportId: string) => {
        return () => {
            if (this.props.active) {
                const report = this.props.appState.reportsList.find(r => r.id === reportId);
                if (report && this.props.appState.selectedReport === report) {
                    console.log("delete report ? " + reportId);
                    this.props.deleteReport(report);
                }
            }
        }
    }
}
export default ReportsList;