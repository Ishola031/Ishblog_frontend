import React, { useEffect, useState } from 'react'
import LeftRightContainer from '../include/LeftRightContainer'
import Article from '../include/Article';
import axios from 'axios';

const Latest = () => {
    const [articleList, setarticleList] = useState([]);
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const [hasMore, setHasMore] = useState(true)

    const articleFetch = async () => {
        if (!hasMore) return;
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/articleApi/?page=${page}`)
            // console.log(response.data)
            setarticleList(art => { return [...art, ...response.data.results] })
            if (response.data.next) setPage(p => p + 1)
            setHasMore(Boolean(response.data.next));
        } catch (error) {
            console.error(error)
        }
    };

    useEffect(() => {
        articleFetch();
    }, [])
    useEffect(() => {
        console.log(articleList)
    }, [articleList])
    return (
        <>
            <LeftRightContainer>
                {articleList.length > 0 ? (
                    <>
                        <h6 style={{ background: 'transparent', textAlign: 'center', color: '#01bb88' }} id="categoryname">Latest</h6>
                        <div className="blog-box">
                            {articleList.map(art => {
                                return (
                                    <Article data={art} key={art.id} />
                                )
                            })}
                            {hasMore && (
                                <button className='linkBtn' onClick={() => articleFetch()}>Show More</button>
                            )}
                        </div>

                    </>
                ) : (
                    <p>No article</p>
                )}
            </LeftRightContainer>
        </>
    )
}

export default Latest
