import ReactTable from '@/components/Table';
import { useAccess, useFetchFunc } from '@/hooks';
import { LinkWithCopy, Transfer } from '@/ui';
import { Need } from '@/util/Need';
import PageInfo from '@/util/PageInfo';
import { Suspense, lazy, useEffect, useMemo, useState } from 'react';

const AddOrUpdate = lazy(() => import('./AddOrUpdate'));

const OrderStatus = ({ value }) => {
	const statusStyles = {
		0: {
			label: 'Approved',
			style: 'bg-primary text-primary-content',
		},
		1: {
			label: 'Running',
			style: 'bg-success text-success-content',
		},
	};
	const { label, style = '' } = statusStyles[value] || {};

	return (
		<span
			className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold ${style}`}>
			{label}
		</span>
	);
};

export default function Index() {
	const info = new PageInfo(
		'Planning',
		'order/planning/details',
		'dyeing__planning'
	);

	const [order, setOrder] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const haveAccess = useAccess('dyeing__planning');

	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	const columns = useMemo(
		() => [
			{
				accessorKey: 'order_number',
				header: 'O/N',
				cell: (info) => {
					const { order_number } = info.row.original;
					return (
						<LinkWithCopy
							title={info.getValue()}
							id={order_number}
							uri='/order/details'
						/>
					);
				},
			},
			{
				accessorKey: 'item_description',
				header: 'Item Description',
				// enableColumnFilter: false,
				cell: (info) => {
					const { order_description_uuid, order_number } =
						info.row.original;
					return (
						<LinkWithCopy
							title={info.getValue()}
							id={order_description_uuid}
							uri={`/order/details/${order_number}`}
						/>
					);
				},
			},
			{
				accessorKey: 'style_count_rank',
				header: 'Position',
				enableColumnFilter: false,
				cell: (info) => {
					const { style_count_rank, style_count } = info.row.original;
					return (
						<span>
							{style_count_rank} / {style_count}
						</span>
					);
				},
			},
			{
				accessorKey: 'style',
				header: 'Style',
				width: 'w-40',
				// enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'color',
				header: 'Color',
				width: 'w-40',
				// enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'size',
				header: 'Size (CM)',
				width: 'w-24',
				// enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'quantity',
				header: (
					<span>
						Quantity <br /> (PCS)
					</span>
				),
				width: 'w-24',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'order_status',
				header: 'Order Status',
				enableColumnFilter: false,
				cell: (info) => <OrderStatus value={info.getValue()} />,
			},
			{
				accessorKey: 'dying_and_iron_prod',
				header: (
					<span>
						Tape <br /> Required
					</span>
				),
				enableColumnFilter: false,
				cell: (info) => {
					const {
						item_name,
						stopper_type,
						zipper_number,
						end_type,
						zipper_size,
						quantity,
					} = info.row.original;
					return `${info.getValue()} / ${Need({
						item: item_name,
						stopper_type: stopper_type,
						zipper_number: zipper_number,
						end_type: end_type,
						size: zipper_size,
						pcs: quantity,
					})}`;
				},
			},
			{
				accessorKey: 'remaining',
				header: 'Remaining',
				enableColumnFilter: false,
				cell: (info) => {
					const {
						item_name,
						stopper_type,
						zipper_number,
						end_type,
						zipper_size,
						quantity,
						dying_and_iron_prod,
					} = info.row.original;
					return (
						Need({
							item: item_name,
							stopper_type: stopper_type,
							zipper_number: zipper_number,
							end_type: end_type,
							size: zipper_size,
							pcs: quantity,
						}) - dying_and_iron_prod
					).toFixed(3);
				},
			},
			{
				accessorKey: 'factory_priority', // use break in priority
				header: (
					<span>
						Priority
						<br />
						(M/F)
					</span>
				),
				enableColumnFilter: false,
				cell: (info) => {
					const { factory_priority, marketing_priority } =
						info.row.original;
					return (
						<span>
							{marketing_priority || '-'} /{' '}
							{factory_priority || '-'}
						</span>
					);
				},
			},
			{
				accessorKey: 'factory_priority_action',
				header: 'F.Priority',
				enableColumnFilter: false,
				hidden: !haveAccess.includes('click_factory_priority'),
				cell: (info) => (
					<Transfer
						onClick={() => handelFactoryPriority(info.row.index)}
					/>
				),
			},
			{
				accessorKey: 'remarks',
				header: 'Remarks',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
		],
		[order]
	);

	// Fetching data from server
	useEffect(() => {
		useFetchFunc(info.getFetchUrl(), setOrder, setLoading, setError);
	}, []);

	// Update
	const [updateOrder, setUpdateOrder] = useState({
		id: null,
		order_number: null,
		order_description_uuid: null,
	});
	const handelFactoryPriority = (idx) => {
		const selectedOrder = order[idx];
		setUpdateOrder((prev) => ({
			...prev,
			...selectedOrder,
		}));
		window['FactoryPriorityModal'].showModal();
	};

	if (loading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<div className=''>
			<ReactTable
				title={info.getTitle()}
				data={order}
				columns={columns}
				// handelAdd={handelAdd}
			/>
			<Suspense>
				<AddOrUpdate
					modalId='FactoryPriorityModal'
					{...{
						setOrder,
						updateOrder,
						setUpdateOrder,
					}}
				/>
			</Suspense>
		</div>
	);
}
