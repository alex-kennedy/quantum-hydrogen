import React from 'react'
import PropTypes from 'prop-types'

const Footer = (props) => (
    <footer id="footer" style={props.timeout ? {display: 'none'} : {}}>
        <p className="copyright">&copy; Quantum Hydrogen</p>
    </footer>
)

Footer.propTypes = {
    timeout: PropTypes.bool
}

export default Footer