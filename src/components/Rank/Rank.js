import React from 'react';

const Rank = ({ name, entries }) => (
    <div>
      {`Welcome ${name}! You have searched for ${entries} images`}
    </div>
);

export default Rank;
