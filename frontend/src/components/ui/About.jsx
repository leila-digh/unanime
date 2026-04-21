import { FiInfo } from "react-icons/fi";

function About() {
  return (
    <div className="about-section">
        <div className="card-header">
          <FiInfo
            className="w-6 h-6 text-dark-blue"/>
          <h1>About</h1>
        </div>
        
        <p>Unanime is a multiplayer game where you and your friends reach unanimous agreement.</p>

        <p>When it’s your turn, you enter words that correspond to the prompt. Other players can object if they think a word doesn’t fit.</p>

        <p>You score points for every entry with no objections. Most points wins.</p>

        <p>Enjoy!</p>
    </div>
  )
}

export default About