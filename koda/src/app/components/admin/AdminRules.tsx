import { useEffect, useState } from "react";
import { storage } from "../../lib/storage";
import { PointsRule, StatusRule } from "../../lib/types";
import { AdminLayout } from "./AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Settings, Save } from "lucide-react";
import { Alert, AlertDescription } from "../ui/alert";

export function AdminRules() {
  const [pointsRules, setPointsRules] = useState<PointsRule[]>([]);
  const [statusRules, setStatusRules] = useState<StatusRule | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    setPointsRules(storage.getPointsRules());
    setStatusRules(storage.getStatusRules());
  }, []);

  const handleSavePointsRules = () => {
    storage.updatePointsRules(pointsRules);
    setSuccess('Pravila za točke uspešno posodobljena');
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleSaveStatusRules = () => {
    if (statusRules) {
      storage.updateStatusRules(statusRules);
      setSuccess('Pravila za statuse uspešno posodobljena');
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  const updatePointsRule = (index: number, field: string, status: string, value: number) => {
    const updated = [...pointsRules];
    if (field === 'min') {
      updated[index].purchaseRange.min = value;
    } else if (field === 'max') {
      updated[index].purchaseRange.max = value === -1 ? null : value;
    } else {
      const points = updated[index].points;
      const statusKey = status as keyof typeof points;
      points[statusKey] = value;
    }
    setPointsRules(updated);
  };

  const updateStatusRule = (path: string[], value: number) => {
    if (!statusRules) return;

    const updated = JSON.parse(JSON.stringify(statusRules));
    let current = updated;

    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]];
    }
    current[path[path.length - 1]] = value;

    setStatusRules(updated);
  };

  if (!statusRules) return null;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Konfiguracija pravil</h1>
          <p className="text-gray-600">Upravljanje pravil za dodeljevanje točk in prehajanje med statusi</p>
        </div>

        {success && (
          <Alert className="bg-green-50 border-green-200">
            <AlertDescription className="text-green-900">{success}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="points" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="points">Pravila za točke</TabsTrigger>
            <TabsTrigger value="status">Pravila za statuse</TabsTrigger>
          </TabsList>

          {/* Points Rules */}
          <TabsContent value="points" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Dodeljevanje točk po nakupih
                </CardTitle>
                <CardDescription>
                  Nastavite število točk glede na znesek nakupov in status stranke
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {pointsRules.map((rule, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label>Minimalni znesek nakupa (EUR)</Label>
                        <Input
                          type="number"
                          value={rule.purchaseRange.min}
                          onChange={(e) => updatePointsRule(index, 'min', '', parseFloat(e.target.value))}
                          min="0"
                        />
                      </div>
                      <div>
                        <Label>Maksimalni znesek nakupa (EUR, -1 za neomejeno)</Label>
                        <Input
                          type="number"
                          value={rule.purchaseRange.max ?? -1}
                          onChange={(e) => updatePointsRule(index, 'max', '', parseFloat(e.target.value))}
                          min="-1"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <Label>Osnovni (točke)</Label>
                        <Input
                          type="number"
                          value={rule.points.basic}
                          onChange={(e) => updatePointsRule(index, 'points', 'basic', parseFloat(e.target.value))}
                          min="0"
                          step="0.5"
                        />
                      </div>
                      <div>
                        <Label>Srebrni (točke)</Label>
                        <Input
                          type="number"
                          value={rule.points.silver}
                          onChange={(e) => updatePointsRule(index, 'points', 'silver', parseFloat(e.target.value))}
                          min="0"
                          step="0.5"
                        />
                      </div>
                      <div>
                        <Label>Zlati (točke)</Label>
                        <Input
                          type="number"
                          value={rule.points.gold}
                          onChange={(e) => updatePointsRule(index, 'points', 'gold', parseFloat(e.target.value))}
                          min="0"
                          step="0.5"
                        />
                      </div>
                      <div>
                        <Label>Bronasti (točke)</Label>
                        <Input
                          type="number"
                          value={rule.points.bronze}
                          onChange={(e) => updatePointsRule(index, 'points', 'bronze', parseFloat(e.target.value))}
                          min="0"
                          step="0.5"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <Button onClick={handleSavePointsRules} className="w-full">
                  <Save className="w-4 h-4 mr-2" />
                  Shrani pravila za točke
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle>Kako delujejo pravila za točke?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-gray-700">
                <p>• Točke se dodelijo mesečno glede na skupni znesek nakupov stranke v preteklem mesecu</p>
                <p>• Sistem preveri v kateri razpon nakupov spada znesek</p>
                <p>• Glede na status stranke se dodeli ustrezno število točk</p>
                <p>• Višji status = več točk za isti znesek nakupa</p>
                <p>• Spremembe pravil veljajo od naslednjega mesečnega izračuna dalje</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Status Rules */}
          <TabsContent value="status" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Prehajanje med statusi
                </CardTitle>
                <CardDescription>
                  Nastavite pogoje za napredovanje in ohranjanje statusov
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Transition to Silver */}
                <div className="border rounded-lg p-4 space-y-3">
                  <h4 className="font-semibold text-gray-900">Prehod v srebrni status</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>Minimalni nakup (EUR)</Label>
                      <Input
                        type="number"
                        value={statusRules.statusTransitions.toSilver.minPurchase}
                        onChange={(e) => updateStatusRule(['statusTransitions', 'toSilver', 'minPurchase'], parseFloat(e.target.value))}
                        min="0"
                      />
                    </div>
                    <div>
                      <Label>Število zahtevanih nakupov</Label>
                      <Input
                        type="number"
                        value={statusRules.statusTransitions.toSilver.timesRequired}
                        onChange={(e) => updateStatusRule(['statusTransitions', 'toSilver', 'timesRequired'], parseInt(e.target.value))}
                        min="1"
                      />
                    </div>
                  </div>
                </div>

                {/* Transition to Gold */}
                <div className="border rounded-lg p-4 space-y-3">
                  <h4 className="font-semibold text-gray-900">Prehod v zlati status</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>Minimalni nakup (EUR)</Label>
                      <Input
                        type="number"
                        value={statusRules.statusTransitions.toGold.minPurchase}
                        onChange={(e) => updateStatusRule(['statusTransitions', 'toGold', 'minPurchase'], parseFloat(e.target.value))}
                        min="0"
                      />
                    </div>
                    <div>
                      <Label>Število zahtevanih nakupov</Label>
                      <Input
                        type="number"
                        value={statusRules.statusTransitions.toGold.timesRequired}
                        onChange={(e) => updateStatusRule(['statusTransitions', 'toGold', 'timesRequired'], parseInt(e.target.value))}
                        min="1"
                      />
                    </div>
                  </div>
                </div>

                {/* Maintain Silver */}
                <div className="border rounded-lg p-4 space-y-3">
                  <h4 className="font-semibold text-gray-900">Ohranjanje srebrnega statusa</h4>
                  <div>
                    <Label>Minimalni mesečni nakup (EUR)</Label>
                    <Input
                      type="number"
                      value={statusRules.statusTransitions.maintainSilver.minMonthlyPurchase}
                      onChange={(e) => updateStatusRule(['statusTransitions', 'maintainSilver', 'minMonthlyPurchase'], parseFloat(e.target.value))}
                      min="0"
                    />
                  </div>
                </div>

                {/* Maintain Gold */}
                <div className="border rounded-lg p-4 space-y-3">
                  <h4 className="font-semibold text-gray-900">Ohranjanje zlatega statusa</h4>
                  <div>
                    <Label>Minimalni mesečni nakup (EUR)</Label>
                    <Input
                      type="number"
                      value={statusRules.statusTransitions.maintainGold.minMonthlyPurchase}
                      onChange={(e) => updateStatusRule(['statusTransitions', 'maintainGold', 'minMonthlyPurchase'], parseFloat(e.target.value))}
                      min="0"
                    />
                  </div>
                </div>

                {/* Transition to Bronze */}
                <div className="border rounded-lg p-4 space-y-3">
                  <h4 className="font-semibold text-gray-900">Prehod v bronasti status</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>Maksimalni mesečni nakup (EUR)</Label>
                      <Input
                        type="number"
                        value={statusRules.statusTransitions.toBronze.maxMonthlyPurchase}
                        onChange={(e) => updateStatusRule(['statusTransitions', 'toBronze', 'maxMonthlyPurchase'], parseFloat(e.target.value))}
                        min="0"
                      />
                    </div>
                    <div>
                      <Label>Število zaporednih mesecev</Label>
                      <Input
                        type="number"
                        value={statusRules.statusTransitions.toBronze.consecutiveMonths}
                        onChange={(e) => updateStatusRule(['statusTransitions', 'toBronze', 'consecutiveMonths'], parseInt(e.target.value))}
                        min="1"
                      />
                    </div>
                  </div>
                </div>

                {/* From Bronze to Silver */}
                <div className="border rounded-lg p-4 space-y-3">
                  <h4 className="font-semibold text-gray-900">Iz bronastega v srebrni status</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>Minimalni mesečni nakup (EUR)</Label>
                      <Input
                        type="number"
                        value={statusRules.statusTransitions.fromBronzeToSilver.minMonthlyPurchase}
                        onChange={(e) => updateStatusRule(['statusTransitions', 'fromBronzeToSilver', 'minMonthlyPurchase'], parseFloat(e.target.value))}
                        min="0"
                      />
                    </div>
                    <div>
                      <Label>Število zaporednih mesecev</Label>
                      <Input
                        type="number"
                        value={statusRules.statusTransitions.fromBronzeToSilver.consecutiveMonths}
                        onChange={(e) => updateStatusRule(['statusTransitions', 'fromBronzeToSilver', 'consecutiveMonths'], parseInt(e.target.value))}
                        min="1"
                      />
                    </div>
                  </div>
                </div>

                {/* From Bronze to Basic */}
                <div className="border rounded-lg p-4 space-y-3">
                  <h4 className="font-semibold text-gray-900">Iz bronastega v osnovni status</h4>
                  <div>
                    <Label>Maksimalni nakup (EUR)</Label>
                    <Input
                      type="number"
                      value={statusRules.statusTransitions.fromBronzeToBasic.maxPurchase}
                      onChange={(e) => updateStatusRule(['statusTransitions', 'fromBronzeToBasic', 'maxPurchase'], parseFloat(e.target.value))}
                      min="0"
                    />
                  </div>
                </div>

                <Button onClick={handleSaveStatusRules} className="w-full">
                  <Save className="w-4 h-4 mr-2" />
                  Shrani pravila za statuse
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle>Kako delujejo pravila za statuse?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-gray-700">
                <p>• Statusi se preverjajo in posodabljajo mesečno ob izračunu točk</p>
                <p>• Najprej se posodobi status, šele nato se dodelijo točke</p>
                <p>• Stranke začnejo z osnovnim statusom ob registraciji</p>
                <p>• Za napredovanje je potrebno doseči določene mejnike nakupov</p>
                <p>• Za ohranjanje višjih statusov je potrebna minimalna mesečna aktivnost</p>
                <p>• Bronasti status je nekakšna "kazen" za neaktivne stranke</p>
                <p>• Spremembe pravil veljajo od naslednjega mesečnega izračuna dalje</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
