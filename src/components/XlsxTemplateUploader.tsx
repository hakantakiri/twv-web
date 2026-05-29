import { ChangeEvent, useRef, useState } from 'react'
import { EnvironmentInterface } from '../common/environment.interface'
import { FileTemplateInterface } from '../common/fileTemplate.interface'
import { VariableInterface } from '../common/variable.interface'
import { processXlsxFile } from '../services/xlsx.service'

interface XlsxTemplateUploaderProps {
    fileTemplate: FileTemplateInterface
    variables: VariableInterface[]
    environments: EnvironmentInterface[]
    currentEnvironmentId: string
    onOutputFileNameTemplateChange: (value: string) => void
    onDelete: () => void
}

type UploadStatus = 'idle' | 'processing' | 'success' | 'error'

export const XlsxTemplateUploader = ({
    fileTemplate,
    variables,
    environments,
    currentEnvironmentId,
    onOutputFileNameTemplateChange,
    onDelete,
}: XlsxTemplateUploaderProps) => {
    const inputRef = useRef<HTMLInputElement>(null)
    const [status, setStatus] = useState<UploadStatus>('idle')
    const [message, setMessage] = useState('')

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) {
            return
        }

        if (!file.name.toLowerCase().endsWith('.xlsx')) {
            setStatus('error')
            setMessage('Upload an .xlsx file.')
            e.target.value = ''
            return
        }

        try {
            setStatus('processing')
            setMessage('Processing file...')
            const result = await processXlsxFile(file, {
                variables,
                environments,
                currentEnvironmentId,
            }, fileTemplate.outputFileNameTemplate)
            setStatus('success')
            setMessage(
                `Downloaded ${result.fileName}. Replaced ${result.replacedCells} cell${result.replacedCells === 1 ? '' : 's'}.`,
            )
        } catch (error) {
            setStatus('error')
            setMessage(
                error instanceof Error
                    ? error.message
                    : 'The XLSX file could not be processed.',
            )
        } finally {
            e.target.value = ''
        }
    }

    return (
        <div className="xlsx-template-panel">
            <div className="xlsx-template-header">
                <div>
                    <label htmlFor={`file-template-${fileTemplate.id}`}>
                        Download file name
                    </label>
                    <p>
                        Use variables like {'{{name}}'} or {'{{environmentName}}'}.
                    </p>
                </div>
                <button onClick={onDelete}>Remove</button>
            </div>
            <div className="xlsx-file-name-row">
                <input
                    id={`file-template-${fileTemplate.id}`}
                    value={fileTemplate.outputFileNameTemplate}
                    onChange={(e) =>
                        onOutputFileNameTemplateChange(e.target.value)
                    }
                    placeholder="report-{{client}}"
                />
            </div>
            <div className="xlsx-upload-actions">
                <button
                    onClick={() => inputRef.current?.click()}
                    disabled={status === 'processing'}
                >
                    {status === 'processing' ? 'Processing...' : 'Upload XLSX'}
                </button>
                <input
                    ref={inputRef}
                    type="file"
                    accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    onChange={handleFileChange}
                    disabled={status === 'processing'}
                    style={{ display: 'none' }}
                />
            </div>
            {message && (
                <p className={`xlsx-upload-message ${status}`}>{message}</p>
            )}
        </div>
    )
}
