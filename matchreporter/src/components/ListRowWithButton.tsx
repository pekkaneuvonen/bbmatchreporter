import * as React from 'react';
import '../css/Reports.css';

export interface IRowProps {
    title: string;
  }
  
class ListRowWithButton extends React.Component<{title: string, onClickHandler: () => void}, {}> {

    public render() {
        return (
            <button className="reportRow" onClick={this.props.onClickHandler}>{this.props.title}</button>
        );
    }
}
export default ListRowWithButton;