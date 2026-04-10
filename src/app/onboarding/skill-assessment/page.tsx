'use client'

import { useState } from 'react'
import { useMutation } from '@apollo/client/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { SUBMIT_SKILL_ASSESSMENT_MUTATION } from '@/lib/graphql/mutations'

const QUESTIONS = [
  { question: 'How would you rate your computer literacy?', options: ['Beginner', 'Intermediate', 'Advanced', 'Expert'] },
  { question: 'Have you worked with any programming language?', options: ['Never', 'Basic scripting', 'Built small projects', 'Professional experience'] },
  { question: 'How comfortable are you with data analysis?', options: ['Not at all', 'Can use spreadsheets', 'Know basic statistics', 'Advanced analytics'] },
  { question: 'Have you led a team before?', options: ['Never', 'Small group projects', 'Managed a team', 'Senior leadership'] },
  { question: 'How would you rate your communication skills?', options: ['Needs work', 'Average', 'Good', 'Excellent'] },
  { question: 'Experience with project management?', options: ['None', 'Informal planning', 'Used PM tools', 'Certified PM'] },
  { question: 'How do you approach problem solving?', options: ['Trial and error', 'Ask for help', 'Structured approach', 'Design thinking'] },
  { question: 'Familiarity with cybersecurity concepts?', options: ['None', 'Basic awareness', 'Intermediate', 'Professional'] },
  { question: 'How often do you learn new skills?', options: ['Rarely', 'When required', 'Monthly', 'Weekly'] },
  { question: 'What is your primary career goal?', options: ['Get first job', 'Switch careers', 'Get promoted', 'Start a business'] },
]

const INTEREST_OPTIONS = ['Technology', 'Leadership', 'Management', 'Communication', 'Innovation']

export default function SkillAssessmentPage() {
  const router = useRouter()
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<{ questionIndex: number; selectedOption: number }[]>([])
  const [interests, setInterests] = useState<string[]>([])
  const [phase, setPhase] = useState<'quiz' | 'interests'>('quiz')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [submitAssessment, { loading }] = useMutation<any>(SUBMIT_SKILL_ASSESSMENT_MUTATION)

  const progress = Math.round(((phase === 'interests' ? QUESTIONS.length : currentQ) / (QUESTIONS.length + 1)) * 100)

  function selectAnswer(optionIndex: number) {
    const updated = [...answers.filter((a) => a.questionIndex !== currentQ), { questionIndex: currentQ, selectedOption: optionIndex }]
    setAnswers(updated)
    if (currentQ < QUESTIONS.length - 1) {
      setTimeout(() => setCurrentQ(currentQ + 1), 300)
    } else {
      setTimeout(() => setPhase('interests'), 300)
    }
  }

  function toggleInterest(interest: string) {
    setInterests((prev) => prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest])
  }

  async function handleSubmit() {
    if (interests.length === 0) return
    try {
      await submitAssessment({ variables: { answers, interests } })
      router.push('/onboarding/recommendations')
    } catch (err) {
      console.error('Failed to submit:', err)
    }
  }

  return (
    <div className="min-h-screen bg-surface-secondary flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 text-white font-bold text-xl shadow-lg shadow-primary-500/30">
            LH
          </div>
          <h1 className="text-2xl font-bold text-neutral-900">Skill Assessment</h1>
          <p className="mt-1 text-sm text-neutral-500">Help us understand your background to recommend the best courses</p>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <ProgressBar value={progress} size="sm" color="primary" />
          <p className="mt-2 text-xs text-neutral-500 text-center">
            {phase === 'quiz' ? `Question ${currentQ + 1} of ${QUESTIONS.length}` : 'Select your interests'}
          </p>
        </div>

        {/* Quiz Phase */}
        {phase === 'quiz' && (
          <Card className="animate-fade-in-up">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">{QUESTIONS[currentQ].question}</h2>
            <div className="space-y-3">
              {QUESTIONS[currentQ].options.map((option, i) => {
                const selected = answers.find((a) => a.questionIndex === currentQ)?.selectedOption === i
                return (
                  <button
                    key={i}
                    onClick={() => selectAnswer(i)}
                    className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                      selected
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-neutral-200 hover:border-primary-300 hover:bg-neutral-50 text-neutral-700'
                    }`}
                  >
                    <span className="font-medium">{option}</span>
                  </button>
                )
              })}
            </div>
            {currentQ > 0 && (
              <button onClick={() => setCurrentQ(currentQ - 1)} className="mt-4 text-sm text-primary-600 hover:text-primary-700 cursor-pointer">
                ← Previous question
              </button>
            )}
          </Card>
        )}

        {/* Interests Phase */}
        {phase === 'interests' && (
          <Card className="animate-fade-in-up">
            <h2 className="text-lg font-semibold text-neutral-900 mb-2">What areas interest you most?</h2>
            <p className="text-sm text-neutral-500 mb-4">Select at least one to get personalized recommendations</p>
            <div className="flex flex-wrap gap-3 mb-6">
              {INTEREST_OPTIONS.map((interest) => {
                const selected = interests.includes(interest)
                return (
                  <button
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    className={`px-4 py-2.5 rounded-xl border-2 font-medium transition-all duration-200 cursor-pointer ${
                      selected
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-neutral-200 hover:border-primary-300 text-neutral-600'
                    }`}
                  >
                    {interest}
                  </button>
                )
              })}
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => { setPhase('quiz'); setCurrentQ(QUESTIONS.length - 1) }}>
                ← Back
              </Button>
              <Button onClick={handleSubmit} loading={loading} disabled={interests.length === 0} className="flex-1">
                Get My Recommendations
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
