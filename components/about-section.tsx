import Image from "next/image"

export default function AboutSection() {
  return (
    <section className="section bg-white text-black" id="about">
      <div className="container max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="section-heading">About Me</h2>
        </div>

        <div className="flex flex-col md:flex-row gap-12 items-start">
          <div className="md:w-1/3 flex justify-center">
            <div className="relative w-64 h-64 rounded-lg overflow-hidden">
              <Image src="/images/pf-grad.png" alt="Adán Flores" fill className="object-cover" />
            </div>
          </div>

          <div className="md:w-2/3">
            <h3 className="text-3xl font-bold mb-6">
              I'm <span className="text-primary">Adán Flores-Ramírez</span>, a Researcher
            </h3>

            <div className="space-y-4 text-gray-700">
              <p>
                Proficient and thorough engineer with experience in software engineering and robotics, always eager to
                learn and self-driven towards building <i>A Society We Deserve</i>. I develop software for robotics, backend, artificial intelligence and automation applications. I do
                research in AI for Robotics.
              </p>
              <p>
                With several years in internships, international robotics and programming competitions as well as
                learning courses and personal projects, I have gained outstanding skills in problem solving, research
                and leadership.
              </p>
            </div>

            <div className="mt-8">
            <h4 className="text-xl font-semibold mb-3">Interests:</h4>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">Robotics</span>
                <span className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
                  Artificial Intelligence
                </span>
                <span className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">Computer Vision</span>
                <span className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">Extended Reality</span>
                <span className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">Automation</span>
              </div>
              {/* <a href="/Adan_Flores_resume.pdf" target="_blank" className="inline-block mt-4 px-6 py-2 bg-primary text-white rounded-full">Check Resume</a> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
