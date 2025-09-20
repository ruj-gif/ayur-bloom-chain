import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Leaf, Truck, ShoppingCart, Eye, EyeOff } from 'lucide-react';

const LoginForm: React.FC = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(credentials.email, credentials.password);
    
    if (success) {
      toast({
        title: "Login Successful",
        description: "Welcome to Ayur-Veritas!",
        variant: "default"
      });
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid credentials. Try: farmer@ayur.com, distributor@ayur.com, or consumer@ayur.com with password 'demo123'",
        variant: "destructive"
      });
    }
  };

  const quickLogin = (email: string) => {
    setCredentials({ email, password: 'demo123' });
  };

  return (
    <div className="min-h-screen gradient-primary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <Leaf className="h-10 w-10 text-white animate-float" />
            <h1 className="text-4xl font-bold text-white">Ayur-Veritas</h1>
          </div>
          <p className="text-white/80 text-lg">Blockchain-Powered Herbal Traceability</p>
        </div>

        <Card className="shadow-2xl">
          <CardHeader>
            <CardTitle>Welcome Back</CardTitle>
            <CardDescription>Sign in to your account to continue</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={credentials.email}
                  onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={credentials.password}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
                variant="farmer"
                size="lg"
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Quick Demo Access</span>
              </div>
            </div>

            <Tabs defaultValue="farmer" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="farmer" className="text-xs">Farmer</TabsTrigger>
                <TabsTrigger value="distributor" className="text-xs">Distributor</TabsTrigger>
                <TabsTrigger value="consumer" className="text-xs">Consumer</TabsTrigger>
              </TabsList>
              
              <TabsContent value="farmer" className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => quickLogin('farmer@ayur.com')}
                >
                  <Leaf className="h-4 w-4 mr-2" />
                  Login as Farmer
                </Button>
              </TabsContent>
              
              <TabsContent value="distributor" className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => quickLogin('distributor@ayur.com')}
                >
                  <Truck className="h-4 w-4 mr-2" />
                  Login as Distributor
                </Button>
              </TabsContent>
              
              <TabsContent value="consumer" className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => quickLogin('consumer@ayur.com')}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Login as Consumer
                </Button>
              </TabsContent>
            </Tabs>

            <p className="text-xs text-muted-foreground text-center">
              Demo credentials: Use any demo account with password "demo123"
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginForm;