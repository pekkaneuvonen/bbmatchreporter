import * as React from 'react';

class ColoredLine extends React.Component<{colour: string, thickness: string, parentHeight: string}, {}> {
    /*
    public render() {
        return <hr
            style={{
                backgroundColor: this.props.colour,
                border: "none",
                color: this.props.colour,
                height: this.props.thickness,
                width: "100%"
            }}
        />
    }
    */
   public render() {
       const middleOfParent: number = parseInt(this.props.parentHeight, 10)/2;
       console.log("middleOfParent : " + middleOfParent);
       return <div style={{
                background: this.props.colour,
                height: this.props.thickness,
                position: "absolute",
                transform: `translateY(${middleOfParent}px)`,
                width: "320px",
                zIndex: 0,
            }}
        />;
   }
}
export default ColoredLine;