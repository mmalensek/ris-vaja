import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { storage } from "../../lib/storage";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Alert, AlertDescription } from "../ui/alert";
import { ShoppingBag, CheckCircle2 } from "lucide-react";

export function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Gesli se ne ujemata');
      return;
    }

    if (formData.password.length < 6) {
      setError('Geslo mora biti dolgo vsaj 6 znakov');
      return;
    }

    // Check if email already exists
    const existingCustomer = storage.getCustomerByEmail(formData.email);
    if (existingCustomer) {
      setError('Ta email naslov je že registriran');
      return;
    }

    // Simulate email verification step
    if (!verificationSent) {
      setVerificationSent(true);
      return;
    }

    // Create new customer
    const newCustomer = {
      id: Date.now().toString(),
      email: formData.email,
      name: formData.name,
      cardNumber: `MLS-${Math.random().toString(36).substr(2, 4).toUpperCase()}-${Math.random().toString(36).substr(2, 4)}`,
      status: 'basic' as const,
      points: 0,
      totalPurchases: 0,
      registrationDate: new Date().toISOString().split('T')[0],
      statusHistory: [{
        date: new Date().toISOString().split('T')[0],
        fromStatus: 'basic' as const,
        toStatus: 'basic' as const,
        reason: 'Začetna registracija'
      }],
      purchaseHistory: [],
      pointsHistory: []
    };

    storage.addCustomer(newCustomer);
    setSuccess(true);

    // Redirect after 3 seconds
    setTimeout(() => {
      navigate('/login');
    }, 3000);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Registracija uspešna!</CardTitle>
            <CardDescription>
              Vaša kartica zvestobe bo poslana na vaš naslov po pošti.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                <strong>Pomembno:</strong> Preverite svoj email naslov in kliknite na povezavo za potrditev.
                Šele po potrditvi boste lahko uporabljali svoj račun.
              </p>
            </div>
            <p className="text-center text-gray-600">
              Preusmerjanje na prijavo...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700">
            <ShoppingBag className="w-8 h-8" />
            <span className="text-2xl font-bold">Maestro Loyalty</span>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Registracija</CardTitle>
            <CardDescription>
              {verificationSent
                ? 'Potrdite svoj email naslov'
                : 'Ustvarite nov račun za program zvestobe'}
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {verificationSent ? (
                <Alert>
                  <AlertDescription>
                    Poslali smo verifikacijsko povezavo na <strong>{formData.email}</strong>.
                    Preverite svoj email (tudi spam mapo) in kliknite na povezavo za potrditev.
                    Po potrditvi kliknite spodnji gumb za dokončanje registracije.
                  </AlertDescription>
                </Alert>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="name">Ime in priimek</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                      placeholder="Janez Novak"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                      placeholder="janez.novak@example.com"
                    />
                    <p className="text-xs text-gray-500">
                      Na ta naslov bomo poslali verifikacijsko povezavo
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Geslo</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      required
                      placeholder="••••••••"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Potrdite geslo</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                      required
                      placeholder="••••••••"
                    />
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-900">
                    <p className="font-semibold mb-1">Po registraciji:</p>
                    <ul className="space-y-1 list-disc list-inside">
                      <li>Prejmete verifikacijsko povezavo na email</li>
                      <li>Kartica zvestobe bo poslana po pošti</li>
                      <li>Začnete zbirati točke z nakupi</li>
                    </ul>
                  </div>
                </>
              )}
            </CardContent>

            <CardFooter className="flex flex-col gap-3">
              <Button type="submit" className="w-full">
                {verificationSent ? 'Potrdi in zaključi registracijo' : 'Pošlji verifikacijski email'}
              </Button>
              <p className="text-sm text-center text-gray-600">
                Že imate račun?{' '}
                <Link to="/login" className="text-indigo-600 hover:underline">
                  Prijavite se
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
