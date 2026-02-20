import React from 'react'
import { Link } from 'react-router-dom'
const Article = ({ data }) => {
    const path = data?.category?.name === ''
        ? `/${data.subcategory.slug}/${data.slug}`
        : `/${data?.category?.slug}/${data?.subcategory?.slug}/${data?.slug}`;
    return (
        <>
            <Link to={path} style={{ textDecoration: 'none' }}>
                <div className="blog">
                    <img src={data?.image?.startsWith('http') ? data?.image : `http://127.0.0.1:8000${data?.image}`} />
                    <h5> {data.name}</h5>
                    <p>{data.summary}</p>
                    <div className="blog-cate">
                        {/* <Link to={`/${data.category.slug}`}><div className="cate">{data.category.name}</div></Link>
                        {data.subcategory && (<Link to={`/${data.category.slug}/${data.subcategory.slug}`}><div className="cate">{data.subcategory.name}</div></Link>)} */}
                    </div>
                </div>
            </Link >
        </>
    )
}

export default Article
