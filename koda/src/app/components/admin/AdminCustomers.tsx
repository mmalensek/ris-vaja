import { useEffect, useState } from "react";
import { storage } from "../../lib/storage";
import { Customer, CustomerStatus } from "../../lib/types";
import { AdminLayout } from "./AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Search, Filter, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";

export function AdminCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    const allCustomers = storage.getCustomers();
    setCustomers(allCustomers);
    setFilteredCustomers(allCustomers);
  }, []);

  useEffect(() => {
    let filtered = customers;

    if (searchTerm) {
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.cardNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(c => c.status === statusFilter);
    }

    setFilteredCustomers(filtered);
  }, [searchTerm, statusFilter, customers]);

  const getStatusBadge = (status: CustomerStatus) => {
    const colors = {
      gold: 'bg-yellow-500',
      silver: 'bg-gray-400',
      bronze: 'bg-orange-600',
      basic: 'bg-blue-500'
    };
    return <Badge className={`${colors[status]} text-white`}>{status}</Badge>;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Upravljanje strank</h1>
          <p className="text-gray-600">Pregled in upravljanje vseh registriranih strank</p>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filtri
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Iskanje po imenu, emailu ali številki kartice..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtriraj po statusu" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Vsi statusi</SelectItem>
                  <SelectItem value="basic">Osnovni</SelectItem>
                  <SelectItem value="silver">Srebrni</SelectItem>
                  <SelectItem value="gold">Zlati</SelectItem>
                  <SelectItem value="bronze">Bronasti</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Customers Table */}
        <Card>
          <CardHeader>
            <CardTitle>Stranke ({filteredCustomers.length})</CardTitle>
            <CardDescription>Seznam vseh strank v programu zvestobe</CardDescription>
          </CardHeader>
          <CardContent>
            {filteredCustomers.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ime</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Kartica</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Točke</TableHead>
                      <TableHead className="text-right">Nakupi</TableHead>
                      <TableHead className="text-right">Akcije</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCustomers.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell className="font-medium">{customer.name}</TableCell>
                        <TableCell>{customer.email}</TableCell>
                        <TableCell className="font-mono text-sm">{customer.cardNumber}</TableCell>
                        <TableCell>{getStatusBadge(customer.status)}</TableCell>
                        <TableCell className="text-right font-semibold">{customer.points}</TableCell>
                        <TableCell className="text-right">{customer.totalPurchases.toFixed(2)} EUR</TableCell>
                        <TableCell className="text-right">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedCustomer(customer)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Podrobnosti stranke</DialogTitle>
                                <DialogDescription>
                                  Celoten pregled podatkov stranke
                                </DialogDescription>
                              </DialogHeader>
                              {selectedCustomer && (
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <p className="text-sm text-gray-500">Ime</p>
                                      <p className="font-semibold">{selectedCustomer.name}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-gray-500">Email</p>
                                      <p className="font-semibold">{selectedCustomer.email}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-gray-500">Številka kartice</p>
                                      <p className="font-mono">{selectedCustomer.cardNumber}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-gray-500">Status</p>
                                      {getStatusBadge(selectedCustomer.status)}
                                    </div>
                                    <div>
                                      <p className="text-sm text-gray-500">Točke</p>
                                      <p className="font-semibold text-indigo-600">{selectedCustomer.points}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-gray-500">Skupaj nakupov</p>
                                      <p className="font-semibold">{selectedCustomer.totalPurchases.toFixed(2)} EUR</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-gray-500">Datum registracije</p>
                                      <p>{new Date(selectedCustomer.registrationDate).toLocaleDateString('sl-SI')}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-gray-500">Število nakupov</p>
                                      <p>{selectedCustomer.purchaseHistory.length}</p>
                                    </div>
                                  </div>

                                  <div>
                                    <h4 className="font-semibold mb-2">Zgodovina statusov</h4>
                                    <div className="space-y-2">
                                      {selectedCustomer.statusHistory.map((status, idx) => (
                                        <div key={idx} className="text-sm bg-gray-50 p-2 rounded">
                                          <p><strong>{new Date(status.date).toLocaleDateString('sl-SI')}:</strong> {status.fromStatus} → {status.toStatus}</p>
                                          <p className="text-gray-600">{status.reason}</p>
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  <div>
                                    <h4 className="font-semibold mb-2">Nedavni nakupi</h4>
                                    <div className="space-y-2 max-h-48 overflow-y-auto">
                                      {selectedCustomer.purchaseHistory.slice(0, 10).map((purchase) => (
                                        <div key={purchase.id} className="flex justify-between text-sm bg-gray-50 p-2 rounded">
                                          <span>{new Date(purchase.date).toLocaleDateString('sl-SI')} - {purchase.store}</span>
                                          <span className="font-semibold">{purchase.amount.toFixed(2)} EUR</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">Ni strank, ki bi ustrezale filtrom</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
