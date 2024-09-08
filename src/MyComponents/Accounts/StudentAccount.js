import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const StudentAccount = () => {

    // retreving account holder name from localStorage
    const accountHolderName = JSON.parse(localStorage.getItem('accountHolderName'));


    // initializing useState hook 
    const [error, setError] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [count, setCount] = useState(1);
    const [message, setMessage] = useState('');
    const [allTeachersList, setAllTeachersList] = useState(true);
    const [name, setName] = useState('');
    const [studentName, setStudentName] = useState('');
    const [studentEmail, setStudentEmail] = useState('');
    const [studentPhone, setStudentPhone] = useState('');
    const [appointmentDate, setAppointmentDate] = useState('');
    const [studentMessage, setStudentMessage] = useState('');
    const [department, setDepartment] = useState('');
    const [studentSubject, setStudentSubject] = useState('');
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchedTeacherDetails, setSearchedTeacherDetails] = useState(false);
    const [showAppointmentForm, setShowAppointmentForm] = useState(false);
    const [showSendMessageForm, setSendMessageForm] = useState(false);
    const [searchTeacherForm, setSearchTeacherForm] = useState(false);


    const navigate = useNavigate(); //initialising navigate function to variable


    // logout function 
    const logout = () => {
        // this will help in conferming logout 
        const confirmLogout = prompt("Do you really want to log out? Type 'Y' to confirm.");

        if (confirmLogout?.toLowerCase() === "y") {
            localStorage.removeItem('token'); //removing token from localstorage which is saved earlier
            localStorage.removeItem('data'); //removing data from localstorage which is saved earlier
            navigate('/login', { replace: true }); // navigating back to login page after logout
            localStorage.setItem('accountHolderName', JSON.stringify('')); // saving users name in local storage to show on their account page

            window.location.reload(); //reloading to confirm token and data removal
        }
    };


    // fetching all teachers  details from backend
    useEffect(() => {
        fetch('http://localhost:8081/teachers')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setTeachers(data); // Store the teacher data
                setLoading(false);
            })
            .catch(err => {
                console.log('Error fetching teachers:', err);
                setError('Error loading teacher details');
                setLoading(false);
            });
    }, []);


    // showing search teacher form 
    const toggleSearchTeacherForm = () => {
        setCount(prevCount => prevCount + 1);
        if (count % 2) {
            setSearchTeacherForm(prev => !prev);
            setAllTeachersList(false);
        } else {
            setSearchTeacherForm(false);
            setAllTeachersList(prev => !prev);
        }

        setShowAppointmentForm(false);
        setSendMessageForm(false);
    }


    // showing Appointment booking Form 
    const toggleBookAppointmentFrom = () => {
        setShowAppointmentForm(prev => !prev);
        setSearchTeacherForm(false);
        setSendMessageForm(false);
        setAllTeachersList(false);
        setMessage("");
    }


    // showing Appointment booking Form 
    const toggleSendMessageFrom = () => {
        setSendMessageForm(prev => !prev);
        setShowAppointmentForm(false);
        setSearchTeacherForm(false);
        setAllTeachersList(false);
        setMessage("");
    }


    // seacrchs teacher from teacher details table from database 
    const searchTeacher = async (e) => {
        e.preventDefault(); // Prevent form submission reload 
        try {
            // Perform the search request
            const response = await axios.get('http://localhost:8081/searchteacher', {
                params: { name, department } // parameters for the search
            });

            // If response status is 200 and data is an array
            if (response.status === 200) {
                if (Array.isArray(response.data) && response.data.length > 0) {
                    setTeachers(response.data); // Update state with results
                    setSearchedTeacherDetails(true); // Show teacher details
                    setMessage(''); // Clear previous messages
                } else {
                    setTeachers([]); // Clear results
                    setSearchedTeacherDetails(false); // Hide teacher details
                    setMessage('No teachers found matching your search criteria.');
                }
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setTeachers([]); // Clear results
                setSearchedTeacherDetails(false); // Hide teacher details
                setMessage('No teachers found matching your search criteria.');
            } else {
                setMessage('An error occurred. Please try again later.');
            }
        }
    };


    // booking appointment 
    const bookAppointment = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8081/bookappointment', {
                teacherName: name,
                department: department,
                studentName: studentName,
                studentEmail: studentEmail,
                studentPhone: studentPhone,
                studentSubject: studentSubject,
                appointmentDate: appointmentDate,
                studentMessage: studentMessage
            });

            if (response.status === 200) {
                setMessage('Appointment booked successfully!,You will recive appointment confermation on your E-Mail');
                setErrorMessage('');
                setStudentEmail('');
                setStudentPhone('');
                setStudentSubject('');
                setAppointmentDate('');
                setStudentMessage('');

            } else {
                setErrorMessage('Failed to book appointment.');
                setMessage('');
            }
        } catch (error) {
            setErrorMessage('Teacher You are Booking Appointment for is not available here,please check teacher name and department.');
            setMessage('');
        }
    };


    // sending messaage to teacher
    const sendMessage = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8081/sendmessage', {
                teacherName: name,
                department: department,
                studentName: studentName,
                studentEmail: studentEmail,
                studentPhone: studentPhone,
                studentMessage: studentMessage
            });

            if (response.status === 200) {
                setMessage('Message sent successfully!,You will recive teacher reply on your E-Mail');
                setErrorMessage('');
                setStudentName('');
                setStudentEmail('');
                setStudentPhone('');
                setStudentMessage('');
            } else {
                setErrorMessage('Failed to send message.');
                setMessage('');
            }
        } catch (error) {
            setErrorMessage('Teacher You are send message for is not available here,please check teacher name and department.');
            setMessage('');
        }
    };



    return <>
        <div className="Account">

            <div className="welcomeMsg" style={{ textTransform: "capitalize" }}>
                <h2>Welcome {accountHolderName}!</h2>
                <button className="logout" onClick={logout}>Logout</button>
            </div>
            <br /><br />


            <div className="msg">
                <p>Good to see you {accountHolderName}.</p>
            </div>

            {/* search teacher  button */}
            <div className="options"><button onClick={toggleSearchTeacherForm}>Search Teacher</button></div>


            {/* Show all teachers available */}
            {allTeachersList && (
                <div className="teachers">
                    <div className="container" style={{ width: "80%", padding: "0px" }}>
                        <h2>List of All Teachers Available Here</h2><br />
                        {loading && <div>Loading Teachers...</div>}
                        {error && <div>{error}</div>}
                        <ul style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
                            {teachers.map((teacher) => (
                                <li key={teacher.Teacher_Id} style={{ border: "2px solid black", padding: "20px", margin: "10px" }}>
                                    <div className="teacherdetails" style={{ textTransform: "uppercase" }}>
                                        <strong>Teacher Name:</strong> {teacher.Teacher_Name} <br />
                                        <strong>Email:</strong> {teacher.Teacher_Email} <br />
                                        <strong>Phone:</strong> {teacher.Teacher_PhoneNo} <br />
                                        <strong>Gender:</strong> {teacher.Teacher_Gender} <br />
                                        <strong>Age:</strong> {teacher.Teacher_Age} <br />
                                        <strong>Department:</strong> {teacher.Teacher_Department} <br />
                                        <strong>Subject:</strong> {teacher.Teacher_Subject} <br /><br />
                                        <div className="options">
                                            <button onClick={toggleBookAppointmentFrom}>Book Appointment</button>
                                            <button onClick={toggleSendMessageFrom}>Send Message</button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}


            {/* search teacher form  */}
            {searchTeacherForm && (
                <div className="container" style={{ paddingBottom: "0px", color: "black" }}>
                    <h2>Search Teacher</h2>
                    <form onSubmit={searchTeacher}>
                        <div className="form-group">
                            <label htmlFor="name">Teacher Name</label>
                            <input autoComplete="off" value={name} onChange={(e) => setName(e.target.value)} type="text" name="name" id="name" required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="department">Department</label>
                            <input autoComplete="off" value={department} onChange={(e) => setDepartment(e.target.value)} type="text" name="department" id="department" required />
                        </div>

                        <div className="form-group">
                            <button type="submit" id="search">Search</button>
                        </div>
                    </form>
                    {message && <p>{message}</p>}
                </div>
            )}


            {/* Displaying Search Results */}
            {searchedTeacherDetails && (
                teachers.length > 0 && (
                    <div className="container" style={{ paddingBottom: "0px" }} >
                        <h2 style={{ textDecoration: "underline" }}>Your Searched Teacher Details</h2><br />
                        <ul>
                            {teachers.map((teacher) => (
                                <div className="teacherDetails" key={teacher.Teacher_Id} style={{ textTransform: "uppercase" }}>
                                    <strong>teacher Name:</strong> {teacher.Teacher_Name} <br />
                                    <strong>Email:</strong> {teacher.Teacher_Email} <br />
                                    <strong>Phone:</strong> {teacher.Teacher_PhoneNo} <br />
                                    <strong>Gender:</strong> {teacher.Teacher_Gender} <br />
                                    <strong>Age:</strong> {teacher.Teacher_Age} <br />
                                    <strong>Department:</strong> {teacher.Teacher_Department} <br />
                                    <strong>Subject:</strong> {teacher.Teacher_Subject} <br />
                                    <div className="options">
                                        <button onClick={toggleBookAppointmentFrom}>Book Appointment</button>
                                        <button onClick={toggleSendMessageFrom}>Send Message</button>
                                    </div>
                                    <br />
                                    <hr />
                                </div>
                            ))}
                        </ul>
                    </div>
                )
            )}


            {/* Appointment booking form  */}
            {showAppointmentForm && (
                <div className="container" style={{ paddingBottom: "0px", color: "black" }}>
                    <h2>Book Appointment</h2>
                    {message && <p style={{ color: 'green' }}>{message}</p>}
                    {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                    <form onSubmit={bookAppointment}>

                        <div className="form-group">
                            <label htmlFor="teachername">Teacher Name</label>
                            <input autoComplete="off" value={name} onChange={(e) => setName(e.target.value)} type="text" name="name" id="name" required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="department">Department</label>
                            <input autoComplete="off" value={department} onChange={(e) => setDepartment(e.target.value)} type="text" name="department" id="department" required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="studentname">Your Name</label>
                            <input autoComplete="off" value={studentName} onChange={(e) => setStudentName(e.target.value)} type="text" name="studentname" id="studentname" required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="studentemail">Your E-Mail</label>
                            <input autoComplete="off" value={studentEmail} onChange={(e) => setStudentEmail(e.target.value)} type="email" name="studentemail" id="studentemail" required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="studentphone">Your Phone No.</label>
                            <input autoComplete="off" value={studentPhone} onChange={(e) => setStudentPhone(e.target.value)} type="number" name="department" id="department" required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="studentsubject">Your Subject</label>
                            <input autoComplete="off" value={studentSubject} onChange={(e) => setStudentSubject(e.target.value)} type="text" name="subject" id="subject" required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="appointmentdate">Date of Appointment</label>
                            <input autoComplete="off" value={appointmentDate} onChange={(e) => setAppointmentDate(e.target.value)} type="date" name="appointmentdate" id="appointmentdate" required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="whybooking">Why you want to book this Appointment?</label>
                            <textarea autoComplete="off" value={studentMessage} onChange={(e) => setStudentMessage(e.target.value)} type="text" name="whybooking" id="whybooking" required style={{ fontSize: "15px" }} />
                        </div>

                        <div className="form-group" >
                            <button type="submit" id="search" style={{ width: "fit-content" }}>Book Appointment</button>
                        </div>
                    </form>
                </div>
            )}


            {/* send message form  */}
            {showSendMessageForm && (
                <div className="container" style={{ paddingBottom: "0px", color: "black" }}>
                    <h2>Send Message to Teacher</h2>
                    {message && <p style={{ color: 'green' }}>{message}</p>}
                    {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                    <form onSubmit={sendMessage}>
                        <div className="form-group">
                            <label htmlFor="teachername">Teacher Name</label>
                            <input autoComplete="off" value={name} onChange={(e) => setName(e.target.value)} type="text" name="name" id="name" required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="department">Department</label>
                            <input autoComplete="off" value={department} onChange={(e) => setDepartment(e.target.value)} type="text" name="department" id="department" required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="studentname">Your Name</label>
                            <input autoComplete="off" value={studentName} onChange={(e) => setStudentName(e.target.value)} type="text" name="studentname" id="studentname" required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="studentemail">Your E-Mail</label>
                            <input autoComplete="off" value={studentEmail} onChange={(e) => setStudentEmail(e.target.value)} type="email" name="studentemail" id="studentemail" required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="studentphone">Your Phone No.</label>
                            <input autoComplete="off" value={studentPhone} onChange={(e) => setStudentPhone(e.target.value)} type="number" name="department" id="department" required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="message">Message</label>
                            <textarea autoComplete="off" value={studentMessage} onChange={(e) => setStudentMessage(e.target.value)} type="text" name="message" id="message" placeholder='Write your message here' required style={{ fontSize: "15px" }} />
                        </div>

                        <div className="form-group" >
                            <button type="submit" id="send" style={{ width: "fit-content" }}>Send Message</button>
                        </div>

                    </form>

                </div>
            )}

        </div>
    </>
}



export default StudentAccount;