import { VariableInterface } from "../common/variable.interface"

interface VariableProps {
    info: VariableInterface,
    onKeyChange: (value: string) => void,
    onValueChange: (value: string) => void,
    onClear: ()=> void
    onDelete: ()=> void
}

export const Variable = (props: VariableProps) => {
    const deleteVariable = () => {
        if (window.confirm("Are you sure you want to delete this variable?")) {
            props.onDelete();
        }    
    }

    return <div> 
        Key: <input onChange={e=>{props.onKeyChange(e.target.value)}} value={props.info.key}/>
        Value: <input onChange={e=>{props.onValueChange(e.target.value)}} value={props.info.value} />
        <button onClick={props.onClear}>ⓧ Clear</button>
        <button onClick={deleteVariable}>🗑️ Remove</button>
    </div>}