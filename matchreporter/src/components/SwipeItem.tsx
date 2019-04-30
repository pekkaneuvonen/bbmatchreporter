import * as React from 'react';
import { isAbsolute } from 'path';

interface ISwipeItemProps{
    offsetWidth: number,
    threshold: number,
    swipeDirs: SwipeDirection[],
    onSwipe: (dir: string) => void,
}
const fpsInterval: number = 60;
export enum SwipeDirection {
    Left = 0,
    Right
}
const bgStyle = {
    position: 'absolute' as 'absolute',
    height: '100vh',
    width: '100vw',
    fontFamily: "'Teko', sans-serif",
    fontWeight: 400,
    color: '#F2F0EE',
    fontSize: '15px',
    textAlign: 'center' as 'center',
};
class SwipeItem extends React.Component<ISwipeItemProps, {}> {
    private container: React.RefObject<HTMLDivElement>;
    private bg: React.RefObject<HTMLDivElement>;
    private bgArrowLeft: React.RefObject<HTMLDivElement>;
    private bgArrowRight: React.RefObject<HTMLDivElement>;
    private swiped: boolean = false;
    private velocity: number | undefined = undefined;
    private swipeX: number = 0;
    private swipeY: number = 0;
    private locX: number | undefined = undefined;
    private locY: number | undefined = undefined;
    private startTime: number = 0;

    constructor(props: any) {
        super(props);
        this.container = React.createRef();
        this.bg = React.createRef();
        this.bgArrowLeft = React.createRef();
        this.bgArrowRight = React.createRef();
    }
    componentDidMount() {
        window.addEventListener("mouseup", this.handleMouseUp);
        window.addEventListener("mouseleave", this.handleMouseUp);
        window.addEventListener("touchend", this.handleTouchEnd);
    }
    componentWillUnmount() {
        window.removeEventListener("mouseup", this.handleMouseUp);
        window.removeEventListener("mouseleave", this.handleMouseUp);
        window.removeEventListener("touchend", this.handleTouchEnd);
    }

    public render() {
        const { children } = this.props
        return <div
        onTouchStart={this.handleTouchStart}
        onTouchMove={this.handleTouchMove}
        onTouchEnd={this.handleTouchEnd}
        onMouseDown={this.handleMouseDown}
        onMouseUp={this.handleMouseUp}
        onMouseLeave={this.handleMouseLeave}>
            <div className="swipeBG" ref={this.bg}>
            <div ref={this.bgArrowLeft} style={{paddingLeft: '48px'}}>{' <'}</div>
            <div ref={this.bgArrowRight} style={{paddingRight: '48px'}}>{'> '}</div>
            </div>
            <div ref={this.container}>
                {children}
            </div>
        </div>
    };

    private handleTouchStart = (event: React.TouchEvent<any>) => {
        this.startSwipe(event.targetTouches[0]);
        window.addEventListener("touchmove", this.handleTouchMove);
    }
    private handleTouchMove = (event: any) => {
        this.updateSwipe(event.targetTouches[0]);
    }
    private handleTouchEnd = (event: any) => {
        window.removeEventListener("touchmove", this.handleTouchMove);        this.resetSwipe();
    }
    private handleMouseDown = (event: any) => {
        this.startSwipe(event);
        window.addEventListener("mousemove", this.handleMouseMove);
    }
    private handleMouseMove = (event: any) => {
        this.updateSwipe(event);
    }
    private handleMouseUp = (event: any) => {
        window.removeEventListener("mousemove", this.handleMouseMove);        this.resetSwipe();
    }
    private handleMouseLeave = (event: any) => {
        window.removeEventListener("mousemove", this.handleMouseMove);        this.resetSwipe();
    }
    private startSwipe = (event: any) => {
        // this.setState({swiped: true, swipeX: 0, swipeY: 0, locX: event.clientX, locY: event.clientY});
        this.swipeX = 0;
        this.swipeY = 0;
        this.locX = event.clientX;
        this.locY = event.clientY;
        this.swiped = true;
        requestAnimationFrame(this.updatePosition);
    }
    private updateSwipe = (event: any) => {
        if (this.locX && this.locY) {
            this.swipeX = event.clientX - this.locX;
            this.swipeY = event.clientY - this.locY;
            // this.setState({swipeX: moveX, swipeY: moveY})
        }
    }
    private resetSwipe = () => {
        if (this.swiped && this.swipeX) {        
            if (this.swipeX < this.props.offsetWidth * this.props.threshold * -1) {
                // this.setState({swipeX: -this.props.offsetWidth * 2});
                this.swipeX = -this.props.offsetWidth * 2;
                this.onSwiped("left");
            } else if (this.swipeX > this.props.offsetWidth * this.props.threshold) {
                // this.setState({swipeX: this.props.offsetWidth * 2});
                this.swipeX = this.props.offsetWidth * 2;
                this.onSwiped("right");
            } else {
                // this.setState({swipeX: 0});
                this.swipeX = 0;
            }
        }
        // this.setState({swiped: false, swipeX: undefined, swipeY: undefined, locX: undefined, locY: undefined});
        this.locX = undefined;
        this.locY = undefined;
        this.swiped = false;
    }
    private onSwiped = (dir: string) => {
        if (this.props.onSwipe) {
            this.props.onSwipe(dir);
        }
    }
    private updatePosition = (callback: any) => {
        if (!this.container.current) return;
        if (this.swiped) {
            requestAnimationFrame(this.updatePosition);
        } else {
            this.container.current.style.transform = 'none';
        }
        const now = Date.now();
        const elapsed = now - this.startTime;
        const currentDir: SwipeDirection | undefined = this.swipeX < 0 ? SwipeDirection.Left : this.swipeX > 0 ? SwipeDirection.Right : undefined;

        if (currentDir !== undefined && elapsed > fpsInterval) {
            if (this.props.swipeDirs.indexOf(currentDir) !== -1) {
                this.container.current.style.transform = `translateX(${this.swipeX}px)`;

                if (this.bg.current) {
                    let arrowOpacity: string = "0";
                    let arrowTransform: string = "0";

                    const ratio: number = this.swipeX / (this.props.offsetWidth * this.props.threshold);
                    const offset: number = currentDir === SwipeDirection.Left ?  -1 * (this.props.offsetWidth * this.props.threshold) / 2 :(this.props.offsetWidth * this.props.threshold) / 2;

                    if (Math.abs(ratio) < 1 && Math.abs(ratio).toString() !== this.container.current.style.opacity) {
                        arrowOpacity = Math.abs(ratio).toString();
                        arrowTransform = ((1 - Math.abs(ratio)) * offset).toString();
                    } else if (Math.abs(ratio) >= 1) {
                        arrowOpacity = "1";
                        arrowTransform = "0";
                    }
                    this.bg.current.style.opacity = arrowOpacity;
                    this.bg.current.style.transform = `translateX(${arrowTransform}px)`;

               }
            }
            /*
            const opacity: number = Math.abs(this.swipeX) / 100;
            if (opacity < 1 && opacity.toString() !== this.container.current.style.opacity) {
                this.container.current.style.opacity = opacity.toString();
            }
            if (opacity >= 1) {
                this.container.current.style.opacity = "1";
            }
            */
            // this.setState({startTime: Date.now()});
            this.startTime = Date.now();
        }
    }
}

export default SwipeItem;