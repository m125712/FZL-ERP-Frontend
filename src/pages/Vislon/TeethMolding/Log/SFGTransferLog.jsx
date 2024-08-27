import { Suspense } from '@/components/Feedback';
import { DeleteModal } from '@/components/Modal';
import ReactTable from '@/components/Table';
import { useAccess, useFetchFunc } from '@/hooks';

import { DateTime, EditDelete, LinkWithCopy } from '@/ui';
import PageInfo from '@/util/PageInfo';
import { lazy, useEffect, useMemo, useState } from 'react';
import SFGAddOrUpdate from './SFGAddOrUpdate';

export default function Index() {
	const info = new PageInfo(
		'SFG Teeth Molding Transfer Log',
		'sfg/trx/by/teeth_molding_prod/by/vislon'
	);
	const [teethMoldingLog, setTeethMoldingLog] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const haveAccess = useAccess('vislon__teeth_molding_log');

	// section	tape_or_coil_stock_id	quantity	wastage	issued_by

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
				accessorKey: 'order_description',
				header: 'Style / Color / Size',
				enableColumnFilter: false,
				cell: (info) => (
					<span className='capitalize'>{info.getValue()}</span>
				),
			},
			// {
			// 	accessorKey: "trx_from",
			// 	header: "Transferred From",
			// 	enableColumnFilter: false,
			// 	cell: (info) => (
			// 	info.getValue()
			// ),
			// },
			{
				accessorKey: 'trx_to',
				header: 'Transferred To',
				enableColumnFilter: false,
				cell: (info) => {
					// remove underscore and capitalize
					const str = info.getValue();
					if (str) {
						const newStr = str.split('_').join(' ');
						return newStr.charAt(0).toUpperCase() + newStr.slice(1);
					} else {
						return str;
					}
				},
			},
			{
				accessorKey: 'trx_quantity',
				header: (
					<span>
						Transferred
						<br />
						QTY (PCS)
					</span>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'issued_by_name',
				header: 'Issued By',
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
				accessorKey: 'created_at',
				header: 'Created',
				filterFn: 'isWithinRange',
				enableColumnFilter: false,
				width: 'w-24',
				cell: (info) => {
					return <DateTime date={info.getValue()} />;
				},
			},
			{
				accessorKey: 'updated_at',
				header: 'Updated',
				enableColumnFilter: false,
				width: 'w-24',
				cell: (info) => {
					return <DateTime date={info.getValue()} />;
				},
			},
			{
				accessorKey: 'actions',
				header: 'Actions',
				enableColumnFilter: false,
				enableSorting: false,
				hidden: !haveAccess.includes('click_update_sfg'),
				width: 'w-24',
				cell: (info) => {
					return (
						<EditDelete
							idx={info.row.index}
							handelUpdate={handelUpdate}
							handelDelete={handelDelete}
							showDelete={haveAccess.includes('click_delete_sfg')}
						/>
					);
				},
			},
		],
		[teethMoldingLog]
	);

	// Fetching data from server
	useEffect(() => {
		useFetchFunc(
			info.getFetchUrl(),
			setTeethMoldingLog,
			setLoading,
			setError
		);
	}, []);

	// Update
	const [updateTeethMoldingLog, setUpdateTeethMoldingLog] = useState({
		id: null,
		trx_from: null,
		trx_to: null,
		trx_quantity: null,
		order_description: null,
		order_quantity: null,
		teeth_molding_prod: null,
		teeth_coloring_stock: null,
		order_entry_id: null,
	});

	const handelUpdate = (idx) => {
		const selected = teethMoldingLog[idx];
		setUpdateTeethMoldingLog((prev) => ({
			...prev,
			...selected,
		}));
		window[info.getAddOrUpdateModalId()].showModal();
	};

	// Delete
	const [deleteItem, setDeleteItem] = useState({
		itemId: null,
		itemName: null,
	});
	const handelDelete = (idx) => {
		setDeleteItem((prev) => ({
			...prev,
			itemId: teethMoldingLog[idx].id,
			itemName: teethMoldingLog[idx].order_description,
		}));

		window[info.getDeleteModalId()].showModal();
	};

	if (loading)
		return <span className='loading loading-dots loading-lg z-50' />;
	// if (error) return <h1>Error:{error}</h1>;

	return (
		<div className=''>
			<ReactTable
				title={info.getTitle()}
				// handelAdd={handelAdd}
				accessor={haveAccess.includes('click_update_sfg')}
				data={teethMoldingLog}
				columns={columns}
				extraClass='py-2'
			/>
			<Suspense>
				<SFGAddOrUpdate
					modalId={info.getAddOrUpdateModalId()}
					{...{
						setTeethMoldingLog,
						updateTeethMoldingLog,
						setUpdateTeethMoldingLog,
					}}
				/>
			</Suspense>
			<Suspense>
				<DeleteModal
					modalId={info.getDeleteModalId()}
					title={info.getTitle()}
					deleteItem={deleteItem}
					setDeleteItem={setDeleteItem}
					setItems={setTeethMoldingLog}
					uri={`/sfg/trx`}
				/>
			</Suspense>
		</div>
	);
}
