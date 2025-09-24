import { getFirestoreAdmin } from '@/lib/firebaseAdmin';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity } from 'lucide-react';
import DashboardClient from '@/components/admin/DashboardClient';

async function getAppointments() {
  try {
    const firestore = await getFirestoreAdmin();
    const appointmentsSnapshot = await firestore.collection('smartAppointments').orderBy('createdAt', 'desc').limit(50).get();
    
    if (appointmentsSnapshot.empty) {
      return [];
    }

    const appointments = appointmentsSnapshot.docs.map(doc => {
      const data = doc.data();
      // Ensure createdAt is a serializable format (ISO string) for the client component
      const createdAt = data.createdAt.toDate();
      return {
        id: doc.id,
        name: data.name,
        phone: data.phone,
        email: data.email,
        program: data.selectedProgramName || 'General Inquiry',
        summary: data.aiSummary,
        recommendation: data.aiRecommendation,
        createdAt: createdAt.toISOString(),
        status: data.status || 'booked',
      };
    });
    return appointments;
  } catch (error) {
    console.error("Failed to fetch appointments for admin dashboard:", error);
    return { error: "Failed to load appointments. Check server logs for details." };
  }
}

export default async function AdminDashboardPage() {
  const appointmentsData = await getAppointments();

  if ('error' in appointmentsData) {
    return (
        <div className="flex flex-col flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12">
             <Card className="bg-destructive/10 border-destructive">
                <CardHeader>
                    <CardTitle>Error Loading Dashboard</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>{appointmentsData.error}</p>
                </CardContent>
            </Card>
        </div>
    );
  }

  return (
    <div className="flex flex-col flex-grow container mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">
        <div className="flex justify-between items-start mb-8">
            <div className="text-left">
            <h1 className="text-4xl sm:text-5xl font-headline font-semibold mb-4 text-glow-primary text-gradient-primary-accent">
                <Activity className="inline-block mr-3 h-10 w-10 align-bottom" />
                Admin Dashboard
            </h1>
            <p className="text-lg text-foreground/80 max-w-2xl font-body">
                View and manage client appointments with AI-powered tools.
            </p>
            </div>
        </div>

        <DashboardClient initialInquiries={appointmentsData} />
    </div>
  );
}
