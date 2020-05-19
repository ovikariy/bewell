import * as SecurityHelpers from '../modules/SecurityHelpers';
import * as GenericActions from './operationActionCreators';
import { loadAuthData } from './authActionCreators';

export const initialize = () => (dispatch) => {
    /* this should be called once on intitial app launch */
    dispatch(GenericActions.operationProcessing());
    SecurityHelpers.initialize()
        .then(() => {
            dispatch(loadAuthData());
        })
        .catch(error => {
            console.log(error);
            dispatch(GenericActions.operationFailed(error.message));
            dispatch(GenericActions.operationCleared());
        })
}




