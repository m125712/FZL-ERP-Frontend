import { Suspense } from '@/components/Feedback';
import ReactTable from '@/components/Table';
import { useAccess } from '@/hooks';
import { useLabDipRecipe } from '@/state/LabDip';
import { EditDelete, LinkWithCopy, StatusButton, UserName } from '@/ui';
import PageInfo from '@/util/PageInfo';
import { lazy, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Index() {
	const { data, isLoading, isError, url } = useLabDipRecipe();
	const navigate = useNavigate();
	const info = new PageInfo('Lab Dip/Recipe', url, 'lab_dip__recipe');
	const haveAccess = useAccess('lab_dip__recipe');

	const columns = useMemo(
		() => [
			{
				accessorKey: 'id',
				header: 'ID',
				width: 'w-12',
				cell: (info) => {
					return (
						<LinkWithCopy
							title={info.getValue()}
							id={info.getValue()}
							uri='/order/details'
						/>
					);
				},
			},
			{
				accessorKey: 'recipe_name',
				header: 'Recipe Name',
				enableColumnFilter: false,
				width: 'w-12',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'item_description',
				header: 'Item Description',
				enableColumnFilter: false,
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
				accessorKey: 'production_percentage',
				header: 'Progress',
				enableColumnFilter: false,
				cell: (info) => <Progress value={info.getValue() || 0} />,
			},
			{
				accessorKey: 'marketing_name',
				header: 'Marketing',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'buyer_name',
				header: 'Buyer',
				width: 'w-20',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'created_by_name',
				header: 'Created By',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'remarks',
				header: 'Remarks',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'approved',
				header: 'Approved',
				enableColumnFilter: false,
				cell: (info) => (
					<StatusButton size='btn-sm' value={info.getValue()} />
				),
			},
			{
				accessorKey: 'status',
				header: 'Status',
				enableColumnFilter: false,
				cell: (info) => (
					<StatusButton size='btn-sm' value={info.getValue()} />
				),
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
	const handelAdd = () => navigate('/lab-dip/recipe/entry');

	// Update
	const handelUpdate = (idx) => {
		const { order_description_uuid, order_number } = data[idx];

		navigate(
			`/lab-dip/recipe/update/${order_number}/${order_description_uuid}`
		);
	};

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<div className='container mx-auto px-2 md:px-4'>
			<ReactTable
				title={info.getTitle()}
				accessor={haveAccess.includes('create')}
				data={data}
				columns={columns}
				handelAdd={handelAdd}
				extraClass='py-2'
			/>
		</div>
	);
}
