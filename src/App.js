import { useReducer } from 'react'
import { DigitButton } from './DigitButton'
import { OperationButton } from './OperationButton';
import './App.css';

// keep all the possible actions here to avoid spelling mistakes filtering through

export const ACTIONS = {
    ADD_DIGIT: 'add-digit',
    CLEAR: 'clear',
    DELETE_DIGIT: 'delete-digit',
    CHOOSE_OPERATION: 'choose-operation',
    EVALUATE: 'evaluate'
}


// Reducer function to handle each type of action, add digit, remove digit, clear digit, choose operation, and clear
// the main logic for the app
function reducer(state, { type, payload }) {
    switch (type) {

        case ACTIONS.ADD_DIGIT:
            if (state.overwrite) {
                return {
                    ...state,
                    currentOperand: payload.digit,
                    overwrite: false
                }
            }
            // dont add 0 if we already have 0
            if (payload.digit === "0" && state.currentOperand === "0") return state
            // dont add decimal point if number already includes one
            if (payload.digit === "." && state.currentOperand.includes(".")) return state
            return {
                ...state,
                currentOperand: `${state.currentOperand || ""}${payload.digit}`
            }


        case ACTIONS.CLEAR:
            //return empty state to clear all
            return {}


        case ACTIONS.CHOOSE_OPERATION:
            // dont choose operation if no numbers are chosen yet
            if (state.currentOperand == null && state.previousOperand == null) {
                return state
            }
            if (state.currentOperand == null) {
                return {
                    ...state,
                    operation: payload.operation
                }
            }
            // set prev operand as current operand, clear current operand
            if (state.previousOperand == null) {
                return {
                    ...state,
                    operation: payload.operation,
                    previousOperand: state.currentOperand,
                    currentOperand: null
                }
            }
            // if we click another operation we evaluate and empty the current operand
            return {
                ...state,
                previousOperand: evaluate(state),
                currentOperand: null,
                operation: payload.operation
            }


        case ACTIONS.EVALUATE:
            if (state.operation == null || state.currentOperand == null || state.previousOperand == null) {
                return state
            }
            // evaluate, set new mode to overwrite so when user clicks new number it clears the screen
            return {
                ...state,
                overwrite: true,
                previousOperand: null,
                currentOperand: evaluate(state),
                operation: null
            }
        

        case ACTIONS.DELETE_DIGIT:
            // overwrite current operand if we are in overwrite mode
            if (state.overwrite) {
                return {
                    ...state,
                    overwrite: false,
                    currentOperand: null
                }
            }
            // dont do anything if we dont have a number to delete
            if (state.currentOperand == null) {
                return state
            }
            // if only one digit return null
            if (state.currentOperand.length === 1) {
                return {
                    ...state,
                    currentOperand: null
                }
            }
            // delete the last digit
            return {
                ...state,
                currentOperand: state.currentOperand.slice(0, -1)
            }
    }
}



function evaluate({ currentOperand, previousOperand, operation }) {
    const prev = parseFloat(previousOperand)
    const curr = parseFloat(currentOperand)
    if (isNaN(previousOperand) || isNaN(currentOperand)) return ""
    let computation = ""
    switch (operation) {
        case "+":
            computation = prev + curr
            break;
        case "-":
            computation = prev - curr
            break;
        case "*":
            computation = prev * curr
            break;
        case "÷":
            computation = prev / curr
            break;

        default:
            break;
    }
    return computation.toString()
}


// for the commas in the digits, makes it look nicer
const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
    maximumFractionDigits: 0,
})


// separates the whole number part and the decimal part
function formatOperand(operand) {
    if (operand == null) return
    const [integer, decimal] = operand.split(".")
    if (decimal == null) return INTEGER_FORMATTER.format(integer)
    return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}

function App() {

    // use reducer is a way of handling complicated states, allows us to push the current number, previous number, and the operation as a state
    // instead of having a separate useState for each of them
    // dispatch is a function that takes in a state and it calls the reducer function into action
    const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(reducer,
        {})

    return (
        <div className="calculator-grid">

            <div className='output'>
                <div className='previous-operand'>{formatOperand(previousOperand)} {operation}</div>
                <div className='current-operand'>{formatOperand(currentOperand)}</div>
            </div>

            <button className='span-two' onClick={() => dispatch({ type: ACTIONS.CLEAR })}>AC</button>
            <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>DEL</button>

            <OperationButton operation="÷" dispatch={dispatch} />

            <DigitButton digit="1" dispatch={dispatch} />
            <DigitButton digit="2" dispatch={dispatch} />
            <DigitButton digit="3" dispatch={dispatch} />

            <OperationButton operation="*" dispatch={dispatch} />

            <DigitButton digit="4" dispatch={dispatch} />
            <DigitButton digit="5" dispatch={dispatch} />
            <DigitButton digit="6" dispatch={dispatch} />

            <OperationButton operation="+" dispatch={dispatch} />

            <DigitButton digit="7" dispatch={dispatch} />
            <DigitButton digit="8" dispatch={dispatch} />
            <DigitButton digit="9" dispatch={dispatch} />

            <OperationButton operation="-" dispatch={dispatch} />
            <DigitButton digit="." dispatch={dispatch} />

            <DigitButton digit="0" dispatch={dispatch} />

            <button className='span-two' onClick={() => dispatch({ type: ACTIONS.EVALUATE })}>=</button>
        </div>
    )
}

export default App;
