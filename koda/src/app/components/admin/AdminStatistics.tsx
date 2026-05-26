import { useEffect, useState } from "react";
import { storage } from "../../lib/storage";
import { Customer } from "../../lib/types";
import { AdminLayout } from "./AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { TrendingUp, Users, Award, ShoppingCart } from "lucide-react";

export function AdminStatistics() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [periodFilter, setPeriodFilter] = useState<string>('all');

  useEffect(() => {
    setCustomers(storage.getCustomers());
  }, []);

  // Status distribution data
  const statusData = [
    { name: 'Osnovni', value: customers.filter(c => c.status === 'basic').length, color: '#3b82f6' },
    { name: 'Srebrni', value: customers.filter(c => c.status === 'silver').length, color: '#9ca3af' },
    { name: 'Zlati', value: customers.filter(c => c.status === 'gold').length, color: '#eab308' },
    { name: 'Bronasti', value: customers.filter(c => c.status === 'bronze').length, color: '#ea580c' },
  ];

  // Monthly purchases
  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - i));
    const month = date.toLocaleDateString('sl-SI', { month: 'short' });

    const monthPurchases = customers.reduce((sum, customer) => {
      return sum + customer.purchaseHistory
        .filter(p => {
          const pDate = new Date(p.date);
          return pDate.getMonth() === date.getMonth() && pDate.getFullYear() === date.getFullYear();
        })
        .reduce((s, p) => s + p.amount, 0);
    }, 0);

    return { month, amount: monthPurchases };
  });

  // Points distribution
  const pointsDistribution = [
    { range: '0-50', count: customers.filter(c => c.points < 50).length },
    { range: '50-100', count: customers.filter(c => c.points >= 50 && c.points < 100).length },
    { range: '100-200', count: customers.filter(c => c.points >= 100 && c.points < 200).length },
    { range: '200-500', count: customers.filter(c => c.points >= 200 && c.points < 500).length },
    { range: '500+', count: customers.filter(c => c.points >= 500).length },
  ];

  // Top customers by points
  const topCustomers = [...customers]
    .sort((a, b) => b.points - a.points)
    .slice(0, 10);

  // Aggregate statistics
  const totalPoints = customers.reduce((sum, c) => sum + c.points, 0);
  const avgPoints = customers.length > 0 ? totalPoints / customers.length : 0;
  const totalPurchases = customers.reduce((sum, c) => sum + c.totalPurchases, 0);
  const avgPurchaseValue = customers.length > 0 ? totalPurchases / customers.length : 0;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Statistika</h1>
            <p className="text-gray-600">Analiza programa zvestobe in aktivnosti strank</p>
          </div>
          <div className="w-48">
            <Select value={periodFilter} onValueChange={setPeriodFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Obdobje" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Vse obdobje</SelectItem>
                <SelectItem value="month">Ta mesec</SelectItem>
                <SelectItem value="quarter">Ta kvartal</SelectItem>
                <SelectItem value="year">To leto</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Skupaj strank</CardTitle>
              <Users className="h-4 w-4 text-indigo-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{customers.length}</div>
              <p className="text-xs text-gray-500 mt-1">Aktivnih članov</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Povprečne točke</CardTitle>
              <Award className="h-4 w-4 text-indigo-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgPoints.toFixed(1)}</div>
              <p className="text-xs text-gray-500 mt-1">Na stranko</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Skupaj točk</CardTitle>
              <TrendingUp className="h-4 w-4 text-indigo-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPoints}</div>
              <p className="text-xs text-gray-500 mt-1">V obtoku</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Povprečen nakup</CardTitle>
              <ShoppingCart className="h-4 w-4 text-indigo-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgPurchaseValue.toFixed(0)} EUR</div>
              <p className="text-xs text-gray-500 mt-1">Na stranko</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Status Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Porazdelitev po statusih</CardTitle>
              <CardDescription>Delež strank v posameznem statusu</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Points Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Porazdelitev točk</CardTitle>
              <CardDescription>Število strank po razponih točk</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={pointsDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="range" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#6366f1" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Purchases Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Trend nakupov</CardTitle>
            <CardDescription>Mesečna vrednost nakupov v zadnjih 6 mesecih</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `${Number(value).toFixed(2)} EUR`} />
                <Legend />
                <Line type="monotone" dataKey="amount" stroke="#6366f1" strokeWidth={2} name="Znesek (EUR)" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Customers */}
        <Card>
          <CardHeader>
            <CardTitle>Top 10 strank po točkah</CardTitle>
            <CardDescription>Stranke z največ aktivnimi točkami</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topCustomers.map((customer, index) => (
                <div key={customer.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      index === 0 ? 'bg-yellow-100 text-yellow-600' :
                      index === 1 ? 'bg-gray-100 text-gray-600' :
                      index === 2 ? 'bg-orange-100 text-orange-600' :
                      'bg-blue-50 text-blue-600'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{customer.name}</p>
                      <p className="text-sm text-gray-500">{customer.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-indigo-600">{customer.points} točk</p>
                    <p className="text-xs text-gray-500 capitalize">{customer.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
