import React from 'react'
import { EnvironmentInterface } from '../common/environment.interface'

interface ToolsHeaderProps {
    onScrollToVariables: () => void
    onScrollToTemplates: () => void
    onConvert: () => void
    environments: EnvironmentInterface[]
    currentEnvironmentId: string
    onEnvironmentChange: (id: string) => void
}

export const ToolsHeader: React.FC<ToolsHeaderProps> = ({
    onScrollToVariables,
    onScrollToTemplates,
    onConvert,
    environments,
    currentEnvironmentId,
    onEnvironmentChange,
}) => {
    return (
        <div
            className="tools-header"
            style={{
                display: 'flex',
                gap: '10px',
                padding: '10px',
                position: 'sticky',
                top: 0,
                backgroundColor: 'white',
                zIndex: 1000,
                borderBottom: '1px solid #ccc',
                alignItems: 'center',
            }}
        >
            <button onClick={onScrollToVariables}>See variables</button>
            <button onClick={onScrollToTemplates}>See templates</button>

            <div
                style={{
                    marginLeft: 'auto',
                    display: 'flex',
                    gap: '10px',
                    alignItems: 'center',
                }}
            >
                {environments.length > 0 && (
                    <select
                        value={currentEnvironmentId}
                        onChange={(e) => onEnvironmentChange(e.target.value)}
                        style={{ padding: '5px' }}
                    >
                        <option value="">Select Environment</option>
                        {environments.map((env) => (
                            <option key={env.id} value={env.id}>
                                {env.name}
                            </option>
                        ))}
                    </select>
                )}
                <button onClick={onConvert} style={{ fontWeight: 'bold' }}>
                    Convert
                </button>
            </div>
        </div>
    )
}
