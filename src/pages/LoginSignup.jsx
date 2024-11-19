import { useState } from "react"
import { userService } from "../services/user.service"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service"
import { useNavigate, useParams } from "react-router"
import { login, signup } from "../store/actions/user.actions"
import { AllIcons, SvgIcon } from "../cmps/SvgIcon"
import { Link } from "react-router-dom"

export const LoginSignup = () => {
    const [credentials, setCredentials] = useState(userService.getEmptyCredentials())
    const navigate = useNavigate()
    const { location } = useParams()

    function onChangeInput({ target }) {
        const { name: key, value } = target
        setCredentials(credentials => ({ ...credentials, [key]: value }))
    }

    async function onSubmitLoginSignup(ev) {
        ev.preventDefault()
        const { fullname, username, password, email } = credentials
        try {
            if (location === 'signup') {
                await signup({ fullname, username, password, email })
            }
            else {
                await login({ username, password })
            }
            navigate('/')
            showSuccessMsg(`${location === 'signup' ? 'Signed up' : 'Logged in'} successfully`)
        } catch (error) {
            console.log("Cannot login or sign up", error);
            showErrorMsg(`Failed to ${location === 'signup' ? 'sign up' : 'login'}`)
        }
    }
    const { fullname, username, password, email } = credentials
    return (
        <div className="login-signup">

            <div className="login-signup-container">
                <section className="spotify-logo-and-title">
                    <button onClick={() => navigate('/')} className="btn-spotify">
                        <SvgIcon iconName='spotify' />
                    </button>
                    <h1>{location === "signup" ? "Sign up" : "Log in"} to Spotify</h1>
                </section>
                <form
                    onSubmit={onSubmitLoginSignup}
                    className="login-signup-form">
                    {location === 'signup' &&
                        <label htmlFor="fullname">Full name</label>}
                    {location === 'signup' &&
                        <input
                            value={fullname}
                            name="fullname"
                            type="text"
                            placeholder="Full name"
                            onChange={onChangeInput}
                            required />}
                    <label htmlFor="username">Username</label>
                    <input
                        value={username}
                        name="username"
                        type="text"
                        placeholder="Username"
                        onChange={onChangeInput}
                        required />
                    <label htmlFor="password">Password</label>
                    <input
                        value={password}
                        name="password"
                        type="password"
                        placeholder="Password"
                        onChange={onChangeInput}
                        required />
                    {location === 'signup' &&
                        <label htmlFor="email">Email</label>}
                    {location === 'signup' &&
                        <input
                            value={email}
                            name="email"
                            type="text"
                            placeholder="Email"
                            onChange={onChangeInput}
                            required />}
                    <button className="btn-login-signup">{location === 'signup' ? 'Sign up' : 'Log in'}</button>
                </form>
                <section className="auth-navigation">
                    <span>
                        {location === "login" ? "Don't have an account?" : "Already have an account?"}
                    </span>
                    <Link to={location === "login" ? "/signup" : "/login"}>
                        {location === "login" ? "Sign up for Spotify" : "Log in here"}
                    </Link>
                </section>
            </div>
        </div>
    )
}
