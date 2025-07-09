import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  link: string;
  github: string;
}

interface Skill {
  name: string;
  level: number;
  category: 'frontend' | 'backend' | 'tools' | 'other';
}

const projects: Project[] = [
  {
    id: 1,
    title: "E-Commerce Platform",
    description: "Full-stack e-commerce solution with React, Node.js, and MongoDB. Features include user authentication, payment processing, and admin dashboard.",
    image: "🛍️",
    technologies: ["React", "Node.js", "MongoDB", "Stripe", "TailwindCSS"],
    link: "#",
    github: "#"
  },
  {
    id: 2,
    title: "Task Management App",
    description: "Real-time task management application with WebSocket support, drag-and-drop functionality, and team collaboration features.",
    image: "📋",
    technologies: ["React", "Socket.io", "Express", "PostgreSQL", "Redis"],
    link: "#",
    github: "#"
  },
  {
    id: 3,
    title: "AI Chat Assistant",
    description: "Intelligent chatbot powered by OpenAI GPT-4, featuring natural language processing and context-aware responses.",
    image: "🤖",
    technologies: ["Python", "OpenAI API", "FastAPI", "React", "TypeScript"],
    link: "#",
    github: "#"
  },
  {
    id: 4,
    title: "Portfolio Website",
    description: "Modern, responsive portfolio website with smooth animations, dark mode, and optimized performance.",
    image: "🎨",
    technologies: ["Next.js", "TypeScript", "Framer Motion", "TailwindCSS"],
    link: "#",
    github: "#"
  }
];

const skills: Skill[] = [
  { name: "React", level: 95, category: "frontend" },
  { name: "TypeScript", level: 90, category: "frontend" },
  { name: "Next.js", level: 88, category: "frontend" },
  { name: "Node.js", level: 85, category: "backend" },
  { name: "Python", level: 80, category: "backend" },
  { name: "PostgreSQL", level: 75, category: "backend" },
  { name: "MongoDB", level: 70, category: "backend" },
  { name: "Docker", level: 65, category: "tools" },
  { name: "AWS", level: 60, category: "tools" },
  { name: "Git", level: 90, category: "tools" },
];

export default function PortfolioExample() {
  const [activeSection, setActiveSection] = useState('about');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'frontend' | 'backend' | 'tools' | 'other'>('all');

  const filteredSkills = skills.filter(skill => 
    selectedCategory === 'all' || skill.category === selectedCategory
  );

  const contactMe = () => {
    toast.success('Contact form submitted! (Demo)');
  };

  const downloadCV = () => {
    toast.success('CV download started! (Demo)');
  };

  const SkillBar = ({ skill }: { skill: Skill }) => (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <span className="font-medium text-gray-900 dark:text-white">{skill.name}</span>
        <span className="text-sm text-gray-600 dark:text-gray-400">{skill.level}%</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${skill.level}%` }}
          transition={{ duration: 1, delay: 0.2 }}
          className="bg-blue-600 h-2 rounded-full"
        />
      </div>
    </div>
  );

  const ProjectCard = ({ project }: { project: Project }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
    >
      <div className="p-6">
        <div className="text-4xl mb-4 text-center">{project.image}</div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          {project.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.map(tech => (
            <span
              key={tech}
              className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded"
            >
              {tech}
            </span>
          ))}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => toast.success('Live demo opened!')}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Live Demo
          </button>
          <button
            onClick={() => toast.success('GitHub opened!')}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            GitHub
          </button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              👨‍💻 John Developer
            </h1>
            <div className="flex space-x-4">
              {['about', 'skills', 'projects', 'contact'].map(section => (
                <button
                  key={section}
                  onClick={() => setActiveSection(section)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeSection === section
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* About Section */}
        {activeSection === 'about' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="mb-8">
              <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center text-4xl">
                👨‍💻
              </div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                John Developer
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
                Full-Stack Developer & UI/UX Enthusiast
              </p>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Passionate about creating beautiful, functional, and user-friendly web applications. 
                I specialize in React, TypeScript, and modern web technologies. Always learning and 
                exploring new technologies to deliver the best possible solutions.
              </p>
            </div>
            <div className="flex justify-center space-x-4">
              <button
                onClick={downloadCV}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                📄 Download CV
              </button>
              <button
                onClick={() => setActiveSection('contact')}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                📧 Contact Me
              </button>
            </div>
          </motion.div>
        )}

        {/* Skills Section */}
        {activeSection === 'skills' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              Skills & Technologies
            </h2>
            
            {/* Category Filter */}
            <div className="flex justify-center mb-8">
              <div className="flex space-x-2">
                {(['all', 'frontend', 'backend', 'tools'] as const).map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedCategory === category
                        ? 'bg-blue-600 text-white'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Technical Skills
                </h3>
                {filteredSkills.map(skill => (
                  <SkillBar key={skill.name} skill={skill} />
                ))}
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Experience
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Senior Developer</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Tech Corp • 2022 - Present</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Full-Stack Developer</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Startup Inc • 2020 - 2022</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Frontend Developer</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Web Agency • 2018 - 2020</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Projects Section */}
        {activeSection === 'projects' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              Featured Projects
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {projects.map(project => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </motion.div>
        )}

        {/* Contact Section */}
        {activeSection === 'contact' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              Get In Touch
            </h2>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Your message..."
                  />
                </div>
                <button
                  onClick={contactMe}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors"
                >
                  Send Message
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}