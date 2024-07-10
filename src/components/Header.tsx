import { useRef } from "react"
import { SaveDocumentInterface } from "../common/saveDocument.interface"
import { getCacheToDownload, loadToCacheFromFile } from "../services/cache.service"
import { downloadFile } from "../services/files.service"

export const Header = () => {
    const uploadRef = useRef<HTMLInputElement>(null)

    const navStyle: React.CSSProperties = {
        display: 'flex',
        justifyContent: 'space-between',
        padding: "10px"
    }

    const saveToFile = () => {
        const currentCache: SaveDocumentInterface = getCacheToDownload()
        downloadFile(currentCache)
    }

    const openFile = (e: any) => {
        const fileReader = new FileReader()
        fileReader.readAsText(e.target.files[0], "UTF-8")
        fileReader.onload = (e) => {
            if( e.target?.result && typeof e.target.result == 'string'){
                const jsonData = JSON.parse( e.target?.result )
                if( 'variables' in jsonData && 'textResults' in jsonData) {
                    const savedDocument: SaveDocumentInterface = {
                        variables: jsonData.variables,
                        textResults: jsonData.textResults
                    }
                    loadToCacheFromFile(savedDocument)
                }
            }
        }
    }

    const handleUploadClick = () => {
        uploadRef.current?.click()
    }

    return <nav style={navStyle}>
        <h2>
            Text generator with variables
        </h2>
        <div>
            <button
            onClick={saveToFile}
            >
                Save as
            </button>
            <button
            onClick={handleUploadClick}
            >
                Open file
            </button>
            <input type="file" ref={uploadRef} onChange={openFile} style={{display: 'none'}}/>
        </div>
    </nav>
}