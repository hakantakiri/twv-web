import { EnvironmentInterface } from '../common/environment.interface'
import deleteIcon from '../assets/delete.svg'

interface EnvironmentsProps {
    environments: EnvironmentInterface[]
    currentEnvironmentId: string
    onEnvironmentsChange: (environments: EnvironmentInterface[]) => void
    onCurrentEnvironmentChange: (id: string) => void
}

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

            <div style={{ overflowX: 'auto' }}>
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
                            <th style={{ width: '200px', padding: '10px' }}>
                                Key
                            </th>
                            {props.environments.map((env) => (
                                <th
                                    key={env.id}
                                    style={{
                                        minWidth: '150px',
                                        padding: '10px',
                                    }}
                                >
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '5px',
                                        }}
                                    >
                                        <input
                                            value={env.name}
                                            onChange={(e) =>
                                                updateEnvironmentName(
                                                    env.id,
                                                    e.target.value,
                                                )
                                            }
                                            style={{
                                                fontWeight: 'bold',
                                                textAlign: 'center',
                                                width: '80%',
                                            }}
                                        />
                                        <button
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
                            <th style={{ width: '50px' }}>
                                <button onClick={addEnvironment}>+ Env</button>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {keys.map((key, index) => (
                            <tr key={index}>
                                <td style={{ padding: '5px' }}>
                                    <div
                                        style={{ display: 'flex', gap: '5px' }}
                                    >
                                        <input
                                            value={key}
                                            onChange={(e) =>
                                                updateKey(index, e.target.value)
                                            }
                                            placeholder="Variable Name"
                                            style={{ width: '100%' }}
                                        />
                                        <button
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
                                {props.environments.map((env) => (
                                    <td key={env.id} style={{ padding: '5px' }}>
                                        <input
                                            value={
                                                env.values[index]?.value || ''
                                            }
                                            onChange={(e) =>
                                                updateValue(
                                                    env.id,
                                                    index,
                                                    e.target.value,
                                                )
                                            }
                                            style={{ width: '100%' }}
                                        />
                                    </td>
                                ))}
                                <td></td>
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
