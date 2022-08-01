import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import { Button, SimpleGrid, Center } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { useLocalStorage } from '../helpers/hooks';

import TeamNameInput from '../components/TeamNameInput';
import PlayerNameInput from '../components/PlayerNameInput';
import { defaultNames } from '../helpers/constants';

function NameForm() {
  const navigate = useNavigate();

  const [names, setNames] = useLocalStorage('names', defaultNames);

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
  return (
    <form onSubmit={formik.handleSubmit}>
      <SimpleGrid columns={2}>
        <TeamNameInput
          id='team1Name'
          teamName={formik.values.team1Name}
          handleChange={formik.handleChange}
        />
        <TeamNameInput
          id='team2Name'
          teamName={formik.values.team2Name}
          handleChange={formik.handleChange}
        />
        <PlayerNameInput
          id='t1p1Name'
          label='Player 1 Name'
          placeholder={`Who's dealing first?`}
          playerName={formik.values.t1p1Name}
          errors={formik.errors.t1p1Name}
          touched={formik.touched.t1p1Name}
          handleChange={formik.handleChange}
        />
        <PlayerNameInput
          id='t2p1Name'
          label='Player 1 Name'
          placeholder={`Who's left of dealer?`}
          playerName={formik.values.t2p1Name}
          errors={formik.errors.t2p1Name}
          touched={formik.touched.t2p1Name}
          handleChange={formik.handleChange}
        />
        <PlayerNameInput
          id='t1p2Name'
          label='Player 2 Name'
          playerName={formik.values.t1p2Name}
          errors={formik.errors.t1p2Name}
          touched={formik.touched.t1p2Name}
          handleChange={formik.handleChange}
        />
        <PlayerNameInput
          id='t2p2Name'
          label='Player 2 Name'
          playerName={formik.values.t2p2Name}
          errors={formik.errors.t2p2Name}
          touched={formik.touched.t2p2Name}
          handleChange={formik.handleChange}
        />
      </SimpleGrid>
      <Center>
        <Button
          size='md'
          height='40px'
          width='200px'
          border='2px'
          borderColor='green.500'
          type='submit'
        >
          Start
        </Button>
      </Center>
    </form>
  );
}

export default NameForm;