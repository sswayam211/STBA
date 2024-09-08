import React, { useState } from 'react'
// import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const RegisterUser = () => {

    const [message, setMessage] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const [department, setDepartment] = useState('');
    const [password, setPassword] = useState('');
    const [description, setDescription] = useState('');

    const RegisterStudent = async (e) => { //performing registration function
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8081/registerstudent', { //sending student data to backend for saving in database
                name,
                password,
                email,
                phone,
                gender,
                age,
                department,
                description
            });

            if (response.status === 201) {
                setMessage('Request to create your account has been sent to admin, once your request is approved, You will get E-mail to your given E-mail address.');
                // Clearing form fields
                setName('');
                setEmail('');
                setPhone('');
                setAge('');
                setGender('');
                setDepartment('');
                setPassword('');
                setDescription('');
            }
        } catch (error) {
            setMessage(error.response?.data?.message || 'An error occurred. Please try again.');
        }
    };


    return (
        <div>
            <div className="bg"><div className="blur"></div></div>
            <div className="container" >
                <br /><br /><br />

                <h1>Create An Account</h1>
                <form action="" onSubmit={RegisterStudent} autoComplete='none'>
                    {message && <p className='successMessage'>{message}</p>}
                    <div className="form-group">
                        <label htmlFor="username">Name</label>
                        <input
                            type="text"
                            id="username"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            autoComplete="off"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">E-Mail</label>
                        <input
                            type="email"
                            id="username"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="off"
                            style={{textTransform:"none"}}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="age">Age</label>
                        <input
                            type="number"
                            id="age"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            autoComplete="off"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="phone">Phone No.</label>
                        <input
                            type="number"
                            id="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            autoComplete="off"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="gender">Gender</label>
                        <input
                            type="text"
                            id="gander"
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            autoComplete="off"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">Student</label>
                        <input
                            type="text"
                            id="student"
                            value={description}
                            onChange={(e) => setDescription("Student")}
                            autoComplete="off"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="department">Department</label>
                        <input
                            type="text"
                            id="department"
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                            autoComplete="off"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="text"
                            id="department"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="off"
                            required
                        />
                        <label htmlFor="Password">Do not forget this password</label>
                    </div>
                    <div className="form-group">
                        <button type="submit" id="createAccountButton">
                            Create Account
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default RegisterUser

