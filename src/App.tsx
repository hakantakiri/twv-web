import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Variable } from './components/Variable'
import { VariableInterface } from './common/variable.interface'
import { TextResultInterface } from './common/textResult.interface'
import { TextPair } from './components/TextPair'



function App() {
  const [count, setCount] = useState(0)
  const [vars, setVars] = useState<VariableInterface[]>([])
  const [textResults, SetTextResults] = useState<TextResultInterface[]>([])

  useEffect(()=> {
    let raw: TextResultInterface = {raw: "", converted: ""}
    let ra1: TextResultInterface = {raw: "", converted: ""}
    let ra2: TextResultInterface = {raw: "", converted: ""}
    SetTextResults([raw, ra1, ra2])
    
  }, [])

  useEffect(()=> {
    console.log(JSON.stringify(vars))
    convertAll()
  }, [vars])


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

  const updateText = (index: number, raw: string) => {
    let newTexts = [...textResults]
    newTexts[index].raw = raw
    newTexts[index].converted = convert(raw)
    SetTextResults(newTexts)
  }

  const convert = (text:string) => {
    for (let v of vars){
      text = text.replace(new RegExp(`{{${v.key}}}` , 'g'), v.value)
    }
    return text
  }

  const convertAll  = () => {
    let texts = textResults
    for (let t of texts){
      t.converted = convert(t.raw)
    }
    console.log(texts)
    SetTextResults(texts)
  }

  return (
    <>
      <section>
        <h1>Variables</h1>
        <ul>
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
          onClick={(e)=> {
            addVariable('', '')
          }}
        >Add Key</button>
      </section>

      <section>
          <h1>Texts</h1>
          <button onClick = {convertAll}>Convert</button>
          {textResults.map((t, i)=>{
              return <li key={i}>
                  <TextPair
                    info={t}
                    onUpdateText={text => {updateText(i, text)}}
                  />
                </li>
            })}
      </section>
    </>
  )
}

export default App
