import { useEffect, useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import { Variable } from './components/Variable'
import { VariableInterface } from './common/variable.interface'
import { TextResultInterface } from './common/textResult.interface'
import { TextPair } from './components/TextPair'
import { getCacheTextResults, getCacheVariables, setTextResultsCache, setVariablesToCache } from './services/cache.service'



function App() {
  const [vars, setVars] = useState<VariableInterface[]>(getCacheVariables())
  const [textResults, SetTextResults] = useState<TextResultInterface[]>((()=>{ 
    let cacheTextResults: TextResultInterface[] = getCacheTextResults()
    if(cacheTextResults.length == 0 ){
      cacheTextResults = [{raw: "", converted: ""},{raw: "", converted: ""},{raw: "", converted: ""}]
    }
      return cacheTextResults
    }
  )())

  useEffect(()=> {
  }, [])

  useEffect(()=> {
    setVariablesToCache(vars)
  }, [vars])

  useEffect(()=> {
    setTextResultsCache(textResults)
  }, [textResults])

  // Functions for Variables
  const addVariable = (key: string, value: string) => {
    setVars([...vars, {
      key: key, value: value
    }])
  }
  const updateKey = (key: string, index: number)=> {
    let nVars  = [...vars]
    nVars[index].key = key
    setVars(nVars)
  }
  const updateValue = (value: string, index: number)=> {
    let nVars  = [...vars]
    nVars[index].value = value
    setVars(nVars)
  }

  const deleteValue = (index: number) =>{
    let newVar = [...vars]
    newVar.splice(index, 1)
    setVars(newVar)
  }

  // Functions for Texts
  const addText = ()=> {
    SetTextResults([...textResults, {raw: "", converted: ""}])
  }

  const updateText = (index: number, raw: string) => {
    let newTexts = [...textResults]
    newTexts[index].raw = raw
    SetTextResults(newTexts)
  }

  const convert = (text:string) => {
    for (let v of vars){
      text = text.replace(new RegExp(`{{${v.key}}}` , 'g'), v.value)
    }
    return text
  }

  const convertAll  = () => {
    let texts = [...textResults]
    for (let t of texts){
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

  return (
    <>
      <section>
        <h1>Variables</h1>
        <ul style={{listStyleType:'none'}}>
          {vars.map((v, i)=>{
            return <li key={i}>
              <Variable 
              info = {{key: v.key, value: v.value}}
              onKeyChange={k => {updateKey(k, i)}}
              onValueChange={value => {updateValue(value, i)}}
              onDelete={()=> {deleteValue(i)}}
              /></li>
          })}
        </ul>
        <button
          onClick={()=> {
            addVariable('', '')
          }}
        >Add Key</button>
      </section>

      <section>
          <h1>Texts</h1>
          <button onClick = {convertAll}>Convert</button>
          <ul style={{listStyleType:'none'}}>
            {textResults.map((t, i)=>{
                return <li key={i}>
                    <TextPair
                      info={t}
                      onUpdateText={text => {updateText(i, text)}}
                      onDeleteText={()=>{deleteText(i)}}
                    />
                  </li>
              })}
          </ul>
          <button onClick={addText}>Add Text</button>
      </section>
    </>
  )
}

export default App
