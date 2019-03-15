import * as React from 'react';
import '../css/Reports.css';

import bg from '../img/prematch/weatherRow.png';
import chosenbg from '../img/prematch/weatherRow_chosen.png';
import { WeatherType, WeatherDescription } from "../model/Weather";

interface IWeatherChooserProps {
    chosen: boolean;
    value: number;
    clickHandler: (e: any) => void;
}

class WeatherChooserRow extends React.Component<IWeatherChooserProps, {}> {
    private bgStyle = {
        backgroundImage: `url(${bg})`,
        backgroundPosition: 'center',
        backgroundRepeat  : 'no-repeat',
        // height: "39px",
    };
    private bgChosenStyle = {
        backgroundImage: `url(${chosenbg})`,
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
        return <div className="weatherChooserRow" style={this.props.chosen ? this.bgChosenStyle : this.bgStyle} onClick={this.props.clickHandler}>
            <div className="weatherChooserSlot">
                <div className={this.props.chosen ? "weatherChooserContent weatherChooserValue value_input" : "weatherChooserContent weatherChooserValue"}>
                    {throwSlot}
                </div>
                <div className={this.props.chosen ? "weatherChooserContent weatherChooserDescription value_input" : "weatherChooserContent weatherChooserDescription"}>{WeatherDescription[this.props.value]}</div>
            </div>
        </div>;
    }
}
export default WeatherChooserRow;
