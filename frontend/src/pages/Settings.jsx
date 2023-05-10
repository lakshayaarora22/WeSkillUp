import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import toast from 'react-hot-toast';

const Settings = () => {

    const [loggedIn, setLoggedIn] = useState(false);
    const [email, setEmail] = useState(sessionStorage.getItem('email'));
    const [section, setSection] = useState(0);
    const [history, setHistory] = useState([]);
    const [level, setLevel] = useState(sessionStorage.getItem('level'));
    const [disabled, setDisabled] = useState(false);
    const [age, setAge] = useState(sessionStorage.getItem('age'));
    const [education, setEducation] = useState(sessionStorage.getItem('education'));

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

    const loadHistory = async () => {
        toast.success('Fetching history...');
        if(history.length == 0)
        {
            const formData = new FormData();
            formData.append('email', email);
            const response = await fetch('http://127.0.0.1:5000/history', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();
            let dates = Object.keys(result);
            dates.map(date => {
                let arr = [];
                arr.push(date);
                arr.push(result[date]['Word']);
                arr.push(result[date]['Meaning']);
                arr.push(result[date]['Accuracy']);

                history.push(arr);
            });
        }
    }

    const updateLevel = async (e) => {
        e.preventDefault();
        setDisabled(true);
        toast('Updating level...');
        const formData = new FormData();
        formData.append('email', email);
        formData.append('level', level);
        const response = await fetch('http://127.0.0.1:5000/updateLevel', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();
        if(Object.keys(result)[0] == 'success') 
        {
            setTimeout(() => {
                toast.success('Successfully updated level!');
                sessionStorage.setItem('level', level);
                setDisabled(false);
                window.location.href = '/profile';
            }, 1000);
        }
        else
        {
            toast.error('Failed to update the level!');
            setTimeout(() => {
                window.location.href = '/profile';
            }, 1000);
        }
    }

const updatePersonal = async (e) => {
    e.preventDefault();
    setDisabled(true);
    toast('Updating personal information...');
    const formData = new FormData();
    formData.append('email', email);
    formData.append('age', age);
    formData.append('education',education);
    const response = await fetch('http://127.0.0.1:5000/updateLevel', {
        method: 'POST',
        body: formData
    });

    const result = await response.json();
    if(Object.keys(result)[0] == 'success') 
    {
        setTimeout(() => {
            toast.success('Successfully updated personal information!');
            sessionStorage.setItem('age', age);
            sessionStorage.setItem('education', education);
            setDisabled(false);
            window.location.href = '/profile';
        }, 1000);
    }
    else
    {
        toast.error('Failed to update information!');
        setTimeout(() => {
            window.location.href = '/profile';
        }, 1000);
    }
}

  return (
    <div>
        <Navbar />
        <div className='p-5 grid grid-cols-4'>
            <div className='my-5'>
                <ul className="menu bg-base-100 w-56 p-2 rounded-box">
                    <li><a onClick={(e) => {
                        e.preventDefault();
                        loadHistory();
                        setTimeout(() => {
                            setSection(1);
                        }, 2000);
                    }}>View history</a></li>
                    <li><a onClick={(e) => setSection(2)}>Update level</a></li>
                    <li><a onClick={(e) => setSection(3)}>Update profile</a></li>
                </ul>
            </div>
            <div className='col-span-3 min-h-[50vh]'>


                {section == 0 && (<>
                    <div className='p-5 grid grid-rows-2'>
                        <div className='flex justify-center my-2'>
                            <span className='text-3xl'>
                                Welcome {email}
                            </span>
                        </div>
                        <div className='flex justify-center my-2'>
                            <span className='text-2xl'>
                                Select one of the options to continue...
                            </span>
                        </div>
                    </div>
                </>)}

                {section == 1 && (<div className='overflow-x-auto p-5'>
                    <table className='table w-full'>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Word</th>
                                <th>Meaning</th>
                                <th>Accuracy</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.map(record => <tr key={record[0]}>
                                <td>{record[0]}</td>
                                <td>{record[1]}</td>
                                <td>{record[2]}</td>
                                <td>{record[3]}</td>
                            </tr>)}
                        </tbody>
                    </table>
                </div>)}

                {section == 2 && (<>
                    <form className='p-5' onSubmit={updateLevel}>
                        <div className='form-control my-2'>
                            <label htmlFor="level" className='label'>
                                <span className="label-text">New Level</span>
                            </label>
                            <select name="level" className='select select-bordered' value={level} onChange={(e) => setLevel(e.target.value)} required={true}>
                                <option value="Beginner" selected>Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advance">Advance</option>
                            </select>
                        </div>
                        <div className='form-control mt-5 flex justify-end items-end'>
                            <button type='submit' className='btn btn-primary w-[15vw]' disabled={disabled}>Update</button>
                        </div>
                    </form>
                </>)}

                {section == 3 && (<>
                    <form onSubmit={updatePersonal} className='p-5'>
                    <div className='form-control my-2'>
                        <label htmlFor="age" className='label'>
                            <span className="label-text">Age</span>
                        </label>
                        <input type="number" min="0" className='input input-bordered' value={age} onChange={(e) => setAge(e.target.value)} required={true}/>
                    </div>
                    <div className='form-control my-2'>
                        <label htmlFor="education" className="label">
                            <span className="label-text">Education</span>
                        </label>
                        <select name="education" className='select select-bordered' value={education} onChange={(e) => setEducation(e.target.value)} required={true}>
                            <option value="Kindergarten" selected>Kindergarten</option>
                            <option value="Primary School">Primary School</option>
                            <option value="Secondary School">Secondary School</option>
                            <option value="Graduate">Graduate</option>
                            <option value="Post Graduate">Post Graduate</option>
                        </select>
                    </div>
                    <div className='form-control mt-5 flex justify-end items-end'>
                        <button type='submit' className='btn btn-success w-[15vw]' disabled={disabled}>Update</button>
                    </div>
                </form>
                </>)}

            </div>
        </div>
        <Footer />
    </div>
  )
}

export default Settings