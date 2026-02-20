import React from 'react'
import { Link } from 'react-router-dom'
const RightArticle = () => {
    return (
        <>
            <div className="others">
                <h6>Trending</h6>
                <div className="latest-container">
                    <Link to="/" style={{ textDecoration: 'none' }}>
                        <div className="other-blog">
                            <img src="../static/img/topic-1.png" alt="" />
                            <div className="other-blog-detial">
                                <h5>Mastering CSS Grid Layouts: A Comprehensive Guide</h5>
                                <div className="other-blog-cate">

                                </div>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>

        </>
    )
}

export default RightArticle
