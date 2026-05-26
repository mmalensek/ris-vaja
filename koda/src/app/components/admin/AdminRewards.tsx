import { useEffect, useState } from "react";
import { storage } from "../../lib/storage";
import { Reward } from "../../lib/types";
import { AdminLayout } from "./AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Badge } from "../ui/badge";
import { Gift, Plus, Pencil, Trash2 } from "lucide-react";
import { Alert, AlertDescription } from "../ui/alert";

export function AdminRewards() {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingReward, setEditingReward] = useState<Reward | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    pointsCost: 0,
    category: '',
    available: true
  });

  useEffect(() => {
    loadRewards();
  }, []);

  const loadRewards = () => {
    setRewards(storage.getRewards());
  };

  const handleOpenDialog = (reward?: Reward) => {
    if (reward) {
      setEditingReward(reward);
      setFormData({
        name: reward.name,
        description: reward.description,
        pointsCost: reward.pointsCost,
        category: reward.category,
        available: reward.available
      });
    } else {
      setEditingReward(null);
      setFormData({
        name: '',
        description: '',
        pointsCost: 0,
        category: '',
        available: true
      });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    let updatedRewards: Reward[];

    if (editingReward) {
      updatedRewards = rewards.map(r =>
        r.id === editingReward.id
          ? { ...r, ...formData }
          : r
      );
      setSuccess('Nagrada uspešno posodobljena');
    } else {
      const newReward: Reward = {
        id: Date.now().toString(),
        ...formData
      };
      updatedRewards = [...rewards, newReward];
      setSuccess('Nagrada uspešno dodana');
    }

    storage.updateRewards(updatedRewards);
    setRewards(updatedRewards);
    setIsDialogOpen(false);
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleDelete = (rewardId: string) => {
    if (confirm('Ali ste prepričani, da želite izbrisati to nagrado?')) {
      const updatedRewards = rewards.filter(r => r.id !== rewardId);
      storage.updateRewards(updatedRewards);
      setRewards(updatedRewards);
      setSuccess('Nagrada uspešno izbrisana');
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  const groupedRewards = rewards.reduce((acc, reward) => {
    if (!acc[reward.category]) {
      acc[reward.category] = [];
    }
    acc[reward.category].push(reward);
    return acc;
  }, {} as Record<string, Reward[]>);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Upravljanje nagrad</h1>
            <p className="text-gray-600">Dodajanje, urejanje in upravljanje nagrad za program zvestobe</p>
          </div>
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="w-4 h-4 mr-2" />
            Nova nagrada
          </Button>
        </div>

        {success && (
          <Alert className="bg-green-50 border-green-200">
            <AlertDescription className="text-green-900">{success}</AlertDescription>
          </Alert>
        )}

        {/* Rewards by Category */}
        {Object.entries(groupedRewards).map(([category, categoryRewards]) => (
          <Card key={category}>
            <CardHeader>
              <CardTitle>{category}</CardTitle>
              <CardDescription>{categoryRewards.length} nagrad v tej kategoriji</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Naziv</TableHead>
                    <TableHead>Opis</TableHead>
                    <TableHead className="text-right">Cena (točke)</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Akcije</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categoryRewards.map((reward) => (
                    <TableRow key={reward.id}>
                      <TableCell className="font-medium">{reward.name}</TableCell>
                      <TableCell>{reward.description}</TableCell>
                      <TableCell className="text-right font-semibold">{reward.pointsCost}</TableCell>
                      <TableCell>
                        <Badge variant={reward.available ? 'default' : 'secondary'}>
                          {reward.available ? 'Aktivna' : 'Neaktivna'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenDialog(reward)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(reward.id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ))}

        {rewards.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Gift className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">Še ni dodanih nagrad</p>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="w-4 h-4 mr-2" />
                Dodaj prvo nagrado
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Add/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingReward ? 'Uredi nagrado' : 'Nova nagrada'}
              </DialogTitle>
              <DialogDescription>
                Vnesite podatke o nagradi
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Naziv nagrade</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="npr. 10% popust bon"
                />
              </div>
              <div>
                <Label htmlFor="description">Opis</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Kratek opis nagrade"
                />
              </div>
              <div>
                <Label htmlFor="category">Kategorija</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  placeholder="npr. Popusti, Boni, Storitve"
                />
              </div>
              <div>
                <Label htmlFor="points">Cena v točkah</Label>
                <Input
                  id="points"
                  type="number"
                  value={formData.pointsCost}
                  onChange={(e) => setFormData({...formData, pointsCost: parseInt(e.target.value)})}
                  placeholder="0"
                  min="0"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="available"
                  checked={formData.available}
                  onCheckedChange={(checked) => setFormData({...formData, available: checked})}
                />
                <Label htmlFor="available">Nagrada aktivna</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Prekliči
              </Button>
              <Button onClick={handleSave}>
                {editingReward ? 'Shrani' : 'Dodaj'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
