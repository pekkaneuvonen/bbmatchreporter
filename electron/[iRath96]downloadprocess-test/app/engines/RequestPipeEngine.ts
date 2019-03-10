import DLAsset from "../components/DLAsset";
import { testAuthorizationHeader } from '../utils/downloader';
import { remote } from "electron";
import * as path from 'path';
import * as fs from 'fs';
// const http = require('http');
import { IDLEngine } from '../components/Home';

const request = require('request');


export default class RequestPipeEngine implements IDLEngine {
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

/*
    private writeToFile(asset: DLAsset, loadResponse: any): Promise<any> {
        return new Promise((resolve: any, reject: any) => {
            const appdatapath: string = remote.app.getPath("appData");
            const currentDirPath: string = path.join(appdatapath, asset.localFilePath);
            fs.access(currentDirPath, fs.constants.F_OK | fs.constants.W_OK, (error: any) => {
                if (error) {
                    if (error.code === "ENOENT") {
                        console.log(`${currentDirPath} 'does not exist'}`);
                    } else {
                        console.log(`${currentDirPath} 'is read-only'}`);
                        reject(asset);
                    }
                }
            });

            const finalFilePath: string = path.join(currentDirPath, asset.uid);
            const tempFilePath: string = finalFilePath + "_temp";
            const tempfile = fs.createWriteStream(tempFilePath);
            tempfile.on("open", () => {
                // var file = fs.createWriteStream(asset.localFilePath);
                console.log("File TO " + tempfile.path);
                // file.write(loadResponse);
                // file.end();
                resolve();
            })
        })
    }
*/
    public downloadFile = (asset: DLAsset) => {
        this.downloading = true;
        return new Promise((resolve: any, reject: any) => {
            let received_bytes: number = 0;
            let total_bytes: number = 0;
            var req = request({
                method: 'GET',
                uri: asset.url,
                requestHeaders: testAuthorizationHeader()
            });
/*
            openTempFileStream(asset.localDirPath, asset.uid)
            .then((responseObject: {tempFileStream: any, finalFilePath: string}) => {
                console.log("file stream opened " + responseObject.tempFileStream, responseObject.finalFilePath);
            }, (currentDirPath: string) => {
                console.log("file stream failed to open " + currentDirPath, asset.localDirPath);
            })
*/
            const appdatapath: string = remote.app.getPath("appData");
            const currentDirPath: string = path.join(appdatapath, asset.localDirPath);
            fs.access(currentDirPath, fs.constants.F_OK | fs.constants.W_OK, (error: any) => {
                if (error) {
                    if (error.code === "ENOENT") {
                        console.log(`${currentDirPath} 'does not exist'}`);
                    } else {
                        console.log(`${currentDirPath} 'is read-only'}`);
                        reject(asset);
                    }
                }
            });

            const finalFilePath: string = path.join(currentDirPath, asset.uid);
            const tempFilePath: string = finalFilePath + "_temp";
            const tempfile = fs.createWriteStream(tempFilePath);
            tempfile.on("open", () => {
                // console.log("temp file open ", tempfile.path);

                // req.pipe(tempfile);
        
                req.on('response', ( data: any ) => {
                    // console.log("response : ", data)
                    // Change the total bytes value to get progress later.
                    total_bytes = parseInt(data.headers['content-length' ]);
                });

                req.on('data', (chunk: any) => {
                    if (this.canceled) {
                        //console.log("req.on('data') canceled")
                        this.downloadComplete();
                        req.abort();
                        tempfile.end();
                        resolve(asset);
                    } else if (this.paused) {
                        req.pause();
                    } else {
                        // console.log("data : ", chunk)
                        var bufferStore = tempfile.write(chunk);
                        if (bufferStore === false) {
                            req.pause();
                        }
                        // Update the received bytes
                        received_bytes += chunk.length;
                        const percentage: number = received_bytes / total_bytes;
                        asset.DLprogress = percentage;
                        if (this.dlProgressCallback) {
                            this.dlProgressCallback(percentage);
                        }
                        if (this.totalProgressCallback) {
                            this.totalProgressCallback(chunk.length);
                        }
                    }
                });
                req.onerror = (error: any) => {
                    console.log("error : ", error)
                    this.downloadComplete();
                    req.abort();
                    tempfile.end();
                    reject(asset);
                }
                req.on('end', () => {
                    console.log("end : ")
                    this.downloadComplete();
                    tempfile.end();
                    fs.renameSync(tempfile.path, finalFilePath);
                    resolve(asset);
                });

                tempfile.on('drain', () => {
                    if (!this.paused) {
                        req.resume();
                    }
                })
            });
            // request.requestHeaders.push(header);
        });
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