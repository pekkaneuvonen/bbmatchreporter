import * as React from 'react';

const titleStyle = {
    marginTop: "12px"
};

class Screentitle extends React.Component<{src: string}, {}> {
    public render() {
        return <div style={titleStyle}>
            <img src={this.props.src}/>
        </div>;
    };
}
export default Screentitle;