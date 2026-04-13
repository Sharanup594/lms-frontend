"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { AuthGuard } from "@/components/layout/AuthGuard";

export default function WelcomePage() {
  const { user } = useAuth();

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-surface-secondary flex items-center justify-center p-4">
        <div className="w-full max-w-2xl text-center">
          {/* Confetti-style decorative elements */}
          <div className="relative mx-auto mb-8">
            <div className="absolute -inset-12 rounded-full bg-primary-100/40 blur-3xl" />
            <div className="relative">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800 text-white text-4xl shadow-xl shadow-primary-600/30">
                🎉
              </div>
            </div>
          </div>

          <h1 className="text-3xl font-extrabold text-neutral-900 sm:text-4xl">
            Welcome to V-Align LMS, {user?.name?.split(" ")[0] ?? "there"}!
          </h1>
          <p className="mt-4 text-lg text-neutral-600 max-w-lg mx-auto">
            Your account is ready. Before you start learning, let&apos;s find
            out your strengths and recommend the perfect courses for you.
          </p>

          {/* Steps */}
          <Card className="mt-10 text-left">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">
              Here&apos;s what happens next:
            </h2>
            <div className="space-y-4">
              {[
                {
                  step: "1",
                  title: "Skill Assessment",
                  desc: "Answer 10 quick questions about your background and skills (takes ~2 min)",
                  active: true,
                },
                {
                  step: "2",
                  title: "Get Your Employability Index",
                  desc: "We'll calculate your score and identify your strengths",
                },
                {
                  step: "3",
                  title: "Personalized Recommendations",
                  desc: "Pick courses tailored to your goals and start learning",
                },
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-4">
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                      item.active
                        ? "bg-primary-600 text-white"
                        : "bg-neutral-100 text-neutral-500"
                    }`}
                  >
                    {item.step}
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-900">
                      {item.title}
                    </p>
                    <p className="text-sm text-neutral-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* CTA */}
          <div className="mt-8 space-y-3">
            <Link href="/onboarding/skill-assessment">
              <Button
                size="lg"
                className="w-full max-w-md text-base px-8 py-4 h-auto"
              >
                🚀 Start Employability Index Assessment
              </Button>
            </Link>
            <p className="text-xs text-neutral-400">
              Takes only 2 minutes • Free • Get personalized course
              recommendations
            </p>
          </div>

          {/* Skip option */}
          <div className="mt-6">
            <Link
              href="/dashboard"
              className="text-sm text-neutral-500 hover:text-primary-600 transition-colors"
            >
              Skip for now and go to dashboard →
            </Link>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
