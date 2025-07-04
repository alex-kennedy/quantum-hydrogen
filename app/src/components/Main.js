import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'gatsby'
import MathJax from 'react-mathjax'

class Main extends React.Component {
  render() {
    let close = (
      <div
        className="close"
        onClick={() => {
          this.props.onCloseArticle()
        }}
      ></div>
    )

    return (
      <div
        ref={this.props.setWrapperRef}
        id="main"
        style={this.props.timeout ? { display: 'flex' } : { display: 'none' }}
      >
        <article
          id="intro"
          className={`${this.props.article === 'intro' ? 'active' : ''} ${
            this.props.articleTimeout ? 'timeout' : ''
          }`}
          style={{ display: 'none' }}
        >
          <MathJax.Provider>
            <h1 className="major">Quantum Hydrogen</h1>

            <ul className="icons">
              <li>
                <a
                  href="https://github.com/alex-kennedy/quantum-hydrogen/"
                  className="icon fa-github"
                  target="_blank"
                >
                  <span className="label">GitHub</span>
                </a>
              </li>
              This project is{' '}
              <a
                href="https://github.com/alex-kennedy/quantum-hydrogen/"
                target="_blank"
              >
                open source
              </a>
              . Made by Alex Kennedy
            </ul>

            <p>
              Full techincal details are located <Link to="/details">here</Link>
              .
            </p>

            <h3>What is this?</h3>
            <p>
              This is a little tool to attempt to visualize the 'quantum states'
              of an electron orbiting a Hydrogen atom.
            </p>

            <p>
              In technical terms, these shapes are surfaces of constant
              probability of finding the electron in that spot if its position
              were to be measured. Feel free to read the{' '}
              <Link to="/details">details page</Link> for a more complete
              picture!{' '}
            </p>

            <ul>
              <li>
                <MathJax.Node inline formula={'n'} /> is the 'principal quantum
                number,' it determines the energy of the state.{' '}
                <MathJax.Node inline formula={'n \\ge 1'} />{' '}
              </li>
              <li>
                <MathJax.Node inline formula={'l'} /> is the 'orbital quantum
                number.' <MathJax.Node inline formula={'l < n'} />{' '}
              </li>
              <li>
                <MathJax.Node inline formula={'m'} /> is the 'magnetic quantum
                number.' <MathJax.Node inline formula={'-l \\le m \\le l'} />
              </li>
            </ul>

            <p>
              My reference for this work is{' '}
              <a href="https://books.google.com/books?vid=ISBN0131118927">
                Introduction to Quantum Mechanics (2nd Edition): David J.
                Girffiths
              </a>
            </p>

            <p style={{ fontSize: '10pt' }}>
              Template{' '}
              <a href="https://html5up.net/" target="_blank">
                HTML5 UP
              </a>
              .
            </p>
          </MathJax.Provider>
          {close}
        </article>
      </div>
    )
  }
}

Main.propTypes = {
  route: PropTypes.object,
  article: PropTypes.string,
  articleTimeout: PropTypes.bool,
  onCloseArticle: PropTypes.func,
  timeout: PropTypes.bool,
  setWrapperRef: PropTypes.func.isRequired,
}

export default Main
