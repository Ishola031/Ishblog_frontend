import React, { useEffect, useState } from 'react'
import LeftRightContainer from '../include/LeftRightContainer'
import axios from 'axios'
import { Link, useParams } from 'react-router-dom'
import Article from '../include/Article'
const Category = () => {
    const [articlecategoryList, setarticlecategoryList] = useState({});
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const { categoryName } = useParams();
    const [hasMore, setHasMore] = useState(true)
    useEffect(() => {
        const articlecategoryFetch = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/categoryarticleApi/?&slug=${categoryName}`)
                setarticlecategoryList(response.data)
                if (response.data.articles.next) setPage(p => p + 1)
                setHasMore(Boolean(response.data.articles.next));
            } catch (error) {

            }
        };
        if (categoryName) articlecategoryFetch();
    }, [categoryName]);

    useEffect(() => {
        console.log(articlecategoryList)
    }, [articlecategoryList])

    const moreArticleCategory = async () => {
        try {
            if (!hasMore) return;
            const response = await axios.get(`http://127.0.0.1:8000/api/categoryarticleApi/?&slug=${categoryName}&page=${page}`)
            setarticlecategoryList(cat => ({
                ...cat,
                articles: {
                    ...cat.articles,
                    results: [
                        ...cat.articles.results,
                        ...response.data.articles.results
                    ]
                }
            }))

            if (response.data.articles.next) setPage(p => p + 1)
            setHasMore(Boolean(response.data.articles.next));
        } catch (error) {

        }
    };

    return (
        <>
            <LeftRightContainer>
                <>
                    {articlecategoryList?.articles?.results?.length > 0 ? (
                        <div>
                            <h6 style={{ background: 'transparent', textAlign: 'center', color: '#01bb88' }} id="categoryname">{articlecategoryList?.category?.name}</h6>
                            <div className="blog-box">
                                {articlecategoryList.articles.results.map(cat => {
                                    return (
                                        <Article data={cat} key={cat.id} />
                                    )
                                })}

                            </div>
                            {hasMore && (
                                <button onClick={moreArticleCategory}>Show More</button>
                            )}
                        </div>
                    ) : (
                        <>
                            <div>
                                <h6 style={{ background: 'transparent', textAlign: 'center', color: '#01bb88' }} id="categoryname">{articlecategoryList?.category?.name}</h6>
                            </div>
                            <p>There is no artcle related to {articlecategoryList?.category?.slug}. Checkout the subcategories of {articlecategoryList?.category?.slug}.</p>
                        </>
                    )}
                    {articlecategoryList?.category?.subcategory?.length > 0 && (
                        articlecategoryList.category.subcategory.map(sub => {
                            return (
                                sub.articles.length > 0 && (
                                    <div key={sub.id}>
                                        <h6>{sub.name}</h6>
                                        <div className="blog-box">
                                            {sub.articles.map(art => {
                                                return (
                                                    <Article data={art} key={art.id} />
                                                )
                                            })}

                                        </div>
                                    </div>
                                )
                            )
                        })
                    )}
                </>
            </LeftRightContainer>
        </>
    )
}

export default Category
