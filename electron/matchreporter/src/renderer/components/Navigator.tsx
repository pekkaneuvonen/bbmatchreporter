import * as React from 'react';
import { IAppProps } from "../App";
// import {Screens} from "../model/AppState";

import base from '../img/navigator/base.png';
import homebutton from '../img/navigator/tab_home_visited.png';
import matchTabButton from '../img/navigator/tab_match.png';
import postTabButton from '../img/navigator/tab_post.png';
import preTabButton from '../img/navigator/tab_pre.png';

import matchTabVisButton from '../img/navigator/tab_match_visited.png';
import postTabVisButton from '../img/navigator/tab_post_visited.png';
import preTabVisButton from '../img/navigator/tab_pre_visited.png';
import { Screens } from '../model/AppState';


class Navigator extends React.Component<IAppProps, {}> {

    private navbarStyle = {
        backgroundImage: `url(${base})`,
        backgroundOrigin: "content-box",
        height: "57px",
        marginTop: "1px",
        width: "100%",
        backgroundPosition: 'center',
        backgroundRepeat  : 'no-repeat',
    };

    public componentDidMount() {
        console.log(" Navigator location : screen = ", this.props.appState.screen);
    }

    public render() {
        return (
        <div style={ this.navbarStyle }>
            <div className="navigator">
                <div className="navbutton">
                    <img src={homebutton}/>
                </div>
                <div className="navbutton">
                    <img src={this.getButtonFor(Screens.Prematch)}/>
                </div>
                <div className="navbutton">
                    <img src={this.getButtonFor(Screens.Match)}/>
                </div>
                <div className="navbutton">
                    <img src={this.getButtonFor(Screens.Postmatch)}/>
                </div>
            </div>
        </div>
        )
    }

    private getButtonFor = (screen: string) => {
        console.log("getButtonFor : " + screen);

        const screens: string[] = [Screens.Home, Screens.Prematch, Screens.Match, Screens.Postmatch];
        const visited: boolean = (screens.indexOf(screen) <= screens.indexOf(this.props.appState.screen));
        
        if (screen === Screens.Prematch) {
            return visited ? preTabVisButton : preTabButton;
        } else if (screen === Screens.Match) {
            return visited ? matchTabVisButton : matchTabButton;
        } else if (screen === Screens.Postmatch) {
            return visited ? postTabVisButton : postTabButton;
        }
    }
}
export default Navigator;