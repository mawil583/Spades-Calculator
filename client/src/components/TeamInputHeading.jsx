import React from 'react';
import { Heading } from '@chakra-ui/react';

function TeamInputHeading({ team1Total, team2Total, title }) {
  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
      }}
    >
      <Heading
        size='lg'
        style={{ position: 'absolute', marginRight: '50%', top: '25px' }}
      >
        {team1Total}
      </Heading>
      <Heading mt={'20px'} mb={'10px'} size={'md'}>
        {title}
      </Heading>
      <Heading
        size='lg'
        style={{ position: 'absolute', marginLeft: '50%', top: '25px' }}
      >
        {team2Total}
      </Heading>
    </div>
  );
}

export default TeamInputHeading;
