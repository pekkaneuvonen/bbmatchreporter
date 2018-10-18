import * as React from "react";
import { Link } from "react-router-dom";
const styles = require("./Home.css");

export default class Home extends React.Component<{}> {
  render() {
    return (
      <div>
        <div className={styles.container} data-tid="container">
          <h2>Home</h2>
          <Link to="/storage">to Storage</Link>
        </div>
      </div>
    );
  }
}
