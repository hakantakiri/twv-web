import { SaveDocumentInterface } from "../common/saveDocument.interface";
import { SAVE_DOCUMENT_EXTENSION } from "../settings";

export const downloadFile = (saveDocument: SaveDocumentInterface):void => {
    const jsonString = JSON.stringify(saveDocument)
    const blob = new Blob([jsonString], {type: 'application/json'})
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    
    link.href = URL.createObjectURL(blob)
    link.download = `save_document${SAVE_DOCUMENT_EXTENSION}`
    document.body.appendChild(link)
    link.click()

    document.body.removeChild(link)
    URL.revokeObjectURL(url)
}
