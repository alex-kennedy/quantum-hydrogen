import React from 'react'
import { Link } from 'gatsby'
import MathJax from 'react-mathjax'

import Layout from '../components/layout'

const DetailsPage = () => (
  <Layout>
    <MathJax.Provider>
      <h1>Details</h1>

      <p><Link to="/">Back to homepage</Link></p>

      <p>The quantum states are derived from Quantum Mechanics. The maths involved is laid out here. If you notice anything that is unclear or inaccurate, please feel free to open an issue on GitHub.</p>

      <h3>Skip to the Answer</h3>
      <p>The complete derivation is pretty gnarly. This section provides the solution only.</p>

      <p>
        The wave function of the electron, <MathJax.Node inline formula={'\\Psi_{nlm}(r, \\theta, \\phi)'} />, is described by 
      </p>

      <MathJax.Node formula={'\\Psi_{nlm}(r, \\theta, \\phi) = \\sqrt{\\left(\\frac{2}{na}\\right)^3 \\frac{(n - l - 1)!}{2n[(n + l)!]^3 }} e^{-r/na} \\left(\\frac{2r}{na}\\right)^l  \\left[L_{n-l-1}^{2l + 1}(2r/na)\\right] Y_l^m(\\theta, \\phi). '} />

      Where <MathJax.Node inline formula={'L_{q-p}^{p}'} /> is the Associated Laguerre Polynomial, defined by:

      <MathJax.Node formula={'L_{q-p}^{p}(x) = (-1)^{p}\\left( \\frac{d}{dx} \\right)^p L_q(x).'} />

      <MathJax.Node inline formula={'L_q'} /> is the Laguerre Polynomial, defined by

      <MathJax.Node formula={'L_q(x) = e^x \\left(\\frac{d}{dx}\\right)^q (e^{-x} x^q).'} />

      For our purposes, it is easier to work with the Laguerre Polynomial in closed form. Note this differs by a factor of <MathJax.Node inline formula={'q!'} /> from the form often used by Mathmeticians. 

      <MathJax.Node formula={'L_q(x) = q! \\sum_{k=0}^q \\binom{n}{k}  \\frac{(-1)^{k}}{k!}x^k '} />

      The Spherical Harmonic is defined by 
      <MathJax.Node formula={'Y_l^m(\\theta, \\phi) = \\epsilon \\sqrt{\\frac{(2l + 1)}{4\\pi} \\frac{(l-|m|)!}{(l + |m|)!}} e^{im\\phi} P_l^m(\\cos \\theta)'} />

      Where <MathJax.Node inline formula={'\\epsilon = (-1)^m'}/> for <MathJax.Node inline formula={'m\\ge0'}/> and <MathJax.Node inline formula={'1'}/> otherwise. <MathJax.Node inline formula={'P_l^m(x)'} /> is an associated Legendre Polynomial, defined by

      <MathJax.Node formula={'L_l^m(x) = (1 - x^2)^(|m|/2) \\left(\\frac{d}{dx}\\right)^m P_l(x), '} />

      and <MathJax.Node inline formula={'P_l(x)'} /> is the Legendre Polynomial, defined by

      <MathJax.Node formula={'\\frac{1}{2^l l!} \\left(\\frac{d}{dx}\\right) (x^2 - 1)^l.'} />

      Once again, in our case, the explicit representation is easiest to work with:

      <MathJax.Node formula={'P_l(x) = 2^l \\sum_{k=0}^l x^l \\binom{l}{k} \\binom{(l+k+1)/2}{l}'} />

    </MathJax.Provider>
  </Layout>
)

export default DetailsPage
