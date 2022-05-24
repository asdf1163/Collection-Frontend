import React from 'react'
import { Dropdown } from 'react-bootstrap'
import { MdSort } from 'react-icons/md'
import { Icollection } from '../../interfaces/collections.interfaces'


enum Isort {
    NEWEST = "newest",
    OLDEST = "oldest",
}

interface Props {
    changeData: React.Dispatch<React.SetStateAction<any>>
    setSearchData: React.Dispatch<React.SetStateAction<any>>
}

const Sort = ({ changeData, setSearchData }: Props) => {

    const handleSort = (sortOption: Isort) => {
        switch (sortOption) {
            case Isort.NEWEST: {
                setSearchData((collections: Icollection[]) => [...collections].sort((collectionA, collectionB) => (collectionA.creationDate > collectionB.creationDate) ? -1 : 1))
                return changeData((collections: Icollection[]) => [...collections].sort((collectionA, collectionB) => (collectionA.creationDate > collectionB.creationDate) ? -1 : 1))
            }
            case Isort.OLDEST: {
                setSearchData((collections: Icollection[]) => [...collections].sort((collectionA, collectionB) => (collectionA.creationDate < collectionB.creationDate) ? -1 : 1))
                return changeData((collections: Icollection[]) => [...collections].sort((collectionA, collectionB) => (collectionA.creationDate < collectionB.creationDate) ? -1 : 1))
            }
            default: {
                break;
            }
        }
    }

    return (
        <Dropdown className="w-25">
            <Dropdown.Toggle><MdSort size={20} /></Dropdown.Toggle>
            <Dropdown.Menu>
                <Dropdown.Item onClick={() => handleSort(Isort.NEWEST)}>Newest</Dropdown.Item>
                <Dropdown.Item onClick={() => handleSort(Isort.OLDEST)}>Oldest</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    )
}

export default Sort