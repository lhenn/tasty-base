import { SIGNED_IN } from "./actions";

function userDataReducer(state={user: null}, action){
    console.log('userDataReducer being called with: ', action)
    switch(action.type) {
        case SIGNED_IN:
          return Object.assign({}, state, 
              {
                user: {...action.user}
               }); 
         default: 
           return state;
     }
}

export default userDataReducer;