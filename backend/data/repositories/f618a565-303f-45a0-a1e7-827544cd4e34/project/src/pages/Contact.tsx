import React, { useState } from 'react';
import { ArrowLeft, Mail, Phone, MapPin, Clock, Send, MessageCircle } from 'lucide-react';

interface ContactProps {
  onNavigateHome: () => void;
}

const Contact: React.FC<ContactProps> = ({ onNavigateHome }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    type: 'general'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Thank you for your message! We\'ll get back to you within 24 hours.');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        type: 'general'
      });
    }, 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Us',
      details: 'support@soulnote.com',
      description: 'Send us an email anytime'
    },
    {
      icon: Phone,
      title: 'Call Us',
      details: '+91-22-27546623', //AASRA helpline number reference
      description: 'Mon-Fri, 9AM-6PM EST'
    },
    {
      icon: Clock,
      title: 'Support Hours',
      details: '24/7 Online Support',
      description: 'We\'re always here to help'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-500 to-indigo-600 p-8">
            <div className="flex items-center justify-between">
              <button
                onClick={onNavigateHome}
                className="flex items-center space-x-2 text-white hover:text-slate-100 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Home</span>
              </button>
              <div className="flex items-center space-x-3">
                <MessageCircle className="w-8 h-8 text-white" />
                <h1 className="text-3xl font-bold text-white">Contact Us</h1>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-8">
            <div className="text-center mb-12">
              <img 
                src="/touch.png" 
                alt="Contact us" 
                className="w-24 h-24 rounded-full mx-auto mb-6 object-cover shadow-md"
              />
              <h2 className="text-4xl font-bold text-slate-800 mb-4">Get in Touch</h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                We're here to support you on your mental wellness journey. Reach out to us with any questions, 
                feedback, or if you need assistance with our platform.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div>
                <h3 className="text-2xl font-bold text-slate-800 mb-6">Send us a Message</h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="type" className="block text-sm font-medium text-slate-700 mb-2">
                      Inquiry Type
                    </label>
                    <select
                      id="type"
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                    >
                      <option value="general">General Inquiry</option>
                      <option value="support">Technical Support</option>
                      <option value="feedback">Feedback</option>
                      <option value="partnership">Partnership</option>
                      <option value="emergency">Crisis Support</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                      placeholder="Brief description of your inquiry"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors resize-none"
                      placeholder="Please provide details about your inquiry..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-6 py-3 bg-gradient-to-r from-slate-500 to-indigo-600 text-white rounded-lg hover:from-slate-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>

                {/* Emergency Notice */}
                <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h4 className="text-red-800 font-semibold mb-2">Crisis Support</h4>
                  <p className="text-red-700 text-sm">
                    If you're experiencing a mental health emergency, please contact your local emergency services 
                    or call the National Suicide Prevention Lifeline at 988 immediately.
                  </p>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-2xl font-bold text-slate-800 mb-6">Contact Information</h3>
                <div className="space-y-6">
                  {contactInfo.map((info, index) => {
                    const IconComponent = info.icon;
                    return (
                      <div key={index} className="flex items-start space-x-4 p-4 bg-slate-50 rounded-lg">
                        <div className="bg-gradient-to-r from-slate-400 to-indigo-500 p-3 rounded-lg">
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-slate-800 mb-1">{info.title}</h4>
                          <p className="text-indigo-600 font-medium mb-1">{info.details}</p>
                          <p className="text-slate-600 text-sm">{info.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* FAQ Section */}
                <div className="mt-8">
                  <h4 className="text-xl font-semibold text-slate-800 mb-4">Frequently Asked Questions</h4>
                  <div className="space-y-4">
                    <div className="p-4 bg-white border border-slate-200 rounded-lg">
                      <h5 className="font-medium text-slate-800 mb-2">How quickly will I receive a response?</h5>
                      <p className="text-slate-600 text-sm">We typically respond to all inquiries within 24 hours during business days.</p>
                    </div>
                    <div className="p-4 bg-white border border-slate-200 rounded-lg">
                      <h5 className="font-medium text-slate-800 mb-2">Is my information secure?</h5>
                      <p className="text-slate-600 text-sm">Yes, all communications are encrypted and your privacy is our top priority.</p>
                    </div>
                    <div className="p-4 bg-white border border-slate-200 rounded-lg">
                      <h5 className="font-medium text-slate-800 mb-2">Do you offer phone support?</h5>
                      <p className="text-slate-600 text-sm">Yes, phone support is available Monday through Friday, 9AM-6PM EST.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;