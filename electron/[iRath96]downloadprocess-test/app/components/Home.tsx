import * as React from 'react';
import RequestPipeEngine from '../engines/RequestPipeEngine';
import FetchStreamEngine from '../engines/FetchStreamEngine';
import ElectronFetchEngine from '../engines/ElectronFetchEngine';
import DLAsset from './DLAsset';
import DLrow from './DLrow';
import EngineDisplay from './EngineDisplay';
import { getXML } from '../utils/downloader';
// import { remote } from "electron";
import TimerDisplay from './TimerDisplay';


import { convertedToMegabyteString } from '../utils/converters';

let styles = require('./Home.scss');

export interface IDLEngine {
  downloadFile: (asset: DLAsset) => Promise<any>,
  downloadComplete: () => void,
  canceled: boolean,
  downloading: boolean,
  name: string,
}

enum EngineType {
  RequestToPipe = 0,
  FetchWithStreamChunks,
  ElectronFetch,
}

enum EngineDescription {
  RequestToPipe = "Request-pipe",
  FetchWithStreamChunks = "Fetch-stream",
  ElectronFetch = "Electron-Fetch",
}

interface IEngineManageState {
  engineCount: number,
  engines: IDLEngine[],
  engineType: EngineType
  alldone: boolean,
  enginesOn: boolean,
  combinedSize: number,
  completedSize: number,
  progress: number,
  dlDir: string,
  running: boolean,
  assetListinfo: string,
  assetRowList: DLAsset[],
  timerOn: boolean,
  currentTime: string,
  resetTimer?: any
}

const APIBASEURL: string = "https://im-dev.prestool.com/"; // "https://im-dev.diago.global";

const defaultEngineCount: number = 1;
const maxEngineCount: number = 16;
const defaultDevDLDir: string = "Electron_testapp_dummytemp_cachedir/";

export default class Home extends React.Component <{}, IEngineManageState> {
  private assetIndex: number;

  public constructor(props: any) {
    super(props);
    this.state = {
      assetRowList: [],
      combinedSize: 0,
      completedSize: 0,
      progress: 0,
      engineCount: defaultEngineCount,
      engineType: EngineType.ElectronFetch,
      engines: [],
      enginesOn: false,
      alldone: false,
      dlDir: defaultDevDLDir,
      running: false,
      assetListinfo: "asset list here",
      timerOn: false,
      currentTime: "0:00:00",
    }
    
  } 
  public componentDidMount() {
    this.assetIndex = 0;
    this.getAssetList();
    this.resetEngines(this.state.engineType);
  }
  public componentDidUpdate(prevProps: any, prevState: any): void {
    if (!prevState.enginesOn && this.state.enginesOn) {
      for (let i = 0; i < this.state.engines.length; i++) {
        this.startNewEngineCycle(this.state.engines[i]);
      }
    }
  }
  public componentWillUnmount() {
    if (this.state.resetTimer) {
      clearInterval(this.state.resetTimer);
    }
  }
  render() {
    const subtitle: string = "Number of download engines: ";
    const dirfield: string = "current directory (relative to Application Support):";
    const loadedStyle: object = {width: `${this.state.progress * 100}%`}
    const assetListHeightModified: object = {height: `calc(100vh - ${this.getModifiedAssetListHeight(false)}px)`}

    return (
      <div>
        <div className={styles.titlebar}>
          <div className={styles.mainTitle}>Assetlist downloadtest:</div>
          <TimerDisplay ticking={this.state.timerOn} reseted={this.state.assetRowList.length < 1} timeService={this.timeTracker}/>
        </div>
        <div className={styles.container} data-tid="container">

          <div className={styles.rowwithbuttons}>
            <div className={styles.mediumData}>{subtitle}</div>
            <input className={[styles.mediumData, styles.inputCount].join(" ")} value={this.state.engineCount} maxLength={2} type="number" onChange={this.changeEngineCount}/>
            <button className={styles.btn} onClick={this.incrementEngineCount}>
              <i className="fa fa-plus" />
            </button>
            <button className={styles.btn} onClick={this.decrementEngineCount}>
              <i className="fa fa-minus" />
            </button>
            <div className={styles.engineChooser}>
              type: 
              <div className={styles.chooserButton} onClick={this.engineTypeChooser(EngineType.RequestToPipe)} style={{background: `${this.state.engineType !== EngineType.RequestToPipe ? "transparent" : "rgb(253, 173, 25)"}`}}>
                RequestToPipe
              </div>
              <div className={styles.chooserButton} onClick={this.engineTypeChooser(EngineType.FetchWithStreamChunks)} style={{background: `${this.state.engineType !== EngineType.FetchWithStreamChunks ? "transparent" : "rgb(253, 173, 25)"}`}}>
                FetchStream
              </div>
            </div>
          </div>
          
          <div className={styles.engineHall}>
            {this.state.engines.map((engine: IDLEngine, index: number) => {
              return <EngineDisplay key={index} displayedEngine={engine}/>
            })}
          </div>

          <div className={styles.mediumData}>{dirfield}</div>
          <input className={[styles.mediumData, styles.inputDir].join(" ")} value={this.state.dlDir} onChange={this.changeDLDir}/>
          
          <div className={styles.rowwithbuttons}>
            <div className={styles.smallData}>from : {APIBASEURL}</div>
            <button onClick={this.refreshAssetlistClicked}>Refresh asset list</button>
          </div>

          <div className={styles.smallData}>{this.state.assetListinfo}</div>
          <div className={styles.totalDownloadProgress}>
            <div className={styles.totalDLprogress} style={loadedStyle}/>
          </div>
          <div className={[styles.smallData, styles.assetList].join(" ")} style={assetListHeightModified}> 
            {this.state.assetRowList.map((asset: DLAsset, index: number) => {
                return <DLrow key={index} asset={asset}/>
              })
            }
          </div>
        </div>
        <div className={styles.footerButtons}>
          {this.state.enginesOn ?
            <button className={styles.startButton} onClick={this.stopDownloadClicked}>Stop Download</button>
          :
            this.state.alldone ?
            <button className={styles.startButton} onClick={this.resetAllClicked}>Reset</button>
            :
            <button className={styles.startButton} onClick={this.startDownloadClicked}>Start Your engines</button>
          }
        </div>
        {this.state.alldone ? this.completionPrompt() : null}
      </div>
    );
  }

  private timeTracker = (time: string) => {
    this.setState({currentTime: time})
  }
  private completionPrompt = () => {
    const totalFilesize: string = convertedToMegabyteString(this.state.completedSize);
    const reverseMappedTypeName: any = EngineType[this.state.engineType];
    const engines: string = `• ${this.state.engines.length} x "${EngineDescription[reverseMappedTypeName]}" engine`;

    return <div className={styles.alldone}>
      <div className={styles.alldoneTitle}>Download complete?</div>
      <div className={styles.alldoneSmall}>{`• Total downloaded size: ${totalFilesize}`}</div>
      <div className={styles.alldoneSmall}>{engines}</div>
      <div className={styles.alldoneTime}>{`Elapsed time ${this.state.currentTime}`}</div>
      <div className={styles.alldoneReset} onClick={this.hardReset}>reset</div>
    </div>
  }
  private getModifiedAssetListHeight = (showResetButton: boolean): number => {
    // const dimensions: Electron.Size = this.getScreenDimensions();
    // console.log("screen dimensions : ", dimensions);
    let headerbaseReduction: number = 200;
    const engineHeight: number = 22;
    const headerExtraHeight: number = Math.ceil(this.state.engineCount / 2) * engineHeight;
    const footerbuttonHeight: number = 22;
    const footerHeight: number = footerbuttonHeight + (showResetButton && !this.state.alldone ? footerbuttonHeight : 0);
    headerbaseReduction += headerExtraHeight + footerHeight;
    // let assetlistHeight: number = dimensions.height - headerbaseReduction;
    // assetlistHeight -= headerExtraHeight + footerHeight;
    // return assetlistHeight;

    return headerbaseReduction;
  }
  /*
  private getScreenDimensions = (): Electron.Size => {
    try {
      var screenElectron = remote.screen;
      var mainScreen = screenElectron.getPrimaryDisplay();
      return mainScreen.size;
    } catch (error) {
      console.log("getScreen dimensions errored : " + error);
      return {height: 500, width: 500};
    }
  }
  */
  /**
   * POPULATING ASSET LIST
   * First calls the clientapi/connect and if response status is OK makes another request to clientapi/assets/list.
   * After receiving the assets-xml in the response constructs the asset array and sets it as the state.assetRowList.
   */
  private getAssetList(): void {
    const connecturl: string = APIBASEURL + "clientapi/connect?create_session=true";
    getXML( connecturl )
    .then((xml: Document) => {
        //
        // success
        //
        const status = xml.getElementsByTagName( "status" );
        if (status != null && status.length > 0 && status[0].textContent === "OK") {
          const assetsurl: string = APIBASEURL + "clientapi/assets/list";

          getXML( assetsurl )
          .then((xml: XMLDocument) => {
            // console.log("assets xml : ", xml)
            let assetstring: string = "ASSET LIST : ";
            const totalFilesizeAttribute = xml.getElementsByTagName( "assets" )[0].getAttribute( "totalFilesize" );
            const totalDownloadSize: number = totalFilesizeAttribute ? parseInt(totalFilesizeAttribute, 10) : 0;
            const totalFilesize: string = convertedToMegabyteString(totalDownloadSize);
            assetstring = assetstring.concat(" ( total Downloadable File Size: " + totalFilesize + ") " + totalDownloadSize);

            const newAssetList: DLAsset[] = [];
            const assets = xml.getElementsByTagName( "assets" )[0].children;
            for (let a: number = 0; a < assets.length; a++) {
              const assetXML = assets[a];
              const uid = assetXML.getAttribute("uid");
              const type = assetXML.localName;
              const rawSize = assetXML.getAttribute( "filesize" );
              const version = assetXML.getAttribute( "version" );
              if (uid && type && rawSize) {
                const size: number = rawSize ? parseInt(rawSize, 10) : 0;
                const url: string = APIBASEURL + "clientapi" + "/" + type + "/" + uid +
                (version !== null ? "?version=" + version : "");
                /*
                const appdatapath: string = remote.app.getPath("appData");
                const currentDirPath: string = path.join(appdatapath, defaultDevDLDir);
                fs.access(currentDirPath, fs.constants.F_OK | fs.constants.W_OK, (error: any) => {
                    if (error) {
                        if (error.code === "ENOENT") {
                            console.log(`${currentDirPath} 'does not exist'}`);
                        } else {
                            console.log(`${currentDirPath} 'is read-only'}`);
                        }
                    }
                });
    
                const filePath: string = path.join(currentDirPath, uid);
                */
                const asset: DLAsset = new DLAsset(uid, type, size, url, defaultDevDLDir);
                // console.log("new asset [" + a + "] : ", asset)
                newAssetList.push(asset);
              }
            }
            this.setState({assetRowList: newAssetList, assetListinfo: assetstring, combinedSize: totalDownloadSize});
          })
          .catch((errCode: number, extendedCode: string) => {
            //
            // cannot connect --> redirect to login on 403
            console.log("errCode :", errCode);
            this.setState({assetListinfo: errCode.toString() + ":" + extendedCode})
          })

        } else {
          const xmlString: string = new XMLSerializer().serializeToString(xml);
          this.setState({assetListinfo: xmlString});
        }
      })
    .catch((errCode: number, extendedCode: string) => {
        //
        // cannot connect --> redirect to login on 403
        console.log("errCode :", errCode);
        this.setState({assetListinfo: errCode.toString() + ":" + extendedCode});
    });
  }


  /**
   * STARTING THE DOWNLOAD.
   * 'startDownloadClicked' and 'buildEngines' are accessible only when no engines already set in state.engines array.
   * 'startYourEngines' sets engines to state (if not already set) and 'ignites' the engines by calling startNewEngineCycle on each
   * 'startNewEngineCycle' assigns the received engine with the next available asset
   */
  private startDownloadClicked = (event: any) => {
    if (this.state.engines && this.state.engines.length > 0) {
      this.startYourEngines();
    }
  }
  private stopDownloadClicked = (event: any) => {
    console.log("STOP!")
    this.setState({enginesOn: false, alldone: true});
  }

  private buildEngines(newEngineCount?: number): Promise<any> {
    // create engines
    return new Promise((resolve, reject) => {
      let engines: IDLEngine[] = [];
      if (!newEngineCount) {
        newEngineCount = this.state.engineCount;
      }
      for(let i: number = 0; i < newEngineCount; i++) {
        let newEngine: IDLEngine;
        if (this.state.engineType === EngineType.RequestToPipe) {
          newEngine = new RequestPipeEngine(i, this.progressTracker);
        } else if (this.state.engineType === EngineType.FetchWithStreamChunks) {
          newEngine = new FetchStreamEngine(i, this.progressTracker);
        } else {
          newEngine = new ElectronFetchEngine(i, this.progressTracker);
        }
        engines.push(newEngine);
      }
      if (engines.length === 0) {
        reject("Zero engines requested.");
      } else {
        resolve(engines);
      }
    });
  }

  private hardReset = (event: any) => {
    this.state.engines.map((engine: IDLEngine) => {
      if (engine.downloading) {
        engine.canceled = true;
      }
    })
    this.setState({timerOn: false, resetTimer: setTimeout(this.resetAllClicked, 1000)});
  }

  private resetAllClicked = (event: any) => {
    this.assetIndex = 0;
    this.setState({engines: [], assetRowList: [], assetListinfo: "", combinedSize: 0, alldone: false, progress: 0});
    this.getAssetList();
    this.resetEngines(this.state.engineType);
  }
  private resetEngines = (type: EngineType, newEngineCount?: number) => {
    this.buildEngines(newEngineCount)
    .then((engines: IDLEngine[]) => {
      this.setState({engines: engines, engineCount: engines.length, engineType: type})
    });
  }
  /*
  private pauseDownloadClicked = (event: any) => {
    this.setState({enginesOn: false});
  }
  private continueDownloadClicked = (event: any) => {
    if (this.state.engines && this.state.engines.length > 0) {
      this.startYourEngines(this.state.engines);
    } else {
      this.startDownloadClicked(event);
    }
  }
*/
  private startYourEngines = () => {
    if (this.state.engines.length === 0) {
      this.buildEngines(this.state.engineCount)
      .then((engines: IDLEngine[]) => {
        this.setState({engines: engines, engineCount: engines.length, enginesOn: true, timerOn: true})
      });
    } else {
      this.setState({enginesOn: true, timerOn: true});
    }
  }


  private startNewEngineCycle(engine: IDLEngine): void {
    // console.log("startNewEngineCycle width [ " + engine.name + " ] downloading: " + engine.downloading);
    // console.log("this.state.enginesOn : " + this.state.enginesOn)
    // console.log("[ " + this.assetIndex + " < " + this.state.assetRowList.length + "]");

    if (this.state.enginesOn
    && this.assetIndex < this.state.assetRowList.length
    && !engine.downloading) {
      const asset: DLAsset = this.state.assetRowList[this.assetIndex];
      asset.engine = engine.name;
      this.assetIndex++;
      engine.downloadFile(asset)
      .then(
      (asset: DLAsset) => {
        // console.log("asset downloaded : " + asset.uid);
        this.progressTracker(asset.size);
        this.startNewEngineCycle(engine);
      },
      (asset: DLAsset) => {
        console.log("asset download errored : " + asset.uid);
        this.startNewEngineCycle(engine);
      }
      );
    } else if (this.assetIndex >= this.state.assetRowList.length || this.state.alldone) {
      this.checkForComplete();
    }
  }
  private checkForComplete = () => {
    const stillDownloading: boolean = this.state.engines.some((engine: IDLEngine) => {
      console.log(" engine.downloading [" + engine.name + "] " + engine.downloading);
      return engine.downloading;
    });
    if (!stillDownloading) {
      console.log("ALLDONE!")
      this.setState({enginesOn: false, timerOn: false, alldone: true})
    }
  }

  private progressTracker = (addedSize: number) => {
    const completed: number = this.state.completedSize + addedSize;
    const newProgress: number = completed / this.state.combinedSize;
    this.setState({completedSize: completed, progress: newProgress})
  }

  private refreshAssetlistClicked = (event: any) => {
    this.getAssetList();
  }




  private changeEngineCount = (event: any) => {
    this.confirmEngineCountChange(parseInt(event.target.value, 10));
  }
  private incrementEngineCount = (event: any) => {
    this.confirmEngineCountChange(this.state.engineCount+1);
  }
  private decrementEngineCount = (event: any) => {
    this.confirmEngineCountChange(this.state.engineCount-1);
  }
  private confirmEngineCountChange(count: number): void {
    if (!this.state.enginesOn) {
      if (count > maxEngineCount) {
        count = maxEngineCount;
      }
      this.resetEngines(this.state.engineType, count);
    }
  }

  private engineTypeChooser = (type: EngineType) => {
    return (event: any) => {
      // this.setState({engineType: type});
      if (!this.state.enginesOn) {
        this.resetEngines(type);
      }
    }
  }
  private changeDLDir = (event: any) => {
    console.log("changeDLDir");
    // this.setState({dlDir: event.target.value})
  }
}
