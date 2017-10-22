import {default as reducers} from './reducers';
import {default as logic} from './logic';
import {STATE_NAME} from './constants'

export * from './<%=FEATURE_NAME_LOWER_CASE%>-redux-abs'
export {STATE_NAME, reducers, logic};