import React, { useEffect, useState } from 'react'
import Article from '../include/Article'
import RightArticle from '../include/RightArticle'
import { Link } from 'react-router-dom'
import axios from 'axios'
import LeftRightContainer from '../include/LeftRightContainer'

const Home = () => {
    const [articleList, setarticleList] = useState([]);
    const [articlecategoryList, setarticlecategoryList] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState('');

    const articleFetchData = async () => {
        try {
            setLoading(true)
            const response = await axios.get('http://127.0.0.1:8000/api/articleApi/');
            setarticleList(response.data);
            const catresponse = await axios.get('http://127.0.0.1:8000/api/categoryarticleApi/');
            setarticlecategoryList(catresponse.data);
            setError('')
        } catch (error) {
            console.error(error)
            setError('Network Error')
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {

        articleFetchData();
    }, []);

    const retry = () => {
        articleFetchData();
    }

    useEffect(() => {
        console.log(articlecategoryList)
        console.log(articleList)
    }, [articlecategoryList, articleList])
    return (
        <>
            <div className="hero-container-wrapper">
                <div className="hero-container">
                    <h5>Everything You Need to Know, All in One Place</h5>
                    <p>From football highlights to education tips, global news, state affairs, and business trends — discover it all
                        here.</p>
                </div>
            </div>

            <div className="blog-wrapper">
                <div className="blog-container">
                    <div className="blog-wrap" id="">
                        <div>
                            <h6>Latest</h6>
                            <div className="blog-box">
                                {loading ? (
                                    <p>Loading</p>
                                ) : (
                                    error ? (
                                        <>
                                            <p>{error}</p>
                                            <button className='linkBtn' onClick={retry}>Retry</button>
                                        </>
                                    ) : (
                                        articleList?.results?.length > 0 ? (
                                            <>
                                                {articleList.results.slice(0, 8).map((art) => {
                                                    return (
                                                        <Article key={art.id} data={art} />
                                                    )
                                                })}
                                                {articleList.next && (<Link className='linkBtn' to="/latest">Show More</Link>)}
                                            </>
                                        ) : (
                                            <div>No articles yet</div>
                                        )
                                    )
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
                        {articlecategoryList.length > 0 ? (
                            articlecategoryList.map(cat => {
                                return (
                                    <>
                                        {cat.articles.length > 0 && (
                                            <div key={cat.id}>
                                                <h6>{cat.name}</h6>
                                                <div className="blog-box">
                                                    {cat.articles.slice(0, 4).map((art) => {
                                                        return (
                                                            <Article key={art.id} data={art} />
                                                        )
                                                    })}
                                                    {cat.articles.length > 4 && (<Link className='linkBtn' to={`/${cat.slug}`}>Show More</Link>)}
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )
                            })
                        ) : (
                            <div></div>
                        )}

                    </div>
                    {/* <button class="blog-lm">Load More Article</button> */}
                </div>
            </div >

        </>
    )
}

export default Home
