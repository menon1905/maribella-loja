'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Toaster, toast } from 'sonner'
import { supabase, getUserRole } from '@/lib/supabase'
import { Eye, EyeOff, Lock, Mail, User as UserIcon } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login')
  const [showPassword, setShowPassword] = useState(false)

  // Form fields
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [isLoading, setIsLoading] = useState(false)

  // Redireciona se já está logado
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        const role = await getUserRole(session.user.id)
        if (role === 'admin') {
          router.replace('/admin')
        } else {
          router.replace('/')
        }
      }
    }
    checkUser()
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })

      if (error) {
        toast.error('E-mail ou senha inválidos.')
        setIsLoading(false)
        return
      }

      toast.success('Login efetuado com sucesso!')
      localStorage.setItem('user_email', email)

      // Redirecionamento silencioso: admin vai para o painel, cliente vai para a loja
      if (data.user) {
        const role = await getUserRole(data.user.id)
        if (role === 'admin') {
          router.push('/admin')
        } else {
          router.push('/')
        }
      } else {
        router.push('/')
      }
    } catch {
      toast.error('Ocorreu um erro ao realizar o login.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (password !== confirmPassword) {
      toast.error('As senhas não coincidem.')
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres.')
      setIsLoading(false)
      return
    }
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { display_name: name, role: 'client' } }
      })

      if (error) {
        toast.error(error.message)
        setIsLoading(false)
        return
      }

      toast.success('Conta criada! Você já pode fazer login.')
      setActiveTab('login')
      setPassword('')
      setConfirmPassword('')
      setName('')
    } catch {
      toast.error('Erro ao cadastrar conta.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex flex-col bg-slate-50/50">
      <Header />
      <Toaster position="top-right" richColors />

      <div className="flex-grow flex items-center justify-center py-16 px-4">
        <div className="bg-white border border-pink-100/60 rounded-3xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">

          {/* Tabs */}
          <div className="flex border-b border-gray-100 bg-slate-50/50">
            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                activeTab === 'login'
                  ? 'bg-white text-gray-900 border-b-2 border-[#ff9edb]'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Entrar
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                activeTab === 'register'
                  ? 'bg-white text-gray-900 border-b-2 border-[#ff9edb]'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Cadastrar
            </button>
          </div>

          <div className="p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                {activeTab === 'login' ? 'Bem-vinda de Volta!' : 'Crie sua Conta'}
              </h2>
              <p className="text-gray-500 text-xs mt-1.5">
                {activeTab === 'login'
                  ? 'Acesse sua conta para acompanhar seus pedidos.'
                  : 'Cadastre-se e aproveite ofertas exclusivas e frete grátis.'}
              </p>
            </div>

            {/* Login Form */}
            {activeTab === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500">E-mail</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="seuemail@provedor.com"
                      className="pl-10 focus-visible:ring-[#ff9edb] border-gray-200"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Senha</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Sua senha"
                      className="pl-10 pr-10 focus-visible:ring-[#ff9edb] border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#ff9edb] hover:bg-[#ff80cb] text-white font-bold py-6 rounded-2xl shadow-sm uppercase tracking-wider text-xs transition-all hover:scale-[1.01]"
                >
                  {isLoading ? 'Entrando...' : 'Entrar na Conta'}
                </Button>
              </form>
            ) : (
              /* Register Form */
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Nome Completo</label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Maria Eduarda"
                      className="pl-10 focus-visible:ring-[#ff9edb] border-gray-200"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500">E-mail</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="seuemail@provedor.com"
                      className="pl-10 focus-visible:ring-[#ff9edb] border-gray-200"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Criar Senha</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Mínimo 6 caracteres"
                      className="pl-10 pr-10 focus-visible:ring-[#ff9edb] border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Confirmar Senha</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="Repita a senha"
                      className="pl-10 pr-10 focus-visible:ring-[#ff9edb] border-gray-200"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#ff9edb] hover:bg-[#ff80cb] text-white font-bold py-6 rounded-2xl shadow-sm uppercase tracking-wider text-xs transition-all hover:scale-[1.01]"
                >
                  {isLoading ? 'Registrando...' : 'Criar minha Conta'}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
