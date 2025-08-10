import React from 'react';

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
