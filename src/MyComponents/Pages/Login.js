import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate , Link} from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Initialize navigate for redirection

    const showPassword = () => {

        // showing password when checked on show password
        const passwordField = document.getElementById("password");
        if (passwordField.type === "password") {
            passwordField.type = "text";
        } else {
            passwordField.type = "password";
        }
    };

    // checking whether inputs are filled properly or not 
    const checkLoginInput = () => {
        if (!username || !password) {
            setError('Username & Password must not be empty.');
        } else {
            setError('');
            userAuthentication(); // Call the function directly if inputs are valid
        }
    };

    // processing User Authentication when clicked on login
    const userAuthentication = async () => {
        try {
            const result = await axios.post('http://localhost:8081/login', { username, password });

            if (result.status === 200) {
                setError(''); // Clear previous error messages
                const { token } = result.data; // Retrieve token from response
                localStorage.setItem('token', token); // Save token to local storage
                fetchUserDetails(token); // Fetch user details
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setError('Incorrect username or password.');
            } else {
                setError('An error occurred. Please try again later.');
            }
        }
    };

    const fetchUserDetails = async (token) => {
        try {
            const response = await axios.get('http://localhost:8081/user', {
                headers: { Authorization: `Bearer ${token}` } // Include token in request headers
            });
            console.log(response.data); // User details
            localStorage.setItem('accountHolderName', JSON.stringify(response.data.Username)); // saving users name in local storage to show on their account page
            localStorage.setItem('accountHolderEmail', JSON.stringify(response.data.User_Email)); // saving users name in local storage to show on their account page
            
            if (response.data.Description?.toLowerCase() === 'admin') {
                navigate('/admin'); // Redirect user to the admin page if successful
            }
            else if (response.data.Description?.toLowerCase() === 'student') {
                navigate('/student'); // Redirect user to the admin page if successful
            }
            else if (response.data.Description?.toLowerCase() === 'teacher') {
                navigate('/teacher'); // Redirect user to the admin page if successful
            }
        } catch (error) {
            console.error('Error fetching user details:', error);
            setError('Failed to fetch user details.');
        }
    };

    return (
        <div className="bg">
            {/* Display error message if login fails */}
            {error && (
                <div className="result error">
                    <p>
                        <strong>Error</strong>: {error}
                    </p>
                </div>
            )}

            <div className="blur">
                <div className="container">
                    <h1>Login to your Account</h1>
                    <form onSubmit={(e) => e.preventDefault() /* Prevent default form submission */}>
                        <div className="form-group">
                            <label htmlFor="username">Username / e-mail</label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                autoComplete="off"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group checkbox">
                            <input
                                type="checkbox"
                                id="showpassword"
                                onClick={showPassword}
                                style={{cursor:"pointer"}}
                            />
                            <lable htmlFor="showpassword" style={{display:"inline"}}>Show Password</lable>
                        </div>

                        <div className="form-group">
                            <button type="submit" onClick={checkLoginInput} id="loginFormButton">
                                Login
                            </button>
                        </div>
                    </form>

                    <div style={{padding:"10px"}}>
                        Don't have an Account? No problem <Link to="/register" style={{ color: "#9f9f9f",textDecoration:"underline",cursor:"pointer" }}>Click Here</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
