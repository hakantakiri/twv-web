import { TextResultInterface } from "./textResult.interface";
import { VariableInterface } from "./variable.interface";

export interface SaveDocumentInterface {
    variables: VariableInterface[],
    textResults: TextResultInterface[]
}