import DLAsset from "../components/DLAsset";
import { openTempFileStream } from '../utils/downloader';
import * as fs from 'fs';
// const http = require('http');
import { IDLEngine } from '../components/Home';


export default class FetchStreamEngine implements IDLEngine {
    public name: string;
    public downloading: boolean;
    public canceled: boolean;
    public paused: boolean;
    public dlProgressCallback: (DLprogress: number) => void;
    public totalProgressCallback: (addedBytes: number) => void;

    constructor (name: number, progressTracker: (addedBytes: number) => void) {
        this.name = name.toString();
        this.downloading = false;
        this.totalProgressCallback = progressTracker;
    }
    public downloadFile(asset: DLAsset): Promise<any> {
        this.downloading = true;
        return new Promise((resolve, reject) => {
            // Add initial values
            var headers = new Headers({'Content-Type': 'application/octet-stream',
                "X-Prestool-Authorization": "Basic " + btoa("testadmin:testadmin")
            });
            var request = new Request(asset.url, {
                method: 'GET', 
                headers: headers,
            });
            
            // Now use it!
            fetch(request)
            .then((response: any) => {
                // console.log("fetch response : ", response)
                if (response.body == null) {
                    console.log('No response body');
                    this.downloadComplete();
                    reject(asset);
                }

                const reader = response.body.getReader();
                // console.log("reader registered ", reader);

                openTempFileStream(asset.localDirPath, asset.uid)
                .then((responseObject: {tempFileStream: any, finalFilePath: string}) => {
                    // console.log("writer registered ", responseObject.tempFileStream);

                    this.streamWithProgress(asset.size, reader, responseObject.tempFileStream, (percentage: number, addedBytes: number) => {
                        asset.DLprogress = percentage;
                        if (this.dlProgressCallback) {
                            this.dlProgressCallback(percentage);
                        }
                        if (this.totalProgressCallback) {
                            this.totalProgressCallback(addedBytes);
                        }
                    })
                    .then(() => {
                        this.downloadComplete();
                        responseObject.tempFileStream.end();
                        fs.renameSync(responseObject.tempFileStream.path, responseObject.finalFilePath);
                        resolve(asset);
                    });

                    // response.body.pipe(tempFileStream);
                }, (currentDirPath: string) => {
                    console.log("file stream failed to open " + currentDirPath, asset.localDirPath);
                })
            });
        });
    }
    async streamWithProgress(length: number, reader: any, writer: any, progressCallback: (percentage: number, size: number) => void) {
        let bytesDone: number = 0;
      
        while (true) {
            const result = await reader.read();
            if (result.done) {
                // console.log("streamWithProgress done")
                if (progressCallback != null) {
                    progressCallback(100, bytesDone);
                }
                return;
            }
            if (this.canceled) {
                console.log("streamWithProgress canceled")
                return;
            }
            const chunk = result.value;
            if (chunk == null) {
                throw Error('Empty chunk received during download');
            } else {
                writer.write(Buffer.from(chunk));
                // writer.write(Buffer.from(chunk));
                if (progressCallback !== null) {
                    bytesDone += chunk.byteLength;
                    const percent: number = length === 0 ? 0 : (bytesDone / length);
                    progressCallback(percent, chunk.byteLength);
                }
            }
        }
      }
    pauseDownload = () => {
        this.paused = true;
    }
    continueDownload = () => {
        this.paused = false;
    }
    cancelDownload = () => {
        this.canceled = true;
    }
    downloadComplete(): void {
        this.downloading = false;
        // this.downloaded = 0;
    }
}