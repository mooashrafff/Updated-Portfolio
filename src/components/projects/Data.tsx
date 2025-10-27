import Image from 'next/image';
import { Image as Img } from 'lucide-react';
import { ChevronRight, Link } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { url } from 'inspector';

// Enhanced project content array with all projects
const PROJECT_CONTENT = [
  {
    title: 'Back2Home',
    description:
      'Back2Home is a dedicated platform created by graduating students to address the critical issue of missing persons. What started as an academic project has evolved into a powerful tool that combines advanced technology with compassionate service to help reunite families.',
    techStack: [
      'Next.js',
      'React',
      'TypeScript',
      'TailwindCSS',
      'shadcn-ui',
      'Vercel',
    ],
    date: '2025',
    links: [
      {
        name: 'website',
        url: 'https://back-to-home.vercel.app/#/',
      },
    ],
    images: [
      {
        src: '/back2home.jpg',
        alt: 'Back2Home preview',
      },
    ],
  },
  {
    title: 'My Previous Portfolio',
    description:
      'My previous portfolio website showcasing my early work and projects. Built with modern web technologies, it demonstrates my growth as a developer and my ability to create clean, responsive user interfaces. This portfolio helped me land my first clients and projects.',
    techStack: [
      'React',
      'JavaScript',
      'CSS3',
      'HTML5',
      'Vercel',
      'Responsive Design',
    ],
    date: '2024',
    links: [
      {
        name: 'website',
        url: 'https://my-portfolio-one-alpha-25.vercel.app/',
      },
    ],
    images: [
      {
        src: '/old-portfolio-preview2.png',
        alt: 'Previous Portfolio detailed view',
      },
    ],
  },
];

// Define interface for project prop
interface ProjectProps {
  title: string;
  description?: string;
  techStack?: string[];
  date?: string;
  links?: { name: string; url: string }[];
  images?: { src: string; alt: string }[];
}

const ProjectContent = ({ project }: { project: ProjectProps }) => {
  // Find the matching project data
  const projectData = PROJECT_CONTENT.find((p) => p.title === project.title);

  if (!projectData) {
    return <div>Project details not available</div>;
  }

  return (
    <div className="space-y-10">
      {/* Header section with description */}
      <div className="rounded-3xl bg-[#F5F5F7] p-8 dark:bg-[#1D1D1F]">
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
            <span>{projectData.date}</span>
          </div>

          <p className="text-secondary-foreground font-sans text-base leading-relaxed md:text-lg">
            {projectData.description}
          </p>

          {/* Tech stack */}
          <div className="pt-4">
            <h3 className="mb-3 text-sm tracking-wide text-neutral-500 uppercase dark:text-neutral-400">
              Technologies
            </h3>
            <div className="flex flex-wrap gap-2">
              {projectData.techStack.map((tech, index) => (
                <span
                  key={index}
                  className="rounded-full bg-neutral-200 px-3 py-1 text-sm text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Links section */}
      {projectData.links && projectData.links.length > 0 && (
        <div className="mb-24">
          <div className="px-6 mb-4 flex items-center gap-2">
            <h3 className="text-sm tracking-wide text-neutral-500 dark:text-neutral-400">
              Links
            </h3>
            <Link className="text-muted-foreground w-4" />
          </div>
          <Separator className="my-4" />
          <div className="space-y-3">
            {projectData.links.map((link, index) => (
                <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-[#F5F5F7] flex items-center justify-between rounded-xl p-4 transition-colors hover:bg-[#E5E5E7] dark:bg-neutral-800 dark:hover:bg-neutral-700"
                >
                <span className="font-light capitalize">{link.name}</span>
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
            ))}
          </div>
        </div>
      )}

      {/* Images gallery */}
      {projectData.images && projectData.images.length > 0 && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            {projectData.images.map((image, index) => (
              <div
                key={index}
                className="relative aspect-video overflow-hidden rounded-2xl"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Main data export with updated content
export const data = [
  {
    category: 'Graduation Project',
    title: 'Back2Home',
    src: '/back2home.jpg',
    content: <ProjectContent project={{ title: 'Back2Home' }} />,
  },
  {
    category: 'Portfolio Project',
    title: 'My Previous Portfolio',
    src: '/old-portfolio-preview.png',
    content: <ProjectContent project={{ title: 'My Previous Portfolio' }} />,
  },
];
