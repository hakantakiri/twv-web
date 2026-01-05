import { useEffect, useState } from 'react'
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
        let nVars = [...vars]
        nVars[index].key = key
        setVars(nVars)
    }
    const updateValue = (value: string | string[], index: number) => {
        let nVars = [...vars]
        nVars[index].value = value
        setVars(nVars)
    }

    const updateLabel = (label: string | string[], index: number) => {
        let nVars = [...vars]
        nVars[index].label = label
        setVars(nVars)
    }

    const clearValue = (index: number) => {
        let newVar = [...vars]
        newVar[index].value = ''
        setVars(newVar)
    }

    const deleteValue = (index: number) => {
        let newVar = [...vars]
        newVar.splice(index, 1)
        setVars(newVar)
    }

    // Functions for Texts
    const addText = () => {
        SetTextResults([...textResults, { raw: '', converted: '' }])
    }

    const updateText = (index: number, raw: string) => {
        let newTexts = [...textResults]
        newTexts[index].raw = raw
        SetTextResults(newTexts)
    }

    const convert = (text: string) => {
        // For single variables
        for (let v of vars) {
            text = text.replace(
                new RegExp(`{{${v.key}}}`, 'g'),
                String(v.value),
            )
        }
        // Identifies all iterative matches
        let iterableSections = text.match(/:::(.*?):::/g)
        console.log('Found iterable sections')
        console.log(iterableSections)
        if (iterableSections) {
            // Prepares iterations for each match
            for (let i = 0; i < iterableSections.length; i++) {
                let iterableSection = iterableSections[i]
                let resulting = []
                for (let v of vars) {
                    if (
                        Array.isArray(v.value) &&
                        iterableSection.includes(`{{${v.key}.label}}`)
                    ) {
                        let newSectionWithAllVarsReplaced = []
                        for (let j = 0; j < v.value.length; j++) {
                            let newSubForEachVar = iterableSection.slice(3, -3)
                            newSubForEachVar = newSubForEachVar.replace(
                                new RegExp(`{{${v.key}.label}}`, 'g'),
                                String(v.label[j]),
                            )
                            newSubForEachVar = newSubForEachVar.replace(
                                new RegExp(`{{${v.key}.value}}`, 'g'),
                                String(v.value[j]),
                            )
                            newSectionWithAllVarsReplaced.push(newSubForEachVar)
                        }
                        // resulting.push(newSectionWithAllVarsReplaced.join('\n'))
                        resulting.push(
                            newSectionWithAllVarsReplaced.join('<br/>'),
                        )
                    }
                }
                if (resulting.length > 0) {
                    // text = text.replace(iterableSection, resulting.join('\n'))
                    text = text.replace(
                        iterableSection,
                        resulting.join('<br/>'),
                    )
                }
            }
        }
        return text
    }

    const convertAll = () => {
        let texts = [...textResults]
        for (let t of texts) {
            t.converted = convert(t.raw)
        }
        console.log(texts)
        SetTextResults(texts)
    }

    const deleteText = (index: number) => {
        let newTexts = [...textResults]
        newTexts.splice(index, 1)
        SetTextResults(newTexts)
    }

    // Functions for Drag and Drop

    const updatePositionOnSuccessDrag = (
        draggedIndex: number,
        draggedOverIndex: number,
    ) => {
        let newVars = [...vars]
        let draggedItem = newVars[draggedIndex]
        newVars.splice(draggedIndex, 1)
        newVars.splice(draggedOverIndex, 0, draggedItem)
        setVars(newVars)
    }

    return (
        <>
            <Header />
            <section>
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

            <section>
                <h1>Texts</h1>
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
                                    onUpdateText={(text: string) => {
                                        updateText(i, text)
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
        </>
    )
}

export default App
