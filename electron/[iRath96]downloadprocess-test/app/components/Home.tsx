import * as React from 'react';
import DLEngine from '../storage/DLEngine';

let styles = require('./Home.scss');

interface IEngineManageState {
  engineCount: number,
  dlDir: string,
  running: boolean,
  assetList: string,
}
interface HttpHeaderEntry {
  header: string;
  content: string;
}
const APIBASEURL: string = "https://im-dev.prestool.com/"; // "https://im-dev.diago.global";

let engines: DLEngine[] = [];
const defaultEngineCount: number = 4;
const maxEngineCount: number = 16;
const defaultDevDLDir: string = "Electron_testapp_dummytemp_cachedir/Local Store/cache/server/";

export default class Home extends React.Component <{}, IEngineManageState> {

  public constructor(props: any) {
    super(props);
    this.state = {
      engineCount: defaultEngineCount,
      dlDir: defaultDevDLDir,
      running: false,
      assetList: "asset list here",
    }
  } 
  public componentDidMount() {
    this.getAssetList();
  }
  render() {
    const subtitle: string = "Number of download engines: ";
    const dirfield: string = "current directory (relative to Application Support):";

    return (
      <div>
        <div className={styles.container} data-tid="container">
          <h2>Assetlist downloadtest:</h2>
          <div className={styles.rowwithbuttons}>
            <div className={styles.mediumData}>{subtitle}</div>
            <input className={[styles.mediumData, styles.inputCount].join(" ")} value={this.state.engineCount} maxLength={2} type="number" onChange={this.changeEngineCount}/>
            <button className={styles.btn} onClick={this.incrementEngineCount}>
              <i className="fa fa-plus" />
            </button>
            <button className={styles.btn} onClick={this.decrementEngineCount}>
              <i className="fa fa-minus" />
            </button>
          </div>
          <div className={styles.mediumData}>{dirfield}</div>
          <input className={[styles.mediumData, styles.inputDir].join(" ")} value={this.state.dlDir} onChange={this.changeDLDir}/>
          <div className={styles.rowwithbuttons}>
            <div className={styles.smallData}>from : {APIBASEURL}</div>
            <button onClick={this.refreshAssetlistClicked}>Refresh asset list</button>
          </div>
          <div className={[styles.smallData, styles.assetList].join(" ")}>{this.state.assetList}</div>
          <button onClick={this.startDownloadClicked}>Start Download</button>
        </div>
      </div>
    );
  }
  private buildEngines(): void {
    // create engines
    engines = [];
    for(let i: number = 0; i < this.state.engineCount; i++) {
      engines.push(new DLEngine());
    }
  }
  private getAssetList(): void {
    const connecturl: string = APIBASEURL + "clientapi/connect?create_session=true";

    const httpHeaders: HttpHeaderEntry[] = [
      this.testAuthorizationHeader()
      // { header: "Authorization", content: "Basic dGVzdGFkbWluOnRlc3RhZG1pbg==" },
    ];
    this.getXML( connecturl, httpHeaders )
    .then((xml: Document) => {
        //
        // success
        //
        const status = xml.getElementsByTagName( "status" );
        if (status != null && status.length > 0 && status[0].textContent === "OK") {
          console.log("xml status OK");
          const assetsurl: string = APIBASEURL + "clientapi//assets/list";

          this.getXML( assetsurl, httpHeaders )
          .then((xml: XMLDocument) => {
            console.log("assets xml : ", xml)
            let assetstring: string = "asset list";

            const totalFilesizeAttribute: string = this.convertedToMegabyteString(xml.getElementsByTagName( "assets" )[0].getAttribute( "totalFilesize" ));

            assetstring = assetstring.concat(" ( total Downloadable File Size: " + totalFilesizeAttribute + ")");

            const assets = xml.getElementsByTagName( "assets" )[0].children;
            for (let a: number = 0; a < assets.length; a++) {
              const asset = assets[a];
              const uid = asset.getAttribute("uid");
              const type = asset.localName;
              const size: string = this.convertedToMegabyteString(asset.getAttribute( "filesize" ));

              assetstring = assetstring.concat("\n * " + type + " -- " + uid + " -- " + size);
            }
            this.setState({assetList: assetstring});
          })
          .catch((errCode: number, extendedCode: string) => {
            //
            // cannot connect --> redirect to login on 403
            console.log("errCode :", errCode);
            this.setState({assetList: errCode.toString() + ":" + extendedCode})
          })

        } else {
          const xmlString: string = new XMLSerializer().serializeToString(xml);
          this.setState({assetList: xmlString});
        }
      })
    .catch((errCode: number, extendedCode: string) => {
        //
        // cannot connect --> redirect to login on 403
        console.log("errCode :", errCode);
        this.setState({assetList: errCode.toString() + ":" + extendedCode});
    });
  }



  private startDownloadClicked = (event: any) => {
    console.log("not this would start the download process...");
    this.buildEngines();
  }
  private refreshAssetlistClicked = (event: any) => {
    this.getAssetList();
  }




  private changeEngineCount = (event: any) => {
    console.log("changeEngineCount from [" + this.state.engineCount + "] to [" + event.target.value + "]");
    this.confirmEngineCountChange(parseInt(event.target.value, 10));
  }
  private incrementEngineCount = (event: any) => {
    console.log("incrementEngineCount");
    this.confirmEngineCountChange(this.state.engineCount+1);
  }
  private decrementEngineCount = (event: any) => {
    console.log("decrementEngineCount");
    this.confirmEngineCountChange(this.state.engineCount-1);
  }
  private confirmEngineCountChange(count: number): void {
    if (count > maxEngineCount) {
      count = maxEngineCount;
    }
    this.setState({engineCount: count});
  }

  private changeDLDir = (event: any) => {
    console.log("changeDLDir");
    // this.setState({dlDir: event.target.value})
  }






  /**
   * Async mode read XML.
   */
  private getXML( url: string, httpHeaders?: HttpHeaderEntry[] ): any {
    return new Promise((resolve: any, reject: any) => {
      const xhr = new XMLHttpRequest();
      xhr.open( "GET", url );
      xhr.setRequestHeader( "X-Diago-Webclient-Version", "1" );
  
      if (httpHeaders) {
        for (let hx of Array.from(httpHeaders)) {
          xhr.setRequestHeader( hx.header, hx.content );
        }
      }
      if (url.includes("clientapi") || url.includes("renderapi")) {
        xhr.withCredentials = true;
      }
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

  private testAuthorizationHeader(): HttpHeaderEntry {
    return { header: "X-Prestool-Authorization", content: "Basic " + btoa("testadmin:testadmin") };
    /* from air client
    return new URLRequestHeader("X-Prestool-Authorization", "Basic "+Base64.encode64String(clientUser.username+":"+clientUser.sessionPassword));
    */
  }


  private convertedToMegabyteString(filesize: string | null): string {
    let filesizeInMB: string = " file size unknown";
    if (filesize) {
      const size: number = parseInt(filesize);  
      if (size > (1024*1024)) {
        filesizeInMB = String(Math.round(size/(1024*1024))) + "MB";
      } else {
        filesizeInMB = String(Number(size/(1024*1024)).toFixed(1)) + "MB";
      }
    }
    return filesizeInMB;
  }
}
