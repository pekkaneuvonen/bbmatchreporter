import * as React from 'react';
import { Link } from 'react-router-dom';
import { IAppProps } from "../App";
// import {Screens} from "../model/AppState";

import homeLabel from '../img/navigator/homeButtonLabel.png';
import homeX from '../img/navigator/homeButtonX.png';
import matchButton from '../img/navigator/MatchButton.png';
import matchButtonDiv from '../img/navigator/MatchButtonDiv.png';
import postmatchButton from '../img/navigator/PostMatchButton.png';
import prematchButton from '../img/navigator/PreMatchButton.png';
import BrowserLinkButton from './buttons/BrowserLinkButton';

import { Screens } from '../model/AppState';
import { TweenLite } from "gsap";


class Navigator extends React.Component<IAppProps, {}> {
    
    private linkTween: ReturnType<typeof TweenLite.to> | null;
    private preButton: React.RefObject<any>;
    private matchButton: React.RefObject<any>;
    private postButton: React.RefObject<any>;
    private naviButtonSlot: React.RefObject<HTMLDivElement>;

    constructor(props: any) {
        super(props);
        this.linkTween = null;
        this.preButton = React.createRef();
        this.matchButton = React.createRef();
        this.postButton = React.createRef();
        this.naviButtonSlot = React.createRef();
    }
    public componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.windowResizeHandler);
    }
    public componentWillUnmount() {
        window.removeEventListener('resize', this.windowResizeHandler);
    }
    private windowResizeHandler = () => {
        this.props.appState.prevscreen = this.props.appState.screen;
        this.updateWindowDimensions();
    }
    private updateWindowDimensions = () => {
        const currentButtonRef: any = this.props.appState.screen === Screens.Prematch ? this.preButton : this.props.appState.screen === Screens.Match ? this.matchButton : this.postButton;
        const prevButtonRef: any = this.props.appState.prevscreen === Screens.Prematch ? this.preButton : this.props.appState.prevscreen === Screens.Match ? this.matchButton : this.postButton;
        // console.log("currentButtonRef ", currentButtonRef);

        const targetX: number = currentButtonRef.current.offsetLeft - 8; // 8 is the padding on navigatorContainer
        let fromX: number = prevButtonRef.current.offsetLeft - 8;
        if (this.props.appState.prevscreen === this.props.appState.screen
        || this.props.appState.prevscreen === Screens.Home) {
            fromX = targetX;
        }
        const buttonWidth: number = currentButtonRef.current.offsetWidth; //this.props.appState.screen === Screens.Prematch ? this.preButton.current

        this.linkTween = TweenLite.fromTo(this.naviButtonSlot.current, 0.2, {x: fromX, ease: "Quad.easeOut"}, {width: buttonWidth, x: targetX, ease: "Quad.easeOut"});
    };
    public render() {

        return (
        <div className="navigator">
            <Link to='/' className="navigatorHomebutton">
                    <img className="img_centered" src={homeLabel}/>
                    <img style={{right: "0px"}} src={homeX}/>
            </Link>
            <div className="navigatorContainer">
                <div ref={this.naviButtonSlot} className="chosenButtonStyles"></div>
                <div className="navigatorTabs">
                    <BrowserLinkButton elementRef={this.preButton} to={Screens.Prematch} imageSource={prematchButton}/>
                    <img className="navigatorDivs" src={matchButtonDiv}/>
                    <BrowserLinkButton elementRef={this.matchButton} to={Screens.Match} imageSource={matchButton}/>
                    <img className="navigatorDivs" src={matchButtonDiv}/>
                    <BrowserLinkButton elementRef={this.postButton} to={Screens.Postmatch} imageSource={postmatchButton}/>
                </div>
            </div>
        </div>
        )
    }

}
export default Navigator;