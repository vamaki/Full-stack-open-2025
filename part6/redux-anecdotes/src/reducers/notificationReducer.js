import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: '',
  reducers: {
    setMessage(state, action) {
      return state = action.payload
    },
  }
})

export const { setMessage } = notificationSlice.actions

export const setNotification = (notification, timeout) => {
  return dispatch => {
    dispatch(setMessage(notification))
    setTimeout(() => dispatch(setMessage('')), timeout*1000)
  }
}

export default notificationSlice.reducer