import { ACTIONS } from "./App"

// this is the operation button. When clicked dispatch is called with the operation the user clicked

export function OperationButton({ dispatch, operation }) {
    return <button 
    onClick={
        () => dispatch({
            type: ACTIONS.CHOOSE_OPERATION, payload: {operation} 
        })
    }>
        {operation}
    </button>
}