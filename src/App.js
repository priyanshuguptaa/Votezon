import React from "react";
import { Switch, Route } from "react-router-dom";
import Admin from "./pages/Admin";
import User from "./pages/User";
import SpecificElection from "./pages/SpecificElection";
import Elections from "./pages/Elections";
import Home from "./pages/Home";
import CreateElections from "./pages/CreateElection";
import Voters from "./pages/Voters";

const App = () => {
  return (
    <Switch>
      <Route path="/" component={Home} exact />
      <Route path="/user/:address" component={User} />
      <Route path="/elections" component={Elections} exact />
      <Route path="/elections/:address" component={SpecificElection} />
      <Route path="/admin/:address" component={Admin} />
      <Route path="/voters/:address" component={Voters} />
      <Route path="/createnewelections" component={CreateElections} />
    </Switch>
  );
};

export default App;
