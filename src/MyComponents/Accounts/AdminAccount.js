import React, { useState, useEffect } from 'react';
import '../CSS/AdminAccount.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminAccount = (props) => {

    // taking name of the admin to show with welcome message
    const accountHolderName = JSON.parse(localStorage.getItem('accountHolderName'));

    // initializing useState hook 
    // const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const [department, setDepartment] = useState('');
    const [subject, setSubject] = useState('');
    const [password, setPassword] = useState('');
    const [description, setDescription] = useState('');
    const [teachers, setTeachers] = useState([]);
    const [addTeacherForm, setAddTeacherForm] = useState(false);
    const [updateDeleteTeacherForm, setUpdateDeleteTeacherForm] = useState(false);
    const [updateTeacherForm, setUpdateTeacherForm] = useState(false);
    const [searchedTeacherDetails, setSearchedTeacherDetails] = useState(false);
    const [pendingRequests, setPendingRequests] = useState(false);
    const [showPendingRequests, setShowPendingRequests] = useState(false);

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


    // shows add teacher form 
    const toggleAddTeacherForm = () => {
        setAddTeacherForm(prev => !prev);
        setUpdateDeleteTeacherForm(false);
        setUpdateTeacherForm(false);
        setSearchedTeacherDetails(false);
        setPendingRequests(false);
        setMessage('');
    };


    // shows search teacher form 
    const toggleUpdateDeleteTeacherForm = () => {
        setUpdateDeleteTeacherForm(prev => !prev);
        setAddTeacherForm(false);
        setUpdateTeacherForm(false);
        setSearchedTeacherDetails(false);
        setShowPendingRequests(false);
        setMessage('');
    };


    // shows update teacher form 
    const toggleUpdateTeacherForm = () => {
        setUpdateTeacherForm(prev => !prev);
        setUpdateDeleteTeacherForm(false);
        setShowPendingRequests(false);
        setMessage('');
    };


    // shows unapproved requests for registration 
    const togglePendingRequests = () => {
        setShowPendingRequests(prev => !prev);
        setAddTeacherForm(false);
        setUpdateDeleteTeacherForm(false);
        setUpdateTeacherForm(false);
        setSearchedTeacherDetails(false);
        setMessage('');
        showUnapprovedRequests();
    };


    // adds teacher to database (in login and teacher details table )
    const addTeacher = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8081/addteacher', { //sending teaher data to server to data that data in database
                name,
                password,
                email,
                phone,
                gender,
                age,
                department,
                subject,
                description
            });

            if (response.status === 201) {
                setMessage('Teacher registered successfully!');
                // Clear form fields
                setName('');
                setEmail('');
                setPhone('');
                setAge('');
                setGender('');
                setDepartment('');
                setSubject('');
                setPassword('');
                setDescription('');
            }
        } catch (error) {
            setMessage(error.response?.data?.message || 'An error occurred. Please try again.'); // displaying server error if any 
        }
    };


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


    // delete teacher from database 
    const deleteTeacher = async (teacherName, teacherEmail) => {
        const confirmDelete = prompt("Are you sure you want to delete this teacher? Type 'Y' to confirm.");
        if (confirmDelete?.toLowerCase() === "y") {
            try {
                setMessage('Deleting teacher...');

                // Correctly formatting the DELETE request URL
                const response = await axios.delete(`http://localhost:8081/deleteTeacher/${teacherName}/${teacherEmail}`);

                if (response.status === 200) {
                    setMessage('Teacher deleted successfully');
                    setUpdateTeacherForm(false);

                    // Update the list of teachers after deletion
                    setTeachers(prev => prev.filter(teacher => teacher.Teacher_Name !== teacherName && teacher.Teacher_Email !== teacherEmail));
                }
            } catch (error) {
                // Handle 404 errors and other issues
                setMessage(error.response?.status === 404 ? 'Teacher not found.' : 'An error occurred while deleting. Please try again.');
            }
        } else {
            setMessage('Deletion canceled.');
        }
    };


    // updates existing teacher deatils to new details 
    const updateTeacherDetails = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put('http://localhost:8081/updateteacher', { // sending updated teacher details to server to update
                name,
                email,
                phone,
                age,
                department,
                subject,
            });

            if (response.status === 200) {
                setMessage('Teacher details updated successfully!');
                // Clear form fields
                setName('');
                setEmail('');
                setPhone('');
                setAge('');
                setDepartment('');
                setSubject('');
            }
        } catch (error) {
            setMessage(error.response?.data?.message || 'An error occurred. Please try again.');
        }
    };


    // showing Unapproved Requests for registration from database 
    const showUnapprovedRequests = async (e) => {
        // e.preventDefault(); // Prevent form submission reload 
        try {
            // Perform the search request
            const response = await axios.get('http://localhost:8081/unapprovedrequest', {
                // params: { name, department } // Correct parameters for the search
            });

            // If response status is 200 and data is an array
            if (response.status === 200) {
                if (Array.isArray(response.data) && response.data.length > 0) {
                    setPendingRequests(response.data); // Update state with results
                    setMessage(''); // Clear previous messages
                } else {
                    setPendingRequests([]); // Clear results
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

    }


    // approving student request for registration 
    const approveRequest = async (studentSno) => {
        try {
            setMessage('Approving request...');

            const response = await axios.put(`http://localhost:8081/approverequest/${studentSno}`); //sending students data to server

            if (response.status === 200) {
                setMessage('Student data has been saved in the database, and request deleted');
                setPendingRequests(prev => prev.filter(request => request.S_no !== studentSno));
            }
        } catch (error) {
            setMessage(error.response?.status === 404 ? 'Student not found.' : 'An error occurred while approving. Please try again.');
        }
    };


    // cancelling student request for registration
    const cancelRequest = async (studentSno) => {
        if (window.confirm('Are you sure you want to cancel this request?')) {
            try {
                setMessage('Cancelling request...');
                const response = await axios.delete(`http://localhost:8081/cancelrequest/${studentSno}`); // sending student data to server

                if (response.status === 200) {
                    setMessage('Request canceled successfully');
                    setPendingRequests(prev => prev.filter(request => request.S_no !== studentSno));
                }
            } catch (error) {
                setMessage('An error occurred while canceling the request. Please try again.');
            }
        } else {
            setMessage('Request cancellation canceled.');
        }
    };


    // whenever message is changed it will show and remove message automatically in 5 seconds
    useEffect(() => { //
        if (message) {
            const timer = setTimeout(() => setMessage(''), 5000); // Clear message after 5 seconds
            return () => clearTimeout(timer);
        }
    }, [message]);



    return (
        <div className='Account'>
            <div className="welcomeMsg" style={{textTransform:"capitalize"}}> 
                <h2>Welcome {accountHolderName}!</h2>
                <button className="logout" onClick={logout}>Logout</button>
            </div>
            <br /><br /><br />

            <div className="msg">
                <p>Good to see you {accountHolderName}, what do you want to do?</p>
            </div>

            {/* displaying admins function on screen  */}
            <div className="options">
                <button onClick={toggleAddTeacherForm}>Add Teacher</button>
                <button onClick={toggleUpdateDeleteTeacherForm}>Update/Delete Teacher</button>
                <button onClick={togglePendingRequests}>Approve Registration Student</button>
            </div>

            {/* Add New Teacher Form */}
            {addTeacherForm && (
                <div className="container" >
                    <h2>Add New Teacher Form</h2>
                    <form onSubmit={addTeacher} >
                        {message && <p className='successMessage'>{message}</p>}
                        <div className="form-group">
                            <label htmlFor="name">Teacher Name</label>
                            <input autoComplete="off" value={name} onChange={(e) => setName(e.target.value)} type="text" name="name" id="name" required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">E-mail</label>
                            <input autoComplete="off" value={email} onChange={(e) => setEmail(e.target.value)} type="email" name="email" id="email" style={{ textTransform: "none" }} required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="phone">Phone No.</label>
                            <input autoComplete="off" value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" name="phone" id="phone" minLength={10} maxLength={15} required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="gender">Gender</label>
                            <input autoComplete="off" value={gender} onChange={(e) => setGender(e.target.value)} type="text" name="gender" id="gender" required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="age">Age</label>
                            <input autoComplete="off" value={age} onChange={(e) => setAge(e.target.value)} type="number" name="age" id="age" min={18} max={120} required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="department">Department</label>
                            <input autoComplete="off" value={department} onChange={(e) => setDepartment(e.target.value)} type="text" name="department" id="department" required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="subject">Subject</label>
                            <input autoComplete="off" value={subject} onChange={(e) => setSubject(e.target.value)} type="text" name="subject" id="subject" required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password For Teacher</label>
                            <input autoComplete="off" value={password} onChange={(e) => setPassword(e.target.value)} type="text" name="password" id="password" required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="description">Description (Teacher)</label>
                            <input autoComplete="off" value={description} onChange={(e) => setDescription("teacher")} name="description" id="description" required />
                        </div>

                        <div className="form-group">
                            <button type="submit" id="add">Add</button>
                        </div>
                    </form>
                </div>
            )}

            {/* search Teacher Form */}
            {updateDeleteTeacherForm && (
                <div className="container" style={{ paddingBottom: "0px" }}>
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
                    <div className="container" >
                        <h2 style={{textDecoration:"underline"}}>Teacher Details</h2><br />
                        <ul>
                            {teachers.map((teacher) => (
                                <div className="teacherDetails" key={teacher.Teacher_Id} style={{textTransform:"uppercase"}}>
                                    <strong>Name:</strong> {teacher.Teacher_Name} <br />
                                    <strong>Email:</strong> {teacher.Teacher_Email} <br />
                                    <strong>Phone:</strong> {teacher.Teacher_PhoneNo} <br />
                                    <strong>Gender:</strong> {teacher.Teacher_Gender} <br />
                                    <strong>Age:</strong> {teacher.Teacher_Age} <br />
                                    <strong>Department:</strong> {teacher.Teacher_Department} <br />
                                    <strong>Subject:</strong> {teacher.Teacher_Subject} <br /> <br />
                                    <div className="options">
                                        <button onClick={toggleUpdateTeacherForm}>Update Details</button>
                                        <button onClick={() => deleteTeacher(teacher.Teacher_Name, teacher.Teacher_Email)}>Delete</button> {/*delete teacher details from database */}
                                    </div>
                                </div>
                            ))}
                        </ul>
                    </div>
                )
            )}

            {/* Update Teacher Details Form */}
            {updateTeacherForm && (
                <div className="container">
                    <h2>Update Teacher Details Form</h2>
                    <form onSubmit={updateTeacherDetails}>
                        {message && <p className='successMessage'>{message}</p>}
                        <div className="form-group">
                            <label htmlFor="name">Teacher Name</label>
                            <input autoComplete="off" value={name} onChange={(e) => setName(e.target.value)} type="text" name="name" id="name" required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">E-mail</label>
                            <input autoComplete="off" value={email} onChange={(e) => setEmail(e.target.value)} type="email" name="email" id="email" style={{ textTransform: "none" }} required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="phone">Phone No.</label>
                            <input autoComplete="off" value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" name="phone" id="phone" minLength={10} maxLength={15} required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="age">Age</label>
                            <input autoComplete="off" value={age} onChange={(e) => setAge(e.target.value)} type="number" name="age" id="age" min={18} max={120} required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="department">Department</label>
                            <input autoComplete="off" value={department} onChange={(e) => setDepartment(e.target.value)} type="text" name="department" id="department" required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="subject">Subject</label>
                            <input autoComplete="off" value={subject} onChange={(e) => setSubject(e.target.value)} type="text" name="subject" id="subject" required />
                        </div>

                        <div className="form-group">
                            <button type="submit" id="update">Update</button>
                        </div>
                    </form>
                </div>
            )}

            {/* showing request to admin for approval or cancelation from database  */}
            {showPendingRequests && (
                pendingRequests.length > 0 && (
                    <div className="container">
                        <h2 style={{ textDecoration: "underline" }}>Pending Requests</h2>
                        <br />
                        <ul>
                            {pendingRequests.map((request) => ( //displaying student data 1 by 1 in list
                                <div key={request.S_no} style={{ textTransform: "uppercase" }}>
                                    {message && <p className='successMessage'>{message}</p>}
                                    <strong>Name:</strong> {request.Student_Name} <br />
                                    <strong>Password:</strong> {request.Student_Password} <br />
                                    <strong>Email:</strong> {request.Student_Email} <br />
                                    <strong>Phone:</strong> {request.Student_Phone} <br />
                                    <strong>Gender:</strong> {request.Student_Gender} <br />
                                    <strong>Age:</strong> {request.Student_Age} <br />
                                    <strong>Department:</strong> {request.Student_Department} <br />
                                    <div className="options">
                                        <br />
                                        <button onClick={() => approveRequest(request.S_no)}>Approve Request</button> 
                                        <button onClick={() => cancelRequest(request.S_no)}>Cancel Request</button>
                                    </div>
                                    <br />
                                    <hr />
                                    <br />
                                </div>
                            ))}
                        </ul>
                    </div>
                )
            )}

        </div>
    );
}

export default AdminAccount;

