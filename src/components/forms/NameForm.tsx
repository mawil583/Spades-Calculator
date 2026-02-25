import { useEffect, useState, useContext } from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useLocalStorage } from "../../helpers/utils/hooks";
import { GlobalContext } from "../../helpers/context/GlobalContext";
import WarningModal from "../modals/WarningModal";
import {
  hasPlayerNamesEntered,
  hasRoundProgress,
} from "../../helpers/math/spadesMath";

import { TeamNameInput, PlayerNameInput } from "./";
import { Button, SimpleGrid, Center } from "../ui";
import { initialNames } from "../../helpers/utils/constants";
import type { Names } from "../../types";

function NameForm() {
  const navigate = useNavigate();
  const { roundHistory, currentRound } = useContext(GlobalContext);
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
  const [names, setNames] = useLocalStorage<Names>("names", initialNames);

  const hasGameData =
    hasPlayerNamesEntered(names) ||
    hasRoundProgress(roundHistory, currentRound);

  const handleNewGame = () => {
    setIsWarningModalOpen(true);
  };

  const validationSchema = Yup.object({
    t1p1Name: Yup.string().required("Required"),
    t2p1Name: Yup.string().required("Required"),
    t1p2Name: Yup.string().required("Required"),
    t2p2Name: Yup.string().required("Required"),
  });

  const formik = useFormik<Names>({
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
      navigate("/spades-calculator", { state: values });
    },
  });

  const { values, setFieldValue } = formik;
  const { team1Name, team2Name } = values;

  useEffect(() => {
    if (team1Name === "") {
      setFieldValue("team1Name", "Team 1");
    }
    if (team2Name === "") {
      setFieldValue("team2Name", "Team 2");
    }
  }, [team1Name, team2Name, setFieldValue]);
  return (
    <>
      <WarningModal
        isOpen={isWarningModalOpen}
        setIsModalOpen={setIsWarningModalOpen}
        resetNames={setNames}
      />
      <form onSubmit={formik.handleSubmit}>
        {/* Team 1 Section */}
        <Center mt={8} mb={2}>
          <TeamNameInput
            id="team1Name"
            teamClassName="team1"
            teamName={formik.values.team1Name}
            handleChange={formik.handleChange}
          />
        </Center>
        <SimpleGrid columns={2} gap={2}>
          <PlayerNameInput
            teamClassName="team1"
            id="t1p1Name"
            label="You"
            placeholder="Enter Your Name"
            playerName={formik.values.t1p1Name}
            errors={formik.errors.t1p1Name}
            touched={formik.touched.t1p1Name}
            handleChange={formik.handleChange}
          />
          <PlayerNameInput
            teamClassName="team1"
            id="t1p2Name"
            label="Partner"
            placeholder=""
            playerName={formik.values.t1p2Name}
            errors={formik.errors.t1p2Name}
            touched={formik.touched.t1p2Name}
            handleChange={formik.handleChange}
          />
        </SimpleGrid>

        {/* Team 2 Section */}
        <Center mt={6} mb={2}>
          <TeamNameInput
            id="team2Name"
            teamClassName="team2"
            teamName={formik.values.team2Name}
            handleChange={formik.handleChange}
          />
        </Center>
        <SimpleGrid columns={2} gap={2}>
          <PlayerNameInput
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
