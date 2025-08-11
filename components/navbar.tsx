"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Menu, X, FileText, BookOpen, Linkedin, Github, MessageCircle } from "lucide-react"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState("home")

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }

      // Determine active section based on scroll position
      const sections = ["home", "about", "portfolio", "experience", "education", "skills", "contact"]
      const scrollPosition = window.scrollY + 100

      for (const section of sections.reverse()) {
        const element = document.getElementById(section)
        if (element && scrollPosition >= element.offsetTop) {
          setActiveSection(section)
          break
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: "smooth",
      })
      setIsOpen(false)
    }
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-[#121212]/90 backdrop-blur-md py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault()
            scrollToSection("home")
          }}
          className="flex items-center gap-2"
        >
          <div className="w-10 h-10 rounded-full overflow-hidden">
            <Image src="/images/me_boston.jpg" alt="Adán Flores" width={40} height={40} className="object-cover" />
          </div>
          <span className="font-bold text-lg hidden sm:inline-block">Adán Flores</span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault()
              scrollToSection("home")
            }}
            className={`text-white/80 hover:text-white transition-colors ${activeSection === "home" ? "text-primary" : ""}`}
          >
            Home
          </a>
          <a
            href="#about"
            onClick={(e) => {
              e.preventDefault()
              scrollToSection("about")
            }}
            className={`text-white/80 hover:text-white transition-colors ${activeSection === "about" ? "text-primary" : ""}`}
          >
            About
          </a>
          <a
            href="#portfolio"
            onClick={(e) => {
              e.preventDefault()
              scrollToSection("portfolio")
            }}
            className={`text-white/80 hover:text-white transition-colors ${activeSection === "portfolio" ? "text-primary" : ""}`}
          >
            Portfolio
          </a>
          <a
            href="#experience"
            onClick={(e) => {
              e.preventDefault()
              scrollToSection("experience")
            }}
            className={`text-white/80 hover:text-white transition-colors ${activeSection === "experience" ? "text-primary" : ""}`}
          >
            Experience
          </a>
          <a
            href="#education"
            onClick={(e) => {
              e.preventDefault()
              scrollToSection("education")
            }}
            className={`text-white/80 hover:text-white transition-colors ${activeSection === "education" ? "text-primary" : ""}`}
          >
            Education
          </a>
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault()
              scrollToSection("contact")
            }}
            className={`text-white/80 hover:text-white transition-colors ${activeSection === "contact" ? "text-primary" : ""}`}
          >
            Contact
          </a>
        </nav>

        {/* Social and Document Icons */}
        <div className="hidden md:flex items-center gap-4">
           <a
            href="https://www.linkedin.com/in/adanfr/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/70 hover:text-primary transition-colors"
            aria-label="LinkedIn"
          >
            <Linkedin size={20} />
          </a>
           <a
            href="https://github.com/afr2903"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/70 hover:text-primary transition-colors"
            aria-label="GitHub"
          >
            <Github size={20} />
          </a>
           <a
            href="https://wa.me/14083121647"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/70 hover:text-primary transition-colors"
            aria-label="WhatsApp"
          >
            <MessageCircle size={20} />
          </a>
           <a
            href="/Adan_Flores_resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/70 hover:text-primary transition-colors"
            aria-label="Resume"
          >
            <FileText size={20} />
          </a>
          <a
            href="https://scholar.google.com/citations?user=lwm1mIEAAAAJ"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/70 hover:text-primary transition-colors"
            aria-label="Google Scholar"
          >
            <BookOpen size={20} />
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white/80 hover:text-white transition-colors"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-[#121212]/95 backdrop-blur-md border-t border-white/10 py-4">
          <nav className="container mx-auto px-4 flex flex-col gap-4">
            <a
              href="#home"
              className={`text-white/80 hover:text-white transition-colors py-2 ${activeSection === "home" ? "text-primary" : ""}`}
              onClick={(e) => {
                e.preventDefault()
                scrollToSection("home")
              }}
            >
              Home
            </a>
            <a
              href="#about"
              className={`text-white/80 hover:text-white transition-colors py-2 ${activeSection === "about" ? "text-primary" : ""}`}
              onClick={(e) => {
                e.preventDefault()
                scrollToSection("about")
              }}
            >
              About
            </a>
            <a
              href="#portfolio"
              className={`text-white/80 hover:text-white transition-colors py-2 ${activeSection === "portfolio" ? "text-primary" : ""}`}
              onClick={(e) => {
                e.preventDefault()
                scrollToSection("portfolio")
              }}
            >
              Portfolio
            </a>
            <a
              href="#experience"
              className={`text-white/80 hover:text-white transition-colors py-2 ${activeSection === "experience" ? "text-primary" : ""}`}
              onClick={(e) => {
                e.preventDefault()
                scrollToSection("experience")
              }}
            >
              Experience
            </a>
            <a
              href="#education"
              className={`text-white/80 hover:text-white transition-colors py-2 ${activeSection === "education" ? "text-primary" : ""}`}
              onClick={(e) => {
                e.preventDefault()
                scrollToSection("education")
              }}
            >
              Education
            </a>
            <a
              href="#contact"
              className={`text-white/80 hover:text-white transition-colors py-2 ${activeSection === "contact" ? "text-primary" : ""}`}
              onClick={(e) => {
                e.preventDefault()
                scrollToSection("contact")
              }}
            >
              Contact
            </a>

            <div className="flex items-center gap-4 py-2">
               <a
                 href="https://www.linkedin.com/in/adanfr/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-primary transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
               <a
                 href="https://github.com/afr2903"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-primary transition-colors"
                aria-label="GitHub"
              >
                <Github size={20} />
              </a>
               <a
                 href="https://wa.me/14083121647"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-primary transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle size={20} />
              </a>
               <a
                 href="/Adan_Flores_resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-primary transition-colors"
                aria-label="Resume"
              >
                <FileText size={20} />
              </a>
              <a
                href="https://scholar.google.com/citations?user=lwm1mIEAAAAJ"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-primary transition-colors"
                aria-label="Google Scholar"
              >
                <BookOpen size={20} />
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
