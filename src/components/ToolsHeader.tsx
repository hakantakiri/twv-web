import React from 'react'
import { EnvironmentInterface } from '../common/environment.interface'

interface ToolsHeaderProps {
    onScrollToVariables: () => void
    onScrollToTemplates: () => void
    onScrollToEnvironments: () => void
    onConvert: () => void
    environments: EnvironmentInterface[]
    currentEnvironmentId: string
    onEnvironmentChange: (id: string) => void
}

export const ToolsHeader: React.FC<ToolsHeaderProps> = ({
    onScrollToVariables,
    onScrollToTemplates,
    onScrollToEnvironments,
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
                position: 'fixed',
                top: '60px',
                left: 0,
                width: '100%',
                boxSizing: 'border-box',
                zIndex: 1000,
                borderBottom: '1px solid #ccc',
                alignItems: 'center',
            }}
        >
            <button onClick={onScrollToEnvironments}>See environments</button>
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
