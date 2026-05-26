import { useEffect, useState } from "react";
import { storage } from "../../lib/storage";
import { Customer } from "../../lib/types";
import { CustomerLayout } from "./CustomerLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { ShoppingCart, TrendingUp, Calendar } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

export function CustomerPurchases() {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [filterMonth, setFilterMonth] = useState<string>('all');

  useEffect(() => {
    const currentUser = storage.getCurrentUser();
    if (currentUser) {
      const customerData = storage.getCustomerByEmail(currentUser);
      setCustomer(customerData);
    }
  }, []);

  if (!customer) return null;

  const filteredPurchases = filterMonth === 'all'
    ? customer.purchaseHistory
    : customer.purchaseHistory.filter(p => {
        const purchaseDate = new Date(p.date);
        const [year, month] = filterMonth.split('-');
        return purchaseDate.getFullYear() === parseInt(year) &&
               purchaseDate.getMonth() === parseInt(month);
      });

  const totalAmount = filteredPurchases.reduce((sum, p) => sum + p.amount, 0);
  const avgPurchase = filteredPurchases.length > 0 ? totalAmount / filteredPurchases.length : 0;

  // Get unique months from purchase history
  const availableMonths = Array.from(
    new Set(
      customer.purchaseHistory.map(p => {
        const date = new Date(p.date);
        return `${date.getFullYear()}-${date.getMonth()}`;
      })
    )
  ).sort().reverse();

  const getMonthLabel = (monthKey: string) => {
    const [year, month] = monthKey.split('-');
    const date = new Date(parseInt(year), parseInt(month));
    return date.toLocaleDateString('sl-SI', { year: 'numeric', month: 'long' });
  };

  return (
    <CustomerLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Zgodovina nakupov</h1>
            <p className="text-gray-600">Pregled vseh vaših nakupov v trgovski verigi Maestro</p>
          </div>
          <div className="w-48">
            <Select value={filterMonth} onValueChange={setFilterMonth}>
              <SelectTrigger>
                <SelectValue placeholder="Filtriraj po mesecu" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Vsi nakupi</SelectItem>
                {availableMonths.map(month => (
                  <SelectItem key={month} value={month}>
                    {getMonthLabel(month)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Skupaj nakupov</CardTitle>
              <ShoppingCart className="h-4 w-4 text-indigo-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredPurchases.length}</div>
              <p className="text-xs text-gray-500 mt-1">
                {filterMonth === 'all' ? 'Vsi časi' : 'V izbranem obdobju'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Skupen znesek</CardTitle>
              <TrendingUp className="h-4 w-4 text-indigo-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalAmount.toFixed(2)} EUR</div>
              <p className="text-xs text-gray-500 mt-1">
                {filterMonth === 'all' ? 'Skupna vrednost' : 'V izbranem obdobju'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Povprečen nakup</CardTitle>
              <Calendar className="h-4 w-4 text-indigo-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgPurchase.toFixed(2)} EUR</div>
              <p className="text-xs text-gray-500 mt-1">
                Povprečna vrednost nakupa
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Purchases Table */}
        <Card>
          <CardHeader>
            <CardTitle>Vsi nakupi</CardTitle>
            <CardDescription>
              {filterMonth === 'all'
                ? 'Celotna zgodovina nakupov'
                : `Nakupi v ${getMonthLabel(filterMonth)}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredPurchases.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Datum</TableHead>
                      <TableHead>Trgovina</TableHead>
                      <TableHead className="text-right">Znesek</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPurchases.map((purchase) => (
                      <TableRow key={purchase.id}>
                        <TableCell className="font-medium">
                          {new Date(purchase.date).toLocaleDateString('sl-SI', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </TableCell>
                        <TableCell>{purchase.store}</TableCell>
                        <TableCell className="text-right font-semibold">
                          {purchase.amount.toFixed(2)} EUR
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12">
                <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Ni nakupov v izbranem obdobju</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle>O nakupih in točkah</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-gray-700">
              • Vsi nakupi z vašo kartico zvestobe so avtomatsko zabeleženi
            </p>
            <p className="text-sm text-gray-700">
              • Točke se izračunajo enkrat mesečno na podlagi skupnega zneska nakupov
            </p>
            <p className="text-sm text-gray-700">
              • Višji kot je znesek nakupov, več točk prejmete
            </p>
            <p className="text-sm text-gray-700">
              • Vaš status vpliva na množitelj točk - višji status = več točk
            </p>
          </CardContent>
        </Card>
      </div>
    </CustomerLayout>
  );
}
