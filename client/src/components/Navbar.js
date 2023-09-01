import React, {useEffect, useState} from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import '../App.css';
import {IconContext} from 'react-icons';
import socket from "./Socket";

function Navbar() {
    const [sidebar, setSidebar] = useState(false);
    const showSidebar = () => setSidebar(!sidebar);
    const [userList, setUserList] = useState([]);

    useEffect(() => {
        socket.on("users", (data) => {
            setUserList(data);
        });
    });

    const userConnectedList = userList.map((d) => <li key={d} className='nav-text'>
        <a href='#'>
            <AiIcons.AiOutlineUser/>
            <span>{d}</span>
        </a>
    </li>);

    const lobby = <li className='nav-text'>
        <a href='#'>
            <AiIcons.AiFillHome/>
            <span>Lobby</span>
        </a>
    </li>

    return (
            <IconContext.Provider value={{color: '#fff'}}>
                <div className='navbar'>
                    <a href='#' className='menu-bars'>
                        <FaIcons.FaBars onClick={showSidebar}/>
                    </a>
                </div>
                <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
                    <ul className='nav-menu-items' onClick={showSidebar}>
                        <li className='navbar-toggle'>
                            <a href='#' className='menu-bars'>
                                <AiIcons.AiOutlineClose/>
                            </a>
                        </li>
                        {lobby}
                        {userConnectedList}
                    </ul>
                </nav>
            </IconContext.Provider>
    );
}

export default Navbar;
