import RoleGuard from "@/components/guards/RoleGuard";
import PensionerList from "@/modules/ssp/pensionerMasterList/views/pensionerList";


export default function AccessControlPage() {
    return (
        <RoleGuard roles={["BRANCH","ADMIN"]}>
            <PensionerList />
        </RoleGuard>
    ); 
}