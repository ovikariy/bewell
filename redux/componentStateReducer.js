import * as ActionTypes from './ActionTypes';

export const componentState = (state = {
    components: {}
}, action) => {
    switch (action.type) {
        case ActionTypes.COMPONENTSTATE_UPDATE:
            const updatedComponents = Object.assign({}, state.components, { [action.payload.componentType]: action.payload.componentData });
            return { ...state, components: updatedComponents }
        default:
            return state;
    }
}