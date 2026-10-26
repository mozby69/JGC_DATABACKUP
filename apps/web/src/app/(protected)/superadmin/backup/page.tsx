import RoleGuard from "@/components/guards/RoleGuard";
import BackupView from "@/modules/superadmin/backup/views/backupView";



export default function AccessControlPage() {
    return (
        <RoleGuard roles={["SUPER_ADMIN"]}>
            <BackupView />
        </RoleGuard>
    );
}


