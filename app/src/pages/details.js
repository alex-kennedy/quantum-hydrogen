import React from 'react'
import { Link } from 'gatsby'
import MathJax from 'react-mathjax'

import Layout from '../components/layout'

const DetailsPage = () => (
  <Layout>
    <MathJax.Provider>
      <h1>Details</h1>
      <p><strong>The quantum states are derived from Quantum Mechanics. The maths involved is laid out here. </strong></p>
      <Link to="/">Go back to the homepage</Link>


    </MathJax.Provider>
  </Layout>
)

export default DetailsPage
