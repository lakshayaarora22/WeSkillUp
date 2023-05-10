import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Game = () => {

    const [loggedIn, setLoggedIn] = useState(false);
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

  return (
    <div>
        <Navbar/>
        <div className='grid grid-cols-2 p-5'>
            <div className='flex justify-center p-5'>
                <div className="card w-96 bg-base-300 shadow-xl">
                    <figure className='pt-10'><img src="https://picsum.photos/300/200?random=1" alt="Shoes" className='rounded' /></figure>
                    <div className="card-body">
                        <h2 className="card-title">One vs One</h2>
                        <p>Challenge a friend and see who is better!</p>
                        <div className="card-actions justify-end">
                        <button className="btn btn-success" onClick={(e) => {window.location.href = "/oneVsOne"}}>Play now</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className='flex justify-center p-5'>
                <div className="card w-96 bg-base-300 shadow-xl">
                    <figure className='pt-10'><img src="https://picsum.photos/300/200?random=2" alt="Shoes" className='rounded' /></figure>
                    <div className="card-body">
                        <h2 className="card-title">Multiplayer</h2>
                        <p>Create a room and add upto 10 friends and play the game!</p>
                        <div className="card-actions justify-end">
                        <button className="btn btn-success" onClick={(e) => {window.location.href = "/multiplayer"}}>Play now</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <Footer/>
    </div>
  )
}

export default Game