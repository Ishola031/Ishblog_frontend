import axios from 'axios'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Reply from './Reply'
import api from '../../api'
import { AuthContext } from '../../IsAuth'

const Comments = ({ articleId }) => {
    const [comments, setComments] = useState([])
    const [page, setPage] = useState(1)
    const [parent, setParent] = useState(null)
    const [content, setContent] = useState('')
    const [hasMore, setHasMore] = useState(true)
    const [loading, setLoading] = useState(false)
    const { slug } = useParams();

    const [replyPage, setReplyPage] = useState({})
    const [replyHasMore, setReplyHasMore] = useState({})

    const { isAuthenticated } = useContext(AuthContext)
    console.log(isAuthenticated)
    const handleCommentSubmit = async (e) => {
        e.preventDefault();

        const data = {
            article: articleId,
            content,
            parent: parent || null
        };

        try {
            const res = await api.post(
                'api/createcomments/',
                data
            );

            setContent('')
            res.data['repliesItem'] = []

            if (res.data.parent == null) {
                setComments(com => [res.data, ...com])
            } else {
                setComments(com => insertReply(com, parent, res.data))
            }

        } catch (error) {
            console.error(
                error.response?.data || 'Failed to submit comment'
            );
            console.error(error)
        }
    };

    const fetchComments = async () => {
        if (loading || !hasMore) return;
        setLoading(true);
        try {
            const res = await axios.get(
                `http://127.0.0.1:8000/api/listcomments/?articleslug=${slug}&page=${page}`
            );

            const comm = res.data.results.map(com => {
                com['repliesItem'] = []
                return com
            });
            setComments(prev => [...prev, ...comm]);
            setHasMore(Boolean(res.data.next));
            if (res.data.next) setPage(p => p + 1)

        } catch (error) {
            console.error("No internet connection or server error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComments()
    }, [])

    // useEffect(() => {
    //     // console.log(comments)
    //     console.log('before')
    //     console.log(comments)
    //     console.log('replypage', replyPage)
    //     console.log('hasmore ', replyHasMore)
    //     console.log('after')
    // }, [comments])

    const timeAgo = (dateString) => {
        const now = new Date();
        const past = new Date(dateString);
        const seconds = Math.floor((now - past) / 1000);

        if (seconds < 60) return `${seconds}s ago`;
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
        // console.log(past.toLocaleDateString())
        return past.toLocaleDateString();
    }

    const handlePage = () => {
        fetchComments()
    }

    const handleParent = (commentID) => {
        setParent(commentID)
        console.log(commentID)
    }

    const insertReplies = (list, commentID, replies) => {
        return list.map(c => {
            if (c.id === commentID) {
                return {
                    ...c,
                    repliesItem: [...c.repliesItem, ...replies]
                };
            } else if (c.repliesItem.length > 0) {
                return {
                    ...c,
                    repliesItem: insertReplies(c.repliesItem, commentID, replies)
                };
            }
            return c;
        });
    };
    const insertReply = (list, commentID, reply) => {
        return list.map(c => {
            if (c.id === commentID) {
                console.log('target', c.id, commentID)
                return {
                    ...c,
                    repliesItem: [...c.repliesItem, reply]
                };
            } else if (c.repliesItem.length > 0) {
                console.log('target change', c.repliesItem.length)
                return {
                    ...c,
                    repliesItem: insertReply(c.repliesItem, commentID, reply)
                };
            }
            return c;
        });
    };

    const fetchReplys = async (commentID) => {
        const page = replyPage[commentID] ?? 1;
        const rhasMore = replyHasMore[commentID] ?? true;

        if (!rhasMore) return;

        try {
            const res = await axios.get(
                `http://127.0.0.1:8000/api/listrepliescomment/?articleslug=${slug}&cid=${commentID}&page=${page}`
            );

            const replies = res.data.results.map(com => {
                com['repliesItem'] = []
                return com
            });
            setComments(prev => insertReplies(prev, commentID, replies));

            setReplyPage(prev => ({
                ...prev,
                [commentID]: page + 1
            }));

            setReplyHasMore(prev => ({
                ...prev,
                [commentID]: Boolean(res.data.next)
            }));

        } catch (e) {
            console.error(e);
        }
    };


    return (
        <>
            <div className="comment-container">
                <div className="comment-list" style={{ position: 'relative' }}>
                    {isAuthenticated ? (
                        <div className="form" style={{ position: 'sticky', top: 0, background: 'white', paddingBottom: `${10}px` }}>
                            <h4>{parent == null ? 'Comment' : 'Reply'} </h4>
                            <form className="comment-form" onSubmit={handleCommentSubmit}>
                                <textarea name="content" placeholder="Add a comment..." rows="3" required value={content} onChange={(e) => setContent(e.target.value)}></textarea>
                                <button type="submit">Post {parent == null ? 'Comment' : 'Reply'}</button>
                            </form>
                        </div>
                    ) : (
                        <div style={{ margin: ' 10px 0' }}> Not Sign in? <Link to='/register'>Sign Up</Link></div>
                    )}
                    {comments.length > 0 ? (
                        <>
                            {comments.map(com => {
                                return (
                                    <div className="comment-item" key={`comment-${com.id}`}>
                                        <div className="comment-profile-picture">
                                            <img src={`${com.user.avatar || 'http://127.0.0.1:8000/media/ArticleImage/1.png'}`} alt="" />
                                        </div>
                                        <div className="comment-header">
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <strong style={{ paddingRight: `${5}px`, fontWeight: `${900}`, color: 'black' }}>{com.user.username}</strong>
                                                <p className="comment-content">{com.content}</p>
                                            </div>
                                            <small>{timeAgo(com.created_at)}</small>
                                            {isAuthenticated ? <button className="reply-btn" onClick={() => handleParent(com.id)}>Reply</button> : ''}
                                            <div className="replies" id="reply-${comment.id}"></div>
                                            <Reply parentID={com.id} repliesLength={com.replies.length} replies={com.repliesItem} fetchReplys={fetchReplys} page={replyPage} hasMore={replyHasMore} handleParent={handleParent} />
                                        </div>
                                    </div >
                                )
                            })}
                            {hasMore && (<p className='loadMorecomment' style={{ paddingLeft: `${10}px`, cursor: 'pointer' }} onClick={handlePage}>Show More</p>)}
                        </>
                    ) : (
                        <p>No comments. Be the first to comment</p>
                    )}
                </div>

            </div >
        </>
    )
}

export default Comments
