import { ChangeEvent, useRef, useState } from 'react'
import { EnvironmentInterface } from '../common/environment.interface'
import { FileTemplateInterface } from '../common/fileTemplate.interface'
import { VariableInterface } from '../common/variable.interface'
import { processFileTemplate } from '../services/fileTemplates.service'

interface FileTemplateUploaderProps {
    fileTemplate: FileTemplateInterface
    variables: VariableInterface[]
    environments: EnvironmentInterface[]
    currentEnvironmentId: string
    onOutputFileNameTemplateChange: (value: string) => void
    onDelete: () => void
}

type UploadStatus = 'idle' | 'processing' | 'success' | 'error'

export const FileTemplateUploader = ({
    fileTemplate,
    variables,
    environments,
    currentEnvironmentId,
    onOutputFileNameTemplateChange,
    onDelete,
}: FileTemplateUploaderProps) => {
    const inputRef = useRef<HTMLInputElement>(null)
    const [status, setStatus] = useState<UploadStatus>('idle')
    const [message, setMessage] = useState('')

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) {
            return
        }

        try {
            setStatus('processing')
            setMessage('Processing file...')
            const result = await processFileTemplate(
                file,
                {
                    variables,
                    environments,
                    currentEnvironmentId,
                },
                fileTemplate.outputFileNameTemplate,
            )
            setStatus('success')
            setMessage(`Downloaded ${result.fileName}. ${result.summary}`)
        } catch (error) {
            setStatus('error')
            setMessage(
                error instanceof Error
                    ? error.message
                    : 'The file could not be processed.',
            )
        } finally {
            e.target.value = ''
        }
    }

    return (
        <div className="file-template-panel">
            <div className="file-template-header">
                <div>
                    <label htmlFor={`file-template-${fileTemplate.id}`}>
                        Download file name
                    </label>
                    <p>
                        Use variables like {'{{name}}'} or{' '}
                        {'{{environmentName}}'}.
                    </p>
                </div>
                <button onClick={onDelete}>Remove</button>
            </div>
            <div className="file-template-name-row">
                <input
                    id={`file-template-${fileTemplate.id}`}
                    value={fileTemplate.outputFileNameTemplate}
                    onChange={(e) =>
                        onOutputFileNameTemplateChange(e.target.value)
                    }
                    placeholder="report-{{client}}"
                />
            </div>
            <div className="file-template-upload-actions">
                <button
                    onClick={() => inputRef.current?.click()}
                    disabled={status === 'processing'}
                >
                    {status === 'processing' ? 'Processing...' : 'Upload file'}
                </button>
                <input
                    ref={inputRef}
                    type="file"
                    accept=".xlsx,.docx,.txt,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                    onChange={handleFileChange}
                    disabled={status === 'processing'}
                    style={{ display: 'none' }}
                />
            </div>
            {message && (
                <p className={`file-template-upload-message ${status}`}>
                    {message}
                </p>
            )}
        </div>
    )
}
