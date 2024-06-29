import { VariableInterface } from "../common/variable.interface"

interface VariableProps {
    info: VariableInterface,
    onKeyChange: (value: string) => void,
    onValueChange: (value: string) => void,
    onDelete: ()=> void
}
export const Variable = (props: VariableProps) => {
    return <div> 
        Key: <input onChange={e=>{props.onKeyChange(e.target.value)}} value={props.info.key}/>
        Value: <input onChange={e=>{props.onValueChange(e.target.value)}} value={props.info.value} />
        <button
            onClick={props.onDelete}
        >
            🗑️
        </button>
    </div>}