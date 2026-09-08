import { EnvironmentInterface } from '../common/environment.interface'
import deleteIcon from '../assets/delete.svg'

interface EnvironmentsProps {
    environments: EnvironmentInterface[]
    currentEnvironmentId: string
    onEnvironmentsChange: (environments: EnvironmentInterface[]) => void
    onCurrentEnvironmentChange: (id: string) => void
}

interface ClearableInputProps {
    value: string
    onChange: (value: string) => void
    clearLabel: string
    placeholder?: string
    inputClassName?: string
}

const ClearableInput = ({
    value,
    onChange,
    clearLabel,
    placeholder,
    inputClassName,
}: ClearableInputProps) => (
    <div className="environment-clearable-input">
        <input
            className={inputClassName}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder={placeholder}
        />
        <button
            type="button"
            className="environment-clear-button"
            onClick={() => onChange('')}
            aria-label={clearLabel}
            title={clearLabel}
        >
            Clear
        </button>
    </div>
)

export const Environments = (props: EnvironmentsProps) => {
    // Helper to ensure all environments have the same keys.
    // We'll use the first environment as the "source of truth" for keys if it exists,
    // or just maintain consistency on every operation.
    // Ideally, we derive the list of keys from the first environment.
    const keys =
        props.environments.length > 0
            ? props.environments[0].values.map((v) => v.key)
            : []

    const addEnvironment = () => {
        const newEnv: EnvironmentInterface = {
            id: crypto.randomUUID(),
            name: `Env ${props.environments.length + 1}`,
            // key-values must match existing structure
            values: keys.map((k) => ({ key: k, value: '' })),
        }
        props.onEnvironmentsChange([...props.environments, newEnv])
        if (!props.currentEnvironmentId) {
            props.onCurrentEnvironmentChange(newEnv.id)
        }
    }

    const deleteEnvironment = (id: string) => {
        if (
            window.confirm('Are you sure you want to delete this environment?')
        ) {
            const newEnvs = props.environments.filter((e) => e.id !== id)
            props.onEnvironmentsChange(newEnvs)
            if (props.currentEnvironmentId === id) {
                props.onCurrentEnvironmentChange(
                    newEnvs.length > 0 ? newEnvs[0].id : '',
                )
            }
        }
    }

    const updateEnvironmentName = (id: string, name: string) => {
        const newEnvs = props.environments.map((e) => {
            if (e.id === id) {
                return { ...e, name }
            }
            return e
        })
        props.onEnvironmentsChange(newEnvs)
    }

    const addKey = () => {
        const newEnvs = props.environments.map((e) => ({
            ...e,
            values: [...e.values, { key: '', value: '' }],
        }))
        props.onEnvironmentsChange(newEnvs)
    }

    const updateKey = (index: number, newKey: string) => {
        const newEnvs = props.environments.map((e) => {
            const newValues = [...e.values]
            newValues[index] = { ...newValues[index], key: newKey }
            return { ...e, values: newValues }
        })
        props.onEnvironmentsChange(newEnvs)
    }

    const updateValue = (envId: string, index: number, newValue: string) => {
        const newEnvs = props.environments.map((e) => {
            if (e.id === envId) {
                const newValues = [...e.values]
                newValues[index] = { ...newValues[index], value: newValue }
                return { ...e, values: newValues }
            }
            return e
        })
        props.onEnvironmentsChange(newEnvs)
    }

    const clearValuesForKey = (index: number) => {
        const keyLabel = keys[index] || `environment key ${index + 1}`
        if (
            window.confirm(
                `Are you sure you want to clear all values for ${keyLabel} across every environment?`,
            )
        ) {
            const newEnvs = props.environments.map((environment) => {
                const newValues = [...environment.values]
                const value = newValues[index]

                if (!value) {
                    return environment
                }

                newValues[index] = { ...value, value: '' }
                return { ...environment, values: newValues }
            })
            props.onEnvironmentsChange(newEnvs)
        }
    }

    const deleteKey = (index: number) => {
        if (
            window.confirm(
                'Are you sure you want to delete this variable from ALL environments?',
            )
        ) {
            const newEnvs = props.environments.map((e) => {
                const newValues = [...e.values]
                newValues.splice(index, 1)
                return { ...e, values: newValues }
            })
            props.onEnvironmentsChange(newEnvs)
        }
    }

    return (
        <div
            style={{
                marginBottom: '20px',
                borderBottom: '1px solid #ccc',
                paddingBottom: '20px',
            }}
        >
            <h1>Environments</h1>

            <div className="environment-table-scroll">
                <table
                    border={1}
                    style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        minWidth: '600px',
                    }}
                >
                    <thead>
                        <tr>
                            <th
                                className="environment-key-header"
                                style={{ padding: '10px' }}
                            >
                                Key
                            </th>
                            {props.environments.map((env, envIndex) => (
                                <th
                                    key={env.id}
                                    className="environment-column-header"
                                    style={{
                                        padding: '10px',
                                    }}
                                >
                                    <div
                                        className="environment-header-controls"
                                        style={{
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <ClearableInput
                                            value={env.name}
                                            onChange={(name) =>
                                                updateEnvironmentName(
                                                    env.id,
                                                    name,
                                                )
                                            }
                                            clearLabel={`Clear name for environment ${envIndex + 1}`}
                                            inputClassName="environment-name-input"
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                deleteEnvironment(env.id)
                                            }
                                            title="Delete Environment"
                                            style={{
                                                border: 'none',
                                                background: 'transparent',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            <img
                                                src={deleteIcon}
                                                alt="delete"
                                                style={{
                                                    width: '12px',
                                                    height: '12px',
                                                }}
                                            />
                                        </button>
                                    </div>
                                </th>
                            ))}
                            <th className="environment-actions-header">
                                <span>Actions</span>
                                <button type="button" onClick={addEnvironment}>
                                    + Env
                                </button>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {keys.map((key, index) => (
                            <tr key={index}>
                                <td style={{ padding: '5px' }}>
                                    <div className="environment-key-controls">
                                        <ClearableInput
                                            value={key}
                                            onChange={(newKey) =>
                                                updateKey(index, newKey)
                                            }
                                            placeholder="Variable Name"
                                            clearLabel={`Clear environment key ${index + 1}`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => deleteKey(index)}
                                        >
                                            <img
                                                src={deleteIcon}
                                                alt="delete"
                                                style={{
                                                    width: '16px',
                                                    height: '16px',
                                                }}
                                            />
                                        </button>
                                    </div>
                                </td>
                                {props.environments.map((env, envIndex) => (
                                    <td key={env.id} style={{ padding: '5px' }}>
                                        <ClearableInput
                                            value={
                                                env.values[index]?.value || ''
                                            }
                                            onChange={(value) =>
                                                updateValue(
                                                    env.id,
                                                    index,
                                                    value,
                                                )
                                            }
                                            clearLabel={`Clear value for ${key || `environment key ${index + 1}`} in ${env.name || `environment ${envIndex + 1}`}`}
                                        />
                                    </td>
                                ))}
                                <td className="environment-row-actions">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            clearValuesForKey(index)
                                        }
                                        disabled={props.environments.every(
                                            (environment) =>
                                                !environment.values[index]
                                                    ?.value,
                                        )}
                                        aria-label={`Clear values for ${key || `environment key ${index + 1}`} across all environments`}
                                    >
                                        Clear values
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {props.environments.length > 0 && (
                <button onClick={addKey} style={{ marginTop: '10px' }}>
                    + Add Variable
                </button>
            )}
            {props.environments.length === 0 && (
                <div
                    style={{
                        padding: '20px',
                        textAlign: 'center',
                        color: '#666',
                    }}
                >
                    No environments created. Click "+ Env" table header to
                    start.
                </div>
            )}
        </div>
    )
}
