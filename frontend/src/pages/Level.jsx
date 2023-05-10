import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import toast from 'react-hot-toast';

const Level = () => {

    const [level, setLevel] = useState('');
    const [age, setAge] = useState(sessionStorage.getItem('age'));
    const [education, setEducation] = useState(sessionStorage.getItem('education'));
    const [fname, setFname] = useState(sessionStorage.getItem('given_name'));
    const [email, setEmail] = useState(sessionStorage.getItem('email'));
    const [lname, setLname] = useState(sessionStorage.getItem('family_name'));

    const postLevel = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('age', age);
        formData.append('education', `${education}`);
        formData.append('given_name', `${fname}`);
        formData.append('family_name', `${lname}`);
        formData.append('email', `${email}`);
        formData.append('level', `${level}`);

        const response = await fetch('http://127.0.0.1:5000/level',{
            method: 'POST',
            body: formData,
        });

        const result = await response.json();
        if(result['success'])
        {
            sessionStorage.setItem('level', level);
            sessionStorage.setItem('loggedIn', true);
            toast.success('Step 3/3 completed successfully. Logged in now!');
            setTimeout(() => {
                window.location.href = '/profile';
            }, 1000);
        }
        else
        {
            toast.error('User not registered or password is incorrect!');
            setTimeout(() => {
                window.location.href = '/login';
            }, 1000);
        }
    }

  return (
    <div>
      <Navbar />
      <section>
        <div className='grid grid-cols-7 p-10'>
            <div className='col-span-2'></div>
            <div className='col-span-3 px-20'>
                <div className='mb-5 text-center'>
                    <span className='text-3xl font-bold'>Set level</span>
                </div>
                <form onSubmit={postLevel}>
                    <div className='form-control mb-5'>
                        <label htmlFor="level" className="label">
                            <span className="label-text">Level</span>
                        </label>
                        <select name="level" className='select select-bordered' onChange={(e) => setLevel(e.target.value)}>
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advance">Advance</option>
                        </select>
                    </div>
                    <div className='form-control mb-5'>
                        <button type='submit' className='btn btn-success'>Finish profile</button>
                    </div>
                </form>
            </div>
            <div className='col-span-2'></div>
        </div>
      </section>
      <Footer />
    </div>
  )
}

export default Level