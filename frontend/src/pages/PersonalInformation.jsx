import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import toast from 'react-hot-toast';

const PersonalInformation = () => {
    const [age, setAge] = useState(0);
    const [education, setEducation] = useState('');
    const [fname, setFname] = useState(sessionStorage.getItem('given_name'));
    const [email, setEmail] = useState(sessionStorage.getItem('email'));
    const [lname, setLname] = useState(sessionStorage.getItem('family_name'));

    const setPersonalInformation = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('age', age);
        formData.append('education', `${education}`);
        formData.append('given_name', `${fname}`);
        formData.append('family_name', `${lname}`);
        formData.append('email', `${email}`);
        console.log(formData);
        const response = await fetch('http://127.0.0.1:5000/personalInformation', {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();
        if(result['message'] && result['level'])
        {
            toast('Step 2/3 successful');
            sessionStorage.setItem('age', age);
            sessionStorage.setItem('education', education);
            setTimeout(() => {
            window.location.href = '/level';
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
                    <span className='text-3xl font-bold'>Set personal information</span>
                </div>
                <form onSubmit={setPersonalInformation}>
                    <div className='form-control mb-5'>
                        <label htmlFor="age" className='label'>
                            <span className="label-text">Age</span>
                        </label>
                        <input type="number" min="0" className='input input-bordered' placeholder='Enter your age' onChange={(e) => setAge(e.target.value)}/>
                    </div>
                    <div className='form-control mb-5'>
                        <label htmlFor="education" className="label">
                            <span className="label-text">Education</span>
                        </label>
                        <select name="education" className='select select-bordered' onChange={(e) => setEducation(e.target.value)}>
                            <option value="Kindergarten">Kindergarten</option>
                            <option value="Primary School">Primary School</option>
                            <option value="Secondary School">Secondary School</option>
                            <option value="Graduate">Graduate</option>
                            <option value="Post Graduate">Post Graduate</option>
                        </select>
                    </div>
                    <div className='form-control mb-5'>
                        <button type='submit' className='btn btn-success'>Next step</button>
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

export default PersonalInformation