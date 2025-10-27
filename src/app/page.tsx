'use client';

import FluidCursor from '@/components/FluidCursor';
import { Button } from '@/components/ui/button';
import { GithubButton } from '@/components/ui/github-button';
import WelcomeModal from '@/components/welcome-modal';
import InteractiveHero from '@/components/InteractiveHero';
import { motion } from 'framer-motion';
import { personal } from '@/config/personal';
import {
  ArrowRight,
  BriefcaseBusiness,
  FileText,
  Laugh,
  Layers,
  PartyPopper,
  UserRoundSearch,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';

/* ---------- quick-question data ---------- */
const questions = {
  Me: 'Who are you? I want to know more about you.',
  Projects: 'What are your projects? What are you working on right now?',
  Skills: 'What are your skills? Give me a list of your soft and hard skills.',
  Fun: "What's the craziest thing you've ever done? What are your hobbies?",
  Contact: 'How can I contact you?',
  Resume: 'Show me your resume. I want to download your CV.',
} as const;

const questionConfig = [
  { key: 'Me', color: '#329696', icon: Laugh },
  { key: 'Projects', color: '#3E9858', icon: BriefcaseBusiness },
  { key: 'Skills', color: '#856ED9', icon: Layers },
  { key: 'Fun', color: '#B95F9D', icon: PartyPopper },
  { key: 'Contact', color: '#C19433', icon: UserRoundSearch },
  { key: 'Resume', color: '#2563EB', icon: FileText },
] as const;

/* ---------- Animation Variants ---------- */
const topElementVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 }
};

const bottomElementVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function Home() {
  const router = useRouter();
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const goToChat = (question: string) => {
    router.push(`/chat?query=${encodeURIComponent(question)}`);
  };

  useEffect(() => {
    inputRef.current?.focus();
    
    // Fetch profile image for InteractiveHero
    const fetchProfile = async () => {
      try {
        const cachedImage = localStorage.getItem('profileImage');
        if (cachedImage) {
          setProfileImage(cachedImage);
        }

        const { data, error } = await supabase
          .from('profiles')
          .select('profile_image_url')
          .single();

        if (error) throw error;
        if (data?.profile_image_url) {
          setProfileImage(data.profile_image_url);
          localStorage.setItem('profileImage', data.profile_image_url);
        }
      } catch (error) {
        console.error('Error fetching profile image:', error);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="relative">
      {/* Interactive Hero Section */}
      <InteractiveHero 
        avatarSrc={profileImage || '/profile.png'} 
        avatarAlt="Mohamed Ashraf - Web Developer & AI Automation Specialist" 
      />
      
       {/* Overlay Content */}
       <div className="absolute inset-0 z-40 flex flex-col items-center justify-between py-8">
         {/* GitHub button */}
         <div className="absolute top-6 right-8 z-50">
          <GithubButton
            animationDuration={1.5}
            label="Star"
            size={'sm'}
            repoUrl={personal.github.repoUrl}
          />
        </div>

         {/* Looking for talent button */}
         <div className="absolute top-6 left-6 z-50">
          <button
            onClick={() => goToChat('Are you looking for an internship?')}
            className="relative flex cursor-pointer items-center gap-2 rounded-full border bg-white/30 px-4 py-1.5 text-sm font-medium text-black shadow-md backdrop-blur-lg transition hover:bg-white/60 dark:border-white dark:text-white dark:hover:bg-neutral-800"
          >
            {/* Green pulse dot */}
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
            </span>
            Looking for a talent?
          </button>
        </div>

         {/* Header */}
         <motion.div
           className="relative z-50 flex flex-col items-center justify-center text-center"
          variants={topElementVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="z-100">
            <WelcomeModal />
          </div>

          <h2 className="text-secondary-foreground text-xl font-semibold md:text-2xl">
            Hey, I'm {personal.name} 👋
          </h2>
           <h1 
             className="text-3xl font-bold sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white"
            style={{
              textShadow: '2px 2px 4px rgba(0,0,0,0.8), 4px 4px 8px rgba(0,0,0,0.6)',
              transform: 'perspective(1000px) rotateX(5deg)',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
            }}
          >
            {personal.branding.siteTitle}
          </h1>
           <p 
             className="text-sm sm:text-base md:text-lg font-normal text-white"
            style={{
              textShadow: '1px 1px 2px rgba(0,0,0,0.8), 2px 2px 4px rgba(0,0,0,0.6)',
              transform: 'perspective(1000px) rotateX(3deg)',
              filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))'
            }}
          >
            Web Developer & AI Automation Specialist
          </p>
        </motion.div>

         {/* Bottom Content */}
         <motion.div
           variants={bottomElementVariants}
           initial="hidden"
           animate="visible"
           className="relative z-50 flex w-full flex-col items-center justify-center md:px-0"
        >
          {/* free-form question */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (input.trim()) goToChat(input.trim());
            }}
            className="relative w-full max-w-sm sm:max-w-md md:max-w-lg"
          >
            <div className="mx-auto flex items-center rounded-3xl border-0 bg-gradient-to-r from-white via-white to-gray-50 py-2 pr-2 pl-4 sm:py-2.5 sm:pr-2 sm:pl-6 shadow-xl backdrop-blur-sm transition-all duration-300 ease-out hover:shadow-2xl hover:scale-110 hover:bg-gradient-to-r hover:from-white/70 hover:via-white/60 hover:to-gray-50/70 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-neutral-600 dark:hover:bg-neutral-700">
               <input
                 ref={inputRef}
                 type="text"
                 value={input}
                 onChange={(e) => setInput(e.target.value)}
                 placeholder="Ask me anything…"
                 className="w-full border-none bg-transparent text-sm sm:text-base text-gray-800 placeholder:text-gray-500 focus:outline-none"
               />
              <button
                type="submit"
                disabled={!input.trim()}
                aria-label="Submit question"
                className="flex items-center justify-center rounded-full bg-gradient-to-r from-[#0171E3] to-[#0056b3] p-2 sm:p-2.5 text-white transition-all duration-200 ease-out hover:from-[#0056b3] hover:to-[#003d82] hover:scale-110 hover:shadow-xl disabled:opacity-70 dark:bg-blue-600 dark:hover:bg-blue-700"
              >
                <ArrowRight  className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>
          </form>

          {/* quick-question grid */}
          <div className="mt-4 grid w-full max-w-sm sm:max-w-xl md:max-w-2xl grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 md:grid-cols-6">
            {questionConfig.map(({ key, color, icon: Icon }) => (
              <Button
                key={key}
                onClick={() => goToChat(questions[key])}
                variant="outline"
                className="aspect-square w-full cursor-pointer rounded-3xl border-0 bg-gradient-to-br from-white via-white to-gray-50 py-4 px-4 sm:py-6 sm:px-6 md:py-8 md:px-8 lg:py-10 lg:px-10 shadow-xl hover:shadow-2xl active:scale-95 hover:scale-110 hover:bg-gradient-to-br hover:from-gray-50 hover:via-white hover:to-gray-100 transition-all duration-300 ease-out backdrop-blur-sm"
              >
                <div className="flex h-full flex-col items-center justify-center gap-0.5 sm:gap-1">
                  <Icon size={20} strokeWidth={1.5} color={color} className="sm:w-[22px] sm:h-[22px] md:w-[24px] md:h-[24px] lg:w-[26px] lg:h-[26px] drop-shadow-sm" />
                   <span 
                     className="text-xs font-semibold sm:text-sm md:text-base text-gray-700 tracking-wide"
                   >
                     {key}
                   </span>
                 </div>
              </Button>
            ))}
          </div>
        </motion.div>
      </div>
      
      <FluidCursor />
    </div>
  );
}
