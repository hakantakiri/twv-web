import { TextResultInterface } from "../common/textResult.interface"

interface TextPairProps {
    info: TextResultInterface
    onUpdateText: (text: string)=> void
}

export const TextPair = (props: TextPairProps) => {
    return <div>
        <textarea  
            rows={10} cols={60}  wrap="soft" 
            onChange = {e => {props.onUpdateText(e.target.value)}} value={props.info.raw}>
        </textarea>
                {"->"}
        <textarea  
            rows={10} cols={60}  wrap="soft" value={props.info.converted}>
        </textarea>

    </div>

}