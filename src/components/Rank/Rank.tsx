import * as React from 'react';
import './Rank.scss';

interface RankProps {
  name: string,
  entries: number
}

const Rank = ({name, entries}: RankProps) => (
  <div> 
    <div className="welcome-title">Welcome {name} </div>
    <div className="welcome-text">You have searched for {entries} images</div>
  </div>
);

export default Rank;