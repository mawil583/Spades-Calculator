import React, { useEffect } from 'react';
import { useFormik } from 'formik';
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
// Note: Chakra UI applies a border-width: 0; to the <body>, so none of the input boxes are visible

import { useNavigate } from 'react-router-dom';
import 'core-js/es/promise';
import 'core-js/es/set';
import 'core-js/es/map';

import * as Yup from 'yup';
import '../App.css';

function Names() {
  const navigate = useNavigate();

  const hasLocalStorage = !!localStorage.getItem('initialValues');
  const initialVal = (fieldName) => {
    if (hasLocalStorage) {
      return JSON.parse(localStorage.getItem('initialValues'))[fieldName];
    }
    return '';
  };

  const validationSchema = Yup.object({
    t1p1Name: Yup.string().required('Required'),
    t2p1Name: Yup.string().required('Required'),
    t1p2Name: Yup.string().required('Required'),
    t2p2Name: Yup.string().required('Required'),
  });
  const formik = useFormik({
    initialValues: {
      team1Name: initialVal('team1Name') ? initialVal('team1Name') : 'Team 1',
      team2Name: initialVal('team2Name') ? initialVal('team2Name') : 'Team 2',
      t1p1Name: initialVal('t1p1Name'),
      t2p1Name: initialVal('t2p1Name'),
      t1p2Name: initialVal('t1p2Name'),
      t2p2Name: initialVal('t2p2Name'),
    },
    validationSchema,
    onSubmit: (values) => {
      sessionStorage.setItem('initialValues', JSON.stringify(values));
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
    if (hasLocalStorage) {
      localStorage.setItem('initialValues', JSON.stringify(formik.values));
    }
    setDefaultTeamNames(formik);
  }, [formik.values, hasLocalStorage, formik]);

  return (
    <div className='App'>
      <div className='App-inner'>
        <div className='team-board'>
          <div>
            <form onSubmit={formik.handleSubmit}>
              <SimpleGrid columns={2}>
                <div className='namesBox'>
                  <Editable
                    defaultValue={formik.values.team1Name}
                    mt={2}
                    fontSize='lg'
                    fontWeight='bold'
                    placeholder={formik.values.team1Name}
                  >
                    <Center>
                      <EditablePreview />
                      <EditableInput
                        type='text'
                        value={formik.values.team1Name}
                        onChange={formik.handleChange}
                        id='team1Name'
                        name='team1Name'
                      />
                    </Center>
                  </Editable>
                </div>
                <div className='namesContainer'>
                  <Editable
                    defaultValue={formik.values.team2Name}
                    mt={2}
                    fontSize='lg'
                    fontWeight='bold'
                    placeholder={formik.values.team2Name}
                  >
                    <Center>
                      <EditablePreview />
                      <EditableInput
                        value={formik.values.team2Name}
                        onChange={formik.handleChange}
                        id='team2Name'
                        name='team2Name'
                      />
                    </Center>
                  </Editable>
                </div>
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

export default Names;
