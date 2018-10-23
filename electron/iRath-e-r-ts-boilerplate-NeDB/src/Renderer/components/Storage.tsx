import * as React from "react";
import { Link } from "react-router-dom";
import { remote } from "electron";
import * as path from 'path';
// import { Datastore } from 'nedb';

const Datastore = require('nedb');
const styles = require("./Storage.css");
const fs = require("fs");

const servercacheDir: string = "Electron_testapp_dummytemp_cachedir/Local Store/cache/server/";
const servercacheDB: string = "Electron_testapp_dummytemp_cachedir/Local Store/cache/db/servercache.sqlite";


const presUids: string[] = [
    "presentation_92d1a5d0-825a-11e7-a6cd-fcaa149af436_3",
    "presentation_8482cd30-2221-11e8-9251-c82a140da4fe_10",
    "presentation_27902ff0-f463-11e7-b75f-60f81dcb0978_5",
    "presentation_84192c10-e18d-11e7-9eb9-c82a140da4fe_13",
    "presentation_c054ba20-af76-11e8-98b7-c8bcc8e6d3f5_9",
];

export default class Storage extends React.Component<{}, {currentPresIndex: number, currentPresTitle: string, currentPresData: string}> {
    constructor(props: any) {
        super(props);
        this.state = {
            currentPresIndex: 0,
            currentPresTitle: "presentation title",
            currentPresData: "presentation xml content.",
        };
    }
    public loaddata = (presIndex: number) => {
        const uid: string = presUids[presIndex];
        const appdatapath: string = remote.app.getPath("appData");
        const currentprespath: string = path.join(appdatapath, servercacheDir + uid);
        // Synchronous read
        // const data = fs.readFileSync(currentprespath);
        // console.log("Synchronous read: " + data.toString());
        
        // Asynchronous read
        fs.readFile(currentprespath, (error: any, data: any) => {
            if (error) {
                console.log("error");
                this.setState({currentPresData: error.toString()});
            }
            this.setState({currentPresIndex: presIndex, currentPresData: data.toString()});
        });
    }
    public componentDidMount() {
        this.loaddata(0);
    }

  render() {
    return (
      <div>
        <div className={styles.backButton} data-tid="backButton">
          <Link to="/">
            <i className="fa fa-arrow-left fa-3x" />
          </Link>
        </div>
        <div className={styles.datafield}>
            <div className={styles.datatitle}>{this.state.currentPresIndex + ": " + this.state.currentPresTitle}</div>
            <textarea className={styles.datacontent} value={this.state.currentPresData} onChange={this.onChange}/>
        </div>
        <div className={styles.btnGroup}>
          <button className={styles.btn} onClick={this.prevPlease} data-tclass="btn">
            <i className="fa fa-arrow-left" />
          </button>
          <button className={styles.btn} onClick={this.nextPlease} data-tclass="btn">
            <i className="fa fa-arrow-right" />
          </button>
          <button
            className={[styles.btn, styles.txtbtn].join(" ")}
            onClick={this.save}
            >
            Save
          </button>
        </div>
      </div>
    );
  }
    private nextPlease = () => {
        let nextIndex: number = this.state.currentPresIndex+1;
        if (this.state.currentPresIndex >= presUids.length - 1) {
            nextIndex = 0;
        }
        if (nextIndex !== this.state.currentPresIndex) {
            this.loaddata(nextIndex);
        }
    }
    private prevPlease = () => {
        let prevIndex: number = this.state.currentPresIndex-1;
        if (this.state.currentPresIndex <= 0) {
            prevIndex = presUids.length - 1;
        }
        if (prevIndex !== this.state.currentPresIndex) {
            this.loaddata(prevIndex);
        }
    }
    private onChange = (event: any) => {
        this.setState({currentPresData: event.target.value})
    }
    private save = () => {
        const appdatapath: string = remote.app.getPath("appData");
        const currentprespath: string = path.join(appdatapath, servercacheDir + presUids[this.state.currentPresIndex]);
        const data = fs.readFileSync(currentprespath);
        // string comparison ??
        if (data !== this.state.currentPresData) {
            fs.writeFile(currentprespath, this.state.currentPresData, (error: any) => {
                if (error){
                    alert("An error ocurred creating the file "+ error.message)
                }
            });
        }

        const db = new Datastore({ filename: servercacheDB });
        db.loadDatabase((error: any) => {  
            console.log("error : ", error);
        });
        console.log("NeDB : ", db);
    }
}
