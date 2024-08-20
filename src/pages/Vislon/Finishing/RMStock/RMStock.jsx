import { Suspense } from '@/components/Feedback';
import ReactTable from '@/components/Table';
import { useAccess } from '@/hooks';
import { useVislonFinishingRM } from '@/state/Vislon';
import { EditDelete, Transfer } from '@/ui';
import PageInfo from '@/util/PageInfo';
import { lazy, useEffect, useMemo, useState } from 'react';

const AddOrUpdate = lazy(() => import('./AddOrUpdate'));

export default function Index() {
	const { data, isLoading, url } = useVislonFinishingRM();
	const info = new PageInfo(
		'Finishing RM Stock',
		url,
		'vislon__finishing_rm'
	);
	const haveAccess = useAccess(info.getTab());

	
	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	const columns = useMemo(
		() => [
			{
				accessorKey: 'material_name',
				header: 'Material Name',
				enableColumnFilter: false,
				cell: (info) => (
					<span className='capitalize'>{info.getValue()}</span>
				),
			},
			{
				accessorKey: 'v_gapping',
				header: 'Gapping',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},

			{
				accessorKey: 'v_teeth_cleaning',
				header: 'T Cleaning',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'v_sealing',
				header: 'Sealing',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'v_t_cutting',
				header: 'T Cutting',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'v_stopper',
				header: 'Stopper',
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
				accessorKey: 'remarks',
				header: 'Remarks',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'action',
				header: 'Used',
				enableColumnFilter: false,
				enableSorting: false,
				hidden: !haveAccess.includes('click_used'),
				width: 'w-24',
				cell: (info) => (
					<Transfer onClick={() => handelUpdate(info.row.index)} />
				),
			},
		],
		[data]
	);

	const [updateFinishingStock, setUpdateFinishingStock] = useState({
		uuid: null,
		unit: null,
		stock: null,
	});

	const handelUpdate = (idx) => {
		setUpdateFinishingStock((prev) => ({
			...prev,
			uuid: data[idx].uuid,
			unit: data[idx].unit,
			stock: data[idx].v_gapping
				? data[idx].v_gapping
				: data[idx].v_teeth_cleaning
					? data[idx].v_teeth_cleaning
					: data[idx].v_sealing
						? data[idx].v_sealing
						: data[idx].v_t_cutting
							? data[idx].v_t_cutting
							: data[idx].v_stopper,
			section: data[idx].v_gapping
				? 'v_gapping'
				: data[idx].v_teeth_cleaning
					? 'v_teeth_cleaning'
					: data[idx].v_sealing
						? 'v_sealing'
						: data[idx].v_t_cutting
							? 'v_t_cutting'
							: 'v_stopper',
		}));
		window[info.getAddOrUpdateModalId()].showModal();
	};

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;
	// if (error) return <h1>Error:{error}</h1>;

	return (
		<div className='container mx-auto px-2 md:px-4'>
			<ReactTable
				title={info.getTitle()}
				data={data}
				columns={columns}
				extraClass='py-2'
			/>
			<Suspense>
				<AddOrUpdate
					modalId={info.getAddOrUpdateModalId()}
					{...{
						updateFinishingStock,
						setUpdateFinishingStock,
					}}
				/>
			</Suspense>
		</div>
	);
}
