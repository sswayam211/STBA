import React from 'react';
import { NavLink } from 'react-router-dom';


const Header = () => {
    return <div>
        <header>
            <nav className="navbar">
                <ul className="navbar-links">
                    <li><NavLink to="/" >Home</NavLink></li>
                    <li><NavLink to="/about" >About</NavLink></li>
                    <li><NavLink to="/services" >Services</NavLink></li>
                </ul>
            </nav>
        </header>
    </div>;
}


export default Header;