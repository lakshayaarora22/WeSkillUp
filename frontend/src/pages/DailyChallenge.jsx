import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import toast from 'react-hot-toast';

const DailyChallenge = () => {

  const [email, setEmail] = useState(sessionStorage.getItem('email'));
  const [challenge, setChallenge] = useState('');
  const [answer, setAnswer] = useState('');
  const [resultSection, setResultSection] = useState(false);
  const [result, setResult] = useState('');
  const [meaning, setMeaning] = useState('');
  const [streak, setStreak] = useState('');
  const [message, setMessage] = useState('');
  const [messageScreen, setMessageScreen] = useState(false);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    (async ()=>{
      if(sessionStorage.getItem('loggedIn'))
      {
        const formData = new FormData();
        formData.append('email', sessionStorage.getItem('email')); 
        formData.append('submit', 'false');

        const response = await fetch('http://127.0.0.1:5000/dailyChallengeForWebsite', {
          method: 'POST',
          body: formData
        });

        const result = await response.json();
        if(Object.keys(result)[0] == 'word')
        {
          setChallenge(result['word']);
        }
        else
        {
          setMessageScreen(true);
          setMessage(result['message']);
        }
      }
      else
      {
        window.location.href = '/login';
      }
    })();
  }, [])
  
  const checkAnswer = async (e) => {
    e.preventDefault();
    toast.success('Submitted successfully');
    setDisabled(true);
    const formData = new FormData();
    formData.append('email', email); 
    formData.append('submit', 'true');
    formData.append('sentence', answer);
    const response = await fetch('http://127.0.0.1:5000/dailyChallengeForWebsite', {
          method: 'POST',
          body: formData
        });

    const result = await response.json();
    setResultSection(true);
    setChallenge(result['word']);
    setMeaning(result['meaning']);
    setResult(result['accuracy']);
    setStreak(result['streak']);
    setMessageScreen(true);
    if(result['streak'] == 'Broken')
        sessionStorage.setItem('streak', '1');
    else
      sessionStorage.setItem('streak', `${parseInt(sessionStorage.getItem('streak'))+1}` );
  }

  return (
    <div>
      <Navbar />
      <section>
      <div className="min-h-screen bg-base-100">
          {!messageScreen && (
            <div className='grid grid-cols-5'>
            <div></div>
            <div className='col-span-3 p-5 flex justify-center'>
              <span className='text-3xl font-bold'>Daily Challenge</span>
            </div>
            <div></div>
            <div></div>
            <div className='col-span-3 p-5'>
              <span className='text-2xl'>Today's challenge is - {challenge}</span>
            </div>
            <div></div>
            <div></div>
            <div className='col-span-3 p-5'>
            <form onSubmit={checkAnswer}>
                <div className='form-control'>
                <label className="label">
                  <span className="label-text">Answer</span>
                </label>
                  <input type="text" name="answer" className='input input-bordered' required={true} onChange={(e) => setAnswer(e.target.value)}/>
                </div>
                <div className='form-control mt-5'>
                  <button type='submit' className='btn btn-primary w-[20vw]' disabled={disabled}>Submit</button>
                </div>
              </form>
            </div>
            <div></div>
          </div>
          )}
          {messageScreen && (
            <div className='p-5 flex justify-center'>
              <span className='text-2xl'>{message}</span>
            </div>
          )}
          {resultSection && (
            <div className='p-5 flex justify-center overflow-x-auto'>
              <table className='table table-compact w-full'>
                <tbody>
                  <tr>
                    <td><span className='font-bold'>Word</span></td>
                    <td> <p>{challenge}</p> </td>
                  </tr>
                  <tr>
                    <td><span className='font-bold'>Input</span></td>
                    <td> <p>{answer}</p></td>
                  </tr>
                  <tr>
                    <td><span className='font-bold'>Actual Meaning</span></td>
                    <td><p>{meaning}</p></td>
                  </tr>
                  <tr>
                    <td><span className='font-bold'>Accuracy</span></td>
                    <td><p>{result}</p></td>
                  </tr>
                  <tr>
                    <td><span className='font-bold'>Streak</span></td>
                    <td><p>{streak}</p></td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
      </div>
      </section>
      <Footer />
    </div>
  )
}

export default DailyChallenge