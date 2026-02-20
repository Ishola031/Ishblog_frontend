import { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../IsAuth';
import { IoSearch } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
const Navbar = () => {
    const [categoryList, setcategoryList] = useState([]);
    const [showCateory, setShowCategory] = useState(false);
    const [showNav, setShowNav] = useState(false);
    const [search, setSearch] = useState('');
    const navigate = useNavigate()
    useEffect(() => {
        const categoryFetch = async () => {
            const responsive = await axios.get('http://127.0.0.1:8000/api/categoryApi')
            setcategoryList(responsive.data)

        };
        categoryFetch();
    }, [])

    useEffect(() => {
        // console.log(categoryList)
    }, [categoryList])

    const handleSearch = (e) => {
        e.preventDefault();

        if (search != '') navigate(`/search/?query=${search}`)
        window.location.reload();
    }

    const handlelogout = () => {
        logout()
    }

    const handleClearSearch = () => {
        setSearch('')
    }
    const { isAuthenticated, logout } = useContext(AuthContext)

    const handlenavbar = () => {

    }

    return (
        <>
            <nav>
                <div className="brandsearch">
                    <h4 className="brand navbrand"><Link to="/">ISH-BLOG</Link></h4>
                    <div className="nav-search">

                        <form className="nav-search-input" onSubmit={handleSearch}>
                            <button className="nav-search-icon" type='submit'><IoSearch size={21} fontWeight={500} cursor={'pointer'} /></button>
                            <input type="text" placeholder="Search..." id="desktopsearchinput" value={search} onChange={(e) => setSearch(e.target.value)} />
                            {search && (
                                <div className="clearsearch" onClick={handleClearSearch}>
                                    <IoMdClose size={21} fontWeight={500} cursor={'pointer'} />
                                </div>
                            )}
                        </form>
                        <div className="nav-search-category nav-search-category-1" onClick={() => setShowCategory(sh => !sh)}>
                            <p>Categories</p>
                            <IoIosArrowDown size={21} fontWeight={500} cursor={'pointer'} />
                        </div>
                        <div className="nav-search-list">
                            <ul className="navsearchlistul" style={{ paddingBottom: 10 + 'px' }}>
                                {/* <li><a href="#">School</a></li> */}
                            </ul>
                        </div>
                        <div className={`nav-category ${showCateory && ('show')}`} >
                            {categoryList.length > 0 ? (
                                categoryList.map(cat => {
                                    return (
                                        <ul key={cat.id}>
                                            <li><Link to={`/${cat.slug}`}>{cat.name}</Link></li>
                                            {cat.subcategory.length > 0 && (
                                                cat.subcategory.map(sub => {
                                                    return (
                                                        <li key={sub.id}><Link to={`/${cat.slug}/${sub.slug}`}>{sub.name}</Link></li>
                                                    )
                                                })
                                            )}
                                        </ul>
                                    )
                                })
                            ) : (
                                <div></div>
                            )}
                        </div>
                    </div>
                </div>
                <ul className="links">
                    <li><Link className='li' to="/">Home</Link></li>
                    <li><Link className='li' to="/">About</Link></li>
                    {isAuthenticated ? (
                        <li><Link className='li' onClick={handlelogout} to="/logout">Log out</Link></li>
                    ) : (
                        <li><Link className='li' to="/register">Sign Up</Link></li>
                    )}
                </ul>
                <button className="nav-menu" data-navbar-toggle onClick={() => setShowNav(sh => !sh)}><IoMdClose size={21} fontWeight={500} cursor={'pointer'} /></button>
            </nav >
            <div className="small-search">
                <div className="nav-search">
                    <div className="nav-search-icon" id="back"><i className="ri-arrow-left-line"></i></div>
                    <div className="nav-search-input"><input type="text" placeholder="Search..." id="small-input" />
                        <div className="clearsearch-1" style={{ paddingRight: 7 + 'px' }}><i className="ri-close-line"></i>
                        </div>
                    </div>
                    <div className="nav-search-category" id="small-nav-search-category">
                        <p style={{ pointerEvents: 'none' }}>Categories</p>
                        <i className="ri-arrow-down-s-line" style={{ fontSize: 20 + 'px' }}></i>
                    </div>
                    <div className="small-search-list">
                        <ul id="smallsearchbox">
                        </ul>
                    </div>
                    <div className="smallcategorylist">
                        {categoryList.length > 0 ? (
                            categoryList.map(cat => {
                                return (
                                    <ul key={cat.id}>
                                        <li>{cat.name}</li>
                                        {cat.subcategory > 0 && (
                                            cat.subcategory.map(sub => {
                                                return (
                                                    <li key={sub.id}>{sub.name}</li>
                                                )
                                            })
                                        )}
                                    </ul>
                                )
                            })
                        ) : (
                            <div></div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Navbar
