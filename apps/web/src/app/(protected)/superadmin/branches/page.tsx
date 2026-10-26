import RoleGuard from "@/components/guards/RoleGuard";
import BranchesView from "@/modules/superadmin/branches/views/branchesView";


export default function AccessControlPage() {
    return (
        <RoleGuard roles={["SUPER_ADMIN"]}>
            <BranchesView />
        </RoleGuard>
    );
}



