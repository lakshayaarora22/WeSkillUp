import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const DeleteAccount = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [email, setEmail] = useState(sessionStorage.getItem('email'));
    const [password, setPassword] = useState('');
    const [disable, setDisable] = useState(false);

    useEffect(() => {
        if(sessionStorage.getItem('loggedIn') != "true")
        {
            window.location.href = '/logout';
        }
        else
        {
            setLoggedIn(true);
        }
    });

    const deleteAcc = async (e) => {
        e.preventDefault();
        toast('Deleting account...');
        setDisable(true);
        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);
        const response = await fetch(`http://127.0.0.1:5000/deleteAccount/${email}`, {
            method: 'POST',
            body: formData
        });

        const result = await response.json();
        if(Object.keys(result)[0] == 'success')
        {
            toast.success('Deleted account successfully!');
            setTimeout(() => {
                window.location.href = '/logout';
            }, 1000);
        }
        else
        {
            toast.error(`${result['error']}`);
            setTimeout(() => {
                window.location.href = '/logout';
            }, 1000);
        }
    }

  return (
    <div>
        <Navbar />
        <div className='p-5 grid grid-cols-5 min-h-[55vh]'>
            <div className='col-span-5 my-2 text-center'>
                <span className='text-3xl font-bold'>Delete Account!</span> <br /><br />
                <p>
                    Are you sure you want to delete this account? Note that once deleted, you will loose all of your data 
                    and if you decide to rejoin, you will have to register again and start afresh.
                </p>
            </div>
            <div></div>
            <div className='col-span-3 p-5'>
                <form onSubmit={deleteAcc}>
                    <div className='form-control my-2'>
                        <label htmlFor="password" className='label'>
                            <span className='label-text'>
                                Enter password
                            </span>
                        </label>
                        <input type="password" name="password" className='input input-bordered' onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <div className='form-control my-2 flex justify-center items-center'>
                        <button type='submit' className='btn btn-danger w-[20vw]' disabled={disable}>Delete my account!</button>
                    </div>
                </form>
            </div>
            <div></div>
        </div>
        <Footer />
    </div>
  )
}

export default DeleteAccount