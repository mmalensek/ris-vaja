import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { storage } from "../../lib/storage";
import { demoCredentials } from "../../lib/mockData";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Alert, AlertDescription } from "../ui/alert";
import { ShoppingBag } from "lucide-react";

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Check admin credentials
    if (email === demoCredentials.admin.email && password === demoCredentials.admin.password) {
      storage.setCurrentUser(email, true);
      navigate('/admin');
      return;
    }

    // Check customer credentials
    if (email === demoCredentials.customer.email && password === demoCredentials.customer.password) {
      const customer = storage.getCustomerByEmail(email);
      if (customer) {
        storage.setCurrentUser(email, false);
        navigate('/customer');
        return;
      }
    }

    setError('Napačen email ali geslo');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700">
            <ShoppingBag className="w-8 h-8" />
            <span className="text-2xl font-bold">Maestro Loyalty</span>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Prijava</CardTitle>
            <CardDescription>Prijavite se v svoj račun</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="vasa@email.si"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Geslo</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
                <p className="font-semibold text-blue-900 mb-1">Demo dostop:</p>
                <p className="text-blue-700">Stranka: demo@example.com / demo123</p>
                <p className="text-blue-700">Admin: admin@maestro.si / admin123</p>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-3">
              <Button type="submit" className="w-full">
                Prijava
              </Button>
              <p className="text-sm text-center text-gray-600">
                Še nimate računa?{' '}
                <Link to="/register" className="text-indigo-600 hover:underline">
                  Registrirajte se
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
