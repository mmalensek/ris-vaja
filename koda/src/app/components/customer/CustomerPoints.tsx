import { useEffect, useState } from "react";
import { storage } from "../../lib/storage";
import { Customer } from "../../lib/types";
import { CustomerLayout } from "./CustomerLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";

export function CustomerPoints() {
  const [customer, setCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    const currentUser = storage.getCurrentUser();
    if (currentUser) {
      const customerData = storage.getCustomerByEmail(currentUser);
      setCustomer(customerData);
    }
  }, []);

  if (!customer) return null;

  const earnedPoints = customer.pointsHistory
    .filter(p => p.type === 'earned')
    .reduce((sum, p) => sum + p.points, 0);

  const redeemedPoints = customer.pointsHistory
    .filter(p => p.type === 'redeemed')
    .reduce((sum, p) => sum + Math.abs(p.points), 0);

  return (
    <CustomerLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Točke zvestobe</h1>
          <p className="text-gray-600">Pregled vašega stanja in zgodovine točk</p>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Trenutno stanje</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-indigo-600">{customer.points}</div>
              <p className="text-xs text-gray-500 mt-1">točk na voljo</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                Pridobljene točke
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{earnedPoints}</div>
              <p className="text-xs text-gray-500 mt-1">skupaj pridobljenih</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-red-600" />
                Unovčene točke
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{redeemedPoints}</div>
              <p className="text-xs text-gray-500 mt-1">skupaj unovčenih</p>
            </CardContent>
          </Card>
        </div>

        {/* Points History */}
        <Card>
          <CardHeader>
            <CardTitle>Zgodovina točk</CardTitle>
            <CardDescription>Vse transakcije točk zvestobe</CardDescription>
          </CardHeader>
          <CardContent>
            {customer.pointsHistory.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Datum</TableHead>
                      <TableHead>Opis</TableHead>
                      <TableHead>Tip</TableHead>
                      <TableHead className="text-right">Točke</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customer.pointsHistory.map((point) => (
                      <TableRow key={point.id}>
                        <TableCell className="font-medium">
                          {new Date(point.date).toLocaleDateString('sl-SI')}
                        </TableCell>
                        <TableCell>{point.description}</TableCell>
                        <TableCell>
                          <Badge variant={point.type === 'earned' ? 'default' : 'secondary'}>
                            {point.type === 'earned' ? 'Pridobljene' : 'Unovčene'}
                          </Badge>
                        </TableCell>
                        <TableCell className={`text-right font-semibold ${
                          point.type === 'earned' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {point.type === 'earned' ? '+' : ''}{point.points}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">Ni zgodovine točk</p>
                <p className="text-sm text-gray-400 mt-2">
                  Točke se izračunavajo mesečno na podlagi vaših nakupov
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* How Points Work */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle>Kako delujejo točke?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="font-semibold text-gray-900">Pridobivanje točk:</p>
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 mt-1">
                <li>Točke se izračunajo enkrat mesečno za pretekli mesec</li>
                <li>Število točk je odvisno od zneska nakupov in vašega statusa</li>
                <li>Večji kot je znesek nakupov, več točk prejmete</li>
                <li>Višji status pomeni več točk za isti znesek</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-gray-900 mt-3">Unovčenje točk:</p>
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 mt-1">
                <li>Točke lahko unovčite kadarkoli v razdelku "Unovči točke"</li>
                <li>Na voljo so različne nagrade: popusti, boni, storitve</li>
                <li>Točke se odštejejo takoj ob unovčenju</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </CustomerLayout>
  );
}
