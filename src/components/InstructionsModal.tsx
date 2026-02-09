import React from 'react'

interface InstructionsModalProps {
    isOpen: boolean
    onClose: () => void
}

export const InstructionsModal: React.FC<InstructionsModalProps> = ({
    isOpen,
    onClose,
}) => {
    if (!isOpen) return null

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-button" onClick={onClose}>
                    &times;
                </button>
                <h3>Instructions</h3>
                <p>
                    This tool allows you to generate texts uring variables and
                    templates where those variables will be replaced.
                </p>
                <h3>Variables</h3>
                <p>In this section you can create:</p>
                <ul>
                    <li>
                        Single variables where the <strong>key</strong> is the
                        identifier and the <strong>value</strong> is the value
                        of the variable.
                    </li>

                    <li>
                        Iterative variables where the <strong>key</strong> that
                        whill iterate for as many pairs of{' '}
                        <strong>label</strong> and <strong>value</strong> are.
                    </li>
                </ul>
                <h3>Texts or templates</h3>
                This are the templates that will vary in content dependind on
                the variables.
                <h4>Using single variables</h4>
                <p>To format goes as:</p>
                <code>{'{{key}}'}</code>
                <p>
                    Fer example, if you want to say "Hello" to a bunch of people
                    and change only the name you can create a "name" variable,
                    "name" being the key and having the values "John" or "Jane".
                </p>
                <p>In that case the template would be:</p>
                <code>{'Helllo {{name}}'}</code>
                <p> and if the variable is key: name, value: John</p>
                <p> the result would be:</p>
                <code>{'Helllo John'}</code>
                <h4>Using iterative variables</h4>
                <p>The format goes as:</p>
                <code>
                    {
                        '::: [string] {{key.label}} [string] {{key.value}} [string]'
                    }
                </code>
                <p>
                    For example, if you have a bunch of objects and want to
                    describe their colors. You can have a variables with{' '}
                    <strong>key</strong> objects and many key pairs of{' '}
                    <strong>label</strong> and <strong>value</strong>.
                </p>
                <p>key: objects</p>
                <p>label: apple, value: red</p>
                <p>label: banana, value: yellow</p>
                <p>lable: orange, label: orange</p>
                <p>Then the template would be:</p>
                <code>{'::: color of {{key.label}} is {{key.value}}'}</code>
                <p>And the result would be:</p>
                <code>color of apple is red</code>
                <br />
                <code>color of banana is yellow</code>
                <br />
                <code>color of orange is orange</code>
            </div>
        </div>
    )
}
