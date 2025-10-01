import DashboardLayout from '@/components/DashboardLayout';
import { PreferencesProvider } from '@/context/PreferencesContext';

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
