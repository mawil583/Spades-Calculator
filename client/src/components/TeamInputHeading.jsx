import React from 'react';
import { Heading } from '@chakra-ui/react';
import { team1Styles, team2Styles } from '../helpers/constants';

function TeamInputHeading({
  team1Total,
  team2Total,
  title,
  team1Name,
  team2Name,
}) {
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
        style={{
          position: 'absolute',
          marginRight: '50%',
          paddingTop: '15px',
          ...team1Styles,
        }}
      >
        {team1Total}
      </Heading>
      <Heading mt={'10px'} mb={'10px'} size={'md'}>
        {title}
      </Heading>
      <Heading
        size='lg'
        style={{
          position: 'absolute',
          marginLeft: '50%',
          paddingTop: '15px',
          ...team2Styles,
        }}
      >
        {team2Total}
      </Heading>
    </div>
  );
}

export default TeamInputHeading;
