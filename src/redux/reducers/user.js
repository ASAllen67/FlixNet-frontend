const initialState = {
  backlog: {},
  completed: {},
  favorites: {},
}

export default (state = initialState, action) => {
  switch (action.type) {

    case "SET_USER": {
    	return { ...action.user }
    }

    case "ADD_ENTRY": {
      const entries = state[action.eType]
      const newEntries = {...entries, [action.id]: action.entry}
      return {...state, [action.eType]: newEntries}
    }

    case "DEL_ENTRY": {
      const entries = state[action.eType]
      delete entries[action.id]
      return {...state, [action.eType]: {...entries}}
    }

    default:  { return state }
  }
}
