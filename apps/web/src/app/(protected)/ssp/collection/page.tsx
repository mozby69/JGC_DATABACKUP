import RoleGuard from "@/components/guards/RoleGuard";
import CollectionView from "@/modules/ssp/collection/views/collectionView";




export default function AccessControlPage() {
    return (
        <RoleGuard roles={["BRANCH","ADMIN"]}>
            <CollectionView />
        </RoleGuard>
    ); 
}