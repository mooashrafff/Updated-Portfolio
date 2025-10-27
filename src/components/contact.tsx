'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Send, CheckCircle, AlertCircle, ChevronDown } from 'lucide-react';
import { personal } from '@/config/personal';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface FormData {
  name: string;
  email: string;
  phone: string;
  country: string;
  brief: string;
  hasWebsite: string;
  websiteUrl: string;
  startTimeline: string;
  services: string[];
  budget: string;
  customBudgetAmount: string;
  deadline: string;
  deadlineDate: string;
  referralSource: string;
}

const serviceOptions = [
  'Web Development',
  'Mobile App Development', 
  'UI/UX Design',
  'Brand Identity',
  'Content Strategy',
  'Digital Marketing',
  'E-commerce Solutions',
  'AI Automations',
  'Consulting',
  'Other'
];

const countryOptions = [
  { name: 'Algeria', code: 'DZ', flag: '🇩🇿' },
  { name: 'Argentina', code: 'AR', flag: '🇦🇷' },
  { name: 'Australia', code: 'AU', flag: '🇦🇺' },
  { name: 'Austria', code: 'AT', flag: '🇦🇹' },
  { name: 'Bahrain', code: 'BH', flag: '🇧🇭' },
  { name: 'Belgium', code: 'BE', flag: '🇧🇪' },
  { name: 'Brazil', code: 'BR', flag: '🇧🇷' },
  { name: 'Bulgaria', code: 'BG', flag: '🇧🇬' },
  { name: 'Canada', code: 'CA', flag: '🇨🇦' },
  { name: 'Chile', code: 'CL', flag: '🇨🇱' },
  { name: 'China', code: 'CN', flag: '🇨🇳' },
  { name: 'Colombia', code: 'CO', flag: '🇨🇴' },
  { name: 'Croatia', code: 'HR', flag: '🇭🇷' },
  { name: 'Czech Republic', code: 'CZ', flag: '🇨🇿' },
  { name: 'Denmark', code: 'DK', flag: '🇩🇰' },
  { name: 'Egypt', code: 'EG', flag: '🇪🇬' },
  { name: 'Estonia', code: 'EE', flag: '🇪🇪' },
  { name: 'Finland', code: 'FI', flag: '🇫🇮' },
  { name: 'France', code: 'FR', flag: '🇫🇷' },
  { name: 'Germany', code: 'DE', flag: '🇩🇪' },
  { name: 'Greece', code: 'GR', flag: '🇬🇷' },
  { name: 'Hungary', code: 'HU', flag: '🇭🇺' },
  { name: 'India', code: 'IN', flag: '🇮🇳' },
  { name: 'Indonesia', code: 'ID', flag: '🇮🇩' },
  { name: 'Ireland', code: 'IE', flag: '🇮🇪' },
  { name: 'Israel', code: 'IL', flag: '🇮🇱' },
  { name: 'Italy', code: 'IT', flag: '🇮🇹' },
  { name: 'Japan', code: 'JP', flag: '🇯🇵' },
  { name: 'Jordan', code: 'JO', flag: '🇯🇴' },
  { name: 'Kenya', code: 'KE', flag: '🇰🇪' },
  { name: 'Kuwait', code: 'KW', flag: '🇰🇼' },
  { name: 'Latvia', code: 'LV', flag: '🇱🇻' },
  { name: 'Lebanon', code: 'LB', flag: '🇱🇧' },
  { name: 'Lithuania', code: 'LT', flag: '🇱🇹' },
  { name: 'Malaysia', code: 'MY', flag: '🇲🇾' },
  { name: 'Mexico', code: 'MX', flag: '🇲🇽' },
  { name: 'Morocco', code: 'MA', flag: '🇲🇦' },
  { name: 'Netherlands', code: 'NL', flag: '🇳🇱' },
  { name: 'New Zealand', code: 'NZ', flag: '🇳🇿' },
  { name: 'Nigeria', code: 'NG', flag: '🇳🇬' },
  { name: 'Norway', code: 'NO', flag: '🇳🇴' },
  { name: 'Oman', code: 'OM', flag: '🇴🇲' },
  { name: 'Peru', code: 'PE', flag: '🇵🇪' },
  { name: 'Philippines', code: 'PH', flag: '🇵🇭' },
  { name: 'Poland', code: 'PL', flag: '🇵🇱' },
  { name: 'Portugal', code: 'PT', flag: '🇵🇹' },
  { name: 'Qatar', code: 'QA', flag: '🇶🇦' },
  { name: 'Romania', code: 'RO', flag: '🇷🇴' },
  { name: 'Russia', code: 'RU', flag: '🇷🇺' },
  { name: 'Saudi Arabia', code: 'SA', flag: '🇸🇦' },
  { name: 'Singapore', code: 'SG', flag: '🇸🇬' },
  { name: 'Slovakia', code: 'SK', flag: '🇸🇰' },
  { name: 'Slovenia', code: 'SI', flag: '🇸🇮' },
  { name: 'South Africa', code: 'ZA', flag: '🇿🇦' },
  { name: 'South Korea', code: 'KR', flag: '🇰🇷' },
  { name: 'Spain', code: 'ES', flag: '🇪🇸' },
  { name: 'Sweden', code: 'SE', flag: '🇸🇪' },
  { name: 'Switzerland', code: 'CH', flag: '🇨🇭' },
  { name: 'Thailand', code: 'TH', flag: '🇹🇭' },
  { name: 'Tunisia', code: 'TN', flag: '🇹🇳' },
  { name: 'Turkey', code: 'TR', flag: '🇹🇷' },
  { name: 'UAE', code: 'AE', flag: '🇦🇪' },
  { name: 'Ukraine', code: 'UA', flag: '🇺🇦' },
  { name: 'United Kingdom', code: 'GB', flag: '🇬🇧' },
  { name: 'United States', code: 'US', flag: '🇺🇸' },
  { name: 'Uruguay', code: 'UY', flag: '🇺🇾' },
  { name: 'Vietnam', code: 'VN', flag: '🇻🇳' },
  { name: 'Other', code: 'XX', flag: '🌍' }
];

const budgetOptions = [
  'Under $500',
  '$500 - $1,500', 
  '$1,500 - $3,000',
  '$3,000 - $5,000',
  '$5,000+',
  'Other'
];

const timelineOptions = [
  'ASAP',
  'Within 1 month',
  '1-3 months',
  '3-6 months',
  'No rush'
];

const referralSources = [
  'Google Search',
  'Social Media',
  'Referral',
  'Portfolio Site',
  'LinkedIn',
  'Other'
];

// Function to get country phone code
const getCountryCode = (countryCode: string): string => {
  const phoneCodes: { [key: string]: string } = {
    'DZ': '213', 'AR': '54', 'AU': '61', 'AT': '43', 'BH': '973', 'BE': '32', 'BR': '55', 'BG': '359',
    'CA': '1', 'CL': '56', 'CN': '86', 'CO': '57', 'HR': '385', 'CZ': '420', 'DK': '45', 'EG': '20',
    'EE': '372', 'FI': '358', 'FR': '33', 'DE': '49', 'GR': '30', 'HU': '36', 'IN': '91', 'ID': '62',
    'IE': '353', 'IL': '972', 'IT': '39', 'JP': '81', 'JO': '962', 'KE': '254', 'KW': '965', 'LV': '371',
    'LB': '961', 'LT': '370', 'MY': '60', 'MX': '52', 'MA': '212', 'NL': '31', 'NZ': '64', 'NG': '234',
    'NO': '47', 'OM': '968', 'PE': '51', 'PH': '63', 'PL': '48', 'PT': '351', 'QA': '974', 'RO': '40',
    'RU': '7', 'SA': '966', 'SG': '65', 'SK': '421', 'SI': '386', 'ZA': '27', 'KR': '82', 'ES': '34',
    'SE': '46', 'CH': '41', 'TH': '66', 'TN': '216', 'TR': '90', 'AE': '971', 'UA': '380', 'GB': '44',
    'US': '1', 'UY': '598', 'VN': '84', 'XX': '1'
  };
  return phoneCodes[countryCode] || '1';
};

export function Contact() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    country: '',
    brief: '',
    hasWebsite: '',
    websiteUrl: '',
    startTimeline: '',
    services: [],
    budget: '',
    customBudgetAmount: '',
    deadline: '',
    deadlineDate: '',
    referralSource: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const countryDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target as Node)) {
        setIsCountryDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Contact information
  const contactInfo = {
    name: personal.name,
    email: personal.contact.email,
    handle: personal.contact.handle,
    socials: personal.contact.socials,
  };

  // Function to handle opening links
  const openLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleInputChange = (field: keyof FormData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.brief.trim()) newErrors.brief = 'Brief is required';
    if (formData.services.length === 0) newErrors.services = 'Please select at least one service';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Form data being submitted:', formData);
      
      // Simplified database insert - only essential fields
      const { error } = await supabase
        .from('messages')
        .insert([{
          name: formData.name,
          email: formData.email,
          phone: formData.phone && formData.country ? 
            `+${getCountryCode(countryOptions.find(c => c.name === formData.country)?.code || 'XX')} ${formData.phone}` : 
            null,
          country: formData.country || null,
          brief: formData.brief,
          services: formData.services,
          budget: formData.budget === 'Other' ? formData.customBudgetAmount : formData.budget
        }]);

      console.log('Supabase response:', { error });

      if (error) {
        console.error('Supabase error details:', error);
        throw error;
      }

      // Send confirmation email to client
      try {
        const emailResponse = await fetch('/api/send-confirmation-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            brief: formData.brief
          }),
        });

        if (!emailResponse.ok) {
          console.warn('Failed to send confirmation email, but form was submitted successfully');
        } else {
          console.log('Confirmation email sent successfully');
        }
      } catch (emailError) {
        console.warn('Email sending failed:', emailError);
        // Don't fail the form submission if email fails
      }

      // Form submitted successfully
      setIsSubmitted(true);
      toast.success('Message sent successfully! We will contact you soon.');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        country: '',
        brief: '',
        hasWebsite: '',
        websiteUrl: '',
        startTimeline: '',
        services: [],
        budget: '',
        customBudgetAmount: '',
        deadline: '',
        deadlineDate: '',
        referralSource: ''
      });

    } catch (error) {
      console.error('Error submitting form:', error);
      
      // More specific error handling
      if (error instanceof Error) {
        if (error.message.includes('has_website')) {
          toast.error('Database schema needs to be updated. Please contact me directly.');
        } else if (error.message.includes('permission')) {
          toast.error('Permission denied. Please check your database settings.');
        } else {
          toast.error(`Error: ${error.message}`);
        }
      } else {
        toast.error('Failed to send message. Please try again or email me directly.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="mx-auto mt-8 w-full space-y-8">
        {/* Success Message Section */}
        <div className="bg-accent w-full overflow-hidden rounded-3xl px-6 py-8 font-sans sm:px-10 md:px-16 md:py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
            <h2 className="text-foreground text-3xl font-semibold md:text-4xl mb-4">
              Thanks, I'll get back to you ASAP!
            </h2>
            <p className="text-muted-foreground mb-6">
              Or you can email me directly at:
            </p>
            <div
              className="group mb-5 cursor-pointer inline-block"
              onClick={() => openLink(`mailto:${contactInfo.email}`)}
            >
              <div className="flex items-center gap-1">
                <span className="text-base font-medium text-blue-500 hover:underline sm:text-lg">
                  {contactInfo.email}
                </span>
                <ChevronRight className="h-5 w-5 text-blue-500 transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            </div>
            <button
              onClick={() => setIsSubmitted(false)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Send another message
            </button>
          </motion.div>
        </div>

        {/* Contact Me Directly Section */}
        <div className="bg-accent w-full overflow-hidden rounded-3xl px-6 py-8 font-sans sm:px-10 md:px-16 md:py-12">
          <div className="mb-8">
            <h2 className="text-foreground text-3xl font-semibold md:text-4xl">
              Contact me directly
            </h2>
          </div>

          <div className="mt-4 flex flex-col">
            <div
              className="group mb-5 cursor-pointer"
              onClick={() => openLink(`mailto:${contactInfo.email}`)}
            >
              <div className="flex items-center gap-1">
                <span className="text-base font-medium text-blue-500 hover:underline sm:text-lg">
                  {contactInfo.email}
                </span>
                <ChevronRight className="h-5 w-5 text-blue-500 transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-5 sm:gap-x-8">
              {contactInfo.socials.map((social) => (
                <button
                  key={social.name}
                  className="text-muted-foreground hover:text-foreground cursor-pointer text-sm transition-colors"
                  onClick={() => openLink(social.url)}
                  title={social.name}
                >
                  {social.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-8 w-full space-y-8">
      {/* Section 1: Contact Me Directly */}
      <div className="bg-accent w-full overflow-hidden rounded-3xl px-6 py-8 font-sans sm:px-10 md:px-16 md:py-12">
        {/* Header Section */}
        <div className="mb-8">
          <h2 className="text-foreground text-3xl font-semibold md:text-4xl">
            Contact me directly
          </h2>
        </div>

        {/* Email Section */}
        <div className="mt-4 flex flex-col">
          <div
            className="group mb-5 cursor-pointer"
            onClick={() => openLink(`mailto:${contactInfo.email}`)}
          >
            <div className="flex items-center gap-1">
              <span className="text-base font-medium text-blue-500 hover:underline sm:text-lg">
                {contactInfo.email}
              </span>
              <ChevronRight className="h-5 w-5 text-blue-500 transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </div>

          {/* Social Links */}
          <div className="flex flex-wrap gap-x-6 gap-y-5 sm:gap-x-8">
            {contactInfo.socials.map((social) => (
              <button
                key={social.name}
                className="text-muted-foreground hover:text-foreground cursor-pointer text-sm transition-colors"
                onClick={() => openLink(social.url)}
                title={social.name}
              >
                {social.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Section 2: Send Me a Message */}
      <div className="bg-accent w-full overflow-hidden rounded-3xl px-6 py-8 font-sans sm:px-10 md:px-16 md:py-12">
        {/* Header Section */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-foreground text-3xl font-semibold md:text-4xl">
            Send me a message
          </h2>
          <span className="mt-2 sm:mt-0 text-muted-foreground">
            For project inquiries
          </span>
        </div>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name and Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                What's your name? *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  errors.name ? 'border-red-500' : 'border-border'
                }`}
                placeholder="Your name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                What's your email? *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  errors.email ? 'border-red-500' : 'border-border'
                }`}
                placeholder="your@email.com"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Phone Number
              </label>
              <div className="flex gap-2">
                {/* Custom Country Dropdown */}
                <div className="relative w-40" ref={countryDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                    className="w-full px-3 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors flex items-center justify-between"
                  >
                    <span className="truncate">
                      {formData.country ? 
                        `${countryOptions.find(c => c.name === formData.country)?.flag} ${formData.country}` : 
                        'Select Country'
                      }
                    </span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </button>
                  
                  {isCountryDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto">
                      {countryOptions.map((country) => (
                        <button
                          key={country.code}
                          type="button"
                          onClick={() => {
                            handleInputChange('country', country.name);
                            setIsCountryDropdownOpen(false);
                          }}
                          className="w-full px-3 py-2 text-left hover:bg-accent transition-colors flex items-center gap-2"
                        >
                          <span>{country.flag}</span>
                          <span className="flex-1">{country.name}</span>
                          <span className="text-muted-foreground">+{getCountryCode(country.code)}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="flex-1 px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  placeholder="Phone number"
                />
              </div>
            </div>
          </div>

          {/* Brief */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              What's your brief? *
            </label>
            <textarea
              value={formData.brief}
              onChange={(e) => handleInputChange('brief', e.target.value)}
              rows={4}
              className={`w-full px-4 py-3 rounded-xl border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none ${
                errors.brief ? 'border-red-500' : 'border-border'
              }`}
              placeholder="Tell me about your project..."
            />
            {errors.brief && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.brief}
              </p>
            )}
          </div>

          {/* Website Question */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Do you currently have a website?
            </label>
            <select
              value={formData.hasWebsite}
              onChange={(e) => handleInputChange('hasWebsite', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              <option value="">Select option</option>
              <option value="yes">Yes, I have a website</option>
              <option value="no-build">No, but I want to build one</option>
              <option value="no-need">No, and I don't need one</option>
            </select>
            
            {/* Website URL Input - Only show if they have a website */}
            {formData.hasWebsite === 'yes' && (
              <div className="mt-3">
                <label className="block text-sm font-medium text-foreground mb-2">
                  What's your current website URL?
                </label>
                <input
                  type="url"
                  value={formData.websiteUrl}
                  onChange={(e) => handleInputChange('websiteUrl', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  placeholder="https://yourwebsite.com"
                />
              </div>
            )}
          </div>

          {/* Timeline */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              When would you like to start?
            </label>
            <select
              value={formData.startTimeline}
              onChange={(e) => handleInputChange('startTimeline', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              <option value="">Select timeline</option>
              {timelineOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          {/* Services */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              What services do you need? *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {serviceOptions.map((service) => (
                <label key={service} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.services.includes(service)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        handleInputChange('services', [...formData.services, service]);
                      } else {
                        handleInputChange('services', formData.services.filter(s => s !== service));
                      }
                    }}
                    className="rounded border-border text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-foreground">{service}</span>
                </label>
              ))}
            </div>
            {errors.services && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.services}
              </p>
            )}
          </div>

          {/* Budget */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              What is your budget?
            </label>
            <select
              value={formData.budget}
              onChange={(e) => handleInputChange('budget', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              <option value="">Select budget range</option>
              {budgetOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            
            {/* Custom Budget Amount Input */}
            {formData.budget === 'Other' && (
              <div className="mt-3">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Enter your budget amount (USD)
                </label>
                <input
                  type="number"
                  value={formData.customBudgetAmount}
                  onChange={(e) => handleInputChange('customBudgetAmount', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  placeholder="e.g., 2500"
                  min="0"
                  step="100"
                />
              </div>
            )}
          </div>

          {/* Deadline */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Do you have a deadline?
              </label>
              <select
                value={formData.deadline}
                onChange={(e) => handleInputChange('deadline', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                <option value="">Select option</option>
                <option value="yes">Yes</option>
                <option value="no-rush">No, no rush</option>
                <option value="asap">No, but ASAP please</option>
              </select>
            </div>

            {formData.deadline === 'yes' && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  What is the deadline?
                </label>
                <input
                  type="date"
                  value={formData.deadlineDate}
                  onChange={(e) => handleInputChange('deadlineDate', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                />
              </div>
            )}
          </div>

          {/* Referral Source */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Where did you hear about me?
            </label>
            <select
              value={formData.referralSource}
              onChange={(e) => handleInputChange('referralSource', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              <option value="">Select source</option>
              {referralSources.map((source) => (
                <option key={source} value={source}>{source}</option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-6">
            <motion.button
              type="submit"
              disabled={isSubmitting}
              className={`flex items-center gap-2 px-8 py-4 rounded-xl font-medium transition-all duration-200 ${
                isSubmitting
                  ? 'bg-muted text-muted-foreground cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 active:scale-95'
              }`}
              whileHover={!isSubmitting ? { scale: 1.05 } : {}}
              whileTap={!isSubmitting ? { scale: 0.95 } : {}}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-muted-foreground border-t-transparent" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Submit
                </>
              )}
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Contact;
