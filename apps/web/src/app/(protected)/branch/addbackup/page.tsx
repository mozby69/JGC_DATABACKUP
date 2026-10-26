import RoleGuard from "@/components/guards/RoleGuard";
import AddBackupView from "@/modules/branch/addbackup/views/addBackupView";




export default function AccessControlPage() {
    return (
        <RoleGuard roles={["SUPER_ADMIN","BRANCH"]}>
            <AddBackupView />
        </RoleGuard>
    );
}


