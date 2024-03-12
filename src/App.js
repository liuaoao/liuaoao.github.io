import logo from './logo.svg';
import Navbar from './Navbar';
import Home from './Home.js'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Create from './create.js'
import BlogDetails from './BlogDetails.js';
import NotFound from './NotFound.js';

function App() {
  const title = 'Welcome to the new blog';
  const likes = 1;
  const person = {name: 'yoshi', age:30};
  const link = 'http://www.google.com'
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="content">
          {/* <Home /> */}
          <Switch>
            {/* 主页的路由 */}
            <Route exact path="/">
              <Home />
            </Route>
            <Route path="/create">
              <Create />
            </Route>
            <Route path="/blogs/:id">
              <BlogDetails />
            </Route>
            <Route path="*">
              <NotFound />
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
