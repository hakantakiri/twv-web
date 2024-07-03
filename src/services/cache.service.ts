import { TextResultInterface } from "../common/textResult.interface"
import { VariableInterface } from "../common/variable.interface"

export const getCacheVariables = () : VariableInterface[]=> {
    const variablesString: string|null = localStorage.getItem('variables')
    if (!variablesString){
        return []
    }
    return JSON.parse(variablesString)
}

export const getCacheTextResults = () : TextResultInterface[]=> {
    const textResultsString: string|null = localStorage.getItem('textResults')
    if (!textResultsString){
        return []
    }
    return JSON.parse(textResultsString)
}

export const setVariablesToCache = (variables: VariableInterface[]) =>  {
    localStorage.setItem('variables', JSON.stringify(variables))
}

export const setTextResultsCache = (textResults: TextResultInterface[]) => {
    localStorage.setItem('textResults', JSON.stringify(textResults))
}