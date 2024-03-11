import logo from './logo.svg';
import Navbar from './Navbar';
import Home from './Home.js'

function App() {
  const title = 'Welcome to the new blog';
  const likes = 1;
  const person = {name: 'yoshi', age:30};
  const link = 'http://www.google.com'
  return (
    <div className="App">
      <Navbar />
      <div className="content">
        <Home />
      </div>
    </div>
  );
}

export default App;