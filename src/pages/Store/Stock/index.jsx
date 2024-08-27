import { Suspense } from '@/components/Feedback';
import ReactTable from '@/components/Table';
import { useAccess, useFetchFunc } from '@/hooks';
import { LinkWithCopy, Transfer } from '@/ui';
import PageInfo from '@/util/PageInfo';
import { lazy, useEffect, useMemo, useState } from 'react';

const AddOrUpdate = lazy(() => import('./AddOrUpdate'));
const AddOrUpdateAgainstOrder = lazy(() => import('./AgainstOrderTransfer'));

export default function Index() {
	const info = new PageInfo(
		'Stock Full',
		'material/stock',
		'store__stock_full'
	);
	const [materialStock, setMaterialStock] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const haveAccess = useAccess('store__stock_full');

	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	const columns = useMemo(
		() => [
			{
				accessorKey: 'name',
				header: 'Name',
				enableColumnFilter: false,
				cell: (info) => (
					<LinkWithCopy
						title={info.getValue()}
						id={info.row.original.id}
						uri='/material'
					/>
				),
			},
			{
				accessorKey: 'stock',
				header: 'Stock',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'unit',
				header: 'Unit',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'action_trx',
				header: 'Action',
				enableColumnFilter: false,
				enableSorting: false,
				hidden: !haveAccess.includes('click_action'),
				width: 'w-24',
				cell: (info) =>
					info.row.original.stock > 0 && (
						<Transfer onClick={() => handleTrx(info.row.index)} />
					),
			},
			{
				accessorKey: 'action_trx_against_order',
				header: 'Trx Against Order',
				enableColumnFilter: false,
				enableSorting: false,
				hidden: !haveAccess.includes('click_trx_against_order'),
				width: 'w-24',
				cell: (info) =>
					info.row.original.stock > 0 && (
						<Transfer
							onClick={() =>
								handleTrxAgainstOrder(info.row.index)
							}
						/>
					),
			},

			{
				accessorKey: 'tape_making',
				header: 'Tape Making',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'coil_forming',
				header: 'Coil Forming',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'dying_and_iron',
				header: 'Dying & Iron',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'm_gapping',
				header: 'Metal Gapping',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'v_gapping',
				header: 'Vislon Gapping',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'v_teeth_molding',
				header: 'Vislon Teeth Molding',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'm_teeth_molding',
				header: 'Metal Teeth Molding',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'teeth_assembling_and_polishing',
				header: 'Teeth Assembling & Polishing',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'm_teeth_cleaning',
				header: 'Metal Teeth Cleaning',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'v_teeth_cleaning',
				header: 'Vislon Teeth Cleaning',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'plating_and_iron',
				header: 'Plating & Iron',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'm_sealing',
				header: 'Metal Sealing',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'v_sealing',
				header: 'Vislon Sealing',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'n_t_cutting',
				header: 'Nylon T Cutting',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'v_t_cutting',
				header: 'Vislon T Cutting',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'm_stopper',
				header: 'Metal Stopper',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'v_stopper',
				header: 'Vislon Stopper',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'n_stopper',
				header: 'Nylon Stopper',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'cutting',
				header: 'Cutting',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'qc_and_packing',
				header: 'QC & Packing',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'die_casting',
				header: 'Die Casting',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'slider_assembly',
				header: 'Slider Assembly',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'coloring',
				header: 'Coloring',
				enableColumnFilter: false,
			},
			{
				accessorKey: 'remarks',
				header: 'Remarks',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
		],
		[materialStock]
	);

	// Fetching data from server
	useEffect(() => {
		useFetchFunc(
			info.getFetchUrl(),
			setMaterialStock,
			setLoading,
			setError
		);
	}, []);

	const [updateMaterialStock, setUpdateMaterialStock] = useState({
		id: null,
		name: null,
		stock: null,
	});

	const handleTrx = (index) => {
		const selectedItem = materialStock[index];
		setUpdateMaterialStock((prev) => ({
			...prev,
			...selectedItem,
		}));
		window[info.getAddOrUpdateModalId()].showModal();
	};

	const handleTrxAgainstOrder = (index) => {
		const selectedItem = materialStock[index];
		setUpdateMaterialStock((prev) => ({
			...prev,
			...selectedItem,
		}));
		window['MaterialTrxAgainstOrder'].showModal();
	};

	if (loading)
		return <span className='loading loading-dots loading-lg z-50' />;
	// if (error) return <h1>Error:{error}</h1>;

	return (
		<div className=''>
			<ReactTable
				title={info.getTitle()}
				// handelAdd={handelAdd}
				data={materialStock}
				columns={columns}
				extraClass='py-2'
			/>

			<Suspense>
				<AddOrUpdate
					modalId={info.getAddOrUpdateModalId()}
					{...{
						setMaterialStock,
						updateMaterialStock,
						setUpdateMaterialStock,
					}}
				/>
			</Suspense>
			<Suspense>
				<AddOrUpdateAgainstOrder
					modalId={'MaterialTrxAgainstOrder'}
					{...{
						setMaterialStock,
						updateMaterialStock,
						setUpdateMaterialStock,
					}}
				/>
			</Suspense>
		</div>
	);
}
