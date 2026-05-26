import { useEffect, useState } from "react";
import { storage } from "../../lib/storage";
import { Customer, Reward } from "../../lib/types";
import { CustomerLayout } from "./CustomerLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Gift, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "../ui/alert";

export function CustomerRedeem() {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [redeeming, setRedeeming] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const currentUser = storage.getCurrentUser();
    if (currentUser) {
      const customerData = storage.getCustomerByEmail(currentUser);
      setCustomer(customerData);
    }
    setRewards(storage.getRewards().filter(r => r.available));
  }, []);

  const handleRedeem = (reward: Reward) => {
    if (!customer || customer.points < reward.pointsCost) return;

    setRedeeming(reward.id);

    // Simulate processing
    setTimeout(() => {
      const updatedCustomer = {
        ...customer,
        points: customer.points - reward.pointsCost,
        pointsHistory: [
          {
            id: Date.now().toString(),
            date: new Date().toISOString().split('T')[0],
            type: 'redeemed' as const,
            points: -reward.pointsCost,
            description: `Unovčeno: ${reward.name}`
          },
          ...customer.pointsHistory
        ]
      };

      storage.updateCustomer(updatedCustomer);
      setCustomer(updatedCustomer);
      setRedeeming(null);
      setSuccess(reward.name);

      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(null), 5000);
    }, 1000);
  };

  if (!customer) return null;

  const groupedRewards = rewards.reduce((acc, reward) => {
    if (!acc[reward.category]) {
      acc[reward.category] = [];
    }
    acc[reward.category].push(reward);
    return acc;
  }, {} as Record<string, Reward[]>);

  return (
    <CustomerLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Unovči točke</h1>
            <p className="text-gray-600">Izberite nagrado in unovčite svoje točke</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Na voljo točk:</p>
            <p className="text-3xl font-bold text-indigo-600">{customer.points}</p>
          </div>
        </div>

        {success && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-900">
              Uspešno ste unovčili: <strong>{success}</strong>. Preverite svoj email za nadaljnja navodila.
            </AlertDescription>
          </Alert>
        )}

        {Object.entries(groupedRewards).map(([category, categoryRewards]) => (
          <div key={category}>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">{category}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryRewards.map((reward) => {
                const canAfford = customer.points >= reward.pointsCost;
                const isRedeeming = redeeming === reward.id;

                return (
                  <Card key={reward.id} className={!canAfford ? 'opacity-60' : ''}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <Gift className="w-8 h-8 text-indigo-600" />
                        <Badge variant={canAfford ? 'default' : 'secondary'}>
                          {reward.pointsCost} točk
                        </Badge>
                      </div>
                      <CardTitle className="mt-4">{reward.name}</CardTitle>
                      <CardDescription>{reward.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button
                        className="w-full"
                        disabled={!canAfford || isRedeeming}
                        onClick={() => handleRedeem(reward)}
                      >
                        {isRedeeming ? 'Procesiranje...' : canAfford ? 'Unovči' : 'Premalo točk'}
                      </Button>
                      {!canAfford && (
                        <p className="text-xs text-red-600 text-center mt-2">
                          Potrebujete še {reward.pointsCost - customer.points} točk
                        </p>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}

        {rewards.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Gift className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Trenutno ni na voljo nobenih nagrad</p>
            </CardContent>
          </Card>
        )}

        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle>Kako unovčiti točke?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-gray-700">
              1. Izberite nagrado, ki vas zanima
            </p>
            <p className="text-sm text-gray-700">
              2. Kliknite na gumb "Unovči" (če imate dovolj točk)
            </p>
            <p className="text-sm text-gray-700">
              3. Točke bodo takoj odštete z vašega računa
            </p>
            <p className="text-sm text-gray-700">
              4. Prejeli boste email z navodili za pridobitev nagrade
            </p>
            <p className="text-sm text-gray-700 mt-4 font-semibold">
              Unovčene točke se ne morejo vrniti. Poskrbite, da izberete pravo nagrado!
            </p>
          </CardContent>
        </Card>
      </div>
    </CustomerLayout>
  );
}
