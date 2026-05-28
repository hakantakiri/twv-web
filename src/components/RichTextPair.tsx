import { useEffect, useState } from 'react'
import { TextResultInterface } from '../common/textResult.interface'
import { RichText } from './RichText'

interface RichTextPairProps {
    info: TextResultInterface
    onUpdateText: (text: string) => void
    onDeleteText: () => void
}

export const RichTextPair = (props: RichTextPairProps) => {
    const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>(
        'idle',
    )

    useEffect(() => {
        console.log('RichTextPairProps updated: props.info', props.info)
    }, [props.info])

    useEffect(() => {
        if (copyStatus === 'idle') {
            return
        }

        const timeoutId = window.setTimeout(() => {
            setCopyStatus('idle')
        }, 2000)

        return () => window.clearTimeout(timeoutId)
    }, [copyStatus])

    const getPlainText = (html: string) => {
        const container = document.createElement('div')
        container.innerHTML = html
        return container.textContent ?? ''
    }

    const copyConvertedText = async () => {
        const html = props.info.converted
        const plainText = getPlainText(html)

        try {
            if (
                navigator.clipboard &&
                'write' in navigator.clipboard &&
                typeof ClipboardItem !== 'undefined'
            ) {
                await navigator.clipboard.write([
                    new ClipboardItem({
                        'text/html': new Blob([html], { type: 'text/html' }),
                        'text/plain': new Blob([plainText], {
                            type: 'text/plain',
                        }),
                    }),
                ])
            } else {
                await navigator.clipboard.writeText(plainText)
            }

            setCopyStatus('copied')
        } catch (error) {
            console.error('Unable to copy converted text', error)
            setCopyStatus('error')
        }
    }

    return (
        <div>
            <label>Original</label>
            <RichText
                content={props.info.raw}
                type="editor"
                onChange={(text: string) => {
                    console.log('RichTextPairProps onChange: text', text)
                    props.onUpdateText(text)
                }}
            />
            <div className="rich-text-preview-header">
                <label>Converted</label>
                <button
                    type="button"
                    onClick={copyConvertedText}
                    disabled={!props.info.converted}
                    aria-label="Copy converted rich text to clipboard"
                >
                    {copyStatus === 'copied'
                        ? 'Copied'
                        : copyStatus === 'error'
                          ? 'Copy failed'
                          : 'Copy'}
                </button>
            </div>
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
