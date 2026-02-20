import React from 'react'
import Article from './Article'
import RightArticle from './RightArticle'
const LeftRightContainer = ({ children }) => {
    return (
        <>
            <div className="blog-wrapper" style={{ padding: `${95}px ${30}px` }}>
                <div className="blog-container">
                    <div className="blog-wrap" id="">
                        {children}
                    </div>
                    <div className="others-container">
                        <RightArticle />
                    </div>
                </div>
            </div>
        </>
    )
}

export default LeftRightContainer