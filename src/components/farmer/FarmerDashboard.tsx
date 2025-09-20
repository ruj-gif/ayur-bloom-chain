import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle, 
  IndianRupee, 
  TrendingUp,
  Plus,
  QrCode,
  MapPin,
  Calendar
} from 'lucide-react';
import { mockBatches, mockPayments } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';

const FarmerDashboard: React.FC = () => {
  const { user } = useAuth();
  
  const userBatches = mockBatches.filter(batch => batch.farmerId === user?.id);
  const userPayments = mockPayments.filter(payment => 
    userBatches.some(batch => batch.id === payment.batchId)
  );

  const stats = {
    totalBatches: userBatches.length,
    verified: userBatches.filter(b => b.status === 'verified').length,
    pending: userBatches.filter(b => b.status === 'pending').length,
    rejected: userBatches.filter(b => b.status === 'rejected').length,
    totalEarnings: userPayments.reduce((sum, p) => p.status === 'paid' ? sum + p.amount : sum, 0),
    pendingPayments: userPayments.reduce((sum, p) => p.status === 'pending' ? sum + p.amount : sum, 0)
  };

  const recentBatches = userBatches.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="gradient-primary rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Welcome back, {user?.name}! 🌱</h2>
            <p className="text-white/80">
              Your harvest journey continues. Track your batches and earnings in real-time.
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-white/80">Total Earnings</p>
            <p className="text-3xl font-bold">₹{stats.totalEarnings.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Batches</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBatches}</div>
            <p className="text-xs text-muted-foreground">
              All registered harvests
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{stats.verified}</div>
            <p className="text-xs text-muted-foreground">
              Approved by distributors
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting verification
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Earnings</CardTitle>
            <IndianRupee className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.totalEarnings.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              ₹{stats.pendingPayments.toLocaleString()} pending
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Fast track your farming operations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="farmer" size="lg" className="h-16">
              <Plus className="h-5 w-5 mr-2" />
              Register New Harvest
            </Button>
            <Button variant="distributor" size="lg" className="h-16">
              <QrCode className="h-5 w-5 mr-2" />
              Generate QR Codes
            </Button>
            <Button variant="consumer" size="lg" className="h-16">
              <TrendingUp className="h-5 w-5 mr-2" />
              View Analytics
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Batches */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Batches</CardTitle>
              <CardDescription>Your latest registered harvests</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentBatches.map((batch) => (
              <div key={batch.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                    <Package className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <h4 className="font-medium">{batch.herbType}</h4>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(batch.harvestDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {batch.quantity} {batch.unit}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={
                    batch.status === 'verified' ? 'verified' : 
                    batch.status === 'pending' ? 'pending' : 'rejected'
                  }>
                    {batch.status.charAt(0).toUpperCase() + batch.status.slice(1)}
                  </Badge>
                  {batch.price && (
                    <div className="text-right">
                      <p className="font-medium">₹{batch.price.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">
                        {batch.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Verification Rate</CardTitle>
            <CardDescription>Batch approval success rate</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Success Rate</span>
                <span className="text-sm text-muted-foreground">
                  {Math.round((stats.verified / stats.totalBatches) * 100)}%
                </span>
              </div>
              <Progress value={(stats.verified / stats.totalBatches) * 100} className="h-2" />
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <p className="font-medium text-success">{stats.verified}</p>
                  <p className="text-muted-foreground">Verified</p>
                </div>
                <div className="text-center">
                  <p className="font-medium text-warning">{stats.pending}</p>
                  <p className="text-muted-foreground">Pending</p>
                </div>
                <div className="text-center">
                  <p className="font-medium text-destructive">{stats.rejected}</p>
                  <p className="text-muted-foreground">Rejected</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recognition</CardTitle>
            <CardDescription>Your earned badges and certifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {user?.badges?.map((badge, index) => (
                <div key={index} className="flex items-center gap-3 p-2 bg-muted/30 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span className="font-medium">{badge}</span>
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full mt-4">
                View All Achievements
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FarmerDashboard;