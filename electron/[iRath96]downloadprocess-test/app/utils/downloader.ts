import { remote } from "electron";
import * as path from 'path';
import * as fs from 'fs';

export interface HttpHeaderEntry {
    header: string;
    content: string;
}
  /**
   * Async mode read XML.
   */
  export const getXML = ( url: string ): any => {
    return new Promise((resolve: any, reject: any) => {
        const xhr: XMLHttpRequest = newConfigRequest(url);
        xhr.onload = () => {
            if (xhr.status === 200) {
                // ok
                resolve( xhr.responseXML );
            } else {
                // error, get extended error code if available
                let extendedErrorCode = null;
                const errorElement = xhr.responseXML ? xhr.responseXML.getElementsByTagName( "error" ) : null;
                if (errorElement != null && errorElement.length > 0) {
                    extendedErrorCode = errorElement[0].getAttribute( "errorCode" );
                }
                reject( {errCode:xhr.status, extendedCode:extendedErrorCode} );
            }
        };
        xhr.send();
    });
  }
  export const newConfigRequest = (url: string): XMLHttpRequest => {
    const xhr = new XMLHttpRequest();
    xhr.open( "GET", url );
    xhr.setRequestHeader( "X-Diago-Webclient-Version", "1" );

    const httpHeaders: HttpHeaderEntry[] = [
        testAuthorizationHeader()
    ];
    if (httpHeaders) {
      for (let hx of Array.from(httpHeaders)) {
        xhr.setRequestHeader( hx.header, hx.content );
      }
    }
    if (url.includes("clientapi") || url.includes("renderapi")) {
      xhr.withCredentials = true;
    }
    return xhr;
  }
  export const testAuthorizationHeader = (): HttpHeaderEntry => {
    return { header: "X-Prestool-Authorization", content: "Basic " + btoa("testadmin:testadmin") };
    /* from air client
    return new URLRequestHeader("X-Prestool-Authorization", "Basic "+Base64.encode64String(clientUser.username+":"+clientUser.sessionPassword));
    */
  }


    export const openTempFileStream = (dirPath: string, assetUid: string) => {
        return new Promise((resolve: any, reject: any) => {
            const appdatapath: string = remote.app.getPath("appData");
            const currentDirPath: string = path.join(appdatapath, dirPath);
            checkDirectory(currentDirPath)
            .then(() => {
                // console.log("local dir ready ", currentDirPath);
                const finalPath: string = path.join(currentDirPath, assetUid);
                const tempFilePath: string = finalPath + "_temp";
                const tempfile = fs.createWriteStream(tempFilePath);
                tempfile.on("open", () => {
                    // console.log("stream to tempfile open ");
                    resolve({tempFileStream: tempfile, finalFilePath: finalPath});
                })
            }, () => {
                reject(currentDirPath);
            })
        });
    }
    //function will check if a directory exists, and create it if it doesn't
    export const  checkDirectory = (directory: string) => {
        return new Promise((resolve: any, reject: any) => {
            fs.access(directory, fs.constants.F_OK | fs.constants.W_OK, (error: any) => {
                if (error) {
                    if (error.code === "ENOENT") {
                        console.log(`${directory} 'does not exist'}`);
                        fs.mkdir(directory, resolve);
                    } else {
                        console.log(`${directory} 'is read-only'}`);
                        reject();
                    }
                } else {
                    resolve();
                }
            });
        })
    }
