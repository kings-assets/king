import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut } from 'lucide-react';
import { clientLogout } from '@/app/actions/authActions';
import { Button } from '@/components/ui/button';
import { getFirestoreAdmin } from '@/lib/firebaseAdmin';
import ClientDashboardDisplay from '@/components/client/ClientDashboardDisplay';
import type { ClientReport, ClientAppointment } from '@/ai/types';

// This is a mock function to get the current user. 
async function getCurrentUser() {
    return { email: 'client@revive.com', name: 'Demo Client' };
}

async function getClientReports(email: string): Promise<ClientReport[] | { error: string }> {
    if (!email) return [];
    try {
        const firestore = await getFirestoreAdmin();
        const clientRef = firestore.collection('clients').doc(email);
        const doc = await clientRef.get();
        if (!doc.exists) return [];
        const data = doc.data();
        const notes = data?.notes ? data.notes : [];
        return notes.map((note: any) => ({
            ...note,
            timestamp: new Date(note.timestamp).toISOString(),
        })).reverse();
    } catch (error: any) {
        console.error(`Failed to fetch reports for ${email}:`, error);
        return { error: `Failed to load reports. Please check server logs.` };
    }
}

async function getClientAppointments(email: string): Promise<ClientAppointment[] | { error: string }> {
    if (!email) return [];
    try {
        const firestore = await getFirestoreAdmin();
        const appointmentsSnapshot = await firestore.collection('smartAppointments').where('email', '==', email).orderBy('createdAt', 'desc').get();
        if (appointmentsSnapshot.empty) return [];
        return appointmentsSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                createdAt: data.createdAt.toDate().toISOString(),
                program: data.selectedProgramName || 'General Inquiry',
                summary: data.aiSummary,
                recommendation: data.aiRecommendation,
                status: data.status,
            };
        });
    } catch (error: any) {
        console.error(`Failed to fetch appointments for ${email}:`, error);
        return { error: `Failed to load appointments. Please check server logs.` };
    }
}


export default async function ClientDashboardPage() {
    const user = await getCurrentUser();
    const reportsData = await getClientReports(user.email);
    const appointmentsData = await getClientAppointments(user.email);

    if (('error' in reportsData) || ('error' in appointmentsData)) {
         return (
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-16">
                <Card className="bg-destructive/10 border-destructive">
                    <CardHeader> <CardTitle>Error Loading Dashboard</CardTitle> </CardHeader>
                    <CardContent> 
                        <p>{('error' in reportsData) ? reportsData.error : ('error' in appointmentsData) ? appointmentsData.error : 'An unknown error occurred.'}</p> 
                    </CardContent>
                </Card>
            </div>
        );
    }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-16">
      <div className="flex justify-between items-start mb-8">
          <div className="text-left animate-slide-up">
          <h1 className="text-4xl sm:text-5xl font-headline font-semibold mb-4 text-glow-primary text-gradient-primary-accent">
              Welcome, {user.name}
          </h1>
          <p className="text-lg text-foreground/80 max-w-2xl font-body">
              This is your secure portal. Review your AI-generated reports and booking history.
          </p>
          </div>
           <form action={clientLogout}>
              <Button variant="outline">
                  <LogOut className="mr-2 h-4 w-4"/>
                  Logout
              </Button>
          </form>
      </div>
      
      <ClientDashboardDisplay reports={reportsData} appointments={appointmentsData} />
    </div>
  );
}
