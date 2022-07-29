import React from 'react';
import 'core-js/es/promise';
import 'core-js/es/set';
import 'core-js/es/map';

import '../App.css';
import NameForm from '../components/NameForm';

function LandingPage() {
  return (
    <div className='App'>
      <NameForm />
    </div>
  );
}

export default LandingPage;
