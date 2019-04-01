
import * as ActionTypes from './ActionTypes';

export const updateComponentState = (data) => ({
    type: ActionTypes.COMPONENTSTATE_UPDATE,
    payload: data
})