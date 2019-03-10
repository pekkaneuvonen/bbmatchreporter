import * as React from 'react';
import DLAsset from './DLAsset';

let styles = require('./Home.scss');

interface IDLrowProps {
    asset: DLAsset,
}
interface IDLrowState {
    DLprogress: number,
    writeProgress: number,
}
export default class DLrow extends React.Component <IDLrowProps, IDLrowState> {
    private assetDownloadSlotSize: number = 200;

    constructor(props:any) {
        super(props);
        this.state = {
            DLprogress: 0,
            writeProgress: 0,
        }

        this.props.asset.dlProgressCallback = (DLprogress: number) => {
            this.setState({DLprogress: DLprogress})
        }
    }
    render() {
        return (
            <div className={styles.dlrow}>
                <div className={styles.dlrowType}>[{this.props.asset.type}]</div>
                <div className={styles.dlrowUid}>{this.props.asset.uid}</div>
                <div className={styles.dlrowEngine}>[{this.props.asset.engine}]</div>
                <div className={styles.assetContainer}>
                    <div className={styles.assetDownloadProgress} style={{width: `${this.state.DLprogress * this.assetDownloadSlotSize}px`}}/>
                </div>
            </div>
        )
    }
}