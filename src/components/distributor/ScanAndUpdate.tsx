import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { mockBatches } from '@/data/mockData';
import { useBlockchainLogger } from '@/components/blockchain/BlockchainLogger';
import { 
  QrCode, 
  Camera, 
  Search, 
  ArrowRight,
  Package,
  User,
  Calendar,
  MapPin,
  CheckCircle,
  Clock
} from 'lucide-react';

const ScanAndUpdate: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { logTransaction } = useBlockchainLogger();
  
  const [isScanning, setIsScanning] = useState(false);
  const [manualBatchId, setManualBatchId] = useState('');
  const [scannedBatch, setScannedBatch] = useState<any>(null);
  const [transferTo, setTransferTo] = useState('');
  const [transferType, setTransferType] = useState<'distributor' | 'retailer' | 'consumer'>('distributor');
  const [updating, setUpdating] = useState(false);

  // Mock QR scanner
  const startScanning = () => {
    setIsScanning(true);
    
    setTimeout(() => {
      // Simulate finding a batch
      const availableBatches = mockBatches.filter(b => b.status === 'verified');
      const randomBatch = availableBatches[Math.floor(Math.random() * availableBatches.length)];
      
      if (randomBatch) {
        handleBatchFound(randomBatch.id);
      }
      setIsScanning(false);
    }, 3000);
  };

  const handleBatchFound = (batchId: string) => {
    const batch = mockBatches.find(b => b.id === batchId);
    
    if (batch) {
      setScannedBatch(batch);
      toast({
        title: "Batch Scanned! ✅",
        description: `${batch.herbType} from ${batch.farmerName}`,
        variant: "default"
      });
    } else {
      toast({
        title: "Batch Not Found",
        description: "This batch ID doesn't exist in our system.",
        variant: "destructive"
      });
    }
  };

  const handleManualSearch = () => {
    if (!manualBatchId.trim()) {
      toast({
        title: "Enter Batch ID",
        description: "Please enter a batch ID to search.",
        variant: "destructive"
      });
      return;
    }
    
    handleBatchFound(manualBatchId.trim());
  };

  const handleUpdate = async () => {
    if (!scannedBatch || !transferTo.trim()) {
      toast({
        title: "Missing Information",
        description: "Please specify transfer destination.",
        variant: "destructive"
      });
      return;
    }

    setUpdating(true);

    // Simulate update process
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Log blockchain transaction
    const { hash } = await logTransaction(
      "Batch Transfer Update",
      user?.name || "Distributor",
      transferTo,
      scannedBatch.id
    );

    setUpdating(false);
    
    toast({
      title: "Batch Updated Successfully! 🎉",
      description: `${scannedBatch.id} transferred to ${transferTo}`,
      variant: "default"
    });

    // Reset form
    setScannedBatch(null);
    setTransferTo('');
    setManualBatchId('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'success';
      case 'pending': return 'warning';
      case 'rejected': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Scanner Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="h-6 w-6 text-primary" />
            Scan & Update Batch Transfer
          </CardTitle>
          <CardDescription>
            Scan QR codes to update batch transfers in the supply chain
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* QR Scanner */}
          <div className="text-center">
            {isScanning ? (
              <div className="space-y-4">
                <div className="w-64 h-64 border-2 border-dashed border-primary mx-auto rounded-lg flex items-center justify-center bg-primary/5">
                  <div className="text-center">
                    <div className="animate-pulse">
                      <Camera className="h-16 w-16 text-primary mx-auto mb-4" />
                    </div>
                    <p className="text-primary font-medium">Scanning QR Code...</p>
                    <p className="text-sm text-muted-foreground">Position the QR code in the frame</p>
                  </div>
                </div>
                <Button variant="outline" onClick={() => setIsScanning(false)}>
                  Cancel Scan
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-64 h-64 border-2 border-dashed border-muted-foreground/25 mx-auto rounded-lg flex items-center justify-center hover:border-primary/50 transition-colors">
                  <div className="text-center">
                    <QrCode className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Click to start scanning</p>
                  </div>
                </div>
                <Button variant="distributor" size="lg" onClick={startScanning}>
                  <Camera className="h-5 w-5 mr-2" />
                  Start QR Scanner
                </Button>
              </div>
            )}
          </div>

          {/* Manual Entry */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or enter manually</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="Enter Batch ID (e.g., AYUR-2024-001)"
              value={manualBatchId}
              onChange={(e) => setManualBatchId(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleManualSearch()}
            />
            <Button variant="distributor" onClick={handleManualSearch}>
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Update Form */}
      {scannedBatch && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowRight className="h-6 w-6 text-primary" />
              Update Batch Transfer
            </CardTitle>
            <CardDescription>
              Update the transfer details for this batch
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Current Batch Info */}
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium">Current Batch</h4>
                <Badge variant={getStatusColor(scannedBatch.status)}>
                  {scannedBatch.status}
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <Package className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{scannedBatch.herbType}</p>
                    <p className="text-sm text-muted-foreground">Herb Type</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{scannedBatch.farmerName}</p>
                    <p className="text-sm text-muted-foreground">From</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{scannedBatch.quantity} {scannedBatch.unit}</p>
                    <p className="text-sm text-muted-foreground">Quantity</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Transfer Form */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="transferType">Transfer To</Label>
                  <Select 
                    value={transferType} 
                    onValueChange={(value: 'distributor' | 'retailer' | 'consumer') => 
                      setTransferType(value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="distributor">Another Distributor</SelectItem>
                      <SelectItem value="retailer">Retailer</SelectItem>
                      <SelectItem value="consumer">Consumer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="transferTo">Recipient Name</Label>
                  <Input
                    id="transferTo"
                    value={transferTo}
                    onChange={(e) => setTransferTo(e.target.value)}
                    placeholder="Enter recipient name"
                  />
                </div>
              </div>

              <Button 
                variant="distributor" 
                size="lg" 
                className="w-full"
                onClick={handleUpdate}
                disabled={updating || !transferTo.trim()}
              >
                {updating ? (
                  <>
                    <Clock className="h-5 w-5 mr-2 animate-spin" />
                    Updating Transfer...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Update Batch Transfer
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ScanAndUpdate;