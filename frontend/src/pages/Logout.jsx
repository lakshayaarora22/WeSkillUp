import React, { useEffect } from 'react'

const Logout = () => {

    useEffect(() => {
        if(sessionStorage.getItem('loggedIn') == "true")
        {
            sessionStorage.removeItem('loggedIn');
            sessionStorage.removeItem('email');
            sessionStorage.removeItem('given_name');
            sessionStorage.removeItem('family_name');
            sessionStorage.removeItem('level');
            sessionStorage.removeItem('age');
            sessionStorage.removeItem('education');
        }
        window.location.href = "/login";
    }, [])
    
    return (
    <div>Logout</div>
  )
}

export default Logout