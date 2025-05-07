import { VariableInterface } from "../common/variable.interface"

interface VariableProps {
    info: VariableInterface,
    onKeyChange: (value: string) => void,
    onValueChange: (value: string | string[]) => void,
    onLabelChange: (value: string | string[]) => void,
    onClear: ()=> void
    onDelete: ()=> void
}

export const Variable = (props: VariableProps) => {
    const deleteVariable = () => {
        if (window.confirm("Are you sure you want to delete this variable?")) {
            props.onDelete();
        }    
    }

    const updateListItemValue = (index: number, value: string) => {
        let newList = [...(props.info.value as Array<string>)]
        newList[index] = value
        props.onValueChange(newList)
    }

    const updateListItemLabel = (index: number, label: string) => {
        let newList = [...(props.info.label as Array<string>)]
        newList[index] = label
        props.onLabelChange(newList)
    }

    const addListItem = () => {
        let newList = [...(props.info.value as Array<string>)]
        newList.push('')
        props.onValueChange(newList)
        let newLabel = [...(props.info.label as Array<string>)]
        newLabel.push('')
        props.onLabelChange(newLabel)
    }

    const clearListItem = (index: number) => {
        let newList = [...(props.info.value as Array<string>)]
        newList[index] = ''
        props.onValueChange(newList)
    }

    const deleteListItem = (index: number) => {
        if (window.confirm("Are you sure you want to delete this item?")) {
            let newList = [...(props.info.value as Array<string>)]
            newList.splice(index, 1)
            props.onValueChange(newList)
            let newLabel = [...(props.info.label as Array<string>)]
            newLabel.splice(index, 1)
            props.onLabelChange(newLabel)
        }
    }

    return <div>
        { !Array.isArray(props.info.value)? 
            <div>
                Key: <input onChange={e=>{props.onKeyChange(e.target.value)}} value={props.info.key}/>
                Value: <input onChange={e=>{props.onValueChange(e.target.value)}} value={props.info.value} />
                <button onClick={props.onClear}>ⓧ Clear</button>
                <button onClick={deleteVariable}>🗑️ Remove</button>
            </div>:
            <div>
                Key: <input onChange={e=>{props.onKeyChange(e.target.value)}} value={props.info.key}/>
                <ul>
                    {(props.info.value as Array<string>).map((v, i) => {
                        return <li key={i}>
                            Label: <input onChange={e=>{updateListItemLabel(i, e.target.value)}} value={props.info.label?.[i]} />
                            Value: <input onChange={e=>{updateListItemValue(i, e.target.value)}} value={v} />
                            <button onClick={()=>{clearListItem(i)}}>ⓧClear</button>
                            <button onClick={()=>{deleteListItem(i)}}>🗑️</button>
                        </li>
                    })}
                    <button onClick={addListItem}>Add item</button>
                    <button onClick={deleteVariable}>🗑️ Remove list</button>
                </ul>
            </div>
        }
        <hr/>
    </div>
   }