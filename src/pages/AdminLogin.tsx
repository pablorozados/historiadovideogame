
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, LogIn } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user, signIn, signUp } = useAuth();
  const { toast } = useToast();

  if (user) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = isSignUp 
        ? await signUp(email, password)
        : await signIn(email, password);

      if (error) {
        toast({
          title: "Erro",
          description: error.message,
          variant: "destructive",
        });
      } else if (isSignUp) {
        toast({
          title: "Sucesso",
          description: "Conta criada! Verifique seu email para confirmar.",
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro inesperado. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-retro-black flex items-center justify-center p-4">
      <Card className="retro-card w-full max-w-md">
        <CardHeader>
          <CardTitle className="font-retro text-2xl text-retro-yellow text-center">
            {isSignUp ? 'CRIAR CONTA ADMIN' : 'LOGIN ADMIN'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="font-mono text-gray-300">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-black border-retro-blue text-white"
                placeholder="admin@podcast.com"
                required
              />
            </div>
            <div>
              <Label htmlFor="password" className="font-mono text-gray-300">
                Senha
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-black border-retro-blue text-white"
                placeholder="••••••••"
                required
              />
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                onClick={() => window.location.href = '/'}
                variant="outline"
                className="flex-1 border-gray-600 text-gray-300"
              >
                <ArrowLeft size={16} className="mr-2" />
                Voltar
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="retro-button flex-1 font-mono"
              >
                <LogIn size={16} className="mr-2" />
                {isLoading ? 'Aguarde...' : (isSignUp ? 'Criar' : 'Entrar')}
              </Button>
            </div>
            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-retro-blue hover:text-retro-yellow font-mono text-sm"
              >
                {isSignUp ? 'Já tem conta? Fazer login' : 'Primeira vez? Criar conta'}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
