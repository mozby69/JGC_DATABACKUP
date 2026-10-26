import RoleGuard from "@/components/guards/RoleGuard";
import SuperAdminView from "@/modules/superadmin/dashboard";

export default function AccessControlPage() {
    return (
        <RoleGuard roles={["SUPER_ADMIN"]}>
            <SuperAdminView />
        </RoleGuard>
    );
}



