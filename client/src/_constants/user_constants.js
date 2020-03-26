/*Contains the redux user action types that can be dispatched in 
the react application, async actions that perform http requests involve a request followed 
by a success or error response, so each of these three steps is represented by a redux action.*/

export const userConstants = {
  REGISTER_REQUEST: 'USERS_REGISTER_REQUEST',
  REGISTER_SUCCESS: 'USERS_REGISTER_SUCCESS',
  REGISTER_FAILURE: 'USERS_REGISTER_FAILURE',

  LOGIN_REQUEST: 'USERS_LOGIN_REQUEST',
  LOGIN_SUCCESS: 'USERS_LOGIN_SUCCESS',
  LOGIN_FAILURE: 'USERS_LOGIN_FAILURE',

  LOGOUT: 'USERS_LOGOUT',

  REFRESHTOKEN_REQUEST: 'USERS_REFRESHTOKEN_REQUEST',
  REFRESHTOKEN_SUCCESS: 'USERS_REFRESHTOKEN_SUCCESS',
  REFRESHTOKEN_FAILURE: 'USERS_REFRESHTOKEN_FAILURE',

  GETUSER_REQUEST: 'USERS_GETUSER_REQUEST',
  GETUSER_SUCCESS: 'USERS_GETUSER_SUCCESS',
  GETUSER_FAILURE: 'USERS_GETUSER_FAILURE',
  GETUSER_CLEAR: 'USERS_GETUSER_CLEAR'
};