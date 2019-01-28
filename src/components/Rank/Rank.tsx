import * as React from 'react';

interface RankProps {
  name: string,
  entries: number
}

const Rank = ({name, entries}: RankProps) => (
  <div> Welcome {name}! You have searched for {entries} images </div>
);

export default Rank;