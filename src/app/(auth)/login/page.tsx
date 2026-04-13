"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});
  const [loading, setLoading] = useState(false);
  const { role, isLoading, login } = useAuth();
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    if (isLoading) return;
    if (role === "admin") router.replace("/admin/dashboard");
    else if (role === "student") router.replace("/dashboard");
  }, [role, isLoading, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newErrors: typeof errors = {};
    if (!email) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "Please enter a valid email";
    if (!password) newErrors.password = "Password is required";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    const error = await login(email, password);
    if (error) {
      setErrors({ general: error });
      setLoading(false);
    }
  }

  if (isLoading || role) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-secondary">
        <svg
          className="h-8 w-8 animate-spin text-primary-600"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-50 via-white to-surface-secondary p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800 text-white font-bold text-xl shadow-lg shadow-primary-600/30">
            VA
          </div>
          <h1 className="text-2xl font-bold text-neutral-900">Welcome back</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Sign in to your V-Align LMS account
          </p>
        </div>

        {/* Form card */}
        <div className="rounded-2xl bg-white border border-neutral-200/80 p-8 shadow-lg shadow-neutral-900/5">
          {/* Demo credentials hint */}
          <div className="mb-6 rounded-xl bg-primary-50 border border-primary-100 p-4">
            <p className="text-xs font-semibold text-primary-800 mb-2">
              Demo Credentials
            </p>
            <div className="space-y-1 text-xs text-primary-700">
              <p>
                <span className="font-medium">Admin:</span> admin@lms.com /
                admin123
              </p>
              <p>
                <span className="font-medium">Student:</span> student@lms.com /
                student123
              </p>
            </div>
          </div>

          {errors.general && (
            <div className="mb-4 rounded-xl bg-danger-50 border border-danger-100 p-3">
              <p className="text-sm text-danger-700">{errors.general}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <Input
              label="Email address"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors((prev) => ({
                  ...prev,
                  email: undefined,
                  general: undefined,
                }));
              }}
              error={errors.email}
              leftIcon={
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                  />
                </svg>
              }
            />
            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors((prev) => ({
                  ...prev,
                  password: undefined,
                  general: undefined,
                }));
              }}
              error={errors.password}
              leftIcon={
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                  />
                </svg>
              }
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-neutral-300 text-primary-600"
                />
                <span className="text-neutral-600">Remember me</span>
              </label>
              <a
                href="#"
                className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
              >
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              loading={loading}
              className="w-full"
              size="lg"
            >
              Sign in
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-neutral-500">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-medium text-primary-600 hover:text-primary-700 transition-colors"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
