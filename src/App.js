import './App.css';
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import Posts from "./components/Posts";
import PostDetails from "./components/PostDetails";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    return (
        <Router>
            <Switch>
                <Route exact path="/" component={Posts}/>
                <Route path="/details/:id" component={PostDetails}/>
                <Route path="*" component={Posts}/>
            </Switch>
        </Router>
        // <Posts/>
    );
}

export default App;
