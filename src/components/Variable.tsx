import { useState } from "react"
import { VariableInterface } from "../common/variable.interface"
import dragIcon from '../assets/drag.svg'
import deleteIcon from '../assets/delete.svg'

interface VariableProps {
    info: VariableInterface,
    onKeyChange: (value: string) => void,
    onValueChange: (value: string | string[]) => void,
    onLabelChange: (value: string | string[]) => void,
    onClear: ()=> void
    onDelete: ()=> void
}

export const Variable = (props: VariableProps) => {

    const [draggedIndex, setDraggedIndex] = useState<number>(-1)
    const [draggedOverIndex, setDraggedOverIndex] = useState<number>(-1)
    
    const deleteVariable = () => {
        if (window.confirm("Are you sure you want to delete this variable?")) {
            props.onDelete();
        }    
    }

    const updateListItemValue = (index: number, value: string) => {
        const newList = [...(props.info.value as Array<string>)]
        newList[index] = value
        props.onValueChange(newList)
    }

    const updateListItemLabel = (index: number, label: string) => {
        const newList = [...(props.info.label as Array<string>)]
        newList[index] = label
        props.onLabelChange(newList)
    }

    const addListItem = () => {
        const newList = [...(props.info.value as Array<string>)]
        newList.push('')
        props.onValueChange(newList)
        const newLabel = [...(props.info.label as Array<string>)]
        newLabel.push('')
        props.onLabelChange(newLabel)
    }

    const clearListItem = (index: number) => {
        const newList = [...(props.info.value as Array<string>)]
        newList[index] = ''
        props.onValueChange(newList)
    }

    const deleteListItem = (index: number) => {
        if (window.confirm("Are you sure you want to delete this item?")) {
            const newList = [...(props.info.value as Array<string>)]
            newList.splice(index, 1)
            props.onValueChange(newList)
            const newLabel = [...(props.info.label as Array<string>)]
            newLabel.splice(index, 1)
            props.onLabelChange(newLabel)
        }
    }

    // Functions for Drag and Drop
    const updatePositionOnSuccessDrag = (draggedIndex: number, draggedOverIndex: number) => {
        const newVars = [...(props.info.value as Array<string>)]
        const draggedItem = newVars[draggedIndex]
        newVars.splice(draggedIndex, 1)
        newVars.splice(draggedOverIndex, 0, draggedItem)
        props.onValueChange(newVars)

        const newLabel = [...(props.info.label as Array<string>)]
        const draggedLabel = newLabel[draggedIndex]
        newLabel.splice(draggedIndex, 1)
        newLabel.splice(draggedOverIndex, 0, draggedLabel)
        props.onLabelChange(newLabel)
    }

    return <div>
        { !Array.isArray(props.info.value)? 
            <div>
                Key: <input onChange={e=>{props.onKeyChange(e.target.value)}} value={props.info.key}/>
                Value: <input onChange={e=>{props.onValueChange(e.target.value)}} value={props.info.value} />
                <button onClick={props.onClear}>ⓧ Clear</button>
                <button onClick={deleteVariable}>
                    {/* 🗑️ Remove */}
                    <img src={deleteIcon} alt="drag" style={{ width: '16px', height: '16px' }} />
                    </button>
            </div>:
            <div>
                Key: <input onChange={e=>{props.onKeyChange(e.target.value)}} value={props.info.key}/>
                <ul style={{listStyleType:'none'}}>
                    {(props.info.value as Array<string>).map((v, i) => {
                        return  <li key={i}
                            className={draggedOverIndex === i ? "topFocus" : ""}
                            onDragOver={(e)=> {
                                e.preventDefault()
                                setDraggedOverIndex(i)}}
                        >
                            <button
                            draggable={true} onDragStart={() => {setDraggedIndex(i)}}
                            
                            onDragEnd={() => {
                                updatePositionOnSuccessDrag(draggedIndex, draggedOverIndex)
                                setDraggedIndex(-1)
                                setDraggedOverIndex(-1)
                            }}
                            >
                                {/* Drag */}
                                <img src={dragIcon} alt="drag" style={{ width: '16px', height: '16px' }} />
                            </button>
                            Label: <input onChange={e=>{updateListItemLabel(i, e.target.value)}} value={props.info.label?.[i]} />
                            Value: <input onChange={e=>{updateListItemValue(i, e.target.value)}} value={v} />
                            <button onClick={()=>{clearListItem(i)}}>ⓧClear</button>
                            <button onClick={()=>{deleteListItem(i)}}>
                                {/* 🗑️  */}
                            <img src={deleteIcon} alt="drag" style={{ width: '16px', height: '16px' }} />
                            </button>
                        </li>
                    })}
                    <button onClick={addListItem}>Add item</button>
                    <button onClick={deleteVariable}>🗑️ Remove list</button>
                </ul>
            </div>
        }
    </div>
   }
