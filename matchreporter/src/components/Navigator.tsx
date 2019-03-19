import * as React from 'react';
import { Link } from 'react-router-dom';
import { IAppProps } from "../App";
// import {Screens} from "../model/AppState";

import homeLabel from '../img/navigator/homeButtonLabel.png';
import homeX from '../img/navigator/homeButtonX.png';
import matchButton from '../img/navigator/MatchButton.png';
import buttonChosenBG from '../img/navigator/naviButtonLight.png';
import matchButtonDiv from '../img/navigator/MatchButtonDiv.png';
import postmatchButton from '../img/navigator/PostMatchButton.png';
import prematchButton from '../img/navigator/PreMatchButton.png';
// import homebutton from '../img/navigator/tab_home_visited.png';
/*
import matchTabButton from '../img/navigator/tab_match.png';
import postTabButton from '../img/navigator/tab_post.png';
import preTabButton from '../img/navigator/tab_pre.png';

import matchTabVisButton from '../img/navigator/tab_match_visited.png';
import postTabVisButton from '../img/navigator/tab_post_visited.png';
import preTabVisButton from '../img/navigator/tab_pre_visited.png';
*/
import { Screens } from '../model/AppState';


class Navigator extends React.Component<IAppProps, {}> {
    private navbarStyle = {
        height: "80px",
        width: "100%",
        zIndex: 50,
    };

    public componentDidMount() {
        console.log(" Navigator location : screen = ", this.props.appState.screen);
    }

    public render() {

        return (
        <div style={ this.navbarStyle }>
            <div className="navigatorHomebutton">
                <Link to='/'>
                        <img src={homeLabel}/>
                        <img style={{right: "0px"}} src={homeX}/>
                </Link>
            </div>
            <div className="navigatorContainer">
                <div className="navigator">
                    <div className={ this.props.appState.screen === Screens.Prematch ? "buttonStyles buttonChosenStyles" : "buttonStyles" }>
                        <Link to={Screens.Prematch}>
                            <img src={prematchButton}/>
                        </Link>
                    </div>
                    <img src={matchButtonDiv}/>
                    <div className={ this.props.appState.screen === Screens.Match ? "buttonStyles buttonChosenStyles" : "buttonStyles" }>
                        <Link to={Screens.Match}>
                            <img src={matchButton}/>
                        </Link>
                    </div>
                    <img src={matchButtonDiv}/>
                    <div className={ this.props.appState.screen === Screens.Postmatch ? "buttonStyles buttonChosenStyles" : "buttonStyles" }>
                        <Link to={Screens.Postmatch}>
                            <img src={postmatchButton}/>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
        )
    }
/*
    private getButtonFor = (screen: string) => {
        const screens: string[] = [Screens.Home, Screens.Prematch, Screens.Match, Screens.Postmatch];
        const visited: boolean = screens.indexOf(screen) <= screens.indexOf(this.props.appState.screen);

        if (screen === Screens.Prematch) {
            return visited ? preTabVisButton : preTabButton;
        } else if (screen === Screens.Match) {
            return visited ? matchTabVisButton : matchTabButton;
        } else if (screen === Screens.Postmatch) {
            return visited ? postTabVisButton : postTabButton;
        }
    }
*/
}
export default Navigator;