import * as React from 'react';
import { IAppProps } from "../App";
import Navigator from '../components/Navigator';
import TimePiece from '../components/TimePiece';
import {Screens} from "../model/AppState";

import '../css/App.css';
import bgMatch from '../img/backgrounds/match.png';

const bgStyle = {
  backgroundImage: `url(${bgMatch})`
};

class Match extends React.Component<IAppProps, {}> {
    public componentWillMount() {
        this.props.appState.screen = Screens.Match;
    }
    public render() {
        return <div className="App" style={bgStyle}>
            <Navigator appState={this.props.appState}/>
            <TimePiece ticking={false} defautlTimerValue={this.props.appState.defaultTimerValue}/>
        </div>;
    };
}
export default Match;