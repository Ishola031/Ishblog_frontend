import React, { useState } from 'react'
import '../signup.css'
import { useNavigate } from 'react-router-dom'
import api from '../../api'
import { REFRESH_TOKEN } from '../../token'
const AuthForm = ({ route, method }) => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)

    const navigate = useNavigate()

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            setLoading(true)
            const res = await api.post(route, { username, password });
            if (method === 'login') {
                setSuccess("Login successful.")
                localStorage.setItem('ACCESS_TOKEN', res.data.access);
                localStorage.setItem('REFRESH_TOKEN', res.data.refresh);
                navigate("/");
                window.location.reload();
            } else {
                setSuccess("Registration successful. Please login.")
                setTimeout(() => {
                    navigate("/login");
                }, 2000)
            }
        } catch {
            console.error(error)
            if (error.response) {
                if (error.response.status === 401) {
                    setError("Invalid Credentials")
                } else if (error.response.status === 400) {
                    setError("Username already exists");
                } else {
                    setError("Something went wrong. Please try again")
                }
            } else if (error.request) {
                setError("Network error. Please check your internet connection.")
            } else {
                setError("Something went wrong. Please try again")
            }
        } finally {
            setLoading(false)
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:8000/accounts/google/login'
    };
    return (
        <>
            <div className="signup-container">
                <form className="signup" style={{ marginTop: `${60}px` }} onSubmit={handleSubmit}>
                    <div className="error" id="error-message">
                        {error && <div>{error}</div>}
                        {success && <div>{success}</div>}
                    </div>
                    {method === 'login' ? (<h5 style={{ fontWeight: 500 }}>Sign <span>In</span></h5>) : (<h5 style={{ fontWeight: 500 }}>Sign <span>Up</span></h5>)}
                    <h5 style={{ fontWeight: 500 }}></h5>
                    <div className="inputbox">
                        <label htmlFor="username">Username</label>
                        <input type="text" name="username" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                    </div>
                    <div className="inputbox">
                        <label htmlFor="password">Password</label>
                        <input type="password" name="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

                    </div>
                    {/* <div className="inputbox">
                        <label htmlFor="confirmpassword">Confirm Password</label>
                        <input type="password" name="confirmpassword" required />
                        <div className="line"></div>
                    </div> */}
                    <button type='submit'>{loading ? ('Loading') : (method === 'register' && !loading ? 'Create Account' : 'login')}</button>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: `${10}px` }}>
                        <div className="line"></div>
                        <p style={{ padding: `${0} ${8}px`, fontSize: `${13}px` }}>or continue with</p>
                        <div className="line"></div>
                    </div>
                    <button type='button' className='google' style={{ marginBottom: `${6}px` }} onClick={handleGoogleLogin}>{method === 'register' ? 'Register with Google' : 'Login with Google'}</button>
                    {method === 'login' && (
                        <p style={{ textAlign: 'center' }}>Don't have an account? <span onClick={() => navigate('/register')}>Register</span></p>
                    )}
                    {method === 'register' && (
                        <p style={{ textAlign: 'center' }}>Already have an account? <span onClick={() => navigate('/login')}>Login</span></p>
                    )}
                </form>
            </div>
        </>
    )
}

export default AuthForm
