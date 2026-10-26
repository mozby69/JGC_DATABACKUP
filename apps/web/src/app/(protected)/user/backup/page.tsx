import RoleGuard from "@/components/guards/RoleGuard";
import DailyBackupForm from "@/modules/backup/components/DailyBackupForm";
import BackupListing from "@/modules/backup/components/BackupListing";
export default function DailyBackupPage() {
  return (
    <RoleGuard roles={["USER"]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Daily Backup</h1>
          <p className="mt-1 text-sm text-gray-500">
            Upload your branch files securely through SFTP.
          </p>
        </div>
        <DailyBackupForm />
        <BackupListing />
      </div>
    </RoleGuard>
  );
}
