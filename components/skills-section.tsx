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
  { name: "C++", icon: "https://skillicons.dev/icons?i=cpp" },
  { name: "Python", icon: "https://skillicons.dev/icons?i=py" },
  { name: "Java", icon: "https://skillicons.dev/icons?i=java" },
  { name: "JavaScript", icon: "https://skillicons.dev/icons?i=js" },
  { name: "C#", icon: "https://skillicons.dev/icons?i=cs" },
  { name: "C", icon: "https://skillicons.dev/icons?i=c" },
  { name: "PHP", icon: "https://skillicons.dev/icons?i=php" },
  { name: "LaTeX", icon: "https://skillicons.dev/icons?i=latex" },
]

const technologies = [
  { name: "Docker", icon: "https://skillicons.dev/icons?i=docker" },
  { name: "Git", icon: "https://skillicons.dev/icons?i=git" },
  { name: "GCP", icon: "https://skillicons.dev/icons?i=gcp" },
  { name: "AWS", icon: "https://skillicons.dev/icons?i=aws" },
  { name: "Kubernetes", icon: "https://skillicons.dev/icons?i=kubernetes" },
  { name: "ROS", icon: "https://skillicons.dev/icons?i=ros" },
  { name: "TensorFlow", icon: "https://skillicons.dev/icons?i=tensorflow" },
  { name: "PyTorch", icon: "https://skillicons.dev/icons?i=pytorch" },
  { name: "React", icon: "https://skillicons.dev/icons?i=react" },
  { name: "Node.js", icon: "https://skillicons.dev/icons?i=nodejs" },
  { name: "Linux", icon: "https://skillicons.dev/icons?i=linux" },
  { name: "Arduino", icon: "https://skillicons.dev/icons?i=arduino" },
  { name: "Raspberry Pi", icon: "https://skillicons.dev/icons?i=raspberrypi" },
  { name: "HTML5", icon: "https://skillicons.dev/icons?i=html" },
  { name: "Unity", icon: "https://skillicons.dev/icons?i=unity" },
  { name: "VS Code", icon: "https://skillicons.dev/icons?i=vscode" },
]
