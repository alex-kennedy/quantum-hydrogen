import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'gatsby';

class Main extends React.Component {
  render() {

    let close = <div className="close" onClick={() => {this.props.onCloseArticle()}}></div>

    return (
      <div ref={this.props.setWrapperRef} id="main" style={this.props.timeout ? {display: 'flex'} : {display: 'none'}}>

        <article id="intro" className={`${this.props.article === 'intro' ? 'active' : ''} ${this.props.articleTimeout ? 'timeout' : ''}`} style={{display:'none'}}>
            <h1 className="major">Quantum Hydrogen</h1>
            {/* <span className="image main"><img src={pic01} alt="" /></span> */}

            <ul className="icons">
              <li>
                <a href="#" className="icon fa-github">
                  <span className="label">GitHub</span>
                </a> 
              </li>
              All code available on <a href="https://github.com/alex-kennedy/quantum-hydrogen/">GitHub</a>
            </ul>

            <p>Made by Alex Kennedy.</p>

            <h3>What is this?</h3>
            <p>This is a little tool to visualize the 'quantum states' of an electron orbiting a Hydrogen atom. These quantum states take some pretty extraordinary shapes. </p>

            <p>The images are derived from Quantum Physics. It is worthy of note that these 'shells', these 'shapes', are meager representations of the whole truth. In technical terms, they are surfaces of constant probability of finding the electron in that spot if its position were to be measured. Feel free to read the details page for a more complete picture! </p>

            <p>My reference for this work is <a href="https://books.google.com/books?vid=ISBN0131118927">Introduction to Quantum Mechanics (2nd Edition): David J. Girffiths</a></p>

            <p><Link to="/details">Technical details</Link></p>

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