
import { useNavigate } from 'react-router-dom';

import { GameScore, Rounds } from '../components/game';
import { Navbar, UpdateNotification } from '../components';
import { useRedirectWhenFalsey } from '../helpers/utils/hooks';
import { useFeatureFlag } from '../helpers/utils/useFeatureFlag';
import { FEATURE_FLAGS } from '../helpers/utils/featureFlags';

function SpadesCalculator() {
  const navigate = useNavigate();
  const names = JSON.parse(localStorage.getItem('names'));
  useRedirectWhenFalsey(names, navigate);
  const [useTableRoundUI] = useFeatureFlag(FEATURE_FLAGS.TABLE_ROUND_UI);

  return (
    <div className="App">
      <UpdateNotification />
      {names && (
        <>
          {useTableRoundUI ? <Navbar /> : <GameScore />}
          <Rounds />
        </>
      )}
    </div>
  );
}

export default SpadesCalculator;
