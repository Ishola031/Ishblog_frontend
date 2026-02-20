import React, { useEffect, useState } from 'react'
import RightArticle from '../include/RightArticle'
import Article from '../include/Article'
import axios from 'axios';
import { Link } from 'react-router-dom';

const Search = () => {
    const [searchArticleList, setSearchArticleList] = useState([]);
    const [latestArticleList, setLatestArticleList] = useState([]);
    const [query, setQuery] = useState('')
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const [hasMore, setHasMore] = useState(true)
    const [page, setpage] = useState(1)


    useEffect(() => {
        setLoading(true)
        const params = new URLSearchParams(window.location.search)
        // const pquery = params.get('query')
        setQuery(() => params.get('query'))
        const handleQuery = async () => {
            try {
                const res = await axios.get(`http://127.0.0.1:8000/api/search/?search=${params.get('query')}`)
                const response = await axios.get('http://127.0.0.1:8000/api/articleApi/');
                console.log(res.data)
                setSearchArticleList(() => res.data.results)
                setLatestArticleList(() => response.data)
                setHasMore(Boolean(res.data.next))
                if (res.data.next) setpage(p => p + 1)
                setError('')
            } catch (error) {
                setError('Network Error')
            } finally {
                setLoading(false)
            }
        };
        handleQuery();
    }, [window.location.search])

    useEffect(() => {
        console.log(searchArticleList)
        console.log(latestArticleList)
    }, [latestArticleList, searchArticleList])

    const handleShowMore = async () => {
        setLoading(true)
        const params = new URLSearchParams(window.location.search)
        // const pquery = params.get('query')
        setQuery(() => params.get('query'))
        const handleMoreQuery = async () => {
            try {
                if (!hasMore) return;
                const res = await axios.get(`http://127.0.0.1:8000/api/search/?search=${params.get('query')}&page=${page}`)
                console.log(res.data)
                setSearchArticleList((art) => [...art, ...res.data.results])
                setHasMore(Boolean(res.data.next))
                if (res.data.next) setpage(p => p + 1)
                setError('')
            } catch (error) {
                setError('Network Error')
            } finally {
                setLoading(false)
            }
        }
        handleMoreQuery();
    }

    return (
        <>
            <div className="blog-wrapper" style={{ paddingTop: '75px' }}>
                <div className="blog-container">
                    <div className="blog-wrap" id="">
                        <div>
                            <h6>Result for {query}</h6>
                            <div className="blog-box">
                                {searchArticleList?.length > 0 ? (
                                    <>
                                        {searchArticleList.map((art) => {
                                            return (
                                                <Article key={art.id} data={art} />
                                            )
                                        })}

                                        {hasMore && (<button className='linkBtn' onClick={handleShowMore}>Show More</button>)}
                                    </>
                                ) : (
                                    !error && !loading && (
                                        <div>No articles </div>
                                    )
                                )}
                                {error && (
                                    <p>{error}</p>
                                )}
                                {loading && (
                                    <p>Loading</p>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="others-container">
                        <RightArticle />
                    </div>
                </div>
            </div>

            <div className="blog-wrapper">
                <div className="blog-container">
                    <div className="blog-wrap" style={{ width: 100 + '%' }} id="categoryarticlelist">
                        <>
                            {latestArticleList?.results?.length > 0 ? (
                                <div>
                                    <h6>Latest</h6>
                                    <div className="blog-box">
                                        {latestArticleList.results.map((art) => {
                                            return (
                                                <Article data={art} key={art.id} />
                                            )
                                        })}
                                        {latestArticleList.next && (<Link className='linkBtn' to='/latest'>Show More</Link>)}
                                    </div>
                                </div>
                            ) : (
                                <div></div>
                            )}


                        </>

                    </div>
                    {/* <button class="blog-lm">Load More Article</button> */}
                </div>
            </div >

        </>
    )
}

export default Search
