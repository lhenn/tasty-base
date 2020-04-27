export const SIGNED_IN = 'SIGNED_IN' // action types

const signedIn = (user) => {
  return(
    {     
        type: SIGNED_IN,
        user    // action payload
     }
  )  
}

export default signedIn;