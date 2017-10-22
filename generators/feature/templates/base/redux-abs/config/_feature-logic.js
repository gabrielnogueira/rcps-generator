import { createLogic } from 'redux-logic';
import {actionTypes} from '../constants'
import {<%=FEATURE_NAME%>Service} from '../services';

//EXAMPLE =>

// const fetchRecipesLogic = createLogic({
//     type: actionTypes.SEARCH_RECIPES, // only apply this logic to this type
//     cancelType: actionTypes.CANCELL_SEARCH_RECIPES, // cancel on this type
//     latest: true, // only take latest
//     process({ getState, action }, dispatch, done) {
//       const {ingredients, page} = action.payload;
//       RecipeService.getByIngredients(ingredients, page)
//         .then(resp => dispatch({ type: page === 1 ? actionTypes.SET_SEARCHED_RECIPES : actionTypes.SET_SEARCHED_MORE_RECIPES,
//                                  payload: resp }))
//         .catch(err => {
//                console.error(err); // log since could be render err
//                dispatch({ type: actionTypes.SEARCH_RECIPES_ERROR, payload: err,
//                           error: true })
//         })
//         .then(() => done());
//     }
//   });
  
//   export default [
//     fetchRecipesLogic
//   ];