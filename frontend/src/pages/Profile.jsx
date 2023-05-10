import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Profile = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [level, setLevel] = useState(sessionStorage.getItem('level'));
  const [age, setAge] = useState(sessionStorage.getItem('age'));
  const [education, setEducation] = useState(sessionStorage.getItem('education'));
  const [fname, setFname] = useState(sessionStorage.getItem('given_name'));
  const [email, setEmail] = useState(sessionStorage.getItem('email'));
  const [lname, setLname] = useState(sessionStorage.getItem('family_name'));
  const [streak, setStreak] = useState(sessionStorage.getItem('streak'));

  useEffect(() => {
    if(sessionStorage.getItem('loggedIn') != "true")
    {
      window.location.href = '/logout';
    }
    else
    {
      setLoggedIn(true);
    }
  }, [])

  return (
    <div>
      <Navbar />
      <section>
        <div className='p-10 grid grid-cols-5'>
          <div className='p-5 col-span-5 text-center'>
            <span className='text-3xl'>Profile</span>
          </div>
          <div></div>
          <div className='col-span-3 flex justify-center mb-5'>
            <img src="https://picsum.photos/300/200" alt="#user" className='rounded-lg' />
          </div>
          <div></div>
          <div></div>
          <div className='col-span-3 flex justify-center'>
            <table className='table'>
              <thead>
                <tr>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email Address</th>
                  <th>Age</th>
                  <th>Education</th>
                  <th>Level</th>
                  <th>Streak</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{fname}</td>
                  <td>{lname}</td>
                  <td>{email}</td>
                  <td>{age}</td>
                  <td>{education}</td>
                  <td>{level}</td>
                  <td>{streak}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div></div>
        </div>
      </section>
      <Footer />
    </div>
  )
}

export default Profile