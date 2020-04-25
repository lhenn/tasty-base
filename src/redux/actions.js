export const ADD_USER = 'ADD_USER' // action types

export function addUser(user) {
  return(
    {     
        type: ADD_USER,
        user: 'test'     // action payload
     }
  )
     
}