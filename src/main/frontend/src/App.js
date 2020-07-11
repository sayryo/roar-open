import React from "react";
import { BrowserRouter, Route } from "react-router-dom";

import "../src/style/Reset.css";
import "../src/style/AppStyle.css";

import SidebarTop from "./components/SidebarTop";
import Sidebar from "./components/Sidebar";
import Top from "./components/Top";
import Home from "./components/Home";
import TeamCreate from "./components/TeamCreate";
import TeamSearch from "./components/TeamSearch";
import Chat from "./components/Chat";
import News from "./components/News";
import Profile from "./components/Profile";
import Setting from "./components/Setting";
import ProfileCreate from "./components/ProfileCreate";

import Auth from "./auth/Auth";
import { auth } from "./firebase/index";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      signedIn: false,
    };
  }

  componentDidMount = () => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          signedIn: true,
        });
      } else {
        this.setState({
          signedIn: false,
        });
      }
    });
  };

  render() {
    return (
      <BrowserRouter>
        <div className="App">
          {this.state.signedIn ? <Sidebar /> : <SidebarTop />}
          <div className="main">
            <Route exact path="/" component={Top} />
            <Route path="/TeamSearch" component={TeamSearch} />
            {/* 以下認証のみ */}
            <Auth>
              <Route path="/Home" component={Home} />
              <Route path="/TeamCreate" component={TeamCreate} />
              <Route path="/Chat" component={Chat} />
              <Route path="/News" component={News} />
              <Route path="/Profile" component={Profile} />
              <Route path="/ProfileCreate" component={ProfileCreate} />
              <Route path="/Setting" component={Setting} />
            </Auth>
          </div>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
