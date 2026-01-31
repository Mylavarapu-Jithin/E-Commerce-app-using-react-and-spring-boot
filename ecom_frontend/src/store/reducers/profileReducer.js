const initialState = {
   profile: {
    imageUrl: null,
  },
  profileIsLoading: null,
  profileErrorMessage: null
};   

const profileReducer = (state = initialState, action) => {   
  switch(action.type) {
    case "GET_USER_PROFILE":
      return {...state, profile: action.payload}; 

    case "PROFILE_FETCHING":
      return {...state, profileIsLoading: true};

    case "PROFILE_FETCHED":
      return {...state, profileIsLoading: false};

    case "PROFILE_FETCH_ERROR":
      return {...state, profileErrorMessage: action.payload, profileIsLoading: false};

    case "UPDATE_PROFILE_SUCCESS":
      return {
        ...state,
        profile: {
          ...state.profile,
          imageUrl: action.payload,
        },
        errorMessage: null,
      };

    case "DELETE_PROFILE_PICTURE":
      return {
        ...state,
        profile: {
          ...state.profile, imageUrl: null,
        }
      }; 
    
    default:
      return state;  
  }
}; 

export default profileReducer;