import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import toast from 'react-hot-toast';
import Countdown from 'react-countdown';

const MultiplayerGame = () => {
    
    const { roomId } = useParams();
    const [loggedIn, setLoggedIn] = useState(false);
    const [email, setEmail] = useState(sessionStorage.getItem('email'));
    const [socket, setSocket] = useState(io.connect('http://localhost:3000'));
    const [answer, setAnswer] = useState('');
    const [messages, setMessages] = useState(['**** Start of chat ****']);
    const [started, setStarted] = useState(false);
    const [word, setWord] = useState('');
    const [meaning, setMeaning] = useState('');
    const [populate, setPopulate] = useState(messages.map(message => <li>{message}</li>));
    const [disabled, setDisabled] = useState(false);
    const [finished, setFinished] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [now, setNow] = useState(Date.now());
    const [count, setCount] = useState(0);
    const [populateTable, setPopulateTable] = useState(tableData.map((row) => 
    <tr key={row[0]}>
        <td>{row[0]}</td>
        <td>{row[1]}</td>
        <td>{row[2]}</td>
    </tr>
    ));

    useEffect(() => {
        if(sessionStorage.getItem('loggedIn') != "true")
        {
            window.location.href = '/logout';
        }
        else
        {
            setLoggedIn(true);
        }

        socket.on(`receive_message_${roomId}`, (data) => {
            try
            {   
                if(data.user)
                {
                    messages.push(data.user);
                    setCount(data.count);
                    setTimeout(() => {
                        socket.emit('sync_room_count', {count: data.count, roomId: roomId});
                    }, 2000);
                }
                if(data.email && data.message)
                {
                    messages.push(`${data.email}: ${data.message}`);
                }
            }
            catch (err)
            {
                console.log(err);
            }
            setPopulate(messages.map((message, index)=> <li key={index}>{message}</li>));
        });

        socket.on(`trigger_start_${roomId}`, (data) => {
            triggerGame(data.word);
        });

        socket.on(`trigger_disconnect_room_${roomId}`, (data) => {
            if(roomId == data.roomId)
            {
                socket.emit('disconnectRoom', {roomId: roomId, user:email});
                toast('Room disbanded!');
                window.location.href = '/game';
            }
        });

        socket.on(`sync_room_${roomId}`, (data) => {
            setCount(data.count);
        });
        
    }, [socket]);

    const leaveRoom = async (e) => {
        e.preventDefault();
        toast('Exiting...');
        const formData = new FormData();
        formData.append('roomId', `${roomId}`);
        formData.append('email', `${email}`);
        const response = await fetch('http://127.0.0.1:5000/leaveMultiplayerRoom', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();
        
        if(result['success'] == true)
        {
            if(result['owner'] == true)
                socket.emit('triggerDisconnectRoom', {roomId: roomId, user:email});
            else
                socket.emit('disconnectRoom', {roomId: roomId, user:email});

            toast.success('Exited!');
            window.location.href = '/game';
        }
        else
        {
            toast.error('Error! Could not exit!');
        }
    }

    const sendMessage = (e) => {
        e.preventDefault();
        messages.push(`You: ${answer}`);
        setPopulate(messages.map((message, index)=> <li key={index}>{message}</li>));
        socket.emit("send_message", {message: answer, roomId: roomId, email: email});
        setAnswer('');
    }

    const saveMeaning = async (e) => {
        e.preventDefault();
        toast.success('Answer received!');
        setDisabled(true);
        if(meaning == '')
        {
            setMeaning('$');
        }
        const formData = new FormData();
        formData.append('email', email);
        formData.append('word', word);
        formData.append('answer', meaning);
        formData.append('roomId', roomId);
        const response = await fetch('http://127.0.0.1:5000/multiplayerStore', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();
        if (result['registered'])
        {
            console.log(result);
        }
    }

    const startGame = async (e) => {
        e.preventDefault();
        setStarted(true);
        setFinished(false);
        setTableData([]);
        setPopulateTable('');
        setNow(Date.now()+18000);
        messages.push(`You started the game!`);
        setPopulate(messages.map((message, index)=> <li key={index}>{message}</li>));
        socket.emit('send_message', {
            message: `Started the game`, 
            roomId: roomId, 
            email: email
        });
        const formData = new FormData();
        formData.append('mode', 1);
        formData.append('roomId', roomId);
        const response = await fetch('http://127.0.0.1:5000/multiplayerGame', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();
        setWord(result['word']);
        socket.emit('start_game', {
            word:result['word'],
            roomId:roomId,
            email:email
        });
        setTimeout(() => {
            setMeaning('');
            setStarted(false);
            setWord('');
            toast('Loading results...');
            setTimeout(async () => {
                setPopulateTable('');
                setTableData([]);
                console.log(await displayResults());
            }, 3000);
            setFinished(true);
        }, 15000);
    }

    const triggerGame = (word) => {
        setStarted(true);
        setFinished(false);
        setWord(word);
        setTableData([]);
        setPopulateTable('');
        setNow(Date.now()+16000);
        setTimeout(() => {
            setMeaning('');
            setStarted(false);
            setWord('');
            toast('Loading results...');
            setTimeout(async () => {
                setPopulateTable('');
                setTableData([]);
                console.log(await displayResults());
            }, 5000);
            setFinished(true);
        }, 15000);
    }

const displayResults = async () => {
    const formData = new FormData();
    formData.append('roomId', roomId);
    formData.append('mode', 2);
    const response2 = await fetch('http://127.0.0.1:5000/multiplayerGame', {
        method: 'POST',
        body: formData
    });

    const result2 = await response2.json();
    setTableData([]);
    setPopulateTable('');
    let keys = Object.keys(result2);
    keys.map(key => {
        let arr = [];
        arr.push(key);
        arr.push(result2[key]['result']);
        arr.push(result2[key]['answer']);
        tableData.push(arr);
    });

    setPopulateTable(tableData.map((row) => 
        <tr key={row[0]}>
            <td>{row[0]}</td>
            <td>{row[1]}</td>
            <td>{row[2]}</td>
        </tr>
    ));

    setDisabled(false);

    return tableData;
}

  return (
    <div>
        <Navbar />
        <div className='grid grid-cols-3 p-5'>
            <div className='col-span-3 p-5 flex justify-center'>
                <span className='text-3xl font-bold'>Multiplayer Game Room - {roomId}!</span>
            </div>
            <div className='flex justify-start'>
                {!started && (
                    <>
                        <button onClick={startGame} className='btn'>Start</button>  
                    </>
                )}
            </div>
            <div className='flex justify-center'>
                    {started && (
                        <>
                            <span className="font-mono text-xl">
                                <Countdown date={now} intervalDelay={0} precision={3} />
                            </span>
                        </>
                    )}
                    <span className='font-mono text-xl px-5'>Online - {count}</span>
            </div>
            <div className='flex justify-end'>
                <button onClick={leaveRoom} className='btn'>Leave</button>
            </div>
            <div className='col-span-2'>
                {started && (
                    <div className='px-5 grid grid-rows-2 my-2'>
                        <div className='my-2'>
                            <span className='text-2xl'>Word - {word}</span>
                        </div>
                        <div className='my-2'>
                            <form onSubmit={saveMeaning}>
                                <div className='form-control my-2'>
                                    <label htmlFor="meaning" className='label'>
                                        <span className='text-label'>Enter meaning</span>
                                    </label>
                                    <input type="text" name="meaning" className="input input-bordered" onChange={(e) => setMeaning(e.target.value)}/>
                                </div>
                                <div className='form-control flex justify-center my-2'>
                                    <button type='submit' className='btn btn-success w-[15vw]' disabled={disabled} >Submit</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
                {finished && (
                    <div className='p-5'>
                        <table className='table'>
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Accuracy</th>
                                    <th>Answer</th>
                                </tr>
                            </thead>
                            <tbody>
                                {populateTable}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            <div className='grid grid-rows-2 p-5'>
                <div className='p-5'>
                    <ul>
                        {populate}
                    </ul>
                </div>
                <div className=''>
                    <form onSubmit={sendMessage}>
                        <div className='form-control'>
                            <label htmlFor="message">
                                <span className='label-text'>Message</span>
                            </label>
                            <input type="text" name="message" className='input input-bordered' value={answer} onChange={(e) => setAnswer(e.target.value)} />
                        </div>
                        <div className='form-control mt-2'>
                            <button type='submit' className='btn btn-success w-[7vw]'>Send</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <Footer />
    </div>
  )
}

export default MultiplayerGame