import {
    TemplateConversionContext,
    replaceFileTemplateVariables,
    replaceSimpleVariables,
} from './template.service'
import { downloadBlob } from './files.service'

export interface ProcessXlsxResult {
    fileName: string
    replacedCells: number
}

const getConvertedFileName = (fileName: string) => {
    return fileName.replace(/\.xlsx$/i, '') + '-converted.xlsx'
}

const sanitizeFileName = (fileName: string) => {
    return fileName.replace(/[\\/:*?"<>|]/g, '-').trim()
}

const getOutputFileName = (
    originalFileName: string,
    outputFileNameTemplate: string,
    context: TemplateConversionContext,
) => {
    const resolvedName = sanitizeFileName(
        replaceFileTemplateVariables(outputFileNameTemplate, context),
    )

    if (!resolvedName) {
        return getConvertedFileName(originalFileName)
    }

    return resolvedName.toLowerCase().endsWith('.xlsx')
        ? resolvedName
        : `${resolvedName}.xlsx`
}

export const processXlsxFile = async (
    file: File,
    context: TemplateConversionContext,
    outputFileNameTemplate: string,
): Promise<ProcessXlsxResult> => {
    const ExcelJS = await import('exceljs')
    const workbook = new ExcelJS.Workbook()
    await workbook.xlsx.load(await file.arrayBuffer())
    let replacedCells = 0

    workbook.eachSheet((worksheet) => {
        worksheet.eachRow((row) => {
            row.eachCell((cell) => {
                if (typeof cell.value !== 'string') {
                    return
                }

                const converted = replaceSimpleVariables(cell.value, context)
                if (converted !== cell.value) {
                    cell.value = converted
                    replacedCells++
                }
            })
        })
    })

    const output = await workbook.xlsx.writeBuffer()
    const fileName = getOutputFileName(
        file.name,
        outputFileNameTemplate,
        context,
    )
    downloadBlob(
        new Blob([output], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        }),
        fileName,
    )

    return {
        fileName,
        replacedCells,
    }
}
