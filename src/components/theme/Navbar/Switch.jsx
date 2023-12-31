import Icons from "components/common/Icons";
import DB from "helpers/db";
import React, { Component } from "react";

export default class Switch extends Component {
  constructor() {
    super();
    this.state = {
      isDark: DB.get("isDark"),
    };
  }

  UNSAFE_componentWillMount() {
    if (DB.get("isDark")) {
      document.getElementsByTagName("body")[0].classList.add("dark-mode");
    }
  }

  render() {
    return (
      <div className="menu-extras my-auto mx-3">
        <div className="menu-item">
          <input
            type="checkbox"
            className="checkbox"
            id="chk"
            onChange={() => {
              if (this.state.isDark) {
                DB.set("isDark", false);
                this.setState({ isDark: false });
                document
                  .getElementsByTagName("body")[0]
                  .classList.remove("dark-mode");
              } else {
                document
                  .getElementsByTagName("body")[0]
                  .classList.add("dark-mode");
                DB.set("isDark", true);
                this.setState({ isDark: true });
              }
            }}
            value={this.state.isDark}
            checked={this.state.isDark}
          />
          <label className="label" htmlFor="chk">
            <div className="ball d-flex">
              <Icons icon="moon" className="moon my-auto" />
              <Icons icon="sun" className="sun my-auto" />
            </div>
          </label>
        </div>
      </div>
    );
  }
}
