import React from 'react';
import { ArrowLeft, Heart, Users, Target, Shield } from 'lucide-react';

interface AboutProps {
  onNavigateHome: () => void;
}

const About: React.FC<AboutProps> = ({ onNavigateHome }) => {
  const values = [
    {
      icon: Heart,
      title: 'Compassionate Care',
      description: 'We believe in treating every individual with empathy, understanding, and respect on their mental health journey.'
    },
    {
      icon: Shield,
      title: 'Privacy & Security',
      description: 'Your mental health data is completely confidential and protected with the highest security standards.'
    },
    {
      icon: Target,
      title: 'Evidence-Based',
      description: 'Our tools and techniques are grounded in scientific research and proven therapeutic methods.'
    },
    {
      icon: Users,
      title: 'Community Support',
      description: 'Building a supportive community where individuals can find understanding and encouragement.'
    }
  ];

  {/*const team = [
    {
      name: 'Riya Rao',
      role: 'Developer and Founder',
      image: 'rao.jpg',
    },
    {
      name: 'Simar Kaur',
      role: 'Developer and Founder',
      image: 'simar.jpg',
    },
    {
      name: 'Vanshika Chhabra',
      role: 'Developer and Founder',
      image: 'chhabra.jpg',
    },
    {
      name: 'Varnika Yadav',
      role: 'Developer and Founder',
      image: 'yadav.jpg',
    }
  ];*/}

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
                <Heart className="w-8 h-8 text-white" />
                <h1 className="text-3xl font-bold text-white">About Soulnote</h1>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-8">
            {/* Mission Section */}
            <div className="text-center mb-16">
              <img 
                src="/mission2.png"
                alt="Our mission" 
                className="w-32 h-32 rounded-full mx-auto mb-8 object-cover shadow-lg"
              />
              <h2 className="text-4xl font-bold text-slate-800 mb-6">Our Mission</h2>
              <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
                At Soulnote, we believe that mental health care should be accessible, personalized, and empowering. 
                Our mission is to provide comprehensive digital tools that support individuals on their journey to 
                better mental wellness, combining evidence-based practices with cutting-edge technology.
              </p>
            </div>

            {/* Story Section */}
            <div className="mb-16">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="text-3xl font-bold text-slate-800 mb-6">Our Story</h3>
                  <div className="space-y-4 text-slate-600 leading-relaxed">
                    <p>
                      Soulnote was born from a simple yet powerful realization: mental health support should be 
                      available whenever and wherever it's needed. Founded in 2026 by a team of college students, we set out to bridge the gap between traditional 
                      therapy and daily mental wellness support.
                    </p>
                    <p>
                      Our platform combines the wisdom of established therapeutic practices with the convenience 
                      and personalization that modern technology can provide. From daily mood tracking to AI-powered 
                      insights, we're committed to making mental health care more accessible and effective.
                    </p>
                    {/*<p>
                      Today, we're proud to serve thousands of users worldwide, helping them build resilience, 
                      manage stress, and cultivate lasting mental wellness habits.
                    </p>*/}
                  </div>
                </div>
                <div>
                  <img 
                    src="two heads.jpg" 
                    alt="Our story" 
                    className="w-full rounded-2xl shadow-lg object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Values Section */}
            <div className="mb-16">
              <h3 className="text-3xl font-bold text-slate-800 text-center mb-12">Our Values</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {values.map((value, index) => {
                  const IconComponent = value.icon;
                  return (
                    <div key={index} className="bg-slate-50 rounded-xl p-6">
                      <div className="flex items-start space-x-4">
                        <div className="bg-gradient-to-r from-slate-400 to-indigo-500 p-3 rounded-lg">
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="text-xl font-semibold text-slate-800 mb-2">{value.title}</h4>
                          <p className="text-slate-600 leading-relaxed">{value.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Team Section (🔄 updated grid-cols-4 here!) 
            <div className="mb-16">
              <h3 className="text-3xl font-bold text-slate-800 text-center mb-12">Meet Our Team</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {team.map((member, index) => (
                  <div key={index} className="text-center">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-32 h-32 rounded-full mx-auto mb-4 object-cover shadow-lg"
                    />
                    <h4 className="text-xl font-semibold text-slate-800 mb-2">{member.name}</h4>
                    <p className="text-indigo-600 font-medium mb-3">{member.role}</p>
                    <p className="text-slate-600 text-sm leading-relaxed">{member.bio}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats Section 
            <div className="bg-gradient-to-r from-slate-100 to-indigo-100 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-slate-800 text-center mb-8">Our Impact</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-indigo-600 mb-2">10,000+</div>
                  <div className="text-slate-600">Active Users</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-emerald-600 mb-2">50,000+</div>
                  <div className="text-slate-600">Sessions Completed</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-violet-600 mb-2">95%</div>
                  <div className="text-slate-600">User Satisfaction</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-amber-600 mb-2">24/7</div>
                  <div className="text-slate-600">Support Available</div>
                </div>
              </div>
            </div>*/}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;