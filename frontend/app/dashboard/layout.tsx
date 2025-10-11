import DashboardLayout from '@/components/DashboardLayout';
import { PreferencesProvider } from '@/contexts/PreferencesContext';

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PreferencesProvider>
      <DashboardLayout>
        {children}
      </DashboardLayout>
    </PreferencesProvider>
  );
}
