// Code 3 : timerSlice.js

import { createSlice } from "@reduxjs/toolkit";

const timerSlice = createSlice({
    name: 'timer',
    initialState: {
        totalSeconds: 0, // Ajout de totalSeconds pour stocker le temps total
        secondsRemaining: 0
    },
    reducers: {
        lessSeconds: (state) => {
            state.secondsRemaining -= 1;
        },
        restartTimer: (state) => {
            state.secondsRemaining = state.totalSeconds; // Réinitialisation avec le temps total
        },
        setTotalSeconds: (state, action) => {
            state.totalSeconds = action.payload;
            state.secondsRemaining = action.payload; // Initialisation avec le temps total
        }
    }
});

export const { lessSeconds, restartTimer, setTotalSeconds } = timerSlice.actions;
export default timerSlice.reducer;
