import * as React from 'react';
import { Link } from 'react-router-dom';
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
    };

    public componentDidMount() {
        console.log(" Navigator location : screen = ", this.props.appState.screen);
    }

    public render() {
        return (
        <div style={ this.navbarStyle }>
            <div className="navigator">
                <div className="navbutton">
                    <Link to='/'>
                        <img src={homebutton}/>
                    </Link>
                </div>
                <div className="navbutton">
                    {this.link(Screens.Prematch)}
                </div>
                <div className="navbutton">
                    {this.link(Screens.Match)}
                </div>
                <div className="navbutton">
                    {this.link(Screens.Postmatch)}
                </div>
            </div>
        </div>
        )
    }
    private link = (screen: string) => {
        if (this.props.appState.report) {
            return <Link to={screen}>
                <img src={this.getButtonFor(screen)}/>
            </Link>
        } else {
            return <img src={this.getButtonFor(screen)}/>
        }
    }
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
}
export default Navigator;