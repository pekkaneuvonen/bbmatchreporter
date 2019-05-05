import { observer } from "mobx-react";
import * as React from 'react';
import { IAppProps, IScreenState } from "../App";
import Navigator from '../components/Navigator';
import TeamTitleInput from '../components/TeamTitleInput';
import TeamValueInput from '../components/TeamValueInput';
import InducementsInput from '../components/InducementsInput';
import GatesInput from '../components/GatesInput';

import {Screens} from "../model/AppState";
import { Transition } from 'react-transition-group';
import { TweenLite } from "gsap";

import bgHome from '../img/backgrounds/GRASS_9AM_grid.jpg';
import WeatherChooserRow from "../components/WeatherChooserRow";
import '../css/Prematch.css';
import { Team } from "../model/Team";
import { WeatherType } from "../model/Weather";
import { Kvalue } from '../types/Kvalue';
import StringFormatter from "../utils/StringFormatter";
import SwipeItem, { SwipeDirection } from '../components/SwipeItem';

import history from "./history";

@observer
class Prematch extends React.Component<IAppProps, IScreenState> {
    private bgContainer: React.RefObject<HTMLDivElement>;
    private tableContainer: React.RefObject<HTMLDivElement>;
    private tableStyle = {
        height: "calc(100vh - 80px)", // will be updated in componentWillMount 
    };
    private bgStyle = {
        backgroundImage: `url(${bgHome})`,
        height: "2048px" // will be updated in componentDidUpdate to fit reportList height 
    };

    constructor(props: any) {
        super(props);
        this.bgContainer = React.createRef();
        this.tableContainer = React.createRef();
        this.props.appState.prevscreen = this.props.appState.screen;
        this.props.appState.screen = Screens.Prematch;
        this.state = {
            swipeEnabled: true,
        }
        this.tableStyle = this.props.appState.brandNewReport !== null ?
            {height: 'calc(100vh - 80px - 54px)',}
            :
            {height: 'calc(100vh - 80px)',};
        this.bgStyle = {
            backgroundImage: `url(${bgHome})`,
            height: `${this.tableContainer.current ? this.tableContainer.current.scrollHeight + 80: 2048}px`,
        };
    };

    public render() {
        console.log("Navigation ", this.props.appState.prevscreen, " --> ", this.props.appState.screen);

        if (!this.props.appState.homeTeam || !this.props.appState.awayTeam
        || this.props.appState.report.id === "empty") {
            window.location.href = "/";
        }

        let induced: string = "even";
        if (this.inducedSide === this.props.appState.homeTeam) {
            induced = "home";
        } else if (this.inducedSide === this.props.appState.awayTeam) {
            induced = "away";
        }
        let inducementString:string = "";
        if (this.inducementValue.asString !== "-") {
            inducementString = "+" + this.inducementValue.asString;
        }

        const show: boolean = this.props.appState.screen === Screens.Prematch;
        let fromX: number = !show ? 0 : this.props.appState.prevscreen === Screens.Home ? 0 : -window.innerWidth;
        let toX: number = show ? 0 : this.props.appState.screen === Screens.Home ? 0 : -window.innerWidth;

        const startState = { autoAlpha: 0, x: fromX};
        return <div className="Prematch">
            <Navigator appState={this.props.appState}/>

            <Transition
                in={show}
                mountOnEnter
                timeout={1000}
                onEnter={node => TweenLite.set(node, startState)}
                onExit={node => TweenLite.set(node, startState)}
                addEndListener={ (node, done) => {
                    TweenLite.fromTo(node, 0.25, {
                        autoAlpha: !show ? 1 : 0, ease:"Quad.easeIn",
                        x: fromX,
                    }, {
                    autoAlpha: show ? 1 : 0,
                    x: toX, ease:"Quad.easeOut",
                    onComplete: done
                    });
                }}
            >  
            <SwipeItem 
                enabled={this.state.swipeEnabled} 
                actionThreshold={0.5} 
                offsetWidth={320} 
                swipeDirs={[SwipeDirection.Left]} 
                onSwipe={this.onSwipe}
                onScrollHandler={this.scrollHandler}
            >
                <div ref={this.bgContainer} className="prematchBackgroundField" >
                    <div style={this.bgStyle}/>
                </div>
                <div ref={this.tableContainer} className="prematchTablecontent" style={this.tableStyle}>
                    {this.props.appState.brandNewReport ?
                        <div className="newReportMessage">NEW REPORT</div>
                    : null }
                    <div className="teamtitles">
                        <TeamTitleInput 
                            activityOverride={this.props.appState.brandNewReport !== null}
                            titleChangeHandler={this.handleTeamNameChange} 
                            title1Default={this.props.appState.homeTeam.name} 
                            title2Default={this.props.appState.awayTeam.name}
                            onFocusIn={this.inputActived}
                            onFocusOut={this.inputDeactivated}/>
                    </div>
                    <div className="teamTVs">
                        <TeamValueInput
                            activityOverride={this.props.appState.brandNewReport !== null}
                            valueChangeHandler={this.handleTeamValueChange} 
                            value1={this.props.appState.homeTeam.tvString} 
                            value2={this.props.appState.awayTeam.tvString}
                            onFocusIn={this.inputActived}
                            onFocusOut={this.inputDeactivated}/>
                    </div>
                    <div className="inducementsContainer">
                        <InducementsInput
                            activityOverride={this.props.appState.brandNewReport !== null}
                            inducementsValue={inducementString} 
                            side={induced} 
                            inducementsDescriptions={this.inducedSide ? this.inducedSide.inducements : "-"} 
                            descriptionsChangeHandler={this.inducementDescriptionChange()}
                            onFocusIn={this.inputActived}
                            onFocusOut={this.inputDeactivated}/>
                    </div>
                    <div className="gateContainer">
                        <GatesInput
                            activityOverride={this.props.appState.brandNewReport !== null}
                            gateValue1={this.props.appState.homeTeam.gateValue} 
                            gateValue2={this.props.appState.awayTeam.gateValue} 
                            gatesChangeHandler={this.handleTeamGateChange}
                            onFocusIn={this.inputActived}
                            onFocusOut={this.inputDeactivated}/>
                    </div>
                    <div className="weatherChooserContainer">
                        {this.createWeatherTable()};
                    </div>
                </div>
            </SwipeItem>
            </Transition>

            {this.props.appState.brandNewReport ? 
                <div onClick={this.doneButtonHandler} className="bottomButton"><div className="bottomButtonText">DONE</div></div>
            : null}
        </div>;
    };
    private inputActived = (event: any) => {
        this.setState({swipeEnabled: false});
    }
    private inputDeactivated = (event: any) => {
        this.setState({swipeEnabled: true});
    }
    private onSwipe = (dir: string) => {
        if (dir === "left") {
            history.push(Screens.Match);
        }
    }
    private scrollHandler = (event:any) => {
        if (this.bgContainer.current && this.tableContainer.current) {
            this.bgContainer.current.scrollTop = this.tableContainer.current.scrollTop / 9;
        }
    }
    private doneButtonHandler = (event: any) => {
        this.props.appState.brandNewReport = null;
    }
    private createWeatherTable = () => {
        const table = [];
        // console.log("currentWeather : " + this.props.appState.currentWeather);

        const weatherTypeCount: number = Object.keys(WeatherType).length / 2
        for (let i = 0; i < weatherTypeCount; i++) {
          table.push(
            <WeatherChooserRow key={i} chosen={this.props.appState.currentWeather === WeatherType[i]} value={i} clickHandler={this.weatherClickHandler(i)}/>
          );
        }
        return table
      }
    private weatherClickHandler = (value: number) => {
        return (event: any) => {
            this.props.appState.currentWeather = WeatherType[value];
            this.props.appState.updateWeather(WeatherType[value]);
        }
    }
    private get inducementValue(): Kvalue {
        if (this.props.appState.inducementValueOverride) {
            return this.props.appState.inducementValueOverride;
        }
        let rawInducements: Kvalue;
        if (this.props.appState.homeTeam && this.props.appState.awayTeam) {
            rawInducements = new Kvalue(this.props.appState.homeTeam.teamValue - this.props.appState.awayTeam.teamValue);
        } else {
            rawInducements = new Kvalue(0);
        }
        return rawInducements;
    }
    private get inducedSide(): Team {
        const rawInducements: Kvalue = this.inducementValue;
        let smallertv: any;
        if (rawInducements.value < 0) {
            smallertv = this.props.appState.homeTeam;
        } else if (rawInducements.value > 0) {
            smallertv = this.props.appState.awayTeam;
        } else {
            smallertv = null;
        }
        return smallertv;
    }


    private handleTeamNameChange = (titles: any) => {
        if (!this.props.appState.homeTeam || !this.props.appState.awayTeam) {
            window.location.href = "/";
        }
        this.props.appState.homeTeam.name = titles.title1;
        this.props.appState.awayTeam.name = titles.title2;
        this.props.appState.updateReport();
    }

    private handleTeamValueChange = (values: any) => {
        if (!this.props.appState.homeTeam || !this.props.appState.awayTeam) {
            window.location.href = "/";
        }

        this.props.appState.homeTeam.teamValue = StringFormatter.convertKvalueStringToNumeric(values.value1);
        this.props.appState.awayTeam.teamValue = StringFormatter.convertKvalueStringToNumeric(values.value2);
        this.props.appState.updateReport();
    }

    private inducementDescriptionChange = () => {
        return (description: string) => {
            // console.log(" update inducementDescriptionChange : " + description);
            this.inducedSide.inducements = description;
            this.props.appState.updateReport();
        }
    }
    private handleTeamGateChange = (gates: any) => {
        if (!this.props.appState.homeTeam || !this.props.appState.awayTeam) {
            window.location.href = "/";
        }

        if (gates.value1) {
            let split1: string[] = gates.value1.split("k");
            let numericValue1: number = parseInt(split1.join(""), 10);
            numericValue1 *= 1000;
            this.props.appState.homeTeam.gateValue = numericValue1;
        }

        if (gates.value2) {
            let split2: string[] = gates.value2.split("k");
            let numericValue2: number = parseInt(split2.join(""), 10);
            numericValue2 *= 1000;
            this.props.appState.awayTeam.gateValue = numericValue2;
        }
        this.props.appState.report.totalGateValue = this.props.appState.homeTeam.gateValue + this.props.appState.awayTeam.gateValue;
        this.props.appState.report.totalGate = new Kvalue(this.props.appState.report.totalGateValue);
        this.props.appState.updateReport();
    }

}
export default Prematch;