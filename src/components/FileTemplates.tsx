import { EnvironmentInterface } from '../common/environment.interface'
import { FileTemplateInterface } from '../common/fileTemplate.interface'
import { VariableInterface } from '../common/variable.interface'
import { FileTemplateUploader } from './FileTemplateUploader'

interface FileTemplatesProps {
    fileTemplates: FileTemplateInterface[]
    variables: VariableInterface[]
    environments: EnvironmentInterface[]
    currentEnvironmentId: string
    onAddFileTemplate: () => void
    onUpdateFileTemplate: (
        id: string,
        update: Partial<FileTemplateInterface>,
    ) => void
    onDeleteFileTemplate: (id: string) => void
}

export const FileTemplates = ({
    fileTemplates,
    variables,
    environments,
    currentEnvironmentId,
    onAddFileTemplate,
    onUpdateFileTemplate,
    onDeleteFileTemplate,
}: FileTemplatesProps) => {
    return (
        <>
            <h1>File Templates</h1>
            <p className="file-templates-description">
                Upload XLSX, DOCX, or TXT files with placeholders and choose
                the converted file name.
            </p>
            {fileTemplates.length > 0 && (
                <ul className="file-template-list">
                    {fileTemplates.map((fileTemplate) => (
                        <li key={fileTemplate.id}>
                            <FileTemplateUploader
                                fileTemplate={fileTemplate}
                                variables={variables}
                                environments={environments}
                                currentEnvironmentId={currentEnvironmentId}
                                onOutputFileNameTemplateChange={(value) =>
                                    onUpdateFileTemplate(fileTemplate.id, {
                                        outputFileNameTemplate: value,
                                    })
                                }
                                onDelete={() =>
                                    onDeleteFileTemplate(fileTemplate.id)
                                }
                            />
                        </li>
                    ))}
                </ul>
            )}
            <button onClick={onAddFileTemplate}>Add file template</button>
        </>
    )
}
