"use client"

import { Linkedin, Github, MessageCircle, ArrowUp } from "lucide-react"

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  return (
    <footer className="bg-white text-black border-t border-gray-200 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <h3 className="text-xl font-bold mb-2">Adán Flores</h3>
            <p className="text-gray-600 max-w-md">
              Robotics and AI Engineer specializing in research and development of intelligent systems.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-end">
            <div className="flex gap-4 mb-4">
              <a
                href="https://linkedin.com/in/adanfr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-primary transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="https://github.com/adanfr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-primary transition-colors"
                aria-label="GitHub"
              >
                <Github size={20} />
              </a>
              <a
                href="https://wa.me/yourphonenumber"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-primary transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle size={20} />
              </a>
            </div>

            <button
              onClick={scrollToTop}
              className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
            >
              <span>Back to top</span>
              <ArrowUp size={16} />
            </button>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Adán Flores. All rights reserved.
          </p>

          <nav className="flex gap-6">
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault()
                scrollToTop()
              }}
              className="text-gray-600 hover:text-black text-sm transition-colors"
            >
              Home
            </a>
            <a
              href="#about"
              onClick={(e) => {
                e.preventDefault()
                const aboutSection = document.getElementById("about")
                if (aboutSection) {
                  window.scrollTo({
                    top: aboutSection.offsetTop - 80,
                    behavior: "smooth",
                  })
                }
              }}
              className="text-gray-600 hover:text-black text-sm transition-colors"
            >
              About
            </a>
            <a
              href="#portfolio"
              onClick={(e) => {
                e.preventDefault()
                const portfolioSection = document.getElementById("portfolio")
                if (portfolioSection) {
                  window.scrollTo({
                    top: portfolioSection.offsetTop - 80,
                    behavior: "smooth",
                  })
                }
              }}
              className="text-gray-600 hover:text-black text-sm transition-colors"
            >
              Portfolio
            </a>
            <a
              href="#experience"
              onClick={(e) => {
                e.preventDefault()
                const experienceSection = document.getElementById("experience")
                if (experienceSection) {
                  window.scrollTo({
                    top: experienceSection.offsetTop - 80,
                    behavior: "smooth",
                  })
                }
              }}
              className="text-gray-600 hover:text-black text-sm transition-colors"
            >
              Experience
            </a>
            <a
              href="#education"
              onClick={(e) => {
                e.preventDefault()
                const educationSection = document.getElementById("education")
                if (educationSection) {
                  window.scrollTo({
                    top: educationSection.offsetTop - 80,
                    behavior: "smooth",
                  })
                }
              }}
              className="text-gray-600 hover:text-black text-sm transition-colors"
            >
              Education
            </a>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault()
                const contactSection = document.getElementById("contact")
                if (contactSection) {
                  window.scrollTo({
                    top: contactSection.offsetTop - 80,
                    behavior: "smooth",
                  })
                }
              }}
              className="text-gray-600 hover:text-black text-sm transition-colors"
            >
              Contact
            </a>
          </nav>
        </div>
      </div>
    </footer>
  )
}
