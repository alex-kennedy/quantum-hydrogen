import React from 'react'
import Layout from '../components/layout'

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
    this.changedQuantumNumber = this.changedQuantumNumber.bind(this);
  }

  componentDidMount () {
    this.timeoutId = setTimeout(() => {
        this.setState({loading: ''});
    }, 100);
    document.addEventListener('mousedown', this.handleClickOutside);

    // Add change listeners
    document.getElementById('n').addEventListener('input', this.changedQuantumNumber)
    document.getElementById('l').addEventListener('input', this.changedQuantumNumber)
    document.getElementById('m').addEventListener('input', this.changedQuantumNumber)

    // Add initial value/s
    document.getElementById('n').value = '1'
    document.getElementById('l').value = '0'
    document.getElementById('m').value = '0'
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

    qNumberElement.dispatchEvent(event);

    if (inc == 1) {
      qNumberElement.stepUp();
    } else {
      qNumberElement.stepDown();
    }
  }

  changedQuantumNumber(event) {
    console.log('A quantum number changed!')
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
      </Layout>
    )
  }
}

export default IndexPage
