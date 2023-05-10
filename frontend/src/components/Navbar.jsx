import React, { useEffect, useState } from 'react'

const Navbar = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    useEffect(() => {
      if (sessionStorage.getItem("loggedIn") !== undefined) 
        {
            if (sessionStorage.getItem("loggedIn") == "true"){
                setLoggedIn(true);
            }
        }
    }, []);
    
  return (
    <div>
        <div className="navbar bg-base-300">
            <div className="flex-1">
                <a className="btn btn-ghost normal-case text-xl" href='/'>VSkillUp</a>
            </div>
            <div className="flex-none">
                <ul className="menu menu-horizontal px-1">
                <li><a href='/'>Home</a></li>
                <li tabIndex={0}>
                    <a>
                    Explore
                    <svg className="fill-current" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/></svg>
                    </a>
                    <ul className="p-2 bg-base-100 z-10">
                    <li><a href='/learn'>Learn</a></li>
                    <li><a href='/dailyChallenge'>Daily Challenge</a></li>
                    <li><a href="/game">Play</a></li>
                    </ul>
                </li>
                {!loggedIn && (
                    <>
                        <li><a href='/login'>Login</a></li>
                        <li><a href='/register'>Register</a></li>
                    </>
                )}
                {loggedIn && (
                    <>
                        <li tabIndex={0}>
                            <a>
                            Profile
                            <svg className="fill-current" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/></svg>
                            </a>
                            <ul className="p-2 bg-base-100 z-10">
                            <li><a href='/profile'>View profile</a></li>
                            <li><a href='/settings'>Settings</a></li>
                            <li><a href="/deleteAccount">Delete account</a></li>
                            </ul>
                        </li>
                        <li><a href="/logout">Logout</a></li>
                    </>
                )}
                
                </ul>
            </div>
        </div>
    </div>
  )
}

export default Navbar