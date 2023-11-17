import { useCallback, useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import style from './style.module.css'
import { DimensionsContext } from "../common/context/DimensionsContext"
import { MOBILE_MAX_WIDTH } from "../../constants"
import { getItems } from "../../data/services/itemService"
import { SearchResult } from "./SearchResult"

export const Search = ({ autoFocus = false, closeHandler }) => {
    const [searchValue, setSearchValue] = useState('')

    const [searchResults, setSearchResults] = useState([])

    const navigate = useNavigate()

    const { windowWidth } = useContext(DimensionsContext)

    const [width, setWidth] = useState(0)

    useEffect(() => {
        let total = 0

        let step = 10

        const interval = setInterval(() => {
            setWidth(total += step)

            if (step < 50)
                step += 10

            if (total === (windowWidth > MOBILE_MAX_WIDTH ? 300 : 250)) {
                clearInterval(interval)
            }
        }, 20)
    }, [windowWidth])

    const searchValueChangeHandler = useCallback(e => {
        setSearchValue(e.target.value)
    }, [])

    const submitHandler = e => {
        e.preventDefault()
        if (searchValue) {
            navigate('/catalog?search=' + searchValue)
            if (closeHandler) {
                closeHandler()
            }
        }
    }

    const blurHandler = useCallback(() => {
        let step = 10

        let total = width
        const interval = setInterval(() => {
            setWidth((total -= step))

            if (step < 50)
                step += 10

            if (total <= 0) {
                clearInterval(interval)
                closeHandler()
            }
        }, 20)

    }, [closeHandler, width])

    const typeHandler = useCallback(() => {
        getItems({ search: searchValue, itemsPerPage: 5 })
            .then(setSearchResults)
    }, [searchValue])

    const blurSearchHandler = useCallback(() => {
        setTimeout(() => setSearchResults([]), 300)
    }, [])

    return (
        <div className={style.searchBar}>
            <form onSubmit={submitHandler} onBlur={closeHandler && blurHandler}>
                <input
                    style={{ width }}
                    value={searchValue}
                    onChange={searchValueChangeHandler}
                    onKeyUp={typeHandler}
                    onBlur={blurSearchHandler}
                    autoFocus={autoFocus}
                />

                <svg onClick={submitHandler} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>

                <ul className={style.searchBarResultsContainer}>
                    {
                        searchResults.map(i => <SearchResult key={i._id} item={i} searchValue={searchValue} />)
                    }
                </ul>
            </form>
        </div>
    )
}