import React from 'react'
import PropTypes from 'prop-types'
import MathJax from 'react-mathjax'

const Header = (props) => (
    <header id="header" style={props.timeout ? {display: 'none'} : {}}>
        <nav>
            <MathJax.Provider>
                <ul>
                    <li><a href="javascript:;" onClick={() => {props.onOpenArticle('intro')}}>Info</a></li>
                    <li>
                        <p><MathJax.Node inline formula={'n = '} /></p>
                        <input type="number" name="n" id="n" />
                        <input type="button" name="n_up" id="n_up" value="▲" onClick={() => {props.incrementValue('n', 1)}} />
                        <input type="button" name="n_down" id="n_down" value="▼" onClick={() => {props.incrementValue('n', -1)}} />
                    </li>
                    <li>
                        <p><MathJax.Node inline formula={'l = '} /></p>
                        <input type="number" name="l" id="l" />
                        <input type="button" name="l_up" id="l_up" value="▲" onClick={() => {props.incrementValue('l', 1)}}/>
                        <input type="button" name="l_down" id="l_down" value="▼" onClick={() => {props.incrementValue('l', -1)}}/>
                    </li>
                    <li>
                        <p><MathJax.Node inline formula={'m = '} /></p>
                        <input type="number" name="m" id="m" />
                        <input type="button" name="m_up" id="m_up" value="▲" onClick={() => {props.incrementValue('m', 1)}}/>
                        <input type="button" name="m_down" id="m_down" value="▼" onClick={() => {props.incrementValue('m', -1)}}/>
                    </li>
                </ul>
            </MathJax.Provider>
        </nav>
    </header>
)

Header.propTypes = {
    onOpenArticle: PropTypes.func,
    timeout: PropTypes.bool,
    incrementValue: PropTypes.func
}

export default Header
