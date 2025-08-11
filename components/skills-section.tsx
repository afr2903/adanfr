export default function SkillsSection() {
  return (
    <section className="section bg-white text-black" id="skills">
      <div className="container max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="section-heading">Technical Skills</h2>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="mb-12">
            <h3 className="section-subheading">Programming Languages</h3>
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4">
              {programmingLanguages.map((skill) => (
                <div key={skill.name} className="flex flex-col items-center">
                  <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-lg mb-2">
                    <img src={skill.icon || "/placeholder.svg"} alt={skill.name} className="w-7 h-7" />
                  </div>
                  <span className="text-xs text-gray-700">{skill.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="section-subheading">Technologies</h3>
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4">
              {technologies.map((tech) => (
                <div key={tech.name} className="flex flex-col items-center">
                  <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-lg mb-2">
                    <img src={tech.icon || "/placeholder.svg"} alt={tech.name} className="w-7 h-7" />
                  </div>
                  <span className="text-xs text-gray-700">{tech.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

const programmingLanguages = [
  { name: "Python", icon: "https://skillicons.dev/icons?i=py" },
  { name: "C++", icon: "https://skillicons.dev/icons?i=cpp" },
  { name: "Bash", icon: "https://skillicons.dev/icons?i=bash" },
  { name: "C#", icon: "https://skillicons.dev/icons?i=cs" },
  { name: "C", icon: "https://skillicons.dev/icons?i=c" },
  { name: "Go", icon: "https://skillicons.dev/icons?i=go" },
  { name: "Java", icon: "https://skillicons.dev/icons?i=java" },
  { name: "Elixir", icon: "https://skillicons.dev/icons?i=elixir" },
]

const technologies = [
  { name: "PyTorch", icon: "https://skillicons.dev/icons?i=pytorch" },
  { name: "ROS", icon: "https://skillicons.dev/icons?i=ros" },
  { name: "Docker", icon: "https://skillicons.dev/icons?i=docker" },
  { name: "TensorFlow", icon: "https://skillicons.dev/icons?i=tensorflow" },
  { name: "Linux", icon: "https://skillicons.dev/icons?i=linux" },
  { name: "OpenCV", icon: "https://skillicons.dev/icons?i=opencv" },
  { name: "Kubernetes", icon: "https://skillicons.dev/icons?i=kubernetes" },
  { name: "Git", icon: "https://skillicons.dev/icons?i=git" },
  { name: "Unity", icon: "https://skillicons.dev/icons?i=unity" },
  { name: "Unreal Engine", icon: "https://skillicons.dev/icons?i=unreal" },
  { name: "GCP", icon: "https://skillicons.dev/icons?i=gcp" },
  { name: "FastAPI", icon: "https://skillicons.dev/icons?i=fastapi" },
  { name: "Arduino", icon: "https://skillicons.dev/icons?i=arduino" },
  { name: "Postman", icon: "https://skillicons.dev/icons?i=postman" },
  { name: "Redis", icon: "https://skillicons.dev/icons?i=redis" },
  { name: "MongoDB", icon: "https://skillicons.dev/icons?i=mongodb" },
]
