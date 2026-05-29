import {
    TemplateConversionContext,
    replaceFileTemplateVariables,
    resolveVariables,
} from './template.service'
import { downloadBlob } from './files.service'

export type SupportedFileTemplateType = 'xlsx' | 'docx' | 'txt'

export interface ProcessFileTemplateResult {
    fileName: string
    summary: string
}

interface FileProcessorResult {
    blob: Blob
    summary: string
}

const supportedExtensions: SupportedFileTemplateType[] = [
    'xlsx',
    'docx',
    'txt',
]

const mimeTypes: Record<SupportedFileTemplateType, string> = {
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    txt: 'text/plain;charset=utf-8',
}

const getFileExtension = (fileName: string): SupportedFileTemplateType | null => {
    const extension = fileName.split('.').pop()?.toLowerCase()
    return supportedExtensions.includes(extension as SupportedFileTemplateType)
        ? (extension as SupportedFileTemplateType)
        : null
}

const stripKnownExtension = (fileName: string) => {
    const extensionPattern = new RegExp(
        `\\.(${supportedExtensions.join('|')})$`,
        'i',
    )
    return fileName.replace(extensionPattern, '')
}

const getConvertedFileName = (
    originalFileName: string,
    extension: SupportedFileTemplateType,
) => {
    return `${originalFileName.replace(/\.[^.]+$/i, '')}-converted.${extension}`
}

const sanitizeFileName = (fileName: string) => {
    return fileName.replace(/[\\/:*?"<>|]/g, '-').trim()
}

const getOutputFileName = (
    originalFileName: string,
    outputFileNameTemplate: string,
    extension: SupportedFileTemplateType,
    context: TemplateConversionContext,
) => {
    const resolvedName = sanitizeFileName(
        replaceFileTemplateVariables(outputFileNameTemplate, context),
    )

    if (!resolvedName) {
        return getConvertedFileName(originalFileName, extension)
    }

    return `${stripKnownExtension(resolvedName)}.${extension}`
}

const processXlsxFile = async (
    file: File,
    context: TemplateConversionContext,
): Promise<FileProcessorResult> => {
    const ExcelJS = await import('exceljs')
    const workbook = new ExcelJS.Workbook()
    await workbook.xlsx.load(await file.arrayBuffer())
    let replacedCount = 0

    workbook.eachSheet((worksheet) => {
        worksheet.eachRow((row) => {
            row.eachCell((cell) => {
                if (typeof cell.value !== 'string') {
                    return
                }

                const converted = replaceFileTemplateVariables(
                    cell.value,
                    context,
                )
                if (converted !== cell.value) {
                    cell.value = converted
                    replacedCount++
                }
            })
        })
    })

    const output = await workbook.xlsx.writeBuffer()
    return {
        blob: new Blob([output], { type: mimeTypes.xlsx }),
        summary: `Replaced ${replacedCount} cell${replacedCount === 1 ? '' : 's'}.`,
    }
}

const processDocxFile = async (
    file: File,
    context: TemplateConversionContext,
): Promise<FileProcessorResult> => {
    const [{ default: Docxtemplater }, { default: PizZip }] =
        await Promise.all([import('docxtemplater'), import('pizzip')])
    const zip = new PizZip(await file.arrayBuffer())
    const doc = new Docxtemplater(zip, {
        delimiters: { start: '{{', end: '}}' },
        linebreaks: true,
        paragraphLoop: true,
        nullGetter: (part) => `{{${part.value}}}`,
    })
    const data: Record<string, string> = {}
    const resolvedVariables = resolveVariables(context)

    for (const variable of resolvedVariables) {
        if (typeof variable.value === 'string') {
            data[variable.key] = variable.value
        }
    }

    const currentEnvironment = context.environments.find(
        (environment) => environment.id === context.currentEnvironmentId,
    )
    data.environmentName = currentEnvironment?.name || ''

    doc.render(data)
    return {
        blob: doc.getZip().generate({
            type: 'blob',
            mimeType: mimeTypes.docx,
        }),
        summary: 'Processed DOCX document.',
    }
}

const processTxtFile = async (
    file: File,
    context: TemplateConversionContext,
): Promise<FileProcessorResult> => {
    const content = await file.text()
    const converted = replaceFileTemplateVariables(content, context)
    return {
        blob: new Blob([converted], { type: mimeTypes.txt }),
        summary:
            converted === content
                ? 'No placeholders changed.'
                : 'Processed text file.',
    }
}

export const processFileTemplate = async (
    file: File,
    context: TemplateConversionContext,
    outputFileNameTemplate: string,
): Promise<ProcessFileTemplateResult> => {
    const fileType = getFileExtension(file.name)
    if (!fileType) {
        throw new Error('Upload an .xlsx, .docx, or .txt file.')
    }

    const result =
        fileType === 'xlsx'
            ? await processXlsxFile(file, context)
            : fileType === 'docx'
              ? await processDocxFile(file, context)
              : await processTxtFile(file, context)
    const fileName = getOutputFileName(
        file.name,
        outputFileNameTemplate,
        fileType,
        context,
    )
    downloadBlob(result.blob, fileName)

    return {
        fileName,
        summary: result.summary,
    }
}
