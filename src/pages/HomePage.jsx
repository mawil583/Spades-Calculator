

import '../App.css';
import { NameForm } from '../components/forms';
import { ScoreSetting, UIModeSetting } from '../components/game';
import { DownloadButton } from '../components/ui';
import { UpdateNotification } from '../components';

function HomePage() {
  return (
    <div className="App">
      <UpdateNotification />
      <NameForm />
      <ScoreSetting />
      <UIModeSetting />
      <DownloadButton />
    </div>
  );
}

export default HomePage;
