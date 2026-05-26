import { useEffect, useState } from "react";
import { storage } from "../../lib/storage";
import { Customer } from "../../lib/types";
import { AdminLayout } from "./AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Users, TrendingUp, Award, ShoppingCart } from "lucide-react";
import { Badge } from "../ui/badge";

export function AdminDashboard() {
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    setCustomers(storage.getCustomers());
  }, []);

  const totalCustomers = customers.length;
  const totalPoints = customers.reduce((sum, c) => sum + c.points, 0);
  const totalPurchases = customers.reduce((sum, c) => sum + c.totalPurchases, 0);

  const statusCounts = customers.reduce((acc, c) => {
    acc[c.status] = (acc[c.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const thisMonthPurchases = customers.reduce((sum, customer) => {
    const monthPurchases = customer.purchaseHistory
      .filter(p => new Date(p.date).getMonth() === new Date().getMonth())
      .reduce((s, p) => s + p.amount, 0);
    return sum + monthPurchases;
  }, 0);

  const recentCustomers = [...customers]
    .sort((a, b) => new Date(b.registrationDate).getTime() - new Date(a.registrationDate).getTime())
    .slice(0, 5);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Administracija</h1>
          <p className="text-gray-600">Pregled programa zvestobe Maestro</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Skupaj strank</CardTitle>
              <Users className="h-4 w-4 text-indigo-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCustomers}</div>
              <p className="text-xs text-gray-500 mt-1">
                Registriranih članov
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Skupaj točk</CardTitle>
              <Award className="h-4 w-4 text-indigo-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPoints}</div>
              <p className="text-xs text-gray-500 mt-1">
                Aktivnih točk v sistemu
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Nakupi ta mesec</CardTitle>
              <ShoppingCart className="h-4 w-4 text-indigo-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{thisMonthPurchases.toFixed(0)} EUR</div>
              <p className="text-xs text-gray-500 mt-1">
                Skupen znesek
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vsi nakupi</CardTitle>
              <TrendingUp className="h-4 w-4 text-indigo-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPurchases.toFixed(0)} EUR</div>
              <p className="text-xs text-gray-500 mt-1">
                Skupna vrednost
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Porazdelitev po statusih</CardTitle>
            <CardDescription>Število strank v vsakem statusu</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Osnovni</p>
                <p className="text-2xl font-bold text-blue-600">{statusCounts.basic || 0}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Srebrni</p>
                <p className="text-2xl font-bold text-gray-600">{statusCounts.silver || 0}</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Zlati</p>
                <p className="text-2xl font-bold text-yellow-600">{statusCounts.gold || 0}</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Bronasti</p>
                <p className="text-2xl font-bold text-orange-600">{statusCounts.bronze || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Customers */}
        <Card>
          <CardHeader>
            <CardTitle>Nedavne registracije</CardTitle>
            <CardDescription>Nazadnje registrirane stranke</CardDescription>
          </CardHeader>
          <CardContent>
            {recentCustomers.length > 0 ? (
              <div className="space-y-4">
                {recentCustomers.map((customer) => (
                  <div key={customer.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                    <div>
                      <p className="font-medium">{customer.name}</p>
                      <p className="text-sm text-gray-500">{customer.email}</p>
                    </div>
                    <div className="text-right">
                      <Badge className={
                        customer.status === 'gold' ? 'bg-yellow-500' :
                        customer.status === 'silver' ? 'bg-gray-400' :
                        customer.status === 'bronze' ? 'bg-orange-600' :
                        'bg-blue-500'
                      }>
                        {customer.status}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(customer.registrationDate).toLocaleDateString('sl-SI')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-4">Ni strank</p>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
