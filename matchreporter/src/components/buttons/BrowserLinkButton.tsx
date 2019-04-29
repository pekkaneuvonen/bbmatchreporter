import * as React from 'react';
import { Link } from 'react-router-dom';

interface IButtonBaseProps {
    to: string;
    imageSource: string;
    elementRef: any;
}

class BrowserLinkButton extends React.Component<IButtonBaseProps, {}> {
    
    public render() {
        return <Link innerRef={this.props.elementRef} to={this.props.to} className="buttonStyles">
            <img className="img_centered" src={this.props.imageSource}/>
        </Link>
    };
}
export default BrowserLinkButton;