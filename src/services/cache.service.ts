import { EnvironmentInterface } from '../common/environment.interface'
import { SaveDocumentInterface } from '../common/saveDocument.interface'
import { TextResultInterface } from '../common/textResult.interface'
import { VariableInterface } from '../common/variable.interface'

export const getCacheVariables = (): VariableInterface[] => {
    const variablesString: string | null = localStorage.getItem('variables')
    if (!variablesString) {
        return []
    }
    return JSON.parse(variablesString)
}

export const getCacheEnvironments = (): EnvironmentInterface[] => {
    const environmentsString: string | null =
        localStorage.getItem('environments')
    if (!environmentsString) {
        return []
    }
    return JSON.parse(environmentsString)
}

export const getCacheCurrentEnvironmentId = (): string => {
    return localStorage.getItem('currentEnvironmentId') || ''
}

export const getCacheTextResults = (): TextResultInterface[] => {
    const textResultsString: string | null = localStorage.getItem('textResults')
    if (!textResultsString) {
        return []
    }
    return JSON.parse(textResultsString)
}

export const getCacheToDownload = (): SaveDocumentInterface => {
    return {
        variables: getCacheVariables(),
        textResults: getCacheTextResults(),
        environments: getCacheEnvironments(),
    }
}

export const loadToCacheFromFile = (
    savedDocument: SaveDocumentInterface,
): void => {
    setVariablesToCache(savedDocument.variables)
    setTextResultsCache(savedDocument.textResults)
    setEnvironmentsToCache(savedDocument.environments || [])
    window.location.reload()
}

export const setVariablesToCache = (variables: VariableInterface[]) => {
    localStorage.setItem('variables', JSON.stringify(variables))
}

export const setTextResultsCache = (textResults: TextResultInterface[]) => {
    localStorage.setItem('textResults', JSON.stringify(textResults))
}

export const setEnvironmentsToCache = (
    environments: EnvironmentInterface[],
) => {
    localStorage.setItem('environments', JSON.stringify(environments))
}

export const setCacheCurrentEnvironmentId = (id: string) => {
    localStorage.setItem('currentEnvironmentId', id)
}
