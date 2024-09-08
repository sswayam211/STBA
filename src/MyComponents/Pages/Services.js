import React from 'react';
import { Link } from 'react-router-dom';
import "../CSS/ServicesPage.css";


const Services = () => {
    return <div>
        <br/><br/>
        <div className="services-container">
            <h1>Our Services</h1>
            <p>
                Our Student-Teacher Booking Appointment Web App offers a range of services designed to facilitate communication and improve efficiency between students and teachers. Below are the key services we provide:
            </p>
            <div className="service-item">
                <h2>1. Appointment Scheduling</h2>
                <p>
                    Students can easily schedule appointments with their teachers through our intuitive booking system. Choose a convenient date slot and book a session with just a few clicks.
                </p>
            </div>
            <div className="service-item">
                <h2>2. E_Mail Notifications</h2>
                <p>
                    We provide E-Mails to students given addess regarding appointment status and registration status.
                </p>
            </div>
            <div className="service-item">
                <h2>3. Real-Time Notifications</h2>
                <p>
                    Receive real-timer notifications for any updates or changes to your appointments. Stay informed and up-to-date with our notification system.
                </p>
            </div>
            <div className="service-item">
                <h2>4. Secure Login and User Authentication</h2>
                <p>
                    We prioritize the security and privacy of our users. Our platform offers secure login and authentication to protect your personal information and ensure a safe user experience.
                </p>
            </div>
            <div className="service-item">
                <h2>5. Customizable Appointment Slots</h2>
                <p>
                    Teachers can set their availability and customize appointment slots according to their schedules. This flexibility ensures that appointments are convenient for both students and teachers.
                </p>
            </div>
            <p>
                For more information or to start using our services, please <Link to="#">contact us</Link>.
            </p>
        </div>
    </div>;
}


export default Services;