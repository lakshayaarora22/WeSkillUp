import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import toast from 'react-hot-toast';
import io from 'socket.io-client';

const OneVsOne = () => {

    const [loggedIn, setLoggedIn] = useState(false);
    const [opponent, setOpponent] = useState('');
    const [email, setEmail] = useState(sessionStorage.getItem('email'));
    const [socket, setSocket] = useState(io.connect('http://localhost:3000'));
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

    }, [socket]);

    const setChallenge = async (e) => {
        e.preventDefault();
        toast('Challenging the opponent!');
        setDisable(true);
        const formData = new FormData();
        formData.append('creator', opponent);
        formData.append('email', email);
        const response = await fetch('http://127.0.0.1:5000/singlePlayerJoin', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (result['success'] == true) {
            setTimeout(() => {
                socket.emit('singlePlayer', {
                    opponent: opponent,
                    user: email,
                    sender: true,
                    receiver: false
                });
                
                let route = opponent.split('@')[0];
                window.location.href = `/singlePlayer/${route}`;
            }, 1000);
        }
        else
        {
            toast.error(result['message']);
        }
    }

    const scanForChallenge = async (e) => {
        e.preventDefault();
        toast('Scanning for challenges');
        setDisable(true);
        const formData = new FormData();
        formData.append('email', email);
        const response = await fetch('http://127.0.0.1:5000/singlePlayerRegister', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();
        if(result['success'] == true)
        {
            setTimeout(() => {
                socket.emit('scanSinglePlayer', {
                    user: email,
                    sender: false,
                    receiver: true
                });
                let route = email.split('@')[0];
                window.location.href = `/singlePlayer/${route}`;
            }, 1000);
        }
        else
        {
            toast.error('Could not create the game!');
        }
    }

  return (
    <div>
        <Navbar />
        <div className='grid grid-cols-3 p-5'>
            <div className='col-span-3 p-5 flex justify-center'>
                <span className='text-3xl font-bold'>One vs One challenge!</span>
            </div>
            <div className='p-5 border-r-2'>
                <div className='w-100 text-center my-2'>
                    <span className='text-xl'>Available challenges!</span>
                </div>
                <div className='w-100 text-center mt-5'>
                    <button onClick={scanForChallenge} className='btn btn-secondary' disabled={disable}>Scan for challenges</button>
                </div>
            </div>
            <div className='col-span-2 p-20'>
                <div className='w-100 text-center my-2'>
                    <span className='text-2xl font-bold'>Challenge a friend!</span>
                    <br />
                    <span className='text-md'>Make sure that your friend is already scanning for challenge before you send them the challenge!</span>
                </div>
                <form onSubmit={setChallenge}>
                    <div className='form-control my-5'>
                        <label htmlFor="email" className="label">
                            <span className="label-text">
                                Email ID of opponent
                            </span>
                        </label>
                        <input type="email" name="email" className='input input-bordered' onChange={(e) => setOpponent(e.target.value)} />
                    </div>
                    <div className='form-control my-5 flex justify-end items-end'>
                        <button type='submit' className='btn btn-success w-[15vw]' disabled={disable}>Send Challenge</button>
                    </div>
                </form>
            </div>
        </div>
        <Footer />
    </div>
  )
}

export default OneVsOne