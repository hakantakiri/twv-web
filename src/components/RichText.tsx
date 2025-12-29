import { CKEditor } from '@ckeditor/ckeditor5-react'
import {
    ClassicEditor,
    Essentials,
    Paragraph,
    Bold,
    Underline,
    Italic,
    Table,
    TableToolbar,
    Highlight,
    Indent,
    IndentBlock,
    List,
    Alignment,
    Link,
    AutoLink,
    TableConfig,
} from 'ckeditor5'

import 'ckeditor5/ckeditor5.css'
import { useEffect } from 'react'

interface RichTextProps {
    content: string
    type: 'editor' | 'preview'
    onChange: (value: string) => void
}

export const RichText = (props: RichTextProps) => {
    let toolbarConfig: string[] = []
    let tableToolbarConfig: TableConfig | undefined = undefined
    if (props.type === 'editor') {
        toolbarConfig = [
            'undo',
            'redo',
            '|',
            'bold',
            'underline',
            'italic',
            '|',
            'alignment',
            '|',
            'highlight',
            '|',
            'insertTable',
            'tableRow',
            'tableColumn',
            '|',
            'bulletedList',
            'numberedList',
            'outdent',
            'indent',
            '|',
            'link',
        ]
        tableToolbarConfig = {
            contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells'],
        }
    }
    useEffect(() => {
        console.log(
            'RichText of type ' + props.type + ' updated: props.content',
            props.content,
        )
    }, [props.content])

    return (
        <section>
            <CKEditor
                editor={ClassicEditor}
                data={props.content}
                onChange={(_, editor) => {
                    const data = editor.getData()
                    props.onChange(data)
                }}
                disabled={props.type === 'preview'}
                config={{
                    licenseKey: 'GPL',
                    plugins: [
                        Essentials,
                        Paragraph,
                        Bold,
                        Underline,
                        Italic,
                        Alignment,
                        Highlight,
                        Table,
                        TableToolbar,
                        List,
                        Indent,
                        IndentBlock,
                        Link,
                        AutoLink,
                    ],
                    toolbar: toolbarConfig,
                    table: tableToolbarConfig,
                }}
            />
        </section>
    )
}
