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
  { name: "C++", icon: "/icons/cpp.svg" },
  { name: "Python", icon: "/icons/python.svg" },
  { name: "Java", icon: "/icons/java.svg" },
  { name: "JavaScript", icon: "/icons/javascript.svg" },
  { name: "C#", icon: "/icons/csharp.svg" },
  { name: "C", icon: "/icons/c.svg" },
  { name: "PHP", icon: "/icons/php.svg" },
  { name: "LaTeX", icon: "/icons/latex.svg" },
]

const technologies = [
  { name: "Docker", icon: "/icons/docker.svg" },
  { name: "Git", icon: "/icons/git.svg" },
  { name: "GCP", icon: "/icons/gcp.svg" },
  { name: "AWS", icon: "/icons/aws.svg" },
  { name: "Kubernetes", icon: "/icons/kubernetes.svg" },
  { name: "ROS", icon: "/icons/ros.svg" },
  { name: "TensorFlow", icon: "/icons/tensorflow.svg" },
  { name: "PyTorch", icon: "/icons/pytorch.svg" },
  { name: "React", icon: "/icons/react.svg" },
  { name: "Node.js", icon: "/icons/nodejs.svg" },
  { name: "Linux", icon: "/icons/linux.svg" },
  { name: "Arduino", icon: "/icons/arduino.svg" },
  { name: "Raspberry Pi", icon: "/icons/raspberry-pi.svg" },
  { name: "HTML5", icon: "/icons/html5.svg" },
  { name: "Unity", icon: "/icons/unity.svg" },
  { name: "VS Code", icon: "/icons/vscode.svg" },
]
