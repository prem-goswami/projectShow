import './index.css'

const Projects = props => {
  const {projectDetails} = props
  const {name, imageUrl} = projectDetails
  return (
    <li className="listItem">
      <img src={imageUrl} alt={name} />
      <p>{name}</p>
    </li>
  )
}

export default Projects
