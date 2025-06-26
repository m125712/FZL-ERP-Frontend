import { useEffect, useMemo, useState } from 'react';
import { useLabDipInfo } from '@/state/LabDip';
import { useNavigate } from 'react-router';
import { useAccess } from '@/hooks';

import ReactTable from '@/components/Table';
import {
	CustomLink,
	DateTime,
	EditDelete,
	LinkWithCopy,
	Status,
	StatusSelect,
} from '@/ui';

import { cn } from '@/lib/utils';
import PageInfo from '@/util/PageInfo';

const options = [
	{ value: 'zipper_sample', label: 'Zipper Sample' },
	{ value: 'zipper_bulk', label: 'Zipper Bulk' },
	{ value: 'thread_sample', label: 'Thread Sample' },
	{ value: 'thread_bulk', label: 'Thread Bulk' },
];

export default function Index() {
	const [status, setStatus] = useState('zipper_sample');

	const { data, isLoading, url } = useLabDipInfo(status);
	const navigate = useNavigate();
	const info = new PageInfo('Lab Dip/Card', url, 'lab_dip__info');
	const haveAccess = useAccess('lab_dip__info');

	const columns = useMemo(
		() => [
			{
				accessorKey: 'info_id',
				header: 'ID',
				width: 'w-40',
				cell: (info) => {
					const { uuid } = info.row.original;
					return (
						<LinkWithCopy
							title={info.getValue()}
							id={uuid}
							uri='/lab-dip/info/details'
						/>
					);
				},
			},
			{
				accessorKey: 'order_number',
				header: 'Order ID',
				width: 'w-40',
				cell: (info) => {
					const { order_number, is_thread_order, order_info_uuid } =
						info.row.original;

					return !is_thread_order ? (
						<LinkWithCopy
							title={info.getValue()}
							id={order_number}
							uri='/order/details'
						/>
					) : (
						<LinkWithCopy
							title={info.getValue()}
							id={order_info_uuid}
							uri='/thread/order-info'
						/>
					);
				},
			},
			{
				accessorKey: 'name',
				header: 'Color',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'color_ref',
				header: 'Color Ref',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			// {
			// 	accessorFn: (row) => {
			// 		return row.recipe_array
			// 			?.map((item) => item.recipe_name)
			// 			.join(', ');
			// 	},
			// 	id: 'recipe_array',
			// 	header: 'Recipe',
			// 	enableColumnFilter: false,
			// 	cell: ({ row }) => {
			// 		const { recipe_array } = row.original;

			// 		if (!recipe_array?.length) return '--';

			// 		return recipe_array?.map((item) => {
			// 			return (
			// 				<div
			// 					key={item.recipe_name}
			// 					className='flex flex-col border-b-2 border-primary/50 p-1 last:border-0'>
			// 					<CustomLink
			// 						label={item.recipe_name}
			// 						url={`/lab-dip/recipe/details/${item.recipe_uuid}`}
			// 						openInNewTab={true}
			// 					/>
			// 					<div className='flex items-center gap-2'>
			// 						Approved
			// 						<span
			// 							className={cn(
			// 								'badge badge-error badge-xs',
			// 								item.approved === 1 && 'bg-success'
			// 							)}
			// 						/>
			// 					</div>
			// 					<div className='flex items-center gap-2'>
			// 						Mkt Approved
			// 						<span
			// 							className={cn(
			// 								'badge badge-error badge-xs',
			// 								item.marketing_approved === 1 &&
			// 									'bg-success'
			// 							)}
			// 						/>
			// 					</div>
			// 				</div>
			// 			);
			// 		});
			// 	},
			// },
			{
				accessorFn: (row) => {
					return row.recipe_array
						?.map((item) => item.recipe_name)
						.join(', ');
				},
				id: 'recipe_array',
				header: 'Recipe',
				enableColumnFilter: false,
				cell: ({ row }) => {
					const { recipe_array } = row.original;

					if (!recipe_array?.length) return '--';

					return (
						<table className='table table-xs border-0 align-top'>
							<thead>
								<tr className='text-xs text-gray-600'>
									<th className={cn(rowStyle)}>RC/N</th>
									<th className={cn(rowStyle)}>PP</th>
									<th className={cn(rowStyle)}>BULK</th>
								</tr>
							</thead>
							<tbody>
								{recipe_array?.map((item) => (
									<tr key={item.recipe_name}>
										<td className={cn(rowStyle)}>
											<CustomLink
												label={item.recipe_name}
												url={`/lab-dip/recipe/details/${item.recipe_uuid}`}
												showCopyButton={false}
												openInNewTab
											/>
										</td>
										<td className={cn(rowStyle)}>
											<Status
												status={item.is_pps_req === 1}
											/>
										</td>
										<td className={cn(rowStyle)}>
											<Status
												status={item.approved === 1}
											/>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					);
				},
			},
			{
				accessorKey: 'buyer_name',
				header: 'Buyer',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'party_name',
				header: 'Party',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'marketing_name',
				header: 'Marketing',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'merchandiser_name',
				header: 'Merchandiser',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},

			{
				accessorKey: 'created_by_name',
				header: 'Created By',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'created_at',
				header: 'Created',
				enableColumnFilter: false,
				filterFn: 'isWithinRange',
				cell: (info) => <DateTime date={info.getValue()} />,
			},
			{
				accessorKey: 'updated_at',
				header: 'Updated',
				enableColumnFilter: false,
				cell: (info) => <DateTime date={info.getValue()} />,
			},
			{
				accessorKey: 'remarks',
				header: 'Remarks',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'action',
				header: 'Action',
				enableColumnFilter: false,
				hidden: !haveAccess.includes('update'),
				width: 'w-24',
				cell: (info) => {
					return (
						<EditDelete
							idx={info.row.index}
							handelUpdate={handelUpdate}
							showEdit={haveAccess.includes('update')}
							showDelete={false}
						/>
					);
				},
			},
		],
		[data]
	);

	// Fetching data from server
	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	// Add
	const handelAdd = () => navigate('/lab-dip/info/entry');

	// Update
	const handelUpdate = (idx) => {
		const { uuid, info_id } = data[idx];

		navigate(`/lab-dip/info/${info_id}/${uuid}/update`);
	};

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	let rowStyle = 'border border-gray-300 px-2 py-1';

	return (
		<div>
			<ReactTable
				title={info.getTitle()}
				accessor={haveAccess.includes('create')}
				data={data}
				columns={columns}
				handelAdd={handelAdd}
				extraButton={
					<StatusSelect
						status={status}
						setStatus={setStatus}
						options={options}
					/>
				}
			/>
		</div>
	);
}
