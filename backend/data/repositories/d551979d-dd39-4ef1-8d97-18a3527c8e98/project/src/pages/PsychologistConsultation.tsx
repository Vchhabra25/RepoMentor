import React, { useState } from 'react';
import { ArrowLeft, Users, Star, Clock, MapPin, Phone, Mail, Calendar, Filter } from 'lucide-react';

interface PsychologistConsultationProps {
  onNavigateHome: () => void;
}

interface Psychologist {
  id: number;
  name: string;
  specialization: string;
  experience: number;
  rating: number;
  reviews: number;
  location: string;
  availableSlots: string[];
  price: number;
  languages: string[];
  image: string;
  bio: string;
  education: string;
  phone: string;
  email: string;
}

const PsychologistConsultation: React.FC<PsychologistConsultationProps> = ({ onNavigateHome }) => {
  const [selectedPsychologist, setSelectedPsychologist] = useState<Psychologist | null>(null);
  const [filterSpecialization, setFilterSpecialization] = useState<string>('all');

  const psychologists: Psychologist[] = [
    {
      id: 1,
      name: ' Dr. Priya Sharm',
      specialization: 'Anxiety & Depression',
      experience: 8,
      rating: 4.9,
      reviews: 127,
      location: 'Mumbai, Maharashtra',
      availableSlots: ['10:00 AM', '2:00 PM', '4:00 PM'],
      price: 1500,
      languages: ['English', 'Hindi'],
      image: 'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=400',
      bio: 'Dr. Sharma specializes in cognitive-behavioral therapy and has helped hundreds of patients overcome anxiety and depression.',
      education: 'PhD in Clinical Psychology, Harvard University',
      phone: '+1 (555) 123-4567',
      email: 'priya.sharman@therapycare.com'
    },
    {
      id: 2,
      name: 'Mr Arjun Mehta',
      specialization: 'Trauma & PTSD',
      experience: 12,
      rating: 4.8,
      reviews: 203,
      location: 'Ahmedabad, Gujarat',
      availableSlots: ['9:00 AM', '11:00 AM', '3:00 PM'],
      price: 1750,
      languages: ['English', 'Mandarin','Hindi'],
      image: 'https://images.pexels.com/photos/6749755/pexels-photo-6749755.jpeg?auto=compress&cs=tinysrgb&w=400',
      bio: 'Mr. Mehta is an expert in trauma therapy and EMDR, helping patients process and heal from traumatic experiences.',
      education: 'MD in Psychiatry, UCLA Medical School',
      phone: '+1 (555) 987-6543',
      email: 'arjun.mehta@mindhealth.com'
    },
    {
      id: 3,
      name: 'Dr. Nandita Roy',
      specialization: 'Stress Management',
      experience: 6,
      rating: 4.7,
      reviews: 89,
      location: 'Kolkata, West Bengal',
      availableSlots: ['8:00 AM', '12:00 PM', '5:00 PM'],
      price: 1200,
      languages: ['English', 'Spanish', 'French','Hindi'],
      image: 'https://images.pexels.com/photos/6749763/pexels-photo-6749763.jpeg?auto=compress&cs=tinysrgb&w=400',
      bio: 'Dr. Roy focuses on stress management and work-life balance, helping professionals manage their mental health.',
      education: 'PsyD in Clinical Psychology, Northwestern University',
      phone: '+1 (555) 456-7890',
      email: 'nandita.roy@stresscare.com'
    },
    {
      id: 4,
      name: 'Dr. Rhea Wilson',
      specialization: 'Relationship Counseling',
      experience: 15,
      rating: 4.9,
      reviews: 156,
      location: ' Bengaluru, Karnataka',
      availableSlots: ['10:00 AM', '1:00 PM', '6:00 PM'],
      price: 1400,
      languages: ['English','Hindi'],
      image: 'https://images.pexels.com/photos/6749774/pexels-photo-6749774.jpeg?auto=compress&cs=tinysrgb&w=400',
      bio: 'Dr. Wilson has extensive experience in couples therapy and family counseling, helping relationships thrive.',
      education: 'PhD in Marriage & Family Therapy, University of Texas',
      phone: '+1 (555) 234-5678',
      email: 'rhea.wilson@relationshipcare.com'
    },
    {
      id: 5,
      name: 'Dr. Kabir Ansari',
      specialization: 'Teen & Young Adult',
      experience: 10,
      rating: 4.8,
      reviews: 134,
      location: 'Lucknow, Uttar Pradesh',
      availableSlots: ['9:00 AM', '2:00 PM', '7:00 PM'],
      price: 1350,
      languages: ['English','Hindi','Urdu'],
      image: 'https://images.pexels.com/photos/6749755/pexels-photo-6749755.jpeg?auto=compress&cs=tinysrgb&w=400',
      bio: 'Dr. Ansari specializes in adolescent and young adult mental health, addressing issues like identity and transitions.',
      education: 'PhD in Developmental Psychology, University of Washington',
      phone: '+1 (555) 345-6789',
      email: 'kabir.ansari@youthcare.com'
    }
  ];

  const specializations = ['all', 'Anxiety & Depression', 'Trauma & PTSD', 'Stress Management', 'Relationship Counseling', 'Teen & Young Adult'];

  const filteredPsychologists = filterSpecialization === 'all' 
    ? psychologists 
    : psychologists.filter(p => p.specialization === filterSpecialization);

  const handleBookAppointment = (psychologist: Psychologist) => {
    alert(`Booking appointment with ${psychologist.name}. You will be redirected to the booking system.`);
  };

  if (selectedPsychologist) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center justify-between mb-8">
              <button
                onClick={() => setSelectedPsychologist(null)}
                className="flex items-center space-x-2 text-slate-600 hover:text-teal-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Psychologists</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="flex items-start space-x-6 mb-8">
                  <img
                    src={selectedPsychologist.image}
                    alt={selectedPsychologist.name}
                    className="w-32 h-32 rounded-xl object-cover"
                  />
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">{selectedPsychologist.name}</h1>
                    <p className="text-teal-600 font-semibold text-lg mb-2">{selectedPsychologist.specialization}</p>
                    <div className="flex items-center space-x-4 mb-3">
                      <div className="flex items-center space-x-1">
                        <Star className="w-5 h-5 text-amber-500 fill-current" />
                        <span className="font-semibold">{selectedPsychologist.rating}</span>
                        <span className="text-slate-500">({selectedPsychologist.reviews} reviews)</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4 text-slate-500" />
                        <span className="text-slate-600">{selectedPsychologist.experience} years exp.</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 mb-3">
                      <MapPin className="w-4 h-4 text-slate-500" />
                      <span className="text-slate-600">{selectedPsychologist.location}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedPsychologist.languages.map((lang) => (
                        <span key={lang} className="px-2 py-1 bg-teal-100 text-teal-800 rounded-full text-sm">
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-3">About</h3>
                    <p className="text-slate-600 leading-relaxed">{selectedPsychologist.bio}</p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-3">Education</h3>
                    <p className="text-slate-600">{selectedPsychologist.education}</p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-3">Contact Information</h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-slate-500" />
                        <span className="text-slate-600">{selectedPsychologist.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-slate-500" />
                        <span className="text-slate-600">{selectedPsychologist.email}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-slate-800 mb-4">Book Appointment</h3>
                
                <div className="mb-6">
                  <p className="text-2xl font-bold text-teal-600 mb-2">${selectedPsychologist.price}/session</p>
                  <p className="text-slate-600 text-sm">50-minute session</p>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-slate-800 mb-3">Available Times</h4>
                  <div className="space-y-2">
                    {selectedPsychologist.availableSlots.map((slot) => (
                      <button
                        key={slot}
                        className="w-full p-3 text-left bg-white rounded-lg hover:bg-teal-50 transition-colors border border-slate-200"
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleBookAppointment(selectedPsychologist)}
                  className="w-full px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Calendar className="w-5 h-5" />
                  <span>Book Appointment</span>
                </button>

                <p className="text-xs text-slate-500 mt-3 text-center">
                  You can cancel or reschedule up to 24 hours before your appointment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={onNavigateHome}
              className="flex items-center space-x-2 text-slate-600 hover:text-teal-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </button>
            <div className="flex items-center space-x-3">
              <Users className="w-8 h-8 text-teal-600" />
              <h1 className="text-3xl font-bold text-slate-800">Find a Psychologist</h1>
            </div>
          </div>

          <div className="text-center mb-8">
            <img 
              src="https://images.pexels.com/photos/3760069/pexels-photo-3760069.jpeg?auto=compress&cs=tinysrgb&w=600" 
              alt="Professional consultation" 
              className="w-20 h-20 rounded-full mx-auto mb-4 object-cover shadow-md"
            />
          </div>

          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-6">
              <Filter className="w-5 h-5 text-slate-600" />
              <select
                value={filterSpecialization}
                onChange={(e) => setFilterSpecialization(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                {specializations.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec === 'all' ? 'All Specializations' : spec}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-teal-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-teal-800 mb-2">Professional Mental Health Support</h3>
              <p className="text-teal-700">
                Connect with licensed psychologists who can provide personalized treatment plans and professional guidance 
                for your mental health journey. All our professionals are verified and experienced.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPsychologists.map((psychologist) => (
              <div key={psychologist.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-slate-100">
                <img
                  src={psychologist.image}
                  alt={psychologist.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">{psychologist.name}</h3>
                  <p className="text-teal-600 font-medium mb-3">{psychologist.specialization}</p>
                  
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-amber-500 fill-current" />
                      <span className="text-sm font-medium">{psychologist.rating}</span>
                      <span className="text-slate-500 text-sm">({psychologist.reviews})</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4 text-slate-500" />
                      <span className="text-slate-600 text-sm">{psychologist.experience}y exp.</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1 mb-3">
                    <MapPin className="w-4 h-4 text-slate-500" />
                    <span className="text-slate-600 text-sm">{psychologist.location}</span>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-bold text-slate-800">₹{psychologist.price}/session</span>
                    <div className="flex flex-wrap gap-1">
                      {psychologist.languages.slice(0, 2).map((lang) => (
                        <span key={lang} className="px-2 py-1 bg-slate-100 text-slate-600 rounded-full text-xs">
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setSelectedPsychologist(psychologist)}
                    className="w-full px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                  >
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <div className="bg-indigo-50 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-slate-800 mb-4">Need Help Choosing?</h3>
              <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
                If you're unsure which psychologist is right for you, consider taking our mental health assessment 
                first, or contact our support team for personalized recommendations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={onNavigateHome}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Take Assessment
                </button>
                <button className="px-6 py-3 bg-white text-indigo-600 border-2 border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors">
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PsychologistConsultation;