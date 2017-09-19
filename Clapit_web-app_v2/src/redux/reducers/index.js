import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import {reducer as reduxAsyncConnect} from 'redux-async-connect';
import { pagination } from 'violet-paginator';
import multireducer from 'multireducer';

import auth from '../modules/auth';
import counter from '../modules/counter';
import {reducer as form} from 'redux-form';
import info from '../modules/info';
import widgets from '../modules/widgets';
