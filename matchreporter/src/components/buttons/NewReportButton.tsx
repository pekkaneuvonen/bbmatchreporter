import * as React from 'react';

interface INewRepButtonProps {
    onClickHandler: () => void;
    source: string;
}

class NewReportButton extends React.Component<INewRepButtonProps, {}> {
    
    public render() {
        return <button className="newReport_button" onClick={this.props.onClickHandler}>
            <img src={this.props.source}/>
        </button>;
    };
}
export default NewReportButton;