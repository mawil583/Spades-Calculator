import { useNavigate } from "react-router-dom";

import { GameScore, Rounds } from "../components/game";
import { Header } from "../components/ui";
import { UpdateNotification } from "../components";
import { useRedirectWhenFalsey } from "../helpers/utils/hooks";
import { useFeatureFlag } from "../helpers/utils/useFeatureFlag";
import { FEATURE_FLAGS } from "../helpers/utils/featureFlags";
import { getNames } from "../helpers/utils/storage";

function SpadesCalculator() {
  const navigate = useNavigate();
  const names = getNames();
  useRedirectWhenFalsey(names, navigate);
  const [useTableRoundUI] = useFeatureFlag(FEATURE_FLAGS.TABLE_ROUND_UI);

  return (
    <div className="App">
      <UpdateNotification />
      <Header />
      {names && (
        <>
          {useTableRoundUI ? null : <GameScore />}
          <Rounds />
        </>
      )}
    </div>
  );
}

export default SpadesCalculator;
