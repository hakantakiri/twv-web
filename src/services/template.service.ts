import { EnvironmentInterface } from '../common/environment.interface'
import { VariableInterface } from '../common/variable.interface'

export interface TemplateConversionContext {
    variables: VariableInterface[]
    environments: EnvironmentInterface[]
    currentEnvironmentId: string
}

const escapeRegExp = (value: string) => {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

const replaceToken = (text: string, key: string, value: string) => {
    if (!key) {
        return text
    }

    return text.replace(new RegExp(`{{${escapeRegExp(key)}}}`, 'g'), value)
}

export const resolveVariables = ({
    variables,
    environments,
    currentEnvironmentId,
}: TemplateConversionContext) => {
    const currentEnv = environments.find((e) => e.id === currentEnvironmentId)

    return variables.map((v) => {
        let newValue = v.value

        if (currentEnv) {
            const replaceInString = (str: string) => {
                let s = str
                for (const envVal of currentEnv.values) {
                    s = replaceToken(s, envVal.key, envVal.value)
                }
                return s
            }

            if (typeof newValue === 'string') {
                newValue = replaceInString(newValue)
            } else if (Array.isArray(newValue)) {
                newValue = newValue.map(replaceInString)
            }
        }

        return { ...v, value: newValue }
    })
}

export const convertTemplate = (
    text: string,
    context: TemplateConversionContext,
) => {
    const resolvedVars = resolveVariables(context)

    for (const v of resolvedVars) {
        text = replaceToken(text, v.key, String(v.value))
    }

    const iterableSections = text.match(/:::(.*?):::/g)
    if (iterableSections) {
        for (let i = 0; i < iterableSections.length; i++) {
            const iterableSection = iterableSections[i]
            const resulting = []
            for (const v of resolvedVars) {
                if (
                    Array.isArray(v.value) &&
                    iterableSection.includes(`{{${v.key}.label}}`)
                ) {
                    const newSectionWithAllVarsReplaced = []
                    for (let j = 0; j < v.value.length; j++) {
                        let newSubForEachVar = iterableSection.slice(3, -3)
                        newSubForEachVar = newSubForEachVar.replace(
                            new RegExp(
                                `{{${escapeRegExp(v.key)}\\.label}}`,
                                'g',
                            ),
                            String(v.label[j]),
                        )
                        newSubForEachVar = newSubForEachVar.replace(
                            new RegExp(
                                `{{${escapeRegExp(v.key)}\\.value}}`,
                                'g',
                            ),
                            String(v.value[j]),
                        )
                        newSectionWithAllVarsReplaced.push(newSubForEachVar)
                    }
                    resulting.push(newSectionWithAllVarsReplaced.join('<br/>'))
                }
            }
            if (resulting.length > 0) {
                text = text.replace(iterableSection, resulting.join('<br/>'))
            }
        }
    }

    return text
}

export const replaceSimpleVariables = (
    text: string,
    context: TemplateConversionContext,
) => {
    let converted = text
    const resolvedVars = resolveVariables(context)

    for (const v of resolvedVars) {
        if (typeof v.value === 'string') {
            converted = replaceToken(converted, v.key, v.value)
        }
    }

    return converted
}

export const replaceFileTemplateVariables = (
    text: string,
    context: TemplateConversionContext,
) => {
    const currentEnv = context.environments.find(
        (e) => e.id === context.currentEnvironmentId,
    )

    return replaceSimpleVariables(
        replaceToken(text, 'environmentName', currentEnv?.name || ''),
        context,
    )
}
