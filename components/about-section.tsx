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
              <Image src="/images/pf-grad.jpg" alt="Adán Flores" fill className="object-cover" />
            </div>
          </div>

          <div className="md:w-2/3">
            <h3 className="text-3xl font-bold mb-6">
              I'm <span className="text-primary">Adán Flores-Ramírez</span>, a Research Engineer 
            </h3>

            <div className="space-y-4 text-gray-700">
              <p>
              The technology to improve people's lives exists. What doesn't exist is the bridge between what technology <em>can</em> do and what people actually <em>adopt</em>. I build that bridge through Human-Computer Interaction.
              </p>
              <p>
              I lead teams, build assistive robotics platforms, and develop AI systems that work without expensive infrastructure.
              Driven to bring first-world innovation back home: making technology accessible, beneficial, and transformative for communities often overlooked.
              </p>
            </div>

            <div className="mt-8">
            <h4 className="text-xl font-semibold mb-3">Interests:</h4>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">Human-Computer Interaction</span>
                <span className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">Robotics</span>
                <span className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
                  Artificial Intelligence
                </span>
                <span className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">Product Design</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
