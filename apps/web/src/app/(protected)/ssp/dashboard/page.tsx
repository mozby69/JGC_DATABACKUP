import RoleGuard from "@/components/guards/RoleGuard";
import SSPDashboard from "@/modules/ssp/dashboard/views/sspDashboard";


export default function AccessControlPage() {
    return (
        <RoleGuard roles={["BRANCH","ADMIN"]}>
            <SSPDashboard />
        </RoleGuard>
    ); 
}