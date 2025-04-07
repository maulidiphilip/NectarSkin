import React from 'react'
import Header from './Header'
import FeaturedProducts from './FeaturedProducts'
import Categories from './Categories'
import Deals from './Deals'
import Testimonials from './Testimonials'

const Home = () => {
  return (
    <>
    <Header/>
    <FeaturedProducts/>
    <Deals/>
    <Categories/>
    <Testimonials/>
    </>
  )
}

export default Home