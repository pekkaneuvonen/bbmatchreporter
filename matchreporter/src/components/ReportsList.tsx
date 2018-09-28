import { observer } from "mobx-react";
import * as React from 'react';
import { IAppProps } from "../App";
import '../css/Reports.css';
import Report from '../model/Report';
import { Reports } from '../services/Reports';
import ListRowWithButton from './ListRowWithButton';

// tslint:disable:no-console
@observer
class ReportsList extends React.Component<IAppProps, {}> {

    public componentDidMount() {
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
    }
    public buildReportList = (reportsData: object[]) => {
        // console.log("complete reports data : ", reportsData);
        this.props.appState.reportsList = reportsData.map(data => {
            return new Report(data);
        })
        console.log("parsed reportList ", this.props.appState.reportsList)
    }
    public render() {
        return (
            <ul className="reportList">
                {this.props.appState.reportsList.map(report => <ListRowWithButton key={report.id} title={report.title} onClickHandler={this.reportClicked(report.id)}/>)}
            </ul>
        )
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