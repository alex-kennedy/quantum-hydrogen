import React from 'react'
import PropTypes from 'prop-types'
import MathJax from 'react-mathjax'

const Header = (props) => (
    <header id="header" style={props.timeout ? {display: 'none'} : {}}>
        {/* <div className="logo">
            <span className="icon fa-diamond"></span>
        </div>
        <div className="content">
            <div className="inner">
                <h1>Dimension</h1>
                <p>A fully responsive site template designed by <a href="https://html5up.net">HTML5 UP</a> and released<br />
                for free under the <a href="https://html5up.net/license">Creative Commons</a> license.</p>
            </div>
        </div> */}
        <nav>
            <MathJax.Provider>
                <ul>
                    <li><a href="javascript:;" onClick={() => {props.onOpenArticle('intro')}}>Info</a></li>
                    <li>
                        <p><MathJax.Node inline formula={'n = '} /></p>
                        <input type="number" name="n" id="n" />
                        <input type="button" name="n_up" id="n_up" value="▲"/>
                        <input type="button" name="n_down" id="n_down" value="▼"/>
                    </li>
                    <li>
                        <p><MathJax.Node inline formula={'l = '} /></p>
                        <input type="number" name="l" id="l" />
                        <input type="button" name="l_up" id="l_up" value="▲"/>
                        <input type="button" name="l_down" id="l_down" value="▼"/>
                    </li>
                    <li>
                        <p><MathJax.Node inline formula={'m = '} /></p>
                        <input type="number" name="m" id="m" />
                        <input type="button" name="m_up" id="m_up" value="▲"/>
                        <input type="button" name="m_down" id="m_down" value="▼"/>
                    </li>
                </ul>
            </MathJax.Provider>
        </nav>
    </header>
)

Header.propTypes = {
    onOpenArticle: PropTypes.func,
    timeout: PropTypes.bool
}

export default Header
