import { TextResultInterface } from './textResult.interface'
import { VariableInterface } from './variable.interface'
import { EnvironmentInterface } from './environment.interface'
import { FileTemplateInterface } from './fileTemplate.interface'

export interface SaveDocumentInterface {
    variables: VariableInterface[]
    textResults: TextResultInterface[]
    environments: EnvironmentInterface[]
    fileTemplates: FileTemplateInterface[]
}
