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
import { herbTypes } from '@/data/mockData';
import QRGenerator from '@/components/qr/QRGenerator';
import { 
  Camera, 
  MapPin, 
  Calendar, 
  Package, 
  Plus,
  CheckCircle,
  Upload,
  Loader2
} from 'lucide-react';

interface HarvestData {
  herbType: string;
  quantity: number;
  unit: string;
  photo: string | null;
  location: {
    lat: number;
    lng: number;
    address: string;
  } | null;
  notes: string;
}

const RegisterHarvest: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [generatedBatchId, setGeneratedBatchId] = useState<string | null>(null);
  const [gettingLocation, setGettingLocation] = useState(false);
  
  const [harvestData, setHarvestData] = useState<HarvestData>({
    herbType: '',
    quantity: 0,
    unit: 'kg',
    photo: null,
    location: null,
    notes: ''
  });

  const generateBatchId = (): string => {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const day = String(new Date().getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `AYUR-${year}${month}${day}-${random}`;
  };

  const getCurrentLocation = () => {
    setGettingLocation(true);
    
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation Not Supported",
        description: "Your browser doesn't support location services.",
        variant: "destructive"
      });
      setGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        // Mock reverse geocoding (in real app, use a geocoding service)
        const mockAddress = `Farm Location, ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
        
        setHarvestData(prev => ({
          ...prev,
          location: {
            lat: latitude,
            lng: longitude,
            address: mockAddress
          }
        }));
        
        setGettingLocation(false);
        toast({
          title: "Location Captured",
          description: "GPS coordinates have been recorded.",
          variant: "default"
        });
      },
      (error) => {
        setGettingLocation(false);
        toast({
          title: "Location Error",
          description: "Unable to get your location. Please ensure location services are enabled.",
          variant: "destructive"
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File Too Large",
          description: "Please select an image smaller than 5MB.",
          variant: "destructive"
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setHarvestData(prev => ({
          ...prev,
          photo: e.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
      
      toast({
        title: "Photo Uploaded",
        description: "Harvest photo has been attached.",
        variant: "default"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!harvestData.herbType || !harvestData.quantity || !harvestData.location) {
      toast({
        title: "Incomplete Information",
        description: "Please fill in all required fields including location.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const batchId = generateBatchId();
    setGeneratedBatchId(batchId);
    
    // Simulate blockchain transaction
    const blockchainHash = `0x${Math.random().toString(16).substr(2, 32)}`;
    
    // Add to mock data (in real app, this would be an API call)
    const newBatch = {
      id: batchId,
      farmerId: user?.id || '1',
      farmerName: user?.name || 'Unknown Farmer',
      herbType: harvestData.herbType,
      quantity: harvestData.quantity,
      unit: harvestData.unit,
      harvestDate: new Date().toISOString(),
      location: harvestData.location,
      status: 'pending' as const,
      qrCode: '', // Will be generated by QRGenerator
      photo: harvestData.photo || undefined,
      blockchainHash,
      price: Math.floor(Math.random() * 1000) + 500,
      paymentStatus: 'pending' as const
    };
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    toast({
      title: "Harvest Registered Successfully! 🎉",
      description: `Batch ${batchId} has been created and recorded on the blockchain.`,
      variant: "default"
    });
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setGeneratedBatchId(null);
    setHarvestData({
      herbType: '',
      quantity: 0,
      unit: 'kg',
      photo: null,
      location: null,
      notes: ''
    });
  };

  if (isSubmitted && generatedBatchId) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="border-success">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
            <CardTitle className="text-success">Harvest Registered Successfully!</CardTitle>
            <CardDescription>
              Your batch has been recorded on the blockchain and is pending verification.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-2">
              <Badge variant="success" className="text-lg px-4 py-2">
                {generatedBatchId}
              </Badge>
              <p className="text-sm text-muted-foreground">
                Your unique batch identifier
              </p>
            </div>

            <QRGenerator 
              batchId={generatedBatchId}
              data={{
                herbType: harvestData.herbType,
                quantity: harvestData.quantity,
                unit: harvestData.unit,
                farmerName: user?.name,
                harvestDate: new Date().toISOString()
              }}
            />

            <div className="space-y-4">
              <h4 className="font-medium">Next Steps:</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span>Batch recorded on blockchain</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-warning rounded-full"></div>
                  <span>Awaiting distributor verification</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-muted rounded-full"></div>
                  <span>Payment will be released after verification</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Button variant="outline" onClick={resetForm} className="flex-1">
                Register Another Harvest
              </Button>
              <Button variant="farmer" className="flex-1">
                View My Batches
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-6 w-6 text-primary" />
            Register New Harvest
          </CardTitle>
          <CardDescription>
            Record your herbal harvest details and generate a blockchain-verified batch ID
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Herb Type Selection */}
            <div className="space-y-2">
              <Label htmlFor="herbType">Herb Type *</Label>
              <Select 
                value={harvestData.herbType} 
                onValueChange={(value) => setHarvestData(prev => ({ ...prev, herbType: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select herb type" />
                </SelectTrigger>
                <SelectContent>
                  {herbTypes.map((herb) => (
                    <SelectItem key={herb} value={herb}>
                      {herb}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Quantity and Unit */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity *</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="0"
                  step="0.1"
                  value={harvestData.quantity || ''}
                  onChange={(e) => setHarvestData(prev => ({ 
                    ...prev, 
                    quantity: parseFloat(e.target.value) || 0 
                  }))}
                  placeholder="Enter quantity"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit">Unit</Label>
                <Select 
                  value={harvestData.unit} 
                  onValueChange={(value) => setHarvestData(prev => ({ ...prev, unit: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">Kilograms (kg)</SelectItem>
                    <SelectItem value="tons">Tons</SelectItem>
                    <SelectItem value="pounds">Pounds (lbs)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Photo Upload */}
            <div className="space-y-2">
              <Label>Harvest Photo</Label>
              <div className="space-y-4">
                {harvestData.photo ? (
                  <div className="relative">
                    <img 
                      src={harvestData.photo} 
                      alt="Harvest preview"
                      className="w-full h-48 object-cover rounded-lg border"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => setHarvestData(prev => ({ ...prev, photo: null }))}
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div 
                    className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center cursor-pointer hover:border-muted-foreground/50 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-2">Click to upload harvest photo</p>
                    <p className="text-xs text-muted-foreground">JPG, PNG up to 5MB</p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label>GPS Location *</Label>
              {harvestData.location ? (
                <div className="p-4 bg-success/5 border border-success/20 rounded-lg">
                  <div className="flex items-center gap-2 text-success mb-2">
                    <MapPin className="h-4 w-4" />
                    <span className="font-medium">Location Captured</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{harvestData.location.address}</p>
                  <p className="text-xs text-muted-foreground">
                    Lat: {harvestData.location.lat.toFixed(6)}, 
                    Lng: {harvestData.location.lng.toFixed(6)}
                  </p>
                </div>
              ) : (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={getCurrentLocation}
                  disabled={gettingLocation}
                  className="w-full"
                >
                  {gettingLocation ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <MapPin className="h-4 w-4 mr-2" />
                  )}
                  {gettingLocation ? 'Getting Location...' : 'Capture GPS Location'}
                </Button>
              )}
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                placeholder="Any additional information about this harvest..."
                value={harvestData.notes}
                onChange={(e) => setHarvestData(prev => ({ ...prev, notes: e.target.value }))}
                rows={3}
              />
            </div>

            {/* Auto Date/Time Display */}
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Calendar className="h-4 w-4" />
              <span>Harvest Date: {new Date().toLocaleString()}</span>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              variant="farmer" 
              size="lg" 
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Registering Harvest...
                </>
              ) : (
                <>
                  <Plus className="h-5 w-5 mr-2" />
                  Register Harvest & Generate QR
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterHarvest;