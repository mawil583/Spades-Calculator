import React from 'react';
import 'core-js/es/promise';
import 'core-js/es/set';
import 'core-js/es/map';

import '../App.css';
import { NameForm } from '../components/forms';
import { ScoreSetting } from '../components/game';
import { DownloadButton } from '../components/ui';
import { UpdateNotification } from '../components';

function HomePage() {
  return (
    <div className="App">
      <UpdateNotification />
      <NameForm />
      <ScoreSetting />
      <DownloadButton />
    </div>
  );
}

export default HomePage;
