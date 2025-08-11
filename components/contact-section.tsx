"use client"

import { useState, useRef } from "react"
import { Send, Mail, MapPin, Phone } from "lucide-react"
import emailjs from "@emailjs/browser"

export default function ContactSection() {
  const formRef = useRef(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState("")
  const [submitError, setSubmitError] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage("")
    setSubmitError(false)

    try {
      // Replace these with your actual EmailJS service ID, template ID, and public key
      const serviceId = "service_l2n6zvj"
      const templateId = "template_7k3mx64"
      const publicKey = "EXjW7JD2MiMNj_SfN"

      await emailjs.sendForm(serviceId, templateId, formRef.current, publicKey)

      setSubmitMessage("Your message has been sent successfully!")
      setFormData({ name: "", email: "", subject: "", message: "" })

      // Clear success message after 5 seconds
      setTimeout(() => setSubmitMessage(""), 5000)
    } catch (error) {
      console.error("Failed to send email:", error)
      setSubmitError(true)
      setSubmitMessage("Failed to send your message. Please try again later.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="section bg-[#121212] text-white" id="contact">
      <div className="container max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="section-heading">Contact</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-bold mb-6">Get in Touch</h3>
            <p className="text-white/70 mb-8">
              I'm interested in research opportunities, especially in AI for robotics. If you have
              any questions or would like to discuss potential collaborations, feel free to contact me.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium mb-1 text-white">Location</h4>
                  <p className="text-white/70">San Luis Potosí, México</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium mb-1 text-white">Email</h4>
                  <a href="mailto:afr102903@gmail.com" className="text-primary hover:underline">
                    afr102903@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium mb-1 text-white">Phone</h4>
                  <p className="text-white/70">+1 (408) 312-1647</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold mb-6">Send Me A Message</h3>

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#333] rounded-lg focus:outline-none focus:border-primary transition-colors text-white"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#333] rounded-lg focus:outline-none focus:border-primary transition-colors text-white"
                  />
                </div>
              </div>

              <div>
                <input
                  type="text"
                  name="subject"
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#333] rounded-lg focus:outline-none focus:border-primary transition-colors text-white"
                />
              </div>

              <div>
                <textarea
                  name="message"
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#333] rounded-lg focus:outline-none focus:border-primary transition-colors resize-none text-white"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-primary hover:bg-primary-700 text-white rounded-full transition-colors flex items-center gap-2"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
                <Send size={16} />
              </button>

              {submitMessage && (
                <div className={`mt-4 ${submitError ? "text-red-500" : "text-green-400"}`}>{submitMessage}</div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
