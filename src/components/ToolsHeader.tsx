import React from 'react'

interface ToolsHeaderProps {
    onScrollToVariables: () => void
    onScrollToTemplates: () => void
    onConvert: () => void
}

export const ToolsHeader: React.FC<ToolsHeaderProps> = ({
    onScrollToVariables,
    onScrollToTemplates,
    onConvert,
}) => {
    return (
        <div className="tools-header">
            <button onClick={onScrollToVariables}>See variables</button>
            <button onClick={onScrollToTemplates}>See templates</button>
            <button onClick={onConvert}>Convert</button>
        </div>
    )
}
