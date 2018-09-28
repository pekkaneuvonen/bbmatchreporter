import * as React from 'react';
import { IAppProps } from "../App";
import Navigator from '../components/Navigator';
import Screentitle from '../components/Screentitle';
import {Screens} from "../model/AppState";


import '../css/App.css';
import bgPrematch from '../img/backgrounds/prematch.png';
import title from '../img/PREMATCH.png';

const bgStyle = {
  backgroundImage: `url(${bgPrematch})`
};

class Prematch extends React.Component<IAppProps, {}> {
    public componentWillMount() {
        this.props.appState.screen = Screens.Prematch;
    }
    public render() {
        return <div className="App" style={bgStyle}>
            <Navigator appState={this.props.appState}/>
            <Screentitle src={title}/>
        </div>;
    };
}
export default Prematch;