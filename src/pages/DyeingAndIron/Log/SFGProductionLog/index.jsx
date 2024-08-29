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
		'Dyeing and Iron Production Log',
		'sfg/production/section/dying_and_iron'
	);
	const [dyeingAndIronLog, setDyeingAndIronLog] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const haveAccess = useAccess('dyeing__dyeing_and_iron_log');

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
					const { id, order_number } = info.row.original;
					return (
						<LinkWithCopy
							title={info.getValue()}
							id={id}
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
			{
				accessorKey: 'section',
				header: 'Section',
				enableColumnFilter: false,
				cell: (info) => {
					return (
						<span className='capitalize'>
							{info.getValue().replace(/_/g, ' ')}
						</span>
					);
				},
			},
			{
				accessorKey: 'production_quantity',
				header: (
					<span>
						Production
						<br />
						QTY (KG)
					</span>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'wastage',
				header: (
					<span>
						Wastage
						<br />
						QTY (KG)
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
				hidden: !haveAccess.includes('click_update_production'),
				width: 'w-24',
				cell: (info) => {
					return (
						<EditDelete
							idx={info.row.index}
							handelUpdate={handelUpdate}
							handelDelete={handelDelete}
							showDelete={haveAccess.includes(
								'click_delete_production'
							)}
						/>
					);
				},
			},
		],
		[dyeingAndIronLog]
	);

	// Fetching data from server
	useEffect(() => {
		useFetchFunc(
			info.getFetchUrl(),
			setDyeingAndIronLog,
			setLoading,
			setError
		);
	}, []);

	// Update
	const [updateDyeingAndIronLog, setUpdateDyeingAndIronLog] = useState({
		id: null,
		order_entry_id: null,
		order_description: null,
		item_description: null,
		order_number: null,
		section: null,
		production_quantity: null,
		dying_and_iron_stock: null,
		wastage: null,
	});

	const handelUpdate = (idx) => {
		const selected = dyeingAndIronLog[idx];
		setUpdateDyeingAndIronLog((prev) => ({
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
			itemId: dyeingAndIronLog[idx].id,
			itemName: dyeingAndIronLog[idx].order_description.replace(
				/[#&/_()]/g,
				''
			),
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
				data={dyeingAndIronLog}
				columns={columns}
				extraClass='py-2'
			/>
			<Suspense>
				<SFGAddOrUpdate
					modalId={info.getAddOrUpdateModalId()}
					{...{
						setDyeingAndIronLog,
						updateDyeingAndIronLog,
						setUpdateDyeingAndIronLog,
					}}
				/>
			</Suspense>
			<Suspense>
				<DeleteModal
					modalId={info.getDeleteModalId()}
					title={info.getTitle()}
					deleteItem={deleteItem}
					setDeleteItem={setDeleteItem}
					setItems={setDyeingAndIronLog}
					uri={`/sfg/production`}
				/>
			</Suspense>
		</div>
	);
}
