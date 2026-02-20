import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import ArticlePage from './ArticlePage'
import SubCategory from './SubCategory'
const CheckUrl = () => {
    const [checkResult, setCheckResult] = useState('')
    const { slug } = useParams()
    useEffect(() => {
        const checkUrlFetch = async () => {
            const responsive = await axios(`http://127.0.0.1:8000/api/checkUrl/?&slug=${slug}`)
            setCheckResult(responsive.data.result)
        };
        checkUrlFetch();
    }, []);
    useEffect(() => {

    }, [checkResult])

    if (checkResult === 'article') {
        return <ArticlePage />
    }
    if (checkResult === 'subcategory') {
        return <SubCategory />
    }
    if (checkResult === '') {

    }
    return (
        <>

        </>
    )
}

export default CheckUrl
