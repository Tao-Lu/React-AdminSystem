import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import memoryUtils from './utils/memoryUtils';
import storageUtils from './utils/storageUtils';

// assign the user from local storage to memory
memoryUtils.user = storageUtils.getUser();

// eslint-disable-next-line react/jsx-filename-extension
ReactDOM.render(<App />, document.getElementById('root'));
