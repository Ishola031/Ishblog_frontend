import React, { useContext, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { AuthContext } from '../../IsAuth'

const Reply = ({ parentID, replies, repliesLength, fetchReplys, page, hasMore, handleParent }) => {
    let rpage = page[parentID]
    let rhasMore = hasMore[parentID] ?? true
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [show, setShow] = useState(true)
    // const { slug } = useParams();

    const { isAuthenticated } = useContext(AuthContext)

    function timeAgo(dateString) {
        const now = new Date();
        const past = new Date(dateString);
        const seconds = Math.floor((now - past) / 1000);

        if (seconds < 60) return `${seconds}s ago`;
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
        return past.toLocaleDateString();
    }

    const handleReply = () => {
        fetchReplys()
    }

    return (
        <>
            <div className={`replies ${!show && ('hide')}`} >
                {replies?.length > 0 && (
                    replies.map(rpy => {
                        return (
                            <div className="comment-item" key={`reply-${rpy.id}`}>
                                <div className="comment-profile-picture">
                                    <img src={`${rpy.user.avatar || 'http://127.0.0.1:8000/media/ArticleImage/1.png'}`} alt="" />
                                </div>
                                <div className="comment-header">
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <strong style={{ paddingRight: `${5}px`, fontWeight: `${900}`, color: 'black' }}>{rpy.user.username}</strong>
                                        {rpy.parent ? <p className="comment-content" style={{ paddingRight: `${5}px` }}>{rpy.parent.content}</p> : ''}
                                        <p className="comment-content">{rpy.content}</p>
                                    </div>
                                    <small>{timeAgo(rpy.created_at)}</small>
                                    {isAuthenticated ? <button className="reply-btn" onClick={() => handleParent(rpy.id)}>Reply</button> : ''}
                                    <div className="replies"></div>
                                    <Reply parentID={rpy.id} replies={rpy.repliesItem} repliesLength={rpy.replies.length} fetchReplys={fetchReplys} page={page} hasMore={hasMore} handleParent={handleParent} />
                                    {/* repliesLength={com.replies.length} replies={com.repliesItem} fetchReplys={fetchReplys} page={replyPage[com.id]} hasMore={replyHasMore[com.id] ?? true}  */}
                                </div>
                            </div>
                        )
                    })
                )}
            </div>
            {loading ? (
                <p>loading</p>
            ) : (
                <>
                    {error !== '' && (<p>{error}</p>)}
                    {error !== '' ? (
                        <p className="show-replies" onClick={() => fetchReplys(parentID)}>Retry</p>
                    ) : (
                        rhasMore ? (
                            repliesLength > 0 && (<p className="show-replies" onClick={() => fetchReplys(parentID)}>Show {repliesLength - ((rpage > 1 ? (rpage - 1) : (0)) * 1)} more {repliesLength - ((rpage > 1 ? (rpage - 1) : (0)) * 1) > 1 ? ('replies') : ('reply')} </p>)
                        ) : (
                            <p className="show-replies" onClick={() => setShow(s => !s)}>{show ? ('Hide replies') : ('Show replies')}</p>
                        )
                    )}
                </>
            )}
            {/* <ReplyBtn.Provider value={handleReply}>
                {children}
            </ReplyBtn.Provider> */}
        </>
    )
}


export default Reply
// export { ReplyBtn }
