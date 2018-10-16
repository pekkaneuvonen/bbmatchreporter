import * as React from 'react';

import '../../css/App.css';
import bg from '../../img/circles/propcircle_generated_59.png';

interface ICircleValueProps {
    value: string;
    valueChangeHandler: (value: string) => void;
}

class CircleInput59 extends React.Component<ICircleValueProps, {}> {
    
    public render() {
        const circleStyle = {
            backgroundImage: `url(${bg})`,
            backgroundPosition: 'center',
            backgroundRepeat  : 'no-repeat'
        };
        return <div className="circlecontainer">
            <input style={circleStyle} className="circlecontainer59_input" value={this.props.value} onChange={this.handleValueChange}/>
        </div>;
    };
    private handleValueChange = (event: any) => {
        this.props.valueChangeHandler(event.target.value);
    }
}
export default CircleInput59;