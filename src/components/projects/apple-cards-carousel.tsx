'use client';
import { useOutsideClick } from '@/hooks/use-outside-click';
import { cn } from '@/lib/utils';
import {
  IconArrowNarrowLeft,
  IconArrowNarrowRight,
  IconX,
} from '@tabler/icons-react';
import { AnimatePresence, motion } from 'framer-motion';
import Image, { ImageProps } from 'next/image';
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

type Card = {
  src: string;
  title: string;
  category: string;
  content: React.ReactNode;
};

export const CarouselContext = createContext<{
  onCardClose: (index: number) => void;
  currentIndex: number;
}>({
  onCardClose: () => {},
  currentIndex: 0,
});

export const Carousel = ({
  items,
  initialScroll = 0,
}: {
  items: React.ReactNode[];
  initialScroll?: number;
}) => {
  const carouselRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = initialScroll;
      checkScrollability();
    }
  }, [initialScroll]);

  const checkScrollability = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
    }
  };

  // Get the card width and gap based on viewport size
  const getScrollDistance = () => {
    // Card width (w-56 = 224px) + gap-4 (16px)
    const cardWidth = 224;
    const gap = 16;
    const totalWidth = cardWidth + gap;

    // Scroll by 2 cards on desktop, 1 on mobile
    const cardsToScroll = 1;
    return totalWidth * cardsToScroll;
  };

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: -getScrollDistance(),
        behavior: 'smooth',
      });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: getScrollDistance(),
        behavior: 'smooth',
      });
    }
  };

  const handleCardClose = (index: number) => {
    if (carouselRef.current) {
      const cardWidth = 224; // w-56 (224px)
      const gap = isMobile() ? 16 : 16; // gap-4 (16px)
      const scrollPosition = (cardWidth + gap) * index;
      carouselRef.current.scrollTo({
        left: scrollPosition,
        behavior: 'smooth',
      });
      setCurrentIndex(index);
    }
  };

  const isMobile = () => {
    return window && window.innerWidth < 768;
  };

  return (
    <CarouselContext.Provider
      value={{ onCardClose: handleCardClose, currentIndex }}
    >
      <motion.div 
        className="relative w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="flex w-full overflow-x-scroll overscroll-x-auto scroll-smooth py-10 [scrollbar-width:none]"
          ref={carouselRef}
          onScroll={checkScrollability}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div
            className={cn(
              'absolute right-0 z-[10] h-auto w-[5%] overflow-hidden bg-gradient-to-l'
            )}
          ></div>

          <div
            className={cn(
              'flex flex-row justify-start gap-4',
              'mx-auto max-w-7xl' // remove max-w-4xl if you want the carousel to span the full width of its container
            )}
          >
            {items.map((item, index) => (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.5,
                    delay: 0.2 * index,
                    ease: 'easeOut',
                    once: true,
                  },
                }}
                key={'card' + index}
                className="rounded-3xl last:pr-[5%] md:last:pr-[33%]"
              >
                {item}
              </motion.div>
            ))}
          </div>
        </motion.div>
        <motion.div 
          className="mr-10 flex justify-end gap-2 md:mr-20"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <motion.button
            className="relative z-40 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 disabled:opacity-50 transition-all duration-300 hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/30"
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            whileHover={{ 
              scale: 1.1,
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              animate={{ x: canScrollLeft ? [0, -2, 0] : 0 }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <IconArrowNarrowLeft className="h-6 w-6 text-gray-500 transition-colors duration-300 hover:text-white" />
            </motion.div>
          </motion.button>
          <motion.button
            className="relative z-40 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 disabled:opacity-50 transition-all duration-300 hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/30"
            onClick={scrollRight}
            disabled={!canScrollRight}
            whileHover={{ 
              scale: 1.1,
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              animate={{ x: canScrollRight ? [0, 2, 0] : 0 }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <IconArrowNarrowRight className="h-6 w-6 text-gray-500 transition-colors duration-300 hover:text-white" />
            </motion.div>
          </motion.button>
        </motion.div>
      </motion.div>
    </CarouselContext.Provider>
  );
};

export const Card = ({
  card,
  index,
  layout = false,
}: {
  card: Card;
  index: number;
  layout?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { onCardClose, currentIndex } = useContext(CarouselContext);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        handleClose();
      }
    }

    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);

  //@ts-ignore
  useOutsideClick(containerRef, () => handleClose());

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    onCardClose(index);
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-52 h-screen overflow-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 h-full w-full bg-black/80 backdrop-blur-lg"
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              ref={containerRef}
              layoutId={layout ? `card-${card.title}` : undefined}
              className="relative z-[60] mx-auto my-10 h-fit max-w-5xl rounded-3xl bg-white font-sans dark:bg-neutral-900"
            >
              {/* Sticky close button */}
              <div className="sticky top-4 z-52 flex justify-end px-8 pt-8 md:px-14 md:pt-8">
                <button
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-black/90 shadow-md dark:bg-white/90"
                  onClick={handleClose}
                >
                  <IconX className="h-6 w-6 text-neutral-100 dark:text-neutral-900" />
                </button>
              </div>

              {/* Header section with consistent padding */}
              <div className="relative px-8 pt-2 pb-0 md:px-14">
                <div>
                  <motion.p
                    layoutId={layout ? `category-${card.title}` : undefined}
                    className="text-base font-medium text-black dark:text-white"
                  >
                    {card.category}
                  </motion.p>
                  <motion.p
                    layoutId={layout ? `title-${card.title}` : undefined}
                    className="mt-4 text-2xl font-semibold text-neutral-700 md:text-5xl dark:text-white"
                  >
                    {card.title}
                  </motion.p>
                </div>
              </div>

              {/* Content with consistent padding */}
              <div className="px-8 pt-8 pb-14 md:px-14">{card.content}</div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <motion.button
        layoutId={layout ? `card-${card.title}` : undefined}
        onClick={handleOpen}
        className="relative z-10 flex h-80 w-56 flex-col items-start justify-start overflow-hidden rounded-3xl bg-gray-100 dark:bg-neutral-900 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20"
        whileHover={{ 
          y: -8,
          transition: { duration: 0.3, ease: "easeOut" }
        }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Enhanced gradient overlay with animation */}
        <motion.div 
          className="absolute inset-x-0 top-0 z-30 h-full cursor-pointer bg-gradient-to-b from-black/60 via-transparent to-transparent"
          whileHover={{ 
            background: "linear-gradient(to bottom, rgba(0,0,0,0.8), transparent, transparent)",
            transition: { duration: 0.3 }
          }}
        />
        
        {/* Animated border glow */}
        <motion.div
          className="absolute inset-0 rounded-3xl border-2 border-transparent"
          whileHover={{
            borderColor: "rgba(59, 130, 246, 0.5)",
            boxShadow: "0 0 20px rgba(59, 130, 246, 0.3)",
            transition: { duration: 0.3 }
          }}
        />
        
        {/* Floating particles effect */}
        <motion.div
          className="absolute inset-0 z-20"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/30 rounded-full"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + (i % 2) * 40}%`,
              }}
              animate={{
                y: [-10, 10, -10],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 2 + i * 0.3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>

        <div className="relative z-40 p-8">
          <motion.p
            layoutId={layout ? `category-${card.category}` : undefined}
            className="text-left font-sans text-sm font-medium text-white md:text-base"
            whileHover={{ 
              scale: 1.05,
              color: "#60A5FA",
              transition: { duration: 0.2 }
            }}
          >
            {card.category}
          </motion.p>
          <motion.p
            layoutId={layout ? `title-${card.title}` : undefined}
            className="max-w-xs text-left font-sans text-xl font-semibold [text-wrap:balance] text-white md:text-3xl"
            whileHover={{ 
              scale: 1.02,
              color: "#93C5FD",
              transition: { duration: 0.2 }
            }}
          >
            {card.title}
          </motion.p>
          
          {/* Animated "View Project" indicator */}
          <motion.div
            className="mt-4 flex items-center gap-2 text-white/80 text-sm"
            initial={{ opacity: 0, x: -10 }}
            whileHover={{ 
              opacity: 1, 
              x: 0,
              transition: { duration: 0.2 }
            }}
          >
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              View Project
            </motion.span>
            <motion.span
              animate={{ x: [0, 3, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
            >
              →
            </motion.span>
          </motion.div>
        </div>
        
        <BlurImage
          src={card.src}
          alt={card.title}
          fill
          className="absolute inset-0 z-10 object-cover transition-transform duration-500 hover:scale-110"
        />
      </motion.button>
    </>
  );
};

export const BlurImage = ({
  height,
  width,
  src,
  className,
  alt,
  ...rest
}: ImageProps) => {
  const [isLoading, setLoading] = useState(true);
  return (
    <Image
      className={cn(
        'transition duration-300',
        isLoading ? 'blur-sm' : 'blur-0',
        className
      )}
      onLoad={() => setLoading(false)}
      src={src}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      blurDataURL={typeof src === 'string' ? src : undefined}
      alt={alt ? alt : 'Background of a beautiful view'}
      {...rest}
    />
  );
};
