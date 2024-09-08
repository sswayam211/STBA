import React from 'react';
import { Link } from 'react-router-dom';


const Home = () => {
    return <div>
        <div className="bg">
            <div className="blur">
                <div className="title">
                    <h1>Student-Teacher Booking Appointment</h1>
                </div>
                <div className="get-started">
                    <Link to="/login"><button>Get Started</button></Link>
                </div>
            </div>
        </div>
    </div>;
}


export default Home;