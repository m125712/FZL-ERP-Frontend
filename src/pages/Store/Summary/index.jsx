import { useAuth } from '@/context/auth';
import Issue from '@/pages/Issue/History';
// import Purchase from '@/pages/Store/Receive/Details';
import Maintenance from '@pages/Issue/Maintenance';
import SpareParts from '@pages/Issue/SpareParts';
import Wastage from '@pages/Issue/Wastage';
import { useParams } from 'react-router-dom';
import Information from './Information';

export default function Index() {
	const { material_id } = useParams();
	const { user } = useAuth();
	const canAccess = (departments = []) =>
		['admin', 'viewer', 'manager', ...departments].some((department) =>
			user?.user_department?.includes(department)
		);
	const showPurchase = canAccess(['store', 'procurement', 'spare-parts']);
	const showIssue = canAccess(['store', 'ppc']);
	const showWastage = canAccess(['store', 'ppc']);
	const showMaintenance = canAccess(['store', 'ppc', 'spare-parts']);
	const showSpareParts = canAccess(['store', 'spare-parts']);

	return (
		<div className='container mx-auto my-2 w-full px-2'>
			<Information material_id={material_id} />
			{showPurchase && <Purchase material_id={material_id} />}
			{showIssue && <Issue material_id={material_id} />}
			{showWastage && <Wastage material_id={material_id} />}
			{showMaintenance && <Maintenance material_id={material_id} />}
			{showSpareParts && <SpareParts material_id={material_id} />}
		</div>
	);
}
