import {bindActionCreators} from 'redux';
import {connect as reduxConnect} from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { getAll, getUiState } from './selectors';

import <%=FEATURE_NAME%>ActionCreator from './actions';

export function mapDispatchToProps(dispatch){
    return bindActionCreators(<%=FEATURE_NAME%>ActionCreator, dispatch);
}

export function mapStateToProps(state, props) {
    return createStructuredSelector({all:getAll, uiState:getUiState})
}

export function connect(Component){
    return reduxConnect(mapStateToProps, mapDispatchToProps)(Component);
}



