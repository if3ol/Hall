import {ReactComponent as Clock} from '../images/clock-fill.svg'
import {ReactComponent as Fire} from '../images/fire.svg'

function PostFilter({filterType, toggle}) {
    return (
      <div className="navUnder">
        <div className={filterType==='recent' ? 'activeFilterButton' : 'recentBtn'} onClick={() => toggle('recent')}>
            <Clock className="iconUnderNav"/>
            <p>Recent</p>
        </div>
        <div className={filterType==='popular' ? 'activeFilterButton' : 'popularBtn'} onClick={() => toggle('popular')}>
            <Fire className="iconUnderNav"/>
            <p>Popular</p>
        </div>
      </div>
    );
  }
  
  export default PostFilter;
  