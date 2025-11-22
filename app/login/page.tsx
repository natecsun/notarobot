import { Button } from "@/components/ui/button"
import { RobotLogo } from "@/components/ui/robot-logo"
import { login, signup } from "./actions"
import Link from "next/link"

export default function LoginPage({
  searchParams,
}: {
  searchParams: { message: string; error: string }
}) {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 font-mono text-sm text-gray-400 hover:text-white">
        <RobotLogo className="w-6 h-6" />
        NOTAROBOT.COM
      </Link>

      <div className="w-full max-w-md border border-zinc-800 bg-zinc-900/50 p-8 rounded-2xl backdrop-blur">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Welcome, Human.</h1>
          <p className="text-gray-400 text-sm">Enter your credentials to access the resistance.</p>
        </div>

        <form className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-gray-500 mb-1 uppercase">Email</label>
            <input
              name="email"
              type="email"
              required
              className="w-full bg-black border border-zinc-800 rounded p-3 text-sm focus:border-accent focus:outline-none transition-colors"
              placeholder="human@example.com"
            />
          </div>
          
          <div>
            <label className="block text-xs font-mono text-gray-500 mb-1 uppercase">Password</label>
            <input
              name="password"
              type="password"
              required
              className="w-full bg-black border border-zinc-800 rounded p-3 text-sm focus:border-accent focus:outline-none transition-colors"
              placeholder="••••••••"
            />
          </div>

          <div className="pt-4 flex flex-col gap-3">
            <Button formAction={login} className="w-full bg-white text-black hover:bg-gray-200 font-bold">
              Sign In
            </Button>
            <Button formAction={signup} variant="outline" className="w-full border-zinc-800 text-gray-400 hover:text-white hover:bg-zinc-800">
              Create Account
            </Button>
          </div>

          {searchParams?.message && (
            <p className="mt-4 text-center text-sm text-green-400 bg-green-400/10 p-2 rounded border border-green-400/20">
              {searchParams.message}
            </p>
          )}
          
          {searchParams?.error && (
            <p className="mt-4 text-center text-sm text-red-400 bg-red-400/10 p-2 rounded border border-red-400/20">
              {searchParams.error}
            </p>
          )}
        </form>
      </div>
    </div>
  )
}
