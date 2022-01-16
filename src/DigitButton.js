import { ACTIONS } from "./App"

// this is the digit button. When clicked dispatch is called with the digit the user clicked

export function DigitButton({ dispatch, digit }) {
    return <button 
    onClick={
        () => dispatch({
            type: ACTIONS.ADD_DIGIT, payload: {digit} 
        })
    }>
        {digit}
    </button>
}