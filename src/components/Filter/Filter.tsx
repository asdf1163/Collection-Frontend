import React from 'react'
import { FormControl, InputGroup, Dropdown } from 'react-bootstrap'

interface Props {
    data: any
    option: string
    options: string[]
    changeData: React.Dispatch<React.SetStateAction<any>>
    setOption: React.Dispatch<React.SetStateAction<string>>
}

const Filter = ({ data, options, changeData, option, setOption }: Props) => {

    return data.length ? (
        <InputGroup className="w-75">
            <Dropdown>
                <Dropdown.Toggle variant="outline-secondary">{option}</Dropdown.Toggle>
                <Dropdown.Menu>
                    {options.map((option: string, index: number) =>
                        <Dropdown.Item key={option + index} className="text-capitalize" onClick={() => setOption(option)}>{option}</Dropdown.Item>
                    )}
                </Dropdown.Menu>
            </Dropdown>
            <FormControl onChange={changeData} />
        </InputGroup>
    ) : <></>
}

export default Filter