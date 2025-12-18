"use client"

import { useState, useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { login as loginUser, register as registerUser } from "@/lib/features/auth/authSlice"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LogIn, UserPlus, Eye, EyeOff, ArrowLeft, Briefcase, Lock } from "lucide-react"
import { toast } from "sonner"
import { api } from "@/lib/api-client"

interface LoginScreenProps {
  defaultTab?: "login" | "register"
  defaultView?: "auth" | "forgot-password" | "reset-password"
}

export default function LoginScreen({ defaultTab = "login", defaultView = "auth" }: LoginScreenProps) {
  const dispatch = useAppDispatch()
  const { user, isLoading } = useAppSelector((state) => state.auth)
  const userId = user?.id

  const router = useRouter()
  const [activeTab, setActiveTab] = useState(defaultTab)
  
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("") 
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [view, setView] = useState<"auth" | "forgot-password" | "reset-password">(defaultView)
  const [resetToken, setResetToken] = useState("")

  // Redirect to dashboard if already logged in
  useEffect(() => {
      if (userId && !isLoading) {
          router.push('/dashboard')
      }
  }, [userId, isLoading, router])

  // Don't show login form while checking auth status to avoid flash
  if (isLoading || userId) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-background p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )
  }

  // Update URL when switching tabs
  const handleTabChange = (value: string) => {
      const tab: "login" | "register" = value === 'register' ? 'register' : 'login'
      setActiveTab(tab)
      if (tab === 'register') router.push('/register')
      else router.push('/login')
  }

  const handleForgotPasswordClick = () => {
      setView("forgot-password")
      router.push('/forgot-password')
  }

  const handleBackToLogin = () => {
      setView("auth")
      setActiveTab("login")
      router.push('/login')
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    try {
      await dispatch(loginUser({ email, pass: password })).unwrap()
      toast.success("Login successful")
      router.push('/dashboard')
    } catch (err: any) {
      const msg = err || "Login failed"
      setError(msg)
      toast.error(msg)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    try {
      await dispatch(registerUser({ name, email, pass: password })).unwrap()
      toast.success("Registration successful! Please log in.")
      setActiveTab("login")
      router.push('/login')
      setPassword("")
      setShowPassword(false)
    } catch (err: any) {
      const msg = err || "Registration failed"
      setError(msg)
      toast.error(msg)
    }
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
      e.preventDefault()
      setError("")
      try {
          await api.forgotPassword(email)
          toast.success("Reset link sent! Check your email (or backend console for demo).")
          setView("reset-password")
          router.push('/reset-password')
      } catch (err: any) {
          const msg = err.message || "Failed to request reset";
          setError(msg)
          toast.error(msg)
      }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
      e.preventDefault()
      setError("")
      try {
          await api.resetPassword(resetToken, password)
          toast.success("Password reset successful! Please log in.")
          setView("auth")
          setActiveTab("login")
          setPassword("")
          setResetToken("")
          router.push('/login')
      } catch (err: any) {
          setError(err.message || "Failed to reset password")
          toast.error(err.message)
      }
  }

  const togglePasswordVisibility = () => setShowPassword(!showPassword)

  if (view === "forgot-password") {
      return (
        <div className="flex items-center justify-center min-h-screen bg-background p-4">
        <Card className="w-full max-w-md shadow-lg border-2">
            <CardHeader className="text-center">
            <div className="mx-auto bg-primary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <Lock className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
            <CardDescription>Enter your email to receive a reset token.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleForgotPassword} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="reset-email">Email</Label>
                        <Input
                            id="reset-email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p className="text-sm text-red-500">{error}</p>}
                    <Button type="submit" className="w-full">
                        Send Reset Link
                    </Button>
                    <Button type="button" variant="ghost" className="w-full gap-2" onClick={handleBackToLogin}>
                        <ArrowLeft className="w-4 h-4" />
                        Back to Login
                    </Button>
                </form>
            </CardContent>
        </Card>
        </div>
      )
  }

  if (view === "reset-password") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md shadow-lg border-2">
          <CardHeader className="text-center">
          <div className="mx-auto bg-primary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <Lock className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Set New Password</CardTitle>
          <CardDescription>Enter your token and new password.</CardDescription>
          </CardHeader>
          <CardContent>
              <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="space-y-2">
                      <Label htmlFor="token">Reset Token</Label>
                      <Input
                          id="token"
                          value={resetToken}
                          onChange={(e) => setResetToken(e.target.value)}
                          required
                          placeholder="Paste token from email"
                      />
                  </div>
                  <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <div className="relative">
                          <Input
                              id="new-password"
                              type={showPassword ? "text" : "password"}
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              required
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={togglePasswordVisibility}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            )}
                            <span className="sr-only">Toggle password visibility</span>
                          </Button>
                        </div>
                    </div>
                  {error && <p className="text-sm text-red-500">{error}</p>}
                  <Button type="submit" className="w-full">
                      Reset Password
                  </Button>
                  <Button type="button" variant="ghost" className="w-full gap-2" onClick={() => setView("auth")}>
                        <ArrowLeft className="w-4 h-4" />
                        Back to Login
                    </Button>
              </form>
          </CardContent>
      </Card>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md shadow-lg border-2">
        <CardHeader className="text-center">
          <div className="mx-auto w-32 h-32 flex items-center justify-center mb-4">
            <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <CardTitle className="text-2xl font-bold">Job Manager</CardTitle>
          <CardDescription>Login or create an account to continue.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <Button 
                            variant="link" 
                            className="p-0 h-auto text-xs text-primary"
                            type="button"
                            onClick={handleForgotPasswordClick}
                        >
                            Forgot password?
                        </Button>
                    </div>
                    <div className="relative">
                      <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className="sr-only">Toggle password visibility</span>
                      </Button>
                    </div>
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <Button type="submit" className="w-full gap-2">
                  <LogIn className="w-4 h-4" />
                  Login
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="reg-name">Name</Label>
                        <Input
                            id="reg-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                  </div>
                    <div className="space-y-2">
                        <Label htmlFor="reg-email">Email</Label>
                        <Input
                            id="reg-email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                    />
                  </div>
                    <div className="space-y-2">
                        <Label htmlFor="reg-password">Password</Label>
                        <div className="relative">
                          <Input
                              id="reg-password"
                              type={showPassword ? "text" : "password"}
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              required
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={togglePasswordVisibility}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            )}
                            <span className="sr-only">Toggle password visibility</span>
                          </Button>
                        </div>
                    </div>
                    {error && <p className="text-sm text-red-500">{error}</p>}
                    <Button type="submit" className="w-full gap-2">
                        <UserPlus className="w-4 h-4" />
                        Register
                    </Button>
                </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
