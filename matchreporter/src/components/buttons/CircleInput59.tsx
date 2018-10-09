import * as React from 'react';

import '../../css/App.css';
import bg from '../../img/circles/propcircle_generated_59.png';
import { Kvalue } from '../../types/Kvalue';

interface ICircleValueProps {
    value: string;
    valueChangeHandler: (value: Kvalue) => void;
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
        const rawValue: string = event.target.value;
        const splitValue: string[] = rawValue.split("k");
        let numericValue: number = parseInt(splitValue[0], 10);
        if (numericValue !== 0 && splitValue.length > 1) {
            numericValue *= 1000;
        }
        const kValue: Kvalue = new Kvalue(numericValue);
        this.props.valueChangeHandler(kValue);
        this.setState({ value: kValue });
    }
}
export default CircleInput59;