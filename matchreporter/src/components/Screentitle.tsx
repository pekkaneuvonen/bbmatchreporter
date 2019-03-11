import * as React from 'react';

const titleStyle = {
    marginTop: "16px",
    zIndex: 1,
};

class Screentitle extends React.Component<{src: string}, {}> {
    public render() {
        return <div style={titleStyle}>
            <img src={this.props.src}/>
        </div>;
    };
}
export default Screentitle;