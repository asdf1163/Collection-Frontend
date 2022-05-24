import { useState, useCallback } from 'react'
import { Row } from 'react-bootstrap'
import Filter from './Filter'
import Sort from './Sort'

interface Props {
    data: any
    options: string[]
    changeData: React.Dispatch<React.SetStateAction<any>>
}

const Fusion = ({ data, options, changeData }: Props) => {

    const [option, setOption] = useState<string>(options[0])
    const [searchData, setSearchData] = useState(data)

    const changeValue = useCallback((e: any) => {
        changeData(searchData.filter((elem: any) => elem[option].includes(e.target.value)))
    }, [changeData, option, searchData])

    return data ? (
        <Row className="flex-nowrap gap-2 gx-0">
            <Sort changeData={changeData} setSearchData={setSearchData} />
            <Filter data={searchData} changeData={changeValue} option={option} setOption={setOption} options={options} />
        </Row>
    ) : <></>
}

export default Fusion