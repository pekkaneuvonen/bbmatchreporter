import * as fetch from 'electron-fetch';
import DLAsset from "../components/DLAsset";
import { openTempFileStream } from '../utils/downloader';
import { IDLEngine } from '../components/Home';
// const fetch = require('electron-fetch');

export default class ElectronFetchEngine implements IDLEngine {
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
        return new Promise((resolve: any, reject: any) => {
            var headers = new Headers({/*'Content-Type': 'application/octet-stream',*/
                "X-Prestool-Authorization": "Basic " + btoa("testadmin:testadmin")
            });
            const defaultOptions = {
                // These properties are part of the Fetch Standard
                method: 'GET',
                headers: headers,        // request headers. format is the identical to that accepted by the Headers constructor (see below)
                body: null,         // request body. can be null, a string, a Buffer, a Blob, or a Node.js Readable stream
                /*
                redirect: 'follow', // (/!\ only works when running on Node.js) set to `manual` to extract redirect headers, `error` to reject redirect
             
                // The following properties are electron-fetch extensions
                follow: 20,         // (/!\ only works when running on Node.js) maximum redirect count. 0 to not follow redirect
                timeout: 0,         // req/res timeout in ms, it resets on redirect. 0 to disable (OS limit applies)
                size: 0,            // maximum response body size in bytes. 0 to disable
                session: session.defaultSession, // (/!\ only works when running on Electron) Electron Session object.,
                useElectronNet: true, // When running on Electron, defaults to true. On Node.js, defaults to false and cannot be set to true.
                user: undefined,    // When running on Electron behind an authenticated HTTP proxy, username to use to authenticate
                password: undefined // When running on Electron behind an authenticated HTTP proxy, password to use to authenticate
                */
            }
            fetch(asset.url, defaultOptions)
            .then((response: any) => {
                if (response.body == null) {
                    console.log('No response body');
                    this.downloadComplete();
                    reject(asset);
                }
                openTempFileStream(asset.localDirPath, asset.uid)
                .then((responseObject: {tempFileStream: any, finalFilePath: string}) => {
                    // const dest = fs.createWriteStream('./octocat.png')
                    response.body.on('data', (chunk: any) => {
                        console.log("chunk ", chunk.length);
                    });
                    response.body.pipe(responseObject.tempFileStream);
                });
            })
        });
    }
/*
    private streamToPromise (stream, dataHandler) {
        return new Promise((resolve, reject) => {
          stream.on('data', (...args) => {
            Promise.resolve()
              .then(() => dataHandler(...args))
              .catch(reject)
          })
          stream.on('end', resolve)
          stream.on('error', reject)
        })
    }
*/
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
