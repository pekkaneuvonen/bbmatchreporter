import * as React from 'react';
import { IAppProps } from "../App";
import Navigator from '../components/Navigator';
import Screentitle from '../components/Screentitle';
import {Screens} from "../model/AppState";


import '../css/App.css';
import bgPostmatch from '../img/backgrounds/postmatch.png';
import title from '../img/POSTMATCH.png';

const bgStyle = {
  backgroundImage: `url(${bgPostmatch})`
};

class Postmatch extends React.Component<IAppProps, {}> {
    public componentWillMount() {
        this.props.appState.screen = Screens.Postmatch;
    }
    public render() {
        return <div className="App" style={bgStyle}>
            <Navigator appState={this.props.appState}/>
            <Screentitle src={title}/>
        </div>;
    };
}
export default Postmatch;