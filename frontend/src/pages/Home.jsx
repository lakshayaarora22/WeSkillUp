import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div>
      <Navbar />
      <section>
      <div className="hero min-h-screen bg-base-100">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <img src="https://picsum.photos/450/450" className="max-w-sm rounded-lg shadow-2xl" />
          <div className='lg:pr-56'>
            <h1 className="text-5xl font-bold">VSkillUp!</h1>
            <p className="py-6">Vocabulary builder for all people of all ages!</p>
            <a href="/register"><button className="btn btn-primary">Get Started</button></a>
          </div>
        </div>
      </div>
      </section>
      <Footer />
    </div>
  )
}

export default Home