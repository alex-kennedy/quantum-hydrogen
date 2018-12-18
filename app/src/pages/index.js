import React from 'react'
import Layout from '../components/layout'
import ToolTip from 'tooltip.js';
import MathJax from 'react-mathjax';

import Header from '../components/Header'
import Main from '../components/Main'
import ThreeScene from '../components/Scene'

class IndexPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isArticleVisible: false,
      timeout: false,
      articleTimeout: false,
      article: '',
      loading: 'is-loading'
    }
    this.handleOpenArticle = this.handleOpenArticle.bind(this);
    this.handleCloseArticle = this.handleCloseArticle.bind(this);
    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.incrementValue = this.incrementValue.bind(this);
    this.validateN = this.validateN.bind(this);
    this.validateL = this.validateL.bind(this);
    this.validateM = this.validateM.bind(this);
  }

  componentDidMount () {
    this.timeoutId = setTimeout(() => {
        this.setState({loading: ''});
    }, 100);
    document.addEventListener('mousedown', this.handleClickOutside);

    // Add initial value/s
    document.getElementById('n').value = '1';
    document.getElementById('l').value = '0';
    document.getElementById('m').value = '0';

    // Quantum Number Tooltips and validation functions
    this.nTool = new ToolTip(document.getElementById('n'), {trigger: 'manual', html: true});
    this.lTool = new ToolTip(document.getElementById('l'), {trigger: 'manual', html: true});
    this.mTool = new ToolTip(document.getElementById('m'), {trigger: 'manual', html: true});

    document.getElementById('n').addEventListener('input', this.validateN);
    document.getElementById('l').addEventListener('input', this.validateL);
    document.getElementById('m').addEventListener('input', this.validateM);

    // Quantum number tooltip timeouts
    this.nToolTipTimer = 0;
    this.lToolTipTimer = 0;
    this.mToolTipTimer = 0;
  }

  componentWillUnmount () {
    if (this.timeoutId) {
        clearTimeout(this.timeoutId);
    }
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  handleOpenArticle(article) {

    this.setState({
      isArticleVisible: !this.state.isArticleVisible,
      article
    })

    setTimeout(() => {
      this.setState({
        timeout: !this.state.timeout
      })
    }, 325)

    setTimeout(() => {
      this.setState({
        articleTimeout: !this.state.articleTimeout
      })
    }, 350)

  }

  handleCloseArticle() {

    this.setState({
      articleTimeout: !this.state.articleTimeout
    })

    setTimeout(() => {
      this.setState({
        timeout: !this.state.timeout
      })
    }, 325)

    setTimeout(() => {
      this.setState({
        isArticleVisible: !this.state.isArticleVisible,
        article: ''
      })
    }, 350)

  }

  handleClickOutside(event) {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      if (this.state.isArticleVisible) {
        this.handleCloseArticle();
      }
    }
  }

  incrementValue(number, inc) {
    var qNumberElement = document.getElementById(number);
    var event = new Event('input');

    if (inc === 1) {
      qNumberElement.stepUp();
    } else {
      qNumberElement.stepDown();
    }

    qNumberElement.dispatchEvent(event);
  }

  validateN() {
    let n = parseInt( document.getElementById('n').value );

    if (n > 50) {
      this.nTool.updateTitleContent( 
        document.getElementById('message-n-too-large').firstElementChild.cloneNode(true)
      );
    } else if (n < 1) {
      this.nTool.updateTitleContent( 
        document.getElementById('message-n-positive').firstElementChild.cloneNode(true)
      );
    } else if ( isNaN(n) ) {
      this.nTool.updateTitleContent( 
        document.getElementById('message-n-not-blank').firstElementChild.cloneNode(true)
      );
    } else {
      this.nTool.hide();
      return true;
    }

    this.nTool.show();
    return false;
  }

  validateL() {
    let l = parseInt( document.getElementById('l').value );
    let n = parseInt( document.getElementById('n').value );

    if (l > n) {
      this.lTool.updateTitleContent(
        document.getElementById('message-l-lessequal-n').firstElementChild.cloneNode(true)
      )
    } else if (l < 0) {
      console.log(document.getElementById('message-l-positive'));
      this.lTool.updateTitleContent(
        document.getElementById('message-l-positive').firstElementChild.cloneNode(true)
      );
    } else if ( isNaN(l) ) {
      this.lTool.updateTitleContent(
        document.getElementById('message-l-not-blank').firstElementChild.cloneNode(true)
      );
    } else {
      this.lTool.hide();
      return true;
    }

    this.lTool.show();
    return false;
  }

  validateM() {
    let m = parseInt( document.getElementById('m').value );
    let l = parseInt( document.getElementById('l').value );

    if (Math.abs(m) > l) {
      this.mTool.updateTitleContent(
        document.getElementById('message-abs-m-lessequal-l').firstElementChild.cloneNode(true)
      );
    } else if ( isNaN(m) ) {
      this.mTool.updateTitleContent(
        document.getElementById('message-m-not-blank').firstElementChild.cloneNode(true)
      );
    } else {
      this.mTool.hide();
      return true;
    }

    this.mTool.show();
    return false;
  }

  render() {
    return (
      <Layout location={this.props.location}>
        <div className={`body ${this.state.loading} ${this.state.isArticleVisible ? 'is-article-visible' : ''}`}>
          <div id="wrapper">
            <div id="bg"><ThreeScene /></div> 
            <Header 
              onOpenArticle={this.handleOpenArticle} 
              timeout={this.state.timeout} 
              incrementValue={this.incrementValue}
            />
            <Main
              isArticleVisible={this.state.isArticleVisible}
              timeout={this.state.timeout}
              articleTimeout={this.state.articleTimeout}
              article={this.state.article}
              onCloseArticle={this.handleCloseArticle}
              setWrapperRef={this.setWrapperRef}
            />
            {/* <Footer timeout={this.state.timeout} /> */}
          </div>
        </div>

        {/* Tool tip messages  */}
        <div className='tooltip-message' id='message-n-too-large'>
          <MathJax.Provider>
            <div><MathJax.Node inline formula={'n'} /> cannot be larger than 50.</div>
          </MathJax.Provider>
        </div>
        <div className='tooltip-message' id='message-n-positive'>
          <MathJax.Provider>
            <div><MathJax.Node inline formula={'n'} /> cannot be less than 1.</div>
          </MathJax.Provider>
        </div>
        <div className='tooltip-message' id='message-n-not-blank'>
          <MathJax.Provider>
            <div><MathJax.Node inline formula={'n'} /> cannot be blank.</div>
          </MathJax.Provider>
        </div>
        <div className='tooltip-message' id='message-l-lessequal-n'>
          <MathJax.Provider>
            <div><MathJax.Node inline formula={'l'} /> must be less than or equal to <MathJax.Node inline formula={'n'}/>.</div>
          </MathJax.Provider>
        </div>
        <div className='tooltip-message' id='message-l-positive'>
          <MathJax.Provider>
            <div><MathJax.Node inline formula={'l'} /> cannot be negative.</div>
          </MathJax.Provider>
        </div>
        <div className='tooltip-message' id='message-l-not-blank'>
          <MathJax.Provider>
            <div><MathJax.Node inline formula={'l'} /> cannot be blank.</div>
          </MathJax.Provider>
        </div>
        <div className='tooltip-message' id='message-abs-m-lessequal-l'>
          <MathJax.Provider>
            <div><MathJax.Node inline formula={'|m|'} /> must be less than or equal to <MathJax.Node inline formula={'l'} />.</div>
          </MathJax.Provider>
        </div>
        <div className='tooltip-message' id='message-m-not-blank'>
          <MathJax.Provider>
            <div><MathJax.Node inline formula={'m'} /> cannot be blank.</div>
          </MathJax.Provider>
        </div>
      </Layout>
    )
  }
}

export default IndexPage
