import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { herbTypes, mockBatches } from '@/data/mockData';
import { useBlockchainLogger } from '@/components/blockchain/BlockchainLogger';
import { 
  Camera, 
  MapPin, 
  Calendar, 
  Package, 
  Plus,
  CheckCircle,
  Upload,
  Loader2,
  Search,
  ArrowRight
} from 'lucide-react';

interface BatchUpdateData {
  batchId: string;
  herbType: string;
  quantity: number;
  unit: string;
  status: 'pending' | 'verified' | 'rejected';
  transferTo: string;
  transferType: 'distributor' | 'retailer' | 'consumer';
  notes: string;
}

const BatchUpdateForm: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { logTransaction } = useBlockchainLogger();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchBatchId, setSearchBatchId] = useState('');
  const [foundBatch, setFoundBatch] = useState<any>(null);
  
  const [updateData, setUpdateData] = useState<BatchUpdateData>({
    batchId: '',
    herbType: '',
    quantity: 0,
    unit: 'kg',
    status: 'pending',
    transferTo: '',
    transferType: 'distributor',
    notes: ''
  });

  const searchBatch = () => {
    if (!searchBatchId.trim()) {
      toast({
        title: "Enter Batch ID",
        description: "Please enter a batch ID to search.",
        variant: "destructive"
      });
      return;
    }

    const batch = mockBatches.find(b => b.id === searchBatchId.trim());
    
    if (batch) {
      setFoundBatch(batch);
      setUpdateData({
        batchId: batch.id,
        herbType: batch.herbType,
        quantity: batch.quantity,
        unit: batch.unit,
        status: batch.status,
        transferTo: '',
        transferType: 'distributor',
        notes: ''
      });
      
      toast({
        title: "Batch Found! ✅",
        description: `${batch.herbType} from ${batch.farmerName}`,
        variant: "default"
      });
    } else {
      toast({
        title: "Batch Not Found",
        description: "This batch ID doesn't exist in our system.",
        variant: "destructive"
      });
      setFoundBatch(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!foundBatch || !updateData.transferTo) {
      toast({
        title: "Incomplete Information",
        description: "Please search for a batch and specify transfer destination.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Log blockchain transaction
    const { hash } = await logTransaction(
      "Batch Transfer",
      user?.name || "Distributor",
      updateData.transferTo,
      updateData.batchId
    );
    
    setIsSubmitting(false);
    
    toast({
      title: "Batch Updated Successfully! 🎉",
      description: `Batch ${updateData.batchId} has been transferred and recorded on blockchain.`,
      variant: "default"
    });

    // Reset form
    setSearchBatchId('');
    setFoundBatch(null);
    setUpdateData({
      batchId: '',
      herbType: '',
      quantity: 0,
      unit: 'kg',
      status: 'pending',
      transferTo: '',
      transferType: 'distributor',
      notes: ''
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-6 w-6 text-primary" />
            Find Batch to Update
          </CardTitle>
          <CardDescription>
            Enter a batch ID to update its status and transfer ownership
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Enter Batch ID (e.g., AYUR-2024-001)"
              value={searchBatchId}
              onChange={(e) => setSearchBatchId(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchBatch()}
            />
            <Button variant="distributor" onClick={searchBatch}>
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Batch Found - Update Form */}
      {foundBatch && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-6 w-6 text-primary" />
              Update Batch Transfer
            </CardTitle>
            <CardDescription>
              Update batch status and transfer to next party in the supply chain
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Current Batch Info */}
            <div className="mb-6 p-4 bg-muted/30 rounded-lg">
              <h4 className="font-medium mb-3">Current Batch Information</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Batch ID:</span>
                  <p className="font-medium">{foundBatch.id}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Herb Type:</span>
                  <p className="font-medium">{foundBatch.herbType}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Quantity:</span>
                  <p className="font-medium">{foundBatch.quantity} {foundBatch.unit}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Current Status:</span>
                  <Badge variant={foundBatch.status === 'verified' ? 'verified' : foundBatch.status === 'pending' ? 'pending' : 'destructive'}>
                    {foundBatch.status}
                  </Badge>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Transfer Details */}
              <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  <ArrowRight className="h-4 w-4" />
                  Transfer Details
                </h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="transferType">Transfer To *</Label>
                    <Select 
                      value={updateData.transferType} 
                      onValueChange={(value: 'distributor' | 'retailer' | 'consumer') => 
                        setUpdateData(prev => ({ ...prev, transferType: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select transfer type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="distributor">Another Distributor</SelectItem>
                        <SelectItem value="retailer">Retailer</SelectItem>
                        <SelectItem value="consumer">Consumer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="transferTo">Recipient Name *</Label>
                    <Input
                      id="transferTo"
                      value={updateData.transferTo}
                      onChange={(e) => setUpdateData(prev => ({ 
                        ...prev, 
                        transferTo: e.target.value 
                      }))}
                      placeholder="Enter recipient name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Update Status</Label>
                  <Select 
                    value={updateData.status} 
                    onValueChange={(value: 'pending' | 'verified' | 'rejected') => 
                      setUpdateData(prev => ({ ...prev, status: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="verified">Verified</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <Label htmlFor="notes">Transfer Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any notes about this transfer..."
                    value={updateData.notes}
                    onChange={(e) => setUpdateData(prev => ({ ...prev, notes: e.target.value }))}
                    rows={3}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                variant="distributor" 
                size="lg" 
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Updating Batch...
                  </>
                ) : (
                  <>
                    <ArrowRight className="h-5 w-5 mr-2" />
                    Update & Transfer Batch
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BatchUpdateForm;