import React from 'react';
import { YellowBox } from 'react-native';
import Routes from './routes';

YellowBox.ignoreWarnings([
  'Unrecognized WebSocket',
  'Debugger and device times have drifted by more than 60s.'
]);

const App = () => {
  return (
    <Routes />
  );
};

export default App;
