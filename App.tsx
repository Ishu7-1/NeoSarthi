import React, { useState, useCallback } from 'react';
import { InputForm } from './components/InputForm';
import { Dashboard } from './components/Dashboard';
import { StudentProfile, Recommendations, Roadmap, User } from './types';
import { getRecommendations, startChat } from './services/geminiService';
import { Welcome } from './components/Welcome';
import AuthForm from './components/AuthForm';

const App: React.FC = () => {
  const [view, setView] = useState<'welcome' | 'main'>('welcome');
  const [profile, setProfile] = useState<StudentProfile>({
    major: 'Computer Science',
    gpa: '8.5',
    projectKeywords: 'natural language processing, chatbot, react',
    desiredRole: 'AI Research Scientist',
  });
  const [recommendations, setRecommendations] = useState<Recommendations | null>(null);
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setRecommendations(null);
    try {
      const result = await getRecommendations(profile);
      setRecommendations(result);
      // Build simple roadmap from returned requiredSkills and user's project keywords
      const skills = (result.requiredSkills || []).map((s) => s.trim()).filter(Boolean);
      const owned = profile.projectKeywords.split(',').map(k => k.trim().toLowerCase()).filter(Boolean);
      const roadmapObj: Roadmap = {
        goal: result.careerPaths.primary.title,
        skills: skills.map((skill) => {
          const lower = skill.toLowerCase();
          const has = owned.some(o => o === lower || o.includes(lower) || lower.includes(o));
          return {
            name: skill,
            has,
            suggestion: has ? undefined : `Suggested: take related courses, projects, or tutorials to learn ${skill}.`
          };
        })
      };
      setRoadmap(roadmapObj);
      startChat(profile); // Initialize chatbot with student context
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [profile]);

  if (view === 'welcome') {
    return <Welcome onGetStarted={() => setView('main')} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            Neo-Sarthi
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
            Your Personal AI-Powered Academic and Career Advisor
          </p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
             <div className="sticky top-8">
               {!currentUser ? (
                 <AuthForm onLogin={(u) => setCurrentUser(u)} />
               ) : (
                 <InputForm
                  profile={profile}
                  setProfile={setProfile}
                  onGenerate={handleGenerate}
                  isLoading={isLoading}
                />
               )}
             </div>
          </div>

          <div className="lg:col-span-2">
            <Dashboard 
              recommendations={recommendations}
              isLoading={isLoading}
              error={error}
              roadmap={roadmap}
              currentUserEmail={currentUser?.email}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
