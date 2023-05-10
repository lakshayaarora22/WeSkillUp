import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import Countdown from 'react-countdown';

const OneVsOneGame = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [email, setEmail] = useState(sessionStorage.getItem('email'));
    const [socket, setSocket] = useState(io.connect('http://localhost:3000'));
    const [disable, setDisable] = useState(false);
    const [chance, setChance] = useState(0);
    const { accepter } = useParams();
    const [challenge, setChallenge] = useState('');
    const [word, setWord] = useState('NONE');
    const [answer, setAnswer] = useState('');
    const [now, setNow] = useState(Date.now());
    const [displayResult, setDisplayResult] = useState('');
    
    useEffect(() => {
        if(sessionStorage.getItem('loggedIn') != "true")
        {
            window.location.href = '/logout';
        }
        else
        {
            setLoggedIn(true);
        }

        if(accepter == email.split('@')[0])
        {
            setChance(0);
        }
        else
        {
            setChance(1);
        }

        socket.on(`triggerEndGame_${accepter}`, async (data) => {
            if(data.accepter == accepter)
            {
                toast('User has left the game! Terminating...');
                const formData = new FormData();
                formData.append('creator', email);
                const response = await fetch('http://127.0.0.1:5000/singlePlayerQuit', {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();
                console.log(result);
                setTimeout(() => {
                    socket.emit('disconnectUser', {
                        user: email,
                        accepter: accepter
                    });

                    window.location.href = "/game";
                }, 1000);
            }
        });

        socket.on(`switchChance_${accepter}`, (data) => {
            setChance(data.chance);
        });

        socket.on(`sendChallenge_${accepter}`, (data) => {
            setWord(data.word);
            setNow(Date.now()+18000);
        });

        socket.on(`singlePlayerMessage_${accepter}`, (data) => {
            setDisplayResult(<ul key={0}>
                <li>Word - {data.word}</li>
                <li>Meaning - {data.meaning}</li>
                <li>Accuracy - {data.accuracy}</li>
            </ul>);
        });

    }, [socket]);

    const endGame = async (e) => {
        e.preventDefault();
        toast.success('Closing game...');

        const formData = new FormData();
        formData.append('creator', email);
        const response = await fetch('http://127.0.0.1:5000/singlePlayerQuit', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();
        if(result['success'] == true)
        {
            toast.success('Game owner leaving!');
        }
        else
        {
            toast.success('Game player leaving!');
        }

        socket.emit(`endGame`, {
            accepter: accepter,
            user: email
        });

        setTimeout(() => {
            socket.emit('disconnectUser', {
                user: email,
                accepter: accepter
            });
            window.location.href = "/game";
        }, 1000);
    }

    const switchChance = () => {
        if(chance==0)
        {   
            setChance(1);
            socket.emit('switchChance', {
                accepter: accepter,
                user: email,
                chance: 0
            });
        }
        else
        {
            setChance(0);
            socket.emit('switchChance', {
                accepter: accepter,
                user: email,
                chance: 1
            });
        }
    }

    const sendChallenge = async (e) => {
        e.preventDefault();
        if(challenge!='')
        {
            setDisable(true);
            const formData = new FormData();
            formData.append('word', challenge);
            const response = await fetch('http://127.0.0.1:5000/verifyWord', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if(result['exists']==true)
            {
                socket.emit('sendChallenge', {
                    word: challenge,
                    user: email, 
                    accepter: accepter
                });
            }
            else
            {
                toast.error('Invalid challenge! Word does not exist');
            }

            setDisable(false);
        }
    }

    const recordAnswer = async (e) => {
        e.preventDefault();
        if(answer != '')
        {
            setDisable(true);
            toast('Submitting answer...');
            const formData = new FormData();
            formData.append('word', word);
            formData.append('meaning', answer);
            const response = await fetch('http://127.0.0.1:5000/singlePlayer', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            setDisplayResult(<ul key={0}>
                <li>Word - {word}</li>
                <li>Meaning - {result['meaning']}</li>
                <li>Accuracy - {result['result']}</li>
            </ul>);

            socket.emit('singlePlayerMessage', {
                accepter: accepter,
                user: email,
                word: word,
                meaning: result['meaning'],
                accuracy: result['result']
            });

            setDisable(false);
            switchChance();
            toast.success('Submitted successfully');
        }
    }

  return (
    <div>
        <Navbar />
        <div className='p-5 grid grid-cols-5'>
            <div className='col-span-5 text-center capitalize p-3'>
                <span className='text-2xl font-bold'>{accepter} has been challenged!</span>
            </div>
            <div className='flex justify-start'>
                {chance == 1 && (<>
                    <span className='font-mono text-xl'>
                        <Countdown date={now} intervalDelay={0} precision={3} />
                    </span>
                </>)}
            </div>
            <div className='col-span-3 grid grid-rows-2'>
                <div className='p-5 flex justify-start'>
                    <span className='text-4xl'>Word - {word}</span>
                </div>
                {chance == 0 && (<>
                    <div className='p-5'>
                        <form onSubmit={sendChallenge}>
                            <div className='form-control my-5'>
                                <label htmlFor="word" className="label">
                                    <span className="label-text">Set challenge word!</span>
                                </label>
                                <input type="text" name="word" className='input input-bordered' onChange={(e) => setChallenge(e.target.value)} required={true} />
                            </div>
                            <div className='form-control my-5 flex justify-end items-end'>
                                <button className='btn btn-primary w-[15vw]' type='submit' disabled={disable} >Set challenge!</button>
                            </div>
                        </form>
                    </div>
                </>)}

                {chance == 1 && (<>
                    <div className='p-5'>
                        <form onSubmit={recordAnswer}>
                            <div className='form-control my-5'>
                                <label htmlFor="answer" className="label">
                                    <span className="label-text">Answer</span>
                                </label>
                                <input type="text" name="word" className='input input-bordered' onChange={(e) => setAnswer(e.target.value)} required={true} />
                            </div>
                            <div className='form-control my-5 flex justify-end items-end'>
                                <button className='btn btn-primary w-[15vw]' type='submit' disabled={disable} >Submit!</button>
                            </div>
                        </form>
                    </div>
                </>)}
            </div>
            <div className='flex justify-end'>
                <button className='btn' onClick={endGame}>Exit</button>
            </div>
            <div className='col-span-5 p-5'>
                {displayResult}
            </div>
        </div>
        <Footer />
    </div>
  )
}

export default OneVsOneGame