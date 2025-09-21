import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Scan,
  FileText,
  TrendingUp,
  Eye,
  MapPin,
  Calendar,
  User
} from 'lucide-react';
import { mockBatches } from '@/data/mockData';

const DistributorDashboard: React.FC = () => {
  const stats = {
    pendingVerification: mockBatches.filter(b => b.status === 'pending').length,
    verified: mockBatches.filter(b => b.status === 'verified').length,
    rejected: mockBatches.filter(b => b.status === 'rejected').length,
    totalProcessed: mockBatches.length
  };

  const pendingBatches = mockBatches.filter(b => b.status === 'pending').slice(0, 3);
  const recentlyVerified = mockBatches.filter(b => b.status === 'verified').slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="gradient-nature rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Quality Control Center 🔍</h2>
            <p className="text-white/80">
              Ensure authenticity and quality of herbal products through verification.
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-white/80">Verification Rate</p>
            <p className="text-3xl font-bold">
              {Math.round((stats.verified / stats.totalProcessed) * 100)}%
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{stats.pendingVerification}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting your verification
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
              Quality approved
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats.rejected}</div>
            <p className="text-xs text-muted-foreground">
              Quality issues found
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Processed</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProcessed}</div>
            <p className="text-xs text-muted-foreground">
              All time batches
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Streamline your verification process
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/scan-update">
              <Button variant="distributor" size="lg" className="h-16 w-full">
                <Scan className="h-5 w-5 mr-2" />
                Scan & Update
              </Button>
            </Link>
            <Link to="/lab-reports">
              <Button variant="farmer" size="lg" className="h-16 w-full">
                <FileText className="h-5 w-5 mr-2" />
                Upload Lab Report
              </Button>
            </Link>
            <Button variant="consumer" size="lg" className="h-16">
              <TrendingUp className="h-5 w-5 mr-2" />
              View Analytics
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Pending Verifications */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-warning" />
                Pending Verifications
              </CardTitle>
              <CardDescription>Batches awaiting your quality review</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pendingBatches.map((batch) => (
              <div key={batch.id} className="flex items-center justify-between p-4 border rounded-lg bg-warning/5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                    <Package className="h-6 w-6 text-warning" />
                  </div>
                  <div>
                    <h4 className="font-medium">{batch.herbType}</h4>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {batch.farmerName}
                      </div>
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
                  <Badge variant="pending">Pending Review</Badge>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    Review
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recently Verified */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-success" />
                Recently Verified
              </CardTitle>
              <CardDescription>Your latest quality approvals</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              View History
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentlyVerified.map((batch) => (
              <div key={batch.id} className="flex items-center justify-between p-4 border rounded-lg bg-success/5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-success" />
                  </div>
                  <div>
                    <h4 className="font-medium">{batch.herbType}</h4>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {batch.farmerName}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {batch.verificationDate ? new Date(batch.verificationDate).toLocaleDateString() : 'N/A'}
                      </div>
                      <div className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        {batch.labReport ? 'Lab Report Available' : 'No Report'}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="verified">Verified</Badge>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quality Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quality Standards</CardTitle>
            <CardDescription>Your verification performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Accuracy Score</span>
                <span className="text-sm font-bold text-success">98.5%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Farmer Satisfaction</span>
                <span className="text-sm font-bold text-success">4.9/5</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Verification Impact</CardTitle>
            <CardDescription>Your contribution to the supply chain</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">{stats.verified}</p>
                <p className="text-sm text-muted-foreground">Batches Verified</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-accent">₹2.4L</p>
                <p className="text-sm text-muted-foreground">Value Secured</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-success">5</p>
                <p className="text-sm text-muted-foreground">Farmers Supported</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DistributorDashboard;