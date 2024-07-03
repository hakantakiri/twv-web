import { TextResultInterface } from "../common/textResult.interface"

interface TextPairProps {
    info: TextResultInterface
    onUpdateText: (text: string)=> void
    onDeleteText: ()=>void
}

export const TextPair = (props: TextPairProps) => {
    return <div>
        <label>Original</label>
        <textarea  
            rows={10} cols={40}  wrap="soft" 
            onChange = {e => {props.onUpdateText(e.target.value)}} 
            value={props.info.raw}>
        </textarea>
        <label>Converted</label>
        <textarea  
            rows={10} cols={40}  wrap="soft" value={props.info.converted} onChange= {()=>{}}>
        </textarea>
        <button onClick={props.onDeleteText}>🗑️</button>
    </div>

}