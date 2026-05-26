import { useEffect, useState } from "react";
import { Link } from "react-router";
import { storage } from "../../lib/storage";
import { Customer } from "../../lib/types";
import { CustomerLayout } from "./CustomerLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { CreditCard, Gift, ShoppingCart, TrendingUp, Award } from "lucide-react";
import { Progress } from "../ui/progress";

export function CustomerDashboard() {
  const [customer, setCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    const currentUser = storage.getCurrentUser();
    if (currentUser) {
      const customerData = storage.getCustomerByEmail(currentUser);
      setCustomer(customerData);
    }
  }, []);

  if (!customer) return null;

  const recentPurchases = customer.purchaseHistory.slice(0, 3);
  const recentPoints = customer.pointsHistory.slice(0, 3);
  const thisMonthPurchases = customer.purchaseHistory
    .filter(p => new Date(p.date).getMonth() === new Date().getMonth())
    .reduce((sum, p) => sum + p.amount, 0);

  const getStatusProgress = () => {
    if (customer.status === 'gold') return { next: 'Gold (Max)', progress: 100, needed: 0 };
    if (customer.status === 'silver') return { next: 'Gold', progress: 66, needed: 500 };
    if (customer.status === 'bronze') return { next: 'Basic', progress: 33, needed: 200 };
    return { next: 'Silver', progress: 33, needed: 499 };
  };

  const statusInfo = getStatusProgress();

  return (
    <CustomerLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dobrodošli, {customer.name}!</h1>
          <p className="text-gray-600">Pregled vašega programa zvestobe</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Skupaj točk</CardTitle>
              <CreditCard className="h-4 w-4 text-indigo-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{customer.points}</div>
              <p className="text-xs text-gray-500 mt-1">
                Na voljo za unovčenje
              </p>
              <Button asChild size="sm" className="mt-3 w-full">
                <Link to="/customer/redeem">Unovči točke</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Nakupi ta mesec</CardTitle>
              <ShoppingCart className="h-4 w-4 text-indigo-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{thisMonthPurchases.toFixed(2)} EUR</div>
              <p className="text-xs text-gray-500 mt-1">
                {customer.purchaseHistory.filter(p => new Date(p.date).getMonth() === new Date().getMonth()).length} nakupov
              </p>
              <Button asChild variant="outline" size="sm" className="mt-3 w-full">
                <Link to="/customer/purchases">Pregled nakupov</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Status</CardTitle>
              <Award className="h-4 w-4 text-indigo-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize">{customer.status}</div>
              <div className="mt-2">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                  <span>Napredek do {statusInfo.next}</span>
                  <span>{statusInfo.progress}%</span>
                </div>
                <Progress value={statusInfo.progress} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Zadnji nakupi
              </CardTitle>
              <CardDescription>Vaši nedavni nakupi v trgovinah Maestro</CardDescription>
            </CardHeader>
            <CardContent>
              {recentPurchases.length > 0 ? (
                <div className="space-y-4">
                  {recentPurchases.map((purchase) => (
                    <div key={purchase.id} className="flex justify-between items-start border-b pb-3 last:border-0">
                      <div>
                        <p className="font-medium">{purchase.store}</p>
                        <p className="text-sm text-gray-500">{new Date(purchase.date).toLocaleDateString('sl-SI')}</p>
                      </div>
                      <p className="font-semibold">{purchase.amount.toFixed(2)} EUR</p>
                    </div>
                  ))}
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link to="/customer/purchases">Vsi nakupi</Link>
                  </Button>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">Ni nakupov</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Zgodovina točk
              </CardTitle>
              <CardDescription>Nedavne spremembe točk zvestobe</CardDescription>
            </CardHeader>
            <CardContent>
              {recentPoints.length > 0 ? (
                <div className="space-y-4">
                  {recentPoints.map((point) => (
                    <div key={point.id} className="flex justify-between items-start border-b pb-3 last:border-0">
                      <div>
                        <p className="font-medium">{point.description}</p>
                        <p className="text-sm text-gray-500">{new Date(point.date).toLocaleDateString('sl-SI')}</p>
                      </div>
                      <p className={`font-semibold ${point.type === 'earned' ? 'text-green-600' : 'text-red-600'}`}>
                        {point.type === 'earned' ? '+' : ''}{point.points}
                      </p>
                    </div>
                  ))}
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link to="/customer/points">Vsa zgodovina</Link>
                  </Button>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">Ni zgodovine točk</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Status Information */}
        <Card className="bg-gradient-to-br from-indigo-50 to-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="w-5 h-5" />
              Kako napredovati?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {customer.status === 'basic' && (
                <p className="text-gray-700">
                  Za pridobitev <strong>srebrnega</strong> statusa opravite nakup nad 499 EUR v enem mesecu.
                </p>
              )}
              {customer.status === 'silver' && (
                <>
                  <p className="text-gray-700">
                    Za pridobitev <strong>zlatega</strong> statusa opravite še 2 nakupa nad 500 EUR.
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Za ohranitev srebrnega statusa potrebujete vsaj 200 EUR nakupov mesečno.
                  </p>
                </>
              )}
              {customer.status === 'gold' && (
                <p className="text-gray-700">
                  Čestitke! Dosegliimate najvišji status. Za ohranitev potrebujete vsaj 500 EUR nakupov mesečno.
                </p>
              )}
              {customer.status === 'bronze' && (
                <p className="text-gray-700">
                  Za vrnitev v osnovni status opravite nakup pod 50 EUR ali za srebrni status 2 zaporedna meseca
                  nakupujte za vsaj 200 EUR.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </CustomerLayout>
  );
}
