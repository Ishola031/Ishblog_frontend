import React, { useEffect, useState } from 'react'
import RightArticle from '../include/RightArticle'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import Comments from '../include/Comments'
import MarkdownIt from "markdown-it"
import DOMPurify from "dompurify";

// import ''

const ArticlePage = () => {
    const [article, setarticle] = useState({})
    const { slug } = useParams();
    // console.log(articleSlug)
    useEffect(() => {
        const articleFetch = async () => {
            const response = await axios.get(`http://127.0.0.1:8000/api/articleViewApi/?&articleslug=${slug}`)
            setarticle(response.data)
        };
        articleFetch();
    }, [slug])
    const md = new MarkdownIt();
    const cleanHTML = DOMPurify.sanitize(md.render(String(article.article)));


    return (
        <>
            <div style={{ paddingTop: `${80}px` }}></div>
            <div className="blog-wrapper">
                <div className="blog-container">
                    <div className="artview">
                        <div className="articlebox">
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <div style={{ display: 'flex', gap: `${10}px`, alignItems: 'center' }}>
                                    {article?.category?.name && (<h6 style={{ background: '#01bb88', color: 'white', width: 'auto', fontSize: '17px', textTransform: 'uppercase', padding: '5px 8px' }}>{article.category.name}</h6>)}
                                    {article?.category?.name && (<i className="ri-arrow-right-long-line" style={{ color: '#01bb88' }}>--</i>)}

                                    {article?.category?.name ? (
                                        <h6 style={{ background: 'transparent', color: '#01bb88', fontSize: `${17}px` }} id="categoryname">{article?.subcategory?.name && (article.subcategory.name)}</h6>
                                    ) : (
                                        <h6 style={{ background: '#01bb88', color: 'white', width: 'auto', fontSize: '17px', textTransform: 'uppercase', padding: '5px 8px' }}>{article?.subcategory?.name}</h6>
                                    )}
                                </div>
                            </div>
                            <h5></h5>
                            <p></p>
                            <div className="imgbox">
                                <img src={article.image} alt="" />
                            </div>
                            {/* <p className="article"></p>
                            {md.render(String(article.article))} */}
                            <div
                                className="article"
                                dangerouslySetInnerHTML={{ __html: cleanHTML }}
                            />
                        </div>

                        <Comments articleId={article.id} />
                    </div>
                    <div className="others-container">
                        <RightArticle />
                    </div>
                </div>
            </div>
        </>
    )
}

export default ArticlePage
