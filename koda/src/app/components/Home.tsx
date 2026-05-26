import { Link } from "react-router";
import { ShoppingBag, CreditCard, Gift } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

export function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <ShoppingBag className="w-16 h-16 text-indigo-600" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Maestro Loyalty</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Program zvestobe za naše cenjene stranke. Zbirajte točke, uživajte v nagradah.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Za stranke
              </CardTitle>
              <CardDescription>
                Prijavite se in začnite zbirati točke zvestobe
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600">•</span>
                  <span>Pregledujte svoje točke zvestobe</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600">•</span>
                  <span>Unovčite točke za nagrade</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600">•</span>
                  <span>Sledite zgodovini nakupov</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600">•</span>
                  <span>Napredujte skozi statusne nivoje</span>
                </li>
              </ul>
              <div className="flex gap-2">
                <Button asChild className="flex-1">
                  <Link to="/login">Prijava</Link>
                </Button>
                <Button asChild variant="outline" className="flex-1">
                  <Link to="/register">Registracija</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="w-5 h-5" />
                Administracija
              </CardTitle>
              <CardDescription>
                Upravljajte program zvestobe in stranke
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600">•</span>
                  <span>Pregled statistik in analiz</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600">•</span>
                  <span>Upravljanje s strankami</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600">•</span>
                  <span>Nastavitve nagrad</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600">•</span>
                  <span>Konfiguracija pravil programa</span>
                </li>
              </ul>
              <Button asChild className="w-full" variant="secondary">
                <Link to="/login">Admin prijava</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Kako deluje program?</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-indigo-600 font-bold">1</span>
              </div>
              <h3 className="font-semibold mb-2">Registracija</h3>
              <p className="text-sm text-gray-600">Registrirajte se online in prejmite kartico</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-indigo-600 font-bold">2</span>
              </div>
              <h3 className="font-semibold mb-2">Nakupujte</h3>
              <p className="text-sm text-gray-600">Opravljajte nakupe v trgovinah Maestro</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-indigo-600 font-bold">3</span>
              </div>
              <h3 className="font-semibold mb-2">Zbirajte točke</h3>
              <p className="text-sm text-gray-600">Prejmite točke vsak mesec glede na nakupe</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-indigo-600 font-bold">4</span>
              </div>
              <h3 className="font-semibold mb-2">Uživajte</h3>
              <p className="text-sm text-gray-600">Unovčite točke za nagrade in popuste</p>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            Demo pristop: Stranka (demo@example.com / demo123) | Admin (admin@maestro.si / admin123)
          </p>
        </div>
      </div>
    </div>
  );
}
