import {Component} from 'react'
import Loader from 'react-loader-spinner'

import Projects from '../Projects'
import './index.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

class Home extends Component {
  state = {
    apiStatus: '',
    projectsList: [],
    activeOptionId: categoriesList[0].id,
  }

  componentDidMount() {
    this.fetchProjects()
  }

  fetchProjects = async () => {
    const {activeOptionId} = this.state
    console.log(activeOptionId)
    this.setState({apiStatus: 'LOADING'})
    const url = `https://apis.ccbp.in/ps/projects?category=${activeOptionId}`
    const options = {
      method: 'GET',
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      this.setState({apiStatus: 'SUCCESS'})
      const updatedData = data.projects.map(eachItem => ({
        id: eachItem.id,
        name: eachItem.name,
        imageUrl: eachItem.image_url,
      }))
      this.setState({projectsList: updatedData})
    } else {
      this.setState({apiStatus: 'FAILURE'})
    }
  }

  onChangeOption = event => {
    this.setState({activeOptionId: event.target.value})
    this.fetchProjects()
  }

  renderLoadingView = () => (
    <div className="loaderContainer" testid="loader">
      <Loader />
    </div>
  )

  renderSelectContainer = () => (
    <select onChange={this.onChangeOption}>
      {categoriesList.map(eachItem => (
        <option key={eachItem.id} value={eachItem.id}>
          {eachItem.displayText}
        </option>
      ))}
    </select>
  )

  renderProjects = () => {
    const {projectsList} = this.state
    return (
      <ul className="projectsContainer">
        {projectsList.map(eachItem => (
          <Projects projectDetails={eachItem} key={eachItem.id} />
        ))}
      </ul>
    )
  }

  renderFinalPage = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case 'SUCCESS':
        return this.renderProjects()
      case 'LOADING':
        return this.renderLoadingView()
      case 'FAILURE':
        return this.renderFailureView()
      default:
        return null
    }
  }

  onClickRetry = () => {
    this.fetchProjects()
  }

  renderFailureView = () => (
    <div className="failureView">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button type="button" onClick={this.onClickRetry}>
        Retry
      </button>
    </div>
  )

  render() {
    return (
      <>
        <div className="headerContainer">
          <img
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            alt="website logo"
            className="websiteImage"
          />
        </div>
        {this.renderSelectContainer()}
        <div>{this.renderFinalPage()}</div>
      </>
    )
  }
}

export default Home
