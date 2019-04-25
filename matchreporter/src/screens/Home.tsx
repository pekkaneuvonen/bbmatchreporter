import { observer } from "mobx-react";
import * as React from 'react';
import { IAppProps } from "../App";

import ReportsList from "../components/ReportsList";
import {Screens} from "../model/AppState";
import Report from '../model/Report';
import { Team } from "../model/Team";
import { Reports } from '../services/Reports';
import { Tween } from 'react-gsap';
import { TweenLite, Quad } from "gsap";

import '../css/Home.css';

import bgHome from '../img/backgrounds/GRASS_9AM.jpg';
import decolines from '../img/load/decolines1.png';
import newButton from '../img/load/newrepButton.png';
import title from '../img/load/title1.png';
import topTitle from '../img/load/title2.png';
import history from "./history";

@observer
class Home extends React.Component<IAppProps, {showDeleteAlert: boolean, showTitleHeader: boolean}> {
    private bgContainer: React.RefObject<HTMLDivElement>;
    private contentContainer: React.RefObject<HTMLDivElement>;
    private toptitleContainer: React.RefObject<HTMLDivElement>;
    private contenttitleContainer: React.RefObject<HTMLDivElement>;
    private toptitleTween: ReturnType<typeof TweenLite.to> | null;
    private contenttitleTween: ReturnType<typeof TweenLite.to> | null;

    private topScrollTreshold: number = 145;

    constructor(props: any) {
        super(props);
        this.state = {
            showDeleteAlert: false,
            showTitleHeader: false,
        }
        this.bgContainer = React.createRef();
        this.contentContainer = React.createRef();
        this.toptitleContainer = React.createRef();
        this.contenttitleContainer = React.createRef();
        // reference to the animation
        this.buildReportList();
        this.toptitleTween = null;
        this.contenttitleTween = null;
    }
    public componentWillMount() {
        this.props.appState.screen = Screens.Home;
        this.resetReport();
    }
    public componentDidMount() {
        this.toptitleTween = TweenLite.to(this.toptitleContainer.current, 0.2, {y: -116, ease: "Quad.easeOut"});
    }
    public componentDidUpdate(prevProps: IAppProps, prevState: {showDeleteAlert: boolean, showTitleHeader: boolean}) {

        if (!prevState.showTitleHeader && this.state.showTitleHeader) {
            this.toptitleTween = TweenLite.to(this.toptitleContainer.current, 0.2, {y: 0, ease: "Quad.easeOut"});
            
            this.contenttitleTween = TweenLite.to(this.contenttitleContainer.current, 0.25, {y: -100, ease: "Quad.easeOut"});

        } else if (prevState.showTitleHeader && !this.state.showTitleHeader) {
            this.toptitleTween = TweenLite.to(this.toptitleContainer.current, 0.2, {y: -116, ease: "Quad.easeOut"});

            this.contenttitleTween = TweenLite.to(this.contenttitleContainer.current, 0.25, {y: 0, ease: "Quad.easeOut"});
        }
    }
    public render() {
        return <div className="home" onScroll={this.scrollHandler}>
            <div ref={this.bgContainer} className="backgroundField">
                <img src={bgHome}/>
            </div>
            <div ref={this.toptitleContainer} className="homeHeader">
                <div className="topTitle"><img className="topTitleImg" src={topTitle}/></div>
                <img className="topTitleButton" src={newButton}/>
            </div>
            <div ref={this.contentContainer} className="content">
                <div ref={this.contenttitleContainer} className="titleElements">
                    <img src={title}/>
                    <div className="decorativeLines">
                        <img className="linesImage" src={decolines}/>
                    </div>
                    <div className="version">version 0.41</div>
                    <div className="newReportButton" onClick={this.createNewReport}>
                        <img src={newButton}/>
                    </div>
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

    private scrollHandler = (event:any) => {
        if (this.contentContainer.current && this.bgContainer.current) {
            this.bgContainer.current.scrollTop = this.contentContainer.current.scrollTop / 9;

            if (this.contentContainer.current.scrollTop >= this.topScrollTreshold && this.state.showTitleHeader === false) {
                this.setState({showTitleHeader: true});
            } else if (this.contentContainer.current.scrollTop < this.topScrollTreshold &&this.state.showTitleHeader === true) {
                this.setState({showTitleHeader: false});
            }
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