import { useEffect } from 'react'
import { TextResultInterface } from '../common/textResult.interface'
import { RichText } from './RichText'

interface RichTextPairProps {
    info: TextResultInterface
    onUpdateText: (text: string) => void
    onDeleteText: () => void
}

export const RichTextPair = (props: RichTextPairProps) => {
    useEffect(() => {
        console.log('RichTextPairProps updated: props.info', props.info)
    }, [props.info])

    return (
        <div>
            <label>Original</label>
            <RichText
                content={props.info.raw}
                type="editor"
                onChange={(text: any) => {
                    console.log('RichTextPairProps onChange: text', text)
                    props.onUpdateText(text)
                }}
            />
            <label>Converted</label>
            <RichText
                content={props.info.converted}
                type="preview"
                onChange={() => {}}
            />
            {/* <textarea
                rows={20}
                cols={60}
                wrap="soft"
                onChange={(e) => {
                    props.onUpdateText(e.target.value)
                }}
                value={props.info.raw}
            ></textarea>
            <label>Converted</label> */}
            {/* <textarea
                rows={20}
                cols={60}
                wrap="soft"
                value={props.info.converted}
                onChange={() => {}}
            ></textarea> */}
            <button onClick={props.onDeleteText}>🗑️</button>
        </div>
    )
}
