import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const TeacherAccount = () => {
    // retreving account holder name from localStorage
    const accountHolderName = JSON.parse(localStorage.getItem('accountHolderName'));
    const accountHolderEmail = JSON.parse(localStorage.getItem('accountHolderEmail'));

    // initializing useState hook 
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [teacherMessages, setTeacherMessages] = useState('');
    const [appointments, setAppointments] = useState('');
    const [scheduledAppointments, setScheduledAppointments] = useState('');
    const [department, setDepartment] = useState('');
    const [showAllMessages, setShowAllMessages] = useState(false);
    const [showAllAppointments, setShowAllAppointments] = useState(false);
    const [showAllScheduledAppointments, setShowAllScheduledAppointments] = useState(false);


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


    // funtion to display all messages 
    const toggleAllMessages = () => {
        setShowAllMessages(prev => !prev);
        setShowAllAppointments(false);
        setShowAllScheduledAppointments(false);
        fetchAllMessages();
    }


    // funtion to display all appointments 
    const toggleAllAppointments = () => {
        setShowAllAppointments(prev => !prev);
        setShowAllMessages(false);
        setShowAllScheduledAppointments(false);
        fetchAllAppointments();
    }


    // function to display all scheduled appointments 
    const toggleAllScheduledAppointments = () => {
        setShowAllScheduledAppointments(prev => !prev);
        setShowAllMessages(false);
        setShowAllAppointments(false);
        fetchAllscheduledAppointments();
    }


    // fetching all the messages from database 
    const fetchAllMessages = async () => {
        try {
            console.log(accountHolderName, accountHolderEmail);
            const response = await axios.get('http://localhost:8081/teacher/department', {
                params: {
                    name: accountHolderName,
                    email: accountHolderEmail
                }
            });

            if (response.status === 200) {
                const fetchedDepartment = response.data.department;
                setDepartment(fetchedDepartment);
                setError('');
                const messageResponse = await axios.get('http://localhost:8081/messages', {
                    params: {
                        name: accountHolderName,
                        department: fetchedDepartment
                    }
                });

                if (messageResponse.status === 200) {
                    setTeacherMessages(messageResponse.data.messages);
                } else {
                    setError('No messages found.');
                }
            }
        } catch (err) {
            console.error('Error fetching teacher department:', err);
            if (err.response && err.response.status === 404) {
                setError('Teacher not found');
            } else {
                setError('Error fetching teacher department');
            }
        }
    };

    // deleting message of given index
    const deleteMessage = (index, Sno) => {
        console.log(index);
        axios.delete(`http://localhost:8081/messages/${Sno}`)
            .then((response) => {
                if (response.status === 200) {
                    // Remove message from the state after successful deletion
                    const updatedMessages = teacherMessages.filter((_, i) => i !== index);
                    setTeacherMessages(updatedMessages);
                    // setMessage('Message Deteled Succesfully!')
                }
            })
            .catch((error) => {
                console.error('Error deleting message:', error);
            });
    }


    // fetching all the appointments from database 
    const fetchAllAppointments = async () => {
        try {
            console.log(accountHolderName, accountHolderEmail);
            const response = await axios.get('http://localhost:8081/teacher/department', {
                params: {
                    name: accountHolderName,
                    email: accountHolderEmail
                }
            });

            if (response.status === 200) {
                const fetchedDepartment = response.data.department;
                setDepartment(fetchedDepartment);
                setError('');
                const messageResponse = await axios.get('http://localhost:8081/appointments', {
                    params: {
                        name: accountHolderName,
                        department: fetchedDepartment
                    }
                });

                if (messageResponse.status === 200) {
                    setAppointments(messageResponse.data.messages);
                } else {
                    setError('No appointment found');
                }
            }
        } catch (err) {
            console.error('Error fetching teacher department:', err);
            if (err.response && err.response.status === 404) {
                setError('Teacher not found');
            } else {
                setError('Error fetching teacher department');
            }
        }
    };


    // scheduling appointment 
    const scheduleAppointment = async (index, Sno, email) => {
        let teacherContact = prompt("Please provide your contact number so that the student can call you for further details.");

        if (!teacherContact) {
            alert("Contact number cannot be empty. Please try again.");
            return; // Exit if no contact number is provided
        }

        try {
            // Fetch appointment details
            const response = await axios.get(`http://localhost:8081/appointmentdetails/${Sno}`);

            if (response.status === 200) {
                const appointmentDetails = response.data;
                console.log(appointmentDetails);

                // Prepare the data to be saved in the scheduled appointment table
                const appointmentData = {
                    appointmentId: Sno,
                    teacherName: appointmentDetails.Teacher_Name,
                    teacherDepartment: appointmentDetails.Teacher_Department,
                    studentName: appointmentDetails.Student_Name,
                    studentEmail: appointmentDetails.Student_Email,
                    studentPhone: appointmentDetails.Student_Phone,
                    studentSubject: appointmentDetails.Student_Subject,
                    dateOfAppointment: appointmentDetails.Date_of_Appointment,
                    teacherContact: teacherContact
                };

                // Save the appointment details into scheduled_appointment_table
                const saveResponse = await axios.post('http://localhost:8081/schedule-appointment', appointmentData);

                if (saveResponse.status === 200) {
                    // Remove appointment from the state after successful scheduling
                    const updatedAppointments = appointments.filter((_, i) => i !== index);
                    setAppointments(updatedAppointments);
                    setMessage("Appointment scheduled successfully!");
                }
            }
        } catch (error) {
            console.error('Error scheduling appointment:', error);
            setMessage("Error scheduling appointment. Please try again.");
        }
    };


    // cancelling appointment request 
    const cancelAppointment = async (index, Sno, email) => {
        let ression = prompt("Why you want to cancel this appointment?Make sue to give good ression which satisfys student.");
        if (ression === "") {
            cancelAppointment();
        } else {
            console.log(ression);
            axios.delete(`http://localhost:8081/cancelappointment/${Sno}/${email}/${ression}`)
                .then((response) => {
                    if (response.status === 200) {
                        // Remove appointment from the state after successful cancellation
                        const updatedAppointments = appointments.filter((_, i) => i !== index);
                        setAppointments(updatedAppointments);
                        setMessage("Appontment Canceled Succesfully!")
                    }
                })
                .catch((error) => {
                    console.error('Error cancelling appointment:', error);
                });
        }
    }


    // showing scheduled appointments 
    const fetchAllscheduledAppointments = async () => {
        try {
            console.log(accountHolderName, accountHolderEmail);
            const response = await axios.get('http://localhost:8081/teacher/department', {
                params: {
                    name: accountHolderName,
                    email: accountHolderEmail
                }
            });

            if (response.status === 200) {
                const fetchedDepartment = response.data.department;
                setDepartment(fetchedDepartment);
                setError('');
                const messageResponse = await axios.get('http://localhost:8081/scheduledappointments', {
                    params: {
                        name: accountHolderName,
                        department: fetchedDepartment
                    }
                });

                if (messageResponse.status === 200) {
                    setScheduledAppointments(messageResponse.data.messages);
                } else {
                    setError('No scheduled appointments found.');
                }
            }
        } catch (err) {
            console.error('Error fetching teacher department:', err);
            if (err.response && err.response.status === 404) {
                setError('Scheduled appointments not found');
            } else {
                setError('Error fetching teacher department');
            }
        }

    }

    // deleting scheluled appointments 
    const deleteScheduledAppointment = (index, Sno) => {
        axios.delete(`http://localhost:8081/scheduledappointments/${Sno}`)
            .then((response) => {
                if (response.status === 200) {
                    // Remove message from the state after successful deletion
                    const updatedScheduledAppointments = scheduledAppointments.filter((_, i) => i !== index);
                    setScheduledAppointments(updatedScheduledAppointments);
                    setMessage("Scheduled Appointment Deleted Succesfully!");
                }
            })
            .catch((error) => {
                console.error('Error deleting message:', error);
            });
    }



    return <>
        <div className='Account'>
            <div className="welcomeMsg" style={{ textTransform: "capitalize" }}>
                <h2>Welcome {accountHolderName}!</h2>
                <button className="logout" onClick={logout}>Logout</button>
            </div>
            <br /><br />

            <div className="msg">
                <p>
                    E-mail : {accountHolderEmail} <br />
                    {department && <p style={{textTransform:"capitalize"}}>Department: {department}</p>} <br />
                    Good to see you Teacher.<br />
                    <br />What you want to see?
                </p>
            </div>

            {/* displaying admins function on screen  */}
            <div className="options">
                <button onClick={toggleAllMessages}>Messages</button>
                <button onClick={toggleAllAppointments}>Appointments</button>
                <button onClick={toggleAllScheduledAppointments}>Scheduled Appointments</button>
            </div>

            {/* displaying all messages for tearcher  */}
            {showAllMessages && (
                <div className="messages">
                    <div className="container" style={{ width: "80%", padding: "0px" }}>
                        <h2>All Messages</h2>
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                        {/* {message && <p>{message}</p> } */}
                        {teacherMessages.length > 0 ? (
                            <ul style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
                                {teacherMessages.map((msg,index,) => (
                                    <li key={index} style={{ textTransform: "uppercase", border: "2px solid black", padding: "20px", margin: "10px", textAlign: "left" }} >
                                        <strong>Index:</strong> {index + 1} <br />
                                        <strong>Message:</strong> {msg.Student_Message} <br />
                                        <strong>From:</strong> {msg.Student_Name} <br />
                                        <strong>E-Mail:</strong> {msg.Student_Email} <br />
                                        <strong>Phone No:</strong> {msg.Student_Phone} <br />
                                        <div className="options" style={{ textAlign: 'center' }}>
                                            <button onClick={() => { deleteMessage(index, msg.S_no) }}>Delete</button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No messages found currently.</p>
                        )}
                    </div>

                </div>
            )}


            {/* displaying all appointment request for tearcher  */}
            {showAllAppointments && (
                <div className="appointments">
                    <div className="container" style={{ width: "80%", padding: "0px" }}>
                        <h2>All Appointments</h2>
                        {appointments.length > 0 ? (
                            <ul style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
                                {error && <p style={{ color: 'red' }}>{error}</p>}
                                {message && <p>{message}</p>}
                                {appointments.map((msg, index) => (
                                    <li key={index} style={{ textTransform: "uppercase", border: "2px solid black", padding: "20px", margin: "10px", textAlign: "left" }} >
                                        <strong>Index:</strong> {index + 1} <br />
                                        <strong>From:</strong> {msg.Student_Name} <br />
                                        <strong>E-Mail:</strong> {msg.Student_Email} <br />
                                        <strong>Phone No:</strong> {msg.Student_Phone} <br />
                                        <strong>Subject:</strong> {msg.Student_Subject} <br />
                                        <strong>Appointment Date:</strong> {msg.Date_of_Appointment} <br />
                                        <strong>Ression:</strong> {msg.Appointment_Details} <br /><br />
                                        <div className="options" style={{ textAlign: 'center' }}>
                                            <button onClick={() => { scheduleAppointment(index, msg.S_no, msg.Student_Email) }}>Schedule Appointment</button>
                                            <button onClick={() => { cancelAppointment(index, msg.S_no, msg.Student_Email) }}>Cancel</button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No appointments found</p>
                        )}
                    </div>

                </div>
            )}


            {/* displaying all scheduled appointments  */}
            {showAllScheduledAppointments && (
                <div className="scheduledAppointments">
                    <div className="container" style={{ width: "80%", padding: "0px" }}>
                        <h2>All Scheduled Appointments</h2>
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                        {message && <p>{message}</p>}
                        {scheduledAppointments.length > 0 ? (
                            <ul style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
                                {scheduledAppointments.map((msg, index) => (
                                    <li key={index} style={{ textTransform: "uppercase", border: "2px solid black", padding: "20px", margin: "10px", textAlign: "left" }} >
                                        <strong>Index:</strong> {index + 1} <br />
                                        <strong>Student name:</strong> {msg.Student_Name} <br />
                                        <strong>E-Mail:</strong> {msg.Student_Email} <br />
                                        <strong>Phone No:</strong> {msg.Student_Phone} <br />
                                        <strong>Subject:</strong> {msg.Student_Subject} <br />
                                        <strong>Appointment Date:</strong> {msg.Date_of_Appointment} <br />
                                        <div className="options" style={{ textAlign: 'center' }}>
                                            <button onClick={() => { deleteScheduledAppointment(index, msg.S_no,) }}>Delete</button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No scheduled appointments found</p>
                        )}
                    </div>

                </div>
            )}

        </div>
    </>;
}

export default TeacherAccount;