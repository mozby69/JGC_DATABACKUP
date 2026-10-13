import RoleGuard from "@/components/guards/RoleGuard";
import ComputationSlip from "@/modules/ssp/computationSlip/views/computationSlip";



export default function AccessControlPage() {
    return (
        <RoleGuard roles={["BRANCH","ADMIN"]}>
            <ComputationSlip />
        </RoleGuard>
    ); 
}