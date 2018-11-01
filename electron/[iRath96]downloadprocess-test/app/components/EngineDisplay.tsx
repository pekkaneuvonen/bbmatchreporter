import * as React from 'react';
import { IDLEngine } from './Home';
import FetchStreamEngine from '../engines/FetchStreamEngine';
import RequestPipeEngine from '../engines/RequestPipeEngine';

let styles = require('./Home.scss');

interface IDLengineProps {
    displayedEngine: IDLEngine,
}
interface IDLengineState {
    DLprogress: number,
    WriteProgress: number,
}
export default class DLrow extends React.Component <IDLengineProps, IDLengineState> {
    private engineDownloadSlotSize: number = 260;
    // private engineWriteSlotSize: number = 130;

    constructor(props:any) {
        super(props);
        this.state = {
            DLprogress: 0,
            WriteProgress: 0,
        }
    }
    public componentDidUpdate(): void {
        if (this.props.displayedEngine instanceof FetchStreamEngine
        || this.props.displayedEngine instanceof RequestPipeEngine) {
            this.props.displayedEngine.dlProgressCallback = (DLprogress: number) => {
                this.setState({DLprogress: DLprogress});
            }
        }
        /*
        this.props.displayedEngine.writeProgressCallback = (WriteProgress: number) => {
            this.setState({WriteProgress: WriteProgress});
        }
        */
    }
    render() {
        return (
            <div className={styles.engineCase}>
              <div className={styles.engineDownloadProgress} style={{width: `${this.state.DLprogress * this.engineDownloadSlotSize}px`}}/>
            </div>
        )
    }
    /*
        <div className={styles.engineWriteProgress} style={{width: `${this.state.WriteProgress * this.engineWriteSlotSize}px`}}/>
    */
}