import {Link} from 'react-router-dom'
import NavBar from './NavBar';

function App() {
    return (
      <div>
        <NavBar />
        <Link to={'/'}>
            <button>Go Home!</button>
        </Link>
        <p>This is about!</p>
      </div>
    );
  }
  
  export default App;
  