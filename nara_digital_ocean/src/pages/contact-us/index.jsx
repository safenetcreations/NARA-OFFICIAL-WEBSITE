import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Contact form submitted:', formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <>
      <Helmet>
        <title>Contact Us - NARA Digital Ocean Platform</title>
        <meta name="description" content="Get in touch with the National Aquatic Resources Research and Development Agency (NARA)" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        {/* Hero Section */}
        <section className="relative py-20 px-4 bg-gradient-to-br from-blue-600 via-cyan-600 to-blue-700 text-white">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">Contact Us</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              We're here to help. Reach out to NARA for inquiries, support, or collaboration opportunities.
            </p>
          </div>
        </section>

        {/* Contact Information & Form */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12">
              
              {/* Contact Information */}
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-8">Get In Touch</h2>
                
                {/* Main Office */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-slate-200">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Icon name="MapPin" size={24} className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-slate-900 mb-2">Main Office</h3>
                      <p className="text-slate-600">
                        National Aquatic Resources Research and Development Agency<br />
                        Crow Island, Colombo 15<br />
                        Sri Lanka
                      </p>
                    </div>
                  </div>
                </div>

                {/* Phone */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-slate-200">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <Icon name="Phone" size={24} className="text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-slate-900 mb-2">Phone</h3>
                      <p className="text-slate-600">
                        +94 11 252 1000<br />
                        +94 11 252 1100
                      </p>
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-slate-200">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <Icon name="Mail" size={24} className="text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-slate-900 mb-2">Email</h3>
                      <p className="text-slate-600">
                        <a href="mailto:info@nara.gov.lk" className="text-blue-600 hover:underline">
                          info@nara.gov.lk
                        </a><br />
                        <a href="mailto:director@nara.gov.lk" className="text-blue-600 hover:underline">
                          director@nara.gov.lk
                        </a>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Working Hours */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-slate-200">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-amber-100 rounded-lg">
                      <Icon name="Clock" size={24} className="text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-slate-900 mb-2">Working Hours</h3>
                      <p className="text-slate-600">
                        Monday - Friday: 8:30 AM - 4:15 PM<br />
                        Saturday - Sunday: Closed<br />
                        <span className="text-sm text-slate-500">(Except Public Holidays)</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quick Links */}
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
                  <h3 className="font-semibold text-lg text-slate-900 mb-4">Quick Links</h3>
                  <div className="space-y-3">
                    <a 
                      href="/procurement-recruitment-portal" 
                      className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      <Icon name="Briefcase" size={18} className="mr-2" />
                      Careers & Recruitment
                    </a>
                    <a 
                      href="/nara-news-updates-center" 
                      className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      <Icon name="Newspaper" size={18} className="mr-2" />
                      News & Updates
                    </a>
                    <a 
                      href="/emergency-response-network" 
                      className="flex items-center text-red-600 hover:text-red-700 transition-colors"
                    >
                      <Icon name="AlertTriangle" size={18} className="mr-2" />
                      Emergency Hotline
                    </a>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-8">Send Us A Message</h2>
                
                <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 border border-slate-200">
                  <div className="mb-6">
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      placeholder="Your name"
                    />
                  </div>

                  <div className="mb-6">
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div className="mb-6">
                    <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      placeholder="How can we help you?"
                    />
                  </div>

                  <div className="mb-6">
                    <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                      placeholder="Tell us more about your inquiry..."
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="default"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-medium"
                  >
                    <Icon name="Send" size={20} className="mr-2" />
                    Send Message
                  </Button>

                  <p className="text-sm text-slate-500 mt-4 text-center">
                    We'll respond to your inquiry within 1-2 business days
                  </p>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section (Optional - Add Google Maps integration later) */}
        <section className="py-16 px-4 bg-slate-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Find Us</h2>
            <div className="bg-slate-200 rounded-xl h-96 flex items-center justify-center">
              <div className="text-center text-slate-600">
                <Icon name="MapPin" size={48} className="mx-auto mb-4 text-slate-400" />
                <p className="text-lg">Map integration coming soon</p>
                <p className="text-sm">Crow Island, Colombo 15, Sri Lanka</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ContactUs;
