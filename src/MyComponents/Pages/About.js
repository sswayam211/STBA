import React from 'react';
import { Link } from 'react-router-dom';
import  "../CSS/AboutPage.css";


const About = () => {
    return <div>
        <br/><br/>
        <div className="about-container">
            <h1>About Us</h1>
            <p>
                Welcome to the Student-Teacher Booking Appointment Web App! Our platform is designed to facilitate smooth and efficient communication between students and teachers. We provide a convenient way for students to schedule appointments with their teachers, ensuring they get the guidance and support they need.
            </p>
            <h2>Our Mission</h2>
            <p>
                Our mission is to bridge the gap between students and teachers by providing a seamless appointment scheduling system. We aim to help students easily access the support they need, while also allowing teachers to manage their time and appointments efficiently.
            </p>
            <h2>Features</h2>
            <ul>
                <li>Easy appointment scheduling for students</li>
                <li>Providing E-Mails regarding their appointment and registration status</li>
                <li>Real-time notifications for both students and teachers</li>
                <li>Secure login and user authentication</li>
                <li>Customizable appointment slots for teachers</li>
            </ul>
            <h2>Contact Us</h2>
            <p>
                Have questions or need support? Feel free to reach out to us at <Link to="#">@helpdesk.com</Link>.
            </p>
        </div>

    </div>;
}



export default About;