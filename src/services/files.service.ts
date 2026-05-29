import { SaveDocumentInterface } from "../common/saveDocument.interface";
import { SAVE_DOCUMENT_EXTENSION } from "../settings";

export const downloadBlob = (blob: Blob, fileName: string): void => {
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()

    document.body.removeChild(link)
    URL.revokeObjectURL(url)
}

export const downloadFile = (saveDocument: SaveDocumentInterface):void => {
    const jsonString = JSON.stringify(saveDocument)
    const blob = new Blob([jsonString], {type: 'application/json'})
    downloadBlob(blob, `save_document${SAVE_DOCUMENT_EXTENSION}`)
}
