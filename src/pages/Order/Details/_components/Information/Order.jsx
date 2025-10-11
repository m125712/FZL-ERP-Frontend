import { useState } from 'react';
import { complainColumns } from '@/pages/Order/columns';
import {
	useComplain,
	useComplainByProductDescriptionUUID,
} from '@/state/Order';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useAccess } from '@/hooks';

import { Suspense } from '@/components/Feedback';
import { DeleteModal } from '@/components/Modal';
import ReactTableWithoutTitle from '@/components/Table/ReactTableWithoutTitle';
import RenderTable from '@/ui/Others/Table/RenderTable';
import { LinkWithCopy, TitleValue } from '@/ui';

import GetDateTime from '@/util/GetDateTime';

const renderCashOrLC = (is_cash, is_sample, is_bill, is_only_value) => {
	let value = is_cash == 1 ? 'Cash' : 'LC';
	let sample_bill = [];

	if (is_sample === 1) sample_bill.push('Sample');
	if (is_bill === 1) sample_bill.push('Bill');

	if (sample_bill.length > 0) value += ` (${sample_bill.join(', ')})`;

	if (is_only_value) return value;

	return <TitleValue title='Cash / LC' value={value} />;
};

export default function OrderDescription({ order }) {
	const {
		data: complainData,
		url,
		postData,
		updateData,
		imageUpdateData,
		invalidateQuery: invalidateComplain,
		deleteData,
	} = useComplainByProductDescriptionUUID(order.order_description_uuid);
	const haveAccess = useAccess('order__complain');
	const navigation = useNavigate();

	const renderItems = () => {
		const {
			order_number,
			reference_order,
			item_description,
			marketing_name,
			marketing_priority,
			factory_priority,
			user_name,
			buyer_name,
			party_name,
			merchandiser_name,
			factory_name,
			is_cash,
			is_sample,
			is_bill,
		} = order;

		const order_details = [
			{
				label: 'O/N',
				value: order_number,
			},
			{
				label: 'Ref. O/N',
				value: reference_order && (
					<LinkWithCopy
						title={reference_order}
						id={reference_order}
						uri='/order/details'
					/>
				),
			},

			{
				label: 'Item',
				value: item_description,
			},
			{
				label: 'Marketing',
				value: marketing_name,
			},

			{
				label: 'Priority (Mark / Fact)',
				value: marketing_priority + ' / ' + factory_priority,
			},
			{
				label: 'Created By',
				value: user_name,
			},
		];

		const buyer_details = [
			{
				label: 'Buyer',
				value: buyer_name,
			},

			{
				label: 'Party',
				value: party_name,
			},

			{
				label: 'Merchandiser.',
				value: merchandiser_name,
			},
			{
				label: 'Factory',
				value: factory_name,
			},

			{
				label: 'Cash / LC',
				value: renderCashOrLC(is_cash, is_sample, is_bill, true),
			},
		];

		return {
			order_details,
			buyer_details,
		};
	};
	const handelUpdate = (idx) => {
		navigation(
			`/order/complain/${complainData[idx]?.order_number}/${complainData[idx]?.order_description_uuid}/${complainData[idx]?.uuid}/update`
		);
	};

	// Delete
	const [deleteItem, setDeleteItem] = useState({
		itemId: null,
		itemName: null,
	});

	const handelDelete = (idx) => {
		setDeleteItem((prev) => ({
			...prev,
			itemId: complainData[idx].uuid,
			itemName: complainData[idx].name,
		}));

		window['deleteComplainModal'].showModal();
	};
	const handelResolved = async (idx) => {
		const is_resolved = complainData[idx].is_resolved ? false : true;
		await updateData.mutateAsync({
			url: `/public/complaint/${complainData[idx].uuid}`,
			updatedData: {
				is_resolved,
				is_resolved_date: is_resolved ? GetDateTime() : null,
			},
			isOnCloseNeeded: false,
		});
	};
	const columns = complainColumns({
		handelUpdate,
		handelDelete,
		haveAccess,
		data: complainData,
		handelResolved,
	});
	return (
		<div className='grid grid-cols-1 md:grid-cols-3 md:gap-8'>
			<RenderTable
				className={
					'border-b border-r-0 border-secondary/30 md:border-r'
				}
				title={'Order Details'}
				items={renderItems().order_details}
			/>

			<RenderTable
				className={
					'border-b border-l-0 border-secondary/30 md:border-l md:border-r'
				}
				title={'Buyer Details'}
				items={renderItems().buyer_details}
			/>
			<div className='border border-secondary/30'>
				<div className='flex items-center justify-between bg-base-200 px-3 py-2'>
					<h4 className='text-lg font-medium capitalize leading-tight text-primary'>
						Complain
					</h4>
					{haveAccess.includes('show_own_order') && (
						<button
							type='button'
							disabled={!haveAccess.includes('show_own_order')}
							className='flex items-center rounded-sm bg-accent p-2 text-xs text-secondary-foreground disabled:bg-slate-400'
							onClick={() =>
								navigation(
									`/order/complain/${order?.order_number}/${order?.order_description_uuid}`
								)
							}
						>
							New
							<Plus className='ml-2' size={16} />
						</button>
					)}
				</div>
				<ReactTableWithoutTitle
					title='Complain'
					data={complainData}
					columns={columns}
				/>
			</div>
			<Suspense>
				<DeleteModal
					modalId={'deleteComplainModal'}
					title={'Are you sure you want to delete this complain?'}
					{...{
						deleteItem,
						setDeleteItem,
						url: `/public/complaint`,
						deleteData,
					}}
				/>
			</Suspense>
		</div>
	);
}
