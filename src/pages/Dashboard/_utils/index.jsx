import { useFetch } from '@/hooks';
export const primaryColor = '#27374D';
export const errorColor = '#f31260';

export function getApproval() {
	const { value: status } = useFetch('/dashboard/order-status');

	const totals = status?.reduce((acc, item) => {
		const key = `${item.item_name}_${item.stopper_type}_${item.order_status}`;
		acc[key] = item.total;
		return acc;
	}, {});

	const nylon_metallic_not_approved =
		totals?.['nylon_metallic_not_approved'] ?? 0;
	const nylon_metallic_approved = totals?.['nylon_metallic_approved'] ?? 0;

	const nylon_plastic_not_approved =
		totals?.['nylon_plastic_not_approved'] ?? 0;
	const nylon_plastic_approved = totals?.['nylon_plastic_approved'] ?? 0;

	const vislon__not_approved = totals?.['vislon__not_approved'] ?? 0;
	const vislon__approved = totals?.['vislon__approved'] ?? 0;

	const metal__not_approved = totals?.['metal__not_approved'] ?? 0;
	const metal__approved = totals?.['metal__approved'] ?? 0;

	return {
		nylon_metallic_not_approved,
		nylon_metallic_approved,
		nylon_plastic_not_approved,
		nylon_plastic_approved,
		vislon__not_approved,
		vislon__approved,
		metal__not_approved,
		metal__approved,
	};
}
