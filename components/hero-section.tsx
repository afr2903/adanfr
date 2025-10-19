"use client"

import { useEffect, useState } from "react"
import { ArrowDown } from "lucide-react"

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [text, setText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTyping, setIsTyping] = useState(true)

  const phrases = [
    "Adán Flores",
    "a Researcher",
    "an AI Engineer",
  ]

  useEffect(() => {
    setIsVisible(true)

    let timeout

    if (isTyping) {
      // Typing effect
      if (text.length < phrases[currentIndex].length) {
        timeout = setTimeout(() => {
          setText(phrases[currentIndex].slice(0, text.length + 1))
        }, 100)
      } else {
        // Pause at the end of typing before starting to delete
        timeout = setTimeout(() => {
          setIsTyping(false)
        }, 2000)
      }
    } else {
      // Deleting effect
      if (text.length > 0) {
        timeout = setTimeout(() => {
          setText(text.slice(0, text.length - 1))
        }, 50)
      } else {
        // Move to the next phrase
        setCurrentIndex((currentIndex + 1) % phrases.length)
        setIsTyping(true)
        timeout = setTimeout(() => {}, 500)
      }
    }

    return () => clearTimeout(timeout)
  }, [text, isTyping, currentIndex, phrases])

  const scrollToAbout = () => {
    const aboutSection = document.getElementById("about")
    if (aboutSection) {
      window.scrollTo({
        top: aboutSection.offsetTop - 80,
        behavior: "smooth",
      })
    }
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden" id="home">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/80 z-10"></div>

      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/parents-degree-bg.jpg')",
          filter: "brightness(0.7) contrast(1.2)",
        }}
      ></div>

      {/* Content */}
      <div className="container relative z-20 px-4 py-20 md:py-0">
        <div
          className={`max-w-4xl mx-auto text-center transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h1 className="text-2xl md:text-3xl font-light mb-4">Hi!</h1>
          <h2 className="text-5xl md:text-7xl font-bold mb-6">
            I'm{" "}
            <span className="text-primary inline-block min-w-[300px] text-left">
              {text}
              <span className="animate-pulse ml-1">|</span>
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-white/80 mb-8">from San Luis Potosí, México.</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
              className="px-8 py-3 bg-primary hover:bg-primary-700 text-white rounded-full transition-colors"
            >
              Hire Me
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
              className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
            >
              View My Work
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
        <button onClick={scrollToAbout} aria-label="Scroll down">
          <ArrowDown className="text-white/70" />
        </button>
      </div>
    </section>
  )
}
