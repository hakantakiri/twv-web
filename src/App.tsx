import { useEffect, useRef, useState } from 'react'
import dragIcon from './assets/drag.svg'
import './App.css'
import { Variable } from './components/Variable'
import { VariableInterface } from './common/variable.interface'
import { TextResultInterface } from './common/textResult.interface'
import {
    getCacheTextResults,
    getCacheVariables,
    setTextResultsCache,
    setVariablesToCache,
} from './services/cache.service'
import { Header } from './components/Header'
import { RichTextPair } from './components/RichTextPair'
import { ToolsHeader } from './components/ToolsHeader'
import { Environments } from './components/Environments'
import { FileTemplates } from './components/FileTemplates'
import { FileTemplateInterface } from './common/fileTemplate.interface'
import { EnvironmentInterface } from './common/environment.interface'
import {
    createDefaultFileTemplate,
    getCacheEnvironments,
    getCacheFileTemplates,
    setEnvironmentsToCache,
    setFileTemplatesToCache,
    getCacheCurrentEnvironmentId,
    setCacheCurrentEnvironmentId,
} from './services/cache.service'
import { convertTemplate } from './services/template.service'

type TemplateMode = 'edit' | 'preview'

function App() {
    const [vars, setVars] = useState<VariableInterface[]>(getCacheVariables())
    const [textResults, SetTextResults] = useState<TextResultInterface[]>(
        (() => {
            let cacheTextResults: TextResultInterface[] = getCacheTextResults()
            if (cacheTextResults.length == 0) {
                cacheTextResults = [
                    { raw: '', converted: '' },
                    { raw: '', converted: '' },
                    { raw: '', converted: '' },
                ]
            }
            return cacheTextResults
        })(),
    )
    const [templateModes, setTemplateModes] = useState<TemplateMode[]>(
        textResults.map(() => 'edit'),
    )
    const [environments, setEnvironments] = useState<EnvironmentInterface[]>(
        getCacheEnvironments(),
    )
    const [currentEnvironmentId, setCurrentEnvironmentId] = useState<string>(
        getCacheCurrentEnvironmentId(),
    )
    const [fileTemplates, setFileTemplates] = useState<FileTemplateInterface[]>(
        getCacheFileTemplates(),
    )
    const [draggedIndex, setDraggedIndex] = useState<number>(-1)
    const [draggedOverIndex, setDraggedOverIndex] = useState<number>(-1)

    // Use effects
    useEffect(() => {
        setVariablesToCache(vars)
        setDraggedOverIndex(-1)
    }, [vars])

    useEffect(() => {
        setTextResultsCache(textResults)
    }, [textResults])

    useEffect(() => {
        setEnvironmentsToCache(environments)
    }, [environments])

    useEffect(() => {
        setCacheCurrentEnvironmentId(currentEnvironmentId)
    }, [currentEnvironmentId])

    useEffect(() => {
        setFileTemplatesToCache(fileTemplates)
    }, [fileTemplates])

    // Functions for Variables
    const addVariable = (
        key: string,
        value: string | string[],
        label: string | string[],
    ) => {
        setVars([
            ...vars,
            {
                key: key,
                value: value,
                label: label,
            },
        ])
    }

    const updateKey = (key: string, index: number) => {
        const nVars = [...vars]
        nVars[index].key = key
        setVars(nVars)
    }
    const updateValue = (value: string | string[], index: number) => {
        const nVars = [...vars]
        nVars[index].value = value
        setVars(nVars)
    }

    const updateLabel = (label: string | string[], index: number) => {
        const nVars = [...vars]
        nVars[index].label = label
        setVars(nVars)
    }

    const clearValue = (index: number) => {
        const newVar = [...vars]
        newVar[index].value = ''
        setVars(newVar)
    }

    const deleteValue = (index: number) => {
        const newVar = [...vars]
        newVar.splice(index, 1)
        setVars(newVar)
    }

    // Functions for Texts
    const addText = () => {
        SetTextResults([...textResults, { raw: '', converted: '' }])
        setTemplateModes([...templateModes, 'edit'])
    }

    const updateText = (index: number, raw: string) => {
        const newTexts = [...textResults]
        newTexts[index].raw = raw
        SetTextResults(newTexts)
    }

    const getTemplateContext = () => ({
        variables: vars,
        environments,
        currentEnvironmentId,
    })

    const convert = (text: string) => convertTemplate(text, getTemplateContext())

    const convertOne = (index: number) => {
        const texts = textResults.map((textResult, i) => {
            if (i !== index) {
                return textResult
            }

            return {
                ...textResult,
                converted: convert(textResult.raw),
            }
        })

        SetTextResults(texts)
        setTemplateModes(
            textResults.map((_, i) =>
                i === index ? 'preview' : (templateModes[i] ?? 'edit'),
            ),
        )
    }

    const convertAll = () => {
        const texts = textResults.map((textResult) => ({
            ...textResult,
            converted: convert(textResult.raw),
        }))
        SetTextResults(texts)
        setTemplateModes(texts.map(() => 'preview'))
    }

    const editText = (index: number) => {
        setTemplateModes(
            textResults.map((_, i) =>
                i === index ? 'edit' : (templateModes[i] ?? 'edit'),
            ),
        )
    }

    const deleteText = (index: number) => {
        const newTexts = [...textResults]
        newTexts.splice(index, 1)
        SetTextResults(newTexts)
        setTemplateModes(templateModes.filter((_, i) => i !== index))
    }

    const addFileTemplate = () => {
        setFileTemplates([...fileTemplates, createDefaultFileTemplate()])
    }

    const updateFileTemplate = (
        id: string,
        update: Partial<FileTemplateInterface>,
    ) => {
        setFileTemplates(
            fileTemplates.map((fileTemplate) =>
                fileTemplate.id === id
                    ? { ...fileTemplate, ...update }
                    : fileTemplate,
            ),
        )
    }

    const deleteFileTemplate = (id: string) => {
        setFileTemplates(
            fileTemplates.filter((fileTemplate) => fileTemplate.id !== id),
        )
    }

    // Functions for Drag and Drop

    const updatePositionOnSuccessDrag = (
        draggedIndex: number,
        draggedOverIndex: number,
    ) => {
        const newVars = [...vars]
        const draggedItem = newVars[draggedIndex]
        newVars.splice(draggedIndex, 1)
        newVars.splice(draggedOverIndex, 0, draggedItem)
        setVars(newVars)
    }

    const variablesSectionRef = useRef<HTMLDivElement>(null)
    const textsSectionRef = useRef<HTMLDivElement>(null)
    const fileTemplatesSectionRef = useRef<HTMLDivElement>(null)
    const environmentsSectionRef = useRef<HTMLDivElement>(null)

    const scrollToVariables = () => {
        if (variablesSectionRef.current) {
            const yOffset = -120 // Accounts for fixed headers
            const element = variablesSectionRef.current
            const y =
                element.getBoundingClientRect().top +
                window.pageYOffset +
                yOffset
            window.scrollTo({ top: y, behavior: 'smooth' })
        }
    }

    const scrollToTexts = () => {
        if (textsSectionRef.current) {
            const yOffset = -120 // Accounts for fixed headers
            const element = textsSectionRef.current
            const y =
                element.getBoundingClientRect().top +
                window.pageYOffset +
                yOffset
            window.scrollTo({ top: y, behavior: 'smooth' })
        }
    }

    const scrollToFileTemplates = () => {
        if (fileTemplatesSectionRef.current) {
            const yOffset = -120 // Accounts for fixed headers
            const element = fileTemplatesSectionRef.current
            const y =
                element.getBoundingClientRect().top +
                window.pageYOffset +
                yOffset
            window.scrollTo({ top: y, behavior: 'smooth' })
        }
    }

    const scrollToEnvironments = () => {
        if (environmentsSectionRef.current) {
            const yOffset = -120 // Accounts for fixed headers
            const element = environmentsSectionRef.current
            const y =
                element.getBoundingClientRect().top +
                window.pageYOffset +
                yOffset
            window.scrollTo({ top: y, behavior: 'smooth' })
        }
    }

    return (
        <>
            <Header />
            <ToolsHeader
                onScrollToVariables={scrollToVariables}
                onScrollToTemplates={scrollToTexts}
                onScrollToFileTemplates={scrollToFileTemplates}
                onScrollToEnvironments={scrollToEnvironments}
                onConvert={convertAll}
                environments={environments}
                currentEnvironmentId={currentEnvironmentId}
                onEnvironmentChange={setCurrentEnvironmentId}
            />
            <section ref={environmentsSectionRef}>
                <Environments
                    environments={environments}
                    currentEnvironmentId={currentEnvironmentId}
                    onEnvironmentsChange={setEnvironments}
                    onCurrentEnvironmentChange={setCurrentEnvironmentId}
                />
            </section>
            <section ref={variablesSectionRef}>
                <h1>Variables</h1>
                <ul style={{ listStyleType: 'none' }}>
                    {vars.map((v, i) => {
                        return (
                            <li
                                key={i}
                                className={
                                    draggedOverIndex === i ? 'topFocus' : ''
                                }
                                onDragOver={(e) => {
                                    e.preventDefault()
                                    setDraggedOverIndex(i)
                                }}
                            >
                                <div className="liContent">
                                    <button
                                        draggable={true}
                                        onDragStart={() => {
                                            setDraggedIndex(i)
                                        }}
                                        onDragEnd={() => {
                                            updatePositionOnSuccessDrag(
                                                draggedIndex,
                                                draggedOverIndex,
                                            )
                                            setDraggedIndex(-1)
                                            setDraggedOverIndex(-1)
                                        }}
                                    >
                                        {/* Drag */}
                                        <img
                                            src={dragIcon}
                                            alt="drag"
                                            style={{
                                                width: '16px',
                                                height: '16px',
                                            }}
                                        />
                                    </button>
                                    <Variable
                                        info={v as VariableInterface}
                                        onKeyChange={(k) => {
                                            updateKey(k, i)
                                        }}
                                        onValueChange={(value) => {
                                            updateValue(value, i)
                                        }}
                                        onLabelChange={(label) => {
                                            updateLabel(label, i)
                                        }}
                                        onClear={() => {
                                            clearValue(i)
                                        }}
                                        onDelete={() => {
                                            deleteValue(i)
                                        }}
                                    />
                                </div>
                                <hr />
                            </li>
                        )
                    })}
                </ul>
                <button
                    onClick={() => {
                        addVariable('', '', '')
                    }}
                >
                    Add variable
                </button>
                <button
                    onClick={() => {
                        addVariable('', [''], [''])
                    }}
                >
                    Add list variable
                </button>
                <button
                    onClick={() => {
                        console.log(vars)
                    }}
                >
                    Log variables
                </button>
            </section>

            <section ref={textsSectionRef}>
                <h1>Templates</h1>
                <button onClick={convertAll}>Convert</button>
                <ul style={{ listStyleType: 'none' }}>
                    {textResults.map((t, i) => {
                        return (
                            <li key={i}>
                                {/* <TextPair
                                    info={t}
                                    onUpdateText={(text) => {
                                        updateText(i, text)
                                    }}
                                    onDeleteText={() => {
                                        deleteText(i)
                                    }}
                                /> */}
                                <RichTextPair
                                    info={t}
                                    mode={templateModes[i] ?? 'edit'}
                                    onUpdateText={(text: string) => {
                                        updateText(i, text)
                                    }}
                                    onEdit={() => {
                                        editText(i)
                                    }}
                                    onConvert={() => {
                                        convertOne(i)
                                    }}
                                    onDeleteText={() => {
                                        deleteText(i)
                                    }}
                                />
                            </li>
                        )
                    })}
                </ul>
                <button onClick={addText}>Add Text</button>
            </section>

            <section ref={fileTemplatesSectionRef}>
                <FileTemplates
                    fileTemplates={fileTemplates}
                    variables={vars}
                    environments={environments}
                    currentEnvironmentId={currentEnvironmentId}
                    onAddFileTemplate={addFileTemplate}
                    onUpdateFileTemplate={updateFileTemplate}
                    onDeleteFileTemplate={deleteFileTemplate}
                />
            </section>
        </>
    )
}

export default App
