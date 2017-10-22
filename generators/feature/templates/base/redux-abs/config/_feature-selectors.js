// import {createSelector} from 'reselect'; 

import {STATE_NAME} from '../constants'

export const getAll = state => state[STATE_NAME];

export const getUiState = state => state[STATE_NAME].uiState;
