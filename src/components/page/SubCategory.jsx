import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import RightArticle from '../include/RightArticle';
import axios from 'axios'
import Article from '../include/Article';

const SubCategory = () => {
    const [articlesubcategoryList, setarticlesubcategoryList] = useState({});
    const [showstatus, setShowStatus] = useState('');
    const [hasMore, setHasMore] = useState(true)
    const { slug } = useParams();

    const articlecategoryFetch = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/categoryarticleApi/?&slug=${slug}`)
            setarticlesubcategoryList(response.data)
            setHasMore(Boolean(response.data.articles.next));

        } catch (error) {
            // console.error(error)
            setShowStatus('No internet connection')
        }
    };

    const moreArticleCategory = () => {
        if (slug) articlecategoryFetch()
    }
    useEffect(() => {
        if (slug) articlecategoryFetch();
    }, [slug]);





    return (
        <>
            <div className="blog-wrapper" style={{ padding: `${95}px ${30}px` }}>
                <div className="blog-container">
                    <div className="blog-wrap" id="">
                        {articlesubcategoryList?.articles?.results?.length > 0 ? (
                            <div>
                                <h6>{articlesubcategoryList.category.name}</h6>
                                <div className="blog-box">
                                    {articlesubcategoryList.articles.results.map(art => {
                                        return (
                                            <Article data={art} key={art.id} />
                                        )
                                    })}

                                </div>
                                {hasMore && (
                                    <button onClick={moreArticleCategory}>Show More</button>
                                )}
                            </div>
                        ) : (
                            <>
                                {showstatus ? (
                                    <div>{showstatus}</div>
                                ) : (
                                    <div>No articles related with {articlesubcategoryList?.category?.name}</div>
                                )}
                            </>
                        )}
                    </div>
                    <div className="others-container">
                        <div className="others">
                            <h6>Trending</h6>
                            <div className="latest-container">
                                <RightArticle />
                            </div>
                        </div>
                    </div>
                    {/* <button className="blog-lm">Load More Article</button> */}
                </div >
            </div >
        </>
    )
}

export default SubCategory
