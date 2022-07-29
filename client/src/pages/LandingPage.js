import React, { useEffect } from 'react';
import { useFormik } from 'formik';
// Note: Chakra UI applies a border-width: 0; to the <body>, so none of the input boxes are visible
import {
  Button,
  SimpleGrid,
  Center,
  Input,
  Editable,
  EditableInput,
  EditablePreview,
  FormControl,
  FormErrorMessage,
  FormLabel,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import 'core-js/es/promise';
import 'core-js/es/set';
import 'core-js/es/map';

import * as Yup from 'yup';
import '../App.css';
import { useLocalStorage } from '../helpers/hooks';
import TeamName from '../components/TeamName';

function LandingPage() {
  const navigate = useNavigate();

  const [names, setNames] = useLocalStorage('names', {
    t1p1Name: '',
    t1p2Name: '',
    t2p1Name: '',
    t2p2Name: '',
    team1Name: 'Team 1',
    team2Name: 'Team 2',
  });

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
    <div className='App'>
      <div className='App-inner'>
        <div className='team-board'>
          <div>
            <form onSubmit={formik.handleSubmit}>
              <SimpleGrid columns={2}>
                <TeamName
                  teamName={formik.values.team1Name}
                  handleChange={formik.handleChange}
                />
                <TeamName
                  teamName={formik.values.team2Name}
                  handleChange={formik.handleChange}
                />
                <div className='namesContainer'>
                  <FormControl
                    isInvalid={
                      formik.errors.t1p1Name && formik.touched.t1p1Name
                    }
                  >
                    <FormLabel
                      style={{ paddingLeft: '5px' }}
                      htmlFor='t1p1Name'
                    >
                      Player 1 Name
                    </FormLabel>
                    <Input
                      px={1}
                      placeholder={`Who's dealing first?`}
                      type='text'
                      value={formik.values.t1p1Name}
                      onChange={formik.handleChange}
                      id='t1p1Name'
                      name='t1p1Name'
                    />
                    {formik.errors.t1p1Name && formik.touched.t1p1Name ? (
                      <FormErrorMessage>
                        {formik.errors.t1p1Name}
                      </FormErrorMessage>
                    ) : null}
                  </FormControl>
                </div>

                <div className='namesContainer'>
                  <FormControl
                    isInvalid={
                      formik.errors.t2p1Name && formik.touched.t2p1Name
                    }
                  >
                    <FormLabel
                      style={{ paddingLeft: '5px' }}
                      htmlFor='t2p1Name'
                    >
                      Player 1 Name
                    </FormLabel>
                    <Input
                      px={1}
                      placeholder={`Who's left of dealer?`}
                      value={formik.values.t2p1Name}
                      onChange={formik.handleChange}
                      id='t2p1Name'
                      name='t2p1Name'
                    />
                    {formik.errors.t2p1Name && formik.touched.t2p1Name ? (
                      <FormErrorMessage>
                        {formik.errors.t2p1Name}
                      </FormErrorMessage>
                    ) : null}
                  </FormControl>
                </div>
                <div className='namesContainer'>
                  <FormControl
                    isInvalid={
                      formik.errors.t1p2Name && formik.touched.t1p2Name
                    }
                  >
                    <FormLabel
                      style={{ paddingLeft: '5px' }}
                      htmlFor='t1p2Name'
                    >
                      Player 2 Name
                    </FormLabel>
                    <Input
                      px={1}
                      value={formik.values.t1p2Name}
                      onChange={formik.handleChange}
                      id='t1p2Name'
                      name='t1p2Name'
                    />
                    {formik.errors.t1p2Name && formik.touched.t1p2Name ? (
                      <FormErrorMessage>
                        {formik.errors.t1p2Name}
                      </FormErrorMessage>
                    ) : null}
                  </FormControl>
                </div>

                <div className='namesContainer'>
                  <FormControl
                    isInvalid={
                      formik.errors.t2p2Name && formik.touched.t2p2Name
                    }
                  >
                    <FormLabel
                      style={{ paddingLeft: '5px' }}
                      htmlFor='t2p2Name'
                    >
                      Player 2 Name
                    </FormLabel>
                    <Input
                      px={1}
                      value={formik.values.t2p2Name}
                      onChange={formik.handleChange}
                      id='t2p2Name'
                      name='t2p2Name'
                    />
                    {formik.errors.t2p2Name && formik.touched.t2p2Name ? (
                      <FormErrorMessage>
                        {formik.errors.t2p2Name}
                      </FormErrorMessage>
                    ) : null}
                  </FormControl>
                </div>
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
