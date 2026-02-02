import { useEffect, useState, useContext } from 'react';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { useLocalStorage } from '../../helpers/utils/hooks';
import { GlobalContext } from '../../helpers/context/GlobalContext';
import WarningModal from '../modals/WarningModal';
import { isNotDefaultValue } from '../../helpers/math/spadesMath';

import { TeamNameInput, PlayerNameInput } from './';
import { Button, SimpleGrid, Center } from '../ui';
import { initialNames } from '../../helpers/utils/constants';
import { useFeatureFlag } from '../../helpers/utils/useFeatureFlag';
import { FEATURE_FLAGS } from '../../helpers/utils/featureFlags';

function NameForm() {
  const navigate = useNavigate();
  const { roundHistory, currentRound } = useContext(GlobalContext);
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
  const [names, setNames] = useLocalStorage('names', initialNames);

  const hasGameData =
    roundHistory.length > 0 ||
    (currentRound &&
      (Object.values(currentRound.team1BidsAndActuals).some(
        isNotDefaultValue
      ) ||
        Object.values(currentRound.team2BidsAndActuals).some(
          isNotDefaultValue
        ))) ||
    JSON.stringify(names) !== JSON.stringify(initialNames);



  const handleNewGame = () => {
    setIsWarningModalOpen(true);
  };

  const validationSchema = Yup.object({
    t1p1Name: Yup.string().required('Required'),
    t2p1Name: Yup.string().required('Required'),
    t1p2Name: Yup.string().required('Required'),
    t2p2Name: Yup.string().required('Required'),
  });

  const formik = useFormik({
    initialValues: {
      team1Name: names.team1Name,
      team2Name: names.team2Name,
      t1p1Name: names.t1p1Name,
      t2p1Name: names.t2p1Name,
      t1p2Name: names.t1p2Name,
      t2p2Name: names.t2p2Name,
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      setNames(values);
      navigate('/spades-calculator', { state: values });
    },
  });

  const setDefaultTeamNames = (formik) => {
    if (formik.values.team1Name === '') {
      formik.setFieldValue('team1Name', 'Team 1');
    }
    if (formik.values.team2Name === '') {
      formik.setFieldValue('team2Name', 'Team 2');
    }
  };

  // put this into hooks.
  useEffect(() => {
    function setLocalStorageTeamNames(formVals) {
      if (formVals.team1Name === '') {
        setNames({ ...names, team1Name: 'Team 1' });
      }
      if (formVals.team2Name === '') {
        setNames({ ...names, team2Name: 'Team 2' });
      }
    }
    setLocalStorageTeamNames(formik.values);
    setDefaultTeamNames(formik);
  }, [formik.values, formik, setNames, names]);

  const [useTableRoundUI] = useFeatureFlag(FEATURE_FLAGS.TABLE_ROUND_UI);

  return (
    <>
      <WarningModal
        isOpen={isWarningModalOpen}
        setIsModalOpen={setIsWarningModalOpen}
        resetNames={setNames}
      />
      <form onSubmit={formik.handleSubmit}>
      <SimpleGrid columns={2} mb={6} gap={2} mt={8}>
        <TeamNameInput
          id="team1Name"
          teamClassName="team1"
          teamName={formik.values.team1Name}
          handleChange={formik.handleChange}
        />
        <TeamNameInput
          id="team2Name"
          teamClassName="team2"
          teamName={formik.values.team2Name}
          handleChange={formik.handleChange}
        />
      </SimpleGrid>

      <SimpleGrid columns={2} gap={2}>
        <PlayerNameInput
          teamClassName="team1"
          teamName={formik.values.team1Name}
          id="t1p1Name"
          label="You"
          placeholder="Enter Your Name"
          playerName={formik.values.t1p1Name}
          errors={formik.errors.t1p1Name}
          touched={formik.touched.t1p1Name}
          handleChange={formik.handleChange}
        />
        <PlayerNameInput
          teamName={formik.values.team2Name}
          id="t2p1Name"
          teamClassName="team2"
          label="Left Opponent"
          placeholder="Left Opponent"
          playerName={formik.values.t2p1Name}
          errors={formik.errors.t2p1Name}
          touched={formik.touched.t2p1Name}
          handleChange={formik.handleChange}
        />
        <PlayerNameInput
          teamClassName="team1"
          id="t1p2Name"
          label="Partner"
          placeholder=""
          teamName={formik.values.team1Name}
          playerName={formik.values.t1p2Name}
          errors={formik.errors.t1p2Name}
          touched={formik.touched.t1p2Name}
          handleChange={formik.handleChange}
        />
        <PlayerNameInput
          teamName={formik.values.team2Name}
          teamClassName="team2"
          id="t2p2Name"
          label="Right Opponent"
          placeholder=""
          playerName={formik.values.t2p2Name}
          errors={formik.errors.t2p2Name}
          touched={formik.touched.t2p2Name}
          handleChange={formik.handleChange}
        />
      </SimpleGrid>
        {hasGameData ? (
          <SimpleGrid columns={2} gap={6} my={8}>
            <Button
              variant="outline"
              size="lg"
              height="40px"
              width="auto"
              minW="120px"
              px={4}
              justifySelf="center"
              onClick={handleNewGame}
              data-cy="newGameButton"
              type="button"
              fontSize="lg"
            >
              New Game
            </Button>
            <Button
              variant="outline"
              size="lg"
              height="40px"
              width="auto"
              minW="120px"
              px={4}
              justifySelf="center"
              data-cy="continueButton"
              type="submit"
              fontSize="lg"
            >
              Continue
            </Button>
          </SimpleGrid>
        ) : (
          <Center>
            <Button
              variant="outline"
              size="lg"
              height="40px"
              width="200px"
              type="submit"
              my={8}
              data-cy="startButton"
              fontSize="lg"
            >
              Start
            </Button>
          </Center>
        )}
    </form>
    </>
  );
}

export default NameForm;
