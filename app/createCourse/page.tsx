"use client"
import React, { useState } from 'react';
import Papa from 'papaparse';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { read, utils as xlsxUtils } from 'xlsx';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Loader2, Search, Menu, BookOpen, Rocket, Award, Zap, Brain, Code } from "lucide-react";
import Groq from "groq-sdk";

interface LearningResource {
  topic: string;
  title: string;
  url: string;
}

const Navbar = () => {
  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 bg-gray-900/80 backdrop-blur-lg z-50 border-b border-gray-700"
    >
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <motion.div
          className="text-2xl font-bold text-teal-400"
          whileHover={{ scale: 1.05 }}
        >
          SkillForge
        </motion.div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="text-gray-300 hover:text-white"
        >
          <Menu size={24} />
        </motion.button>
      </div>
    </motion.nav>
  );
};

const NavItem = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <motion.button
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.95 }}
    className="flex items-center space-x-1 text-gray-300 hover:text-teal-400 transition-colors duration-200"
  >
    {icon}
    <span className="hidden md:inline">{text}</span>
  </motion.button>
);

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="bg-gray-800 p-6 rounded-xl shadow-lg"
  >
    <div className="text-teal-400 mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
    <p className="text-gray-400">{description}</p>
  </motion.div>
);
const LearningComponent: React.FC = () => {
  const [learningGoal, setLearningGoal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<LearningResource[] | null>(null);
  const [isFileSaved, setIsFileSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const csvData = await fetch('/onlyTitles.csv');
      const fileContent = await csvData.text();

      const dataWorkbook = read(fileContent, { type: 'string' });
      const dataSheet = dataWorkbook.Sheets[dataWorkbook.SheetNames[0]];
      const dataArray = xlsxUtils.sheet_to_json<string[]>(dataSheet, { header: 1 });

      const systemPrompt = `You are a professional Course Designer with expertise in curriculum development and instructional design. Your task is to create a well-structured, logical course outline based on the provided CSV data and the user's learning goals.

        Follow these guidelines:
        1. Assume the USER has zero knowledge about the domain unless they specify otherwise.
        2. Analyze the provided CSV data to extract rows relevant to the user's learning/upskilling goal.
        3. Include foundational topics necessary for understanding more advanced concepts.
        4. Ensure a logical progression of topics, starting with the most basic and building up to more complex subjects.
        5. If a subtopic is included, ensure its parent topic or a relevant prerequisite is also part of the course structure.
        6. Order the topics in increasing complexity, considering dependencies between topics.

        Output format:
        - Return only the relevant CSV row entries in 'topic', 'title' format.
        - Ensure the rows are in increasing order of skill requirement or complexity.
        - Do not include any introductory text, explanations, or additional comments.
        - Provide only the filtered data without any special characters.

        Example output:
        'Introduction to Programming', 'What is Programming?'
        'Introduction to Programming', 'Basic Programming Concepts'
        'Variables and Data Types', 'Understanding Variables'
        'Variables and Data Types', 'Common Data Types'
        'Control Structures', 'If-Else Statements'
        'Control Structures', 'Loops in Programming'

        Ensure the course structure is comprehensive, well-organized, and tailored to the user's specific learning goals while maintaining the simple 'topic', 'title' output format.`;
      const userPrompt = `USER's Learning Goal: ${learningGoal}\n\nCSV Data:\n${dataArray.map(row => row.join(',')).join('\n')}`;

      console.log(userPrompt);
      console.log(systemPrompt);

      const groq = new Groq({ apiKey: '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', dangerouslyAllowBrowser: true });
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: userPrompt
          }
        ],
        model: "llama3-groq-70b-8192-tool-use-preview",
        temperature: 0.5,
        max_tokens: 8192,
        top_p: 0.65,
        stream: false,
        stop: null
      });

      console.log("groq req sent", chatCompletion);

      const response = chatCompletion.choices[0]?.message?.content;

      if (!response) {
        throw new Error("No response received from the API");
      }

      const relevantLines = response.trim().split('\n');

      const relevantData = relevantLines.map((line: string) => {
        const [topic, title] = line.split(',').map(item => item.trim());
        return { topic, title } as LearningResource;
      }).filter(item => item.topic && item.title); // Filter out any items with empty topic or title

      if (relevantData.length === 0) {
        throw new Error("No relevant data found in the API response");
      }

      // Generate and download CSV using PapaParse
      const csv = Papa.unparse(relevantData, { header: true });

      await fetch('/api/save-csv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileName: 'output.csv', csvData: csv }),
      });
      // const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      // const link = document.createElement('a');

      // link.href = URL.createObjectURL(blob);
      // link.setAttribute('download', 'output.csv');
      // document.body.appendChild(link);
      // link.click();
      // document.body.removeChild(link);

      setResult(relevantData);
      setIsFileSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred while processing your request.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-6xl font-bold text-center mb-4 bg-gradient-to-r from-teal-400 via-blue-500 to-purple-600 text-transparent bg-clip-text">Create Your Dream Course</h1>
          <p className="text-xl text-center mb-12 text-gray-400">Discover your own learning pathway.</p>

          <form onSubmit={handleSubmit} className="relative mb-16">
            <Input
              type="text"
              value={learningGoal}
              onChange={(e) => setLearningGoal(e.target.value)}
              placeholder="What do you want to learn today?"
              className="w-full text-lg p-6 pr-16 rounded-full bg-gray-800 border-2 border-gray-700 focus:border-teal-400 text-white placeholder-gray-500"
            />
            <Button
              type="submit"
              disabled={isLoading}
              className="absolute right-[1rem] top-[1rem] flex items-center justify-center rounded-full w-12 h-12 bg-teal-500 text-white hover:bg-teal-600"
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="flex items-center justify-center w-full h-full"
                >
                  <Loader2 className="h-6 w-6" />
                </motion.div>
              ) : (
                <Search className="h-6 w-6" />
              )}
            </Button>
          </form>
          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-red-400 mt-4 text-center"
              >
                {error}
              </motion.p>
            )}
            {!result && !isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h2 className="text-3xl font-bold text-center mb-8 text-teal-400">How to craft a perfect course?</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FeatureCard
                    icon={<Zap size={40} />}
                    title="Have a Clear Idea"
                    description="Have a crystal clear idea on what you want to learn and achieve."
                  />
                  <FeatureCard
                    icon={<Brain size={40} />}
                    title="Be Self-Aware"
                    description="Let us know what you already know and what you want to learn next."
                  />
                  <FeatureCard
                    icon={<Code size={40} />}
                    title="Be more Self-Aware"
                    description="Also let us know what you DO NOT know too, so that we cover them up to. ;)"
                  />
                  <FeatureCard
                    icon={<BookOpen size={40} />}
                    title="Structured Learning"
                    description="Organize your learning journey with a personalized roadmap and step-by-step guidance."
                  />

                  <FeatureCard
                    icon={<Rocket size={40} />}
                    title="Accelerated Progress"
                    description="Learn faster and more efficiently with targeted exercises and optimized learning strategies."
                  />

                  <FeatureCard
                    icon={<Award size={40} />}
                    title="Achievement Recognition"
                    description="Track your progress and celebrate milestones, motivating you to keep learning and growing."
                  />
                </div>
              </motion.div>
            )}
            {/* {result && (
              <div className="mt-8">
                <h2 className="text-2xl font-semibold text-center mb-4 text-teal-400">Filtered Learning Resources</h2>
                <ul>
                  {result.map((item, index) => (
                    <li key={index} className="text-gray-300 mb-2">
                      <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-teal-400 hover:underline">
                        {item.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )} */}
            {result && isFileSaved && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mt-8 flex justify-center"
              >
                <Link href="/journey" passHref>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-teal-500 text-white font-bold py-3 px-6 rounded-full shadow-lg flex items-center space-x-2 hover:bg-teal-600 transition duration-300"
                  >
                    <span>Start Your Journey</span>
                    <ChevronRight size={20} />
                  </motion.button>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>
    </div>
  );
};

export default LearningComponent;
