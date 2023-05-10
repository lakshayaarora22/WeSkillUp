import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import toast from 'react-hot-toast';

const Register = () => {

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if(sessionStorage.getItem('loggedIn'))
      window.location.href = "/profile";
  })

  const signUp = async (e) => {
    e.preventDefault();
    toast('Registration process started!');
    try
    {
      const formData = new FormData();
      formData.append('first_name', `${firstName}`);
      formData.append('last_name', `${lastName}`);
      formData.append('email', `${email}`);
      formData.append('password', `${password}`);
      
      const response = await fetch('http://127.0.0.1:5000/register', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if(result['registered'])
      {
        toast.success('Registration successful!');
        setTimeout(() => {
          window.location.href = '/login';
        }, 1000);
      }
      else
      {
        toast.error('User is already registered!');
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    }
    catch(err)
    {
      console.log(err);
      toast.error('Failed to register. Please try again later!');
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  }

  return (
    <div>
      <Navbar />
      <section>
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl font-bold">Sign up!</h1>
            <p className="py-6">Step into a professional world with top most vocabulary skills at a very cheap price.</p>
          </div>
          <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100 lg:mr-36">
            <div className="card-body">
            <div className="form-control">
                <label className="label">
                  <span className="label-text">First Name</span>
                </label>
                <input type="text" placeholder="John" className="input input-bordered" onChange={(e) => setFirstName(e.target.value)} required={true} />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Last Name</span>
                </label>
                <input type="text" placeholder="Doe" className="input input-bordered" onChange={(e) => setLastName(e.target.value)} required={true} />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email Address</span>
                </label>
                <input type="email" placeholder="johnDoe@example.com" className="input input-bordered" onChange={(e) => setEmail(e.target.value)} required={true} />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <input type="password" placeholder="Better safe than sorry!" className="input input-bordered" onChange={(e) => setPassword(e.target.value)} required={true}/>
              </div>
              <div className="form-control mt-6">
                <button className="btn btn-success" onClick={signUp}>Sign Up</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      </section>
      <Footer />
    </div>
  )
}

export default Register