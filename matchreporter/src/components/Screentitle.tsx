import * as React from 'react';

class Screentitle extends React.Component<{src: string}, {}> {
    public render() {
        return <div className="screenTitle">
            <img src={this.props.src}/>
        </div>;
    };
}
export default Screentitle;