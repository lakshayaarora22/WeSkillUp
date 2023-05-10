import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import io from 'socket.io-client';
import toast from 'react-hot-toast';

const Multiplayer = () => {
    
    const [socket, setSocket] = useState(io.connect('http://localhost:3000'));
    const [loggedIn, setLoggedIn] = useState(false);
    const [email, setEmail] = useState(sessionStorage.getItem('email'));
    const [RoomId, setRoomId] = useState('');
    const [roomPass, setRoomPass] = useState('');

    useEffect(() => {
        if(sessionStorage.getItem('loggedIn') != "true")
        {
            window.location.href = '/logout';
        }
        else
        {
            setLoggedIn(true);
        }

    }, []);

    const createRoom = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('roomId', `${RoomId}`);
        formData.append('password', `${roomPass}`)
        const response = await fetch('http://127.0.0.1:5000/joinMultiplayerRoom', {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();
        if(result.success == true)
        {
            toast.success(result['message']);
            socket.emit('join_room', {
                roomId: RoomId,
                user: email,
                count: result['count']
            });  
    
            window.location.href = `/multiplayer/${RoomId}`;
        } 
        else
        {
            toast.error(result['message']);
        }
    }

    const joinRoom = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('roomId', `${RoomId}`);
        formData.append('password', `${roomPass}`)
        const response = await fetch('http://127.0.0.1:5000/joinMultiplayerRoom', {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();
        if(result.success == true)
        {
            toast.success(result['message']);
            socket.emit('join_room', {
                roomId: RoomId,
                user: email,
                count: result['count']
            });  
    
            window.location.href = `/multiplayer/${RoomId}`;
        } 
        else
        {
            toast.error(result['message']);
        }

        window.location.href = `/multiplayer/${RoomId}`;
    }

    const generateRoomId = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('email', `${email}`);

        const response = await fetch('http://127.0.0.1:5000/createRoom', {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();
        console.log(result);
        if(result['room_id'])
        {
            setRoomId(result['room_id']);
            setRoomPass(result['password']);
        }
        else
        {
            setRoomId('Set up a room id for yourself!');
        }
    }

  return (
    <div>
        <Navbar />
        <div className='grid grid-cols-4 p-5'>
            <div className='col-span-4 p-5 flex justify-center'>
                <span className='text-3xl font-bold'>Multiplayer challenge!</span>
            </div>
            <div></div>
            <div className='mt-5 p-2 flex justify-center'>
                <label htmlFor='create-modal' className='btn btn-warning'>Create a room</label>
            </div>
            <div className='mt-5 p-2 flex justify-center'>
                <label htmlFor='join-modal' className='btn btn-warning'>Join a room</label>
            </div>
            <div></div>
            <div className='col-span-4 pl-20 py-5'>
                <div className='w-100 flex justify-start'>
                        <span className='text-xl font-bold'>How to play -</span>
                </div>
                <div className='w-100 flex justify-start'>
                <ul className='pl-5'>
                            <li>
                                1. One person creates a room and share the room ID with other users.
                            </li>
                            <li>
                                2. Once everyone joins, the room creator clicks on Start Button to start the game.
                            </li>
                            <li>
                                3. As the game begins, the screen will bring forth a word, that requires to be answered by the 
                                players within a time limit of 10 seconds.
                            </li>
                            <li>
                                4. As per the correctness of the answer, the users will be ranked on the screen.
                            </li>
                            <li>
                                5. Each room will have upto 5 rounds of the above process. Upon completion, the room ID will expire.
                            </li>
                            <li>
                                6. To enjoy unlimited games, subscribe to the premium version of VSkillUp.
                            </li>
                        </ul>
                </div>
            </div>
        </div>
        <Footer />

        <input type="checkbox" id="create-modal" className="modal-toggle" />
            <div className="modal">
            <div className="modal-box">
                
                <form onSubmit={createRoom}>
                    <div className='form-control p-5'>
                        <label className="label">
                            <span className="label-text">Get a room ID</span>
                        </label>
                        <input type="text" className='input input-bordered' value={RoomId} onChange={(e) => setRoomId(e.target.value)} />
                    </div>
                    <div className='form-control p-5'>
                        <label className="label">
                            <span className="label-text">Get a password</span>
                        </label>
                        <input type="text" className='input input-bordered' value={roomPass} onChange={(e) => setRoomPass(e.target.value)} />
                    </div>
                    <div className='form-control p-5 flex justify-center items-center'>
                        <button type='button' onClick={generateRoomId} className='btn btn-warning w-[18vw]'>Generate Room ID</button>
                    </div>
                    <div className='form-control p-5 flex justify-center items-center'>
                        <button type='submit' className='btn btn-primary w-[15vw]'>Create a room</button>
                    </div>
                </form>

                <div className="modal-action">
                <label htmlFor="create-modal" className="btn">Close</label>
                </div>
            </div>
        </div>

        <input type="checkbox" id="join-modal" className="modal-toggle" />
            <div className="modal">
            <div className="modal-box">
                
                <form onSubmit={joinRoom}>
                    <div className='form-control p-5'>
                        <label className="label">
                            <span className="label-text">Enter room ID</span>
                        </label>
                        <input type="text" className='input input-bordered' onChange={(e) => setRoomId(e.target.value)} />
                    </div>
                    <div className='form-control p-5'>
                        <label className="label">
                            <span className="label-text">Enter room password</span>
                        </label>
                        <input type="password" className='input input-bordered' onChange={(e) => setRoomPass(e.target.value)} />
                    </div>
                    <div className='form-control p-5 flex justify-center items-center'>
                        <button type='submit' className='btn btn-primary w-[15vw]'>Join room</button>
                    </div>
                </form>

                <div className="modal-action">
                <label htmlFor="join-modal" className="btn">Close</label>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Multiplayer