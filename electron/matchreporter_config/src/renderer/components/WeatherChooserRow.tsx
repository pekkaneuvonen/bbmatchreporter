import * as React from 'react';
import '../css/Reports.css';

import arrow from '../img/buttonindicator.png';
import chosenbg from '../img/chosenRow.png';
import inputField from '../img/weather_throwcircle.png';
import { WeatherDescription, WeatherType } from "../model/Weather";

interface IWeatherChooserProps {
    chosen: boolean;
    value: number;
    clickHandler: (e: any) => void;
}

class WeatherChooserRow extends React.Component<IWeatherChooserProps, {}> {
    private chosenStyle = {
        backgroundImage: `url(${chosenbg})`,
        backgroundPosition: 'center',
        backgroundRepeat  : 'no-repeat',
        // height: "39px",
    };
    private circleStyle = {
        backgroundImage: `url(${inputField})`,
        backgroundPosition: 'center',
        backgroundRepeat  : 'no-repeat',
        // height: "39px",
    };

    public render() {
        let throwSlot: string = "4-10";
        if (this.props.value === WeatherType.SwelteringHeat) {
            throwSlot = "2";
        } else if (this.props.value === WeatherType.VerySunny) {
            throwSlot = "3";
        } else if (this.props.value === WeatherType.PouringRain) {
            throwSlot = "11";
        } else if (this.props.value === WeatherType.Blizzard) {
            throwSlot = "12";
        }

        return <div className="weatherChooserRow" style={this.props.chosen ? this.chosenStyle : undefined} onClick={this.props.clickHandler}>
            <div style={this.circleStyle} className="weatherChooserRowThrow weatherChooserRowtext">
                {throwSlot}
            </div>
            <img src={arrow} className="weatherChooserRowArrow"/>
            <div className="weatherChooserRowtext weatherChooserRowDescription">{WeatherDescription[WeatherType[this.props.value]]}</div>
        </div>;
    }
}
export default WeatherChooserRow;
