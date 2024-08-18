// const info = new PageInfo(
// 	'Finishing RM Stock',
// 	'/material/stock/by/field-names/m_gapping,m_teeth_cleaning,m_sealing,m_stopper',
// 	'metal__finishing_rm'
// );
import { Suspense } from '@/components/Feedback';
import ReactTable from '@/components/Table';
import { useAccess } from '@/hooks';
import { useMetalFinishingRM } from '@/state/Metal';
import { EditDelete, Transfer } from '@/ui';
import PageInfo from '@/util/PageInfo';
import { lazy, useEffect, useMemo, useState } from 'react';

const AddOrUpdate = lazy(() => import('./AddOrUpdate'));

export default function Index() {
	const { data, isLoading, url } = useMetalFinishingRM();
	const info = new PageInfo('Finishing RM Stock', url, 'metal__finishing_rm');
	const haveAccess = useAccess(info.getTab());

	console.log(data);
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
				accessorKey: 'm_gapping',
				header: 'Gapping',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},

			{
				accessorKey: 'm_teeth_cleaning',
				header: 'T Cleaning',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'm_sealing',
				header: 'Sealing',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},

			{
				accessorKey: 'm_stopper',
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
			stock: data[idx].m_gapping
				? data[idx].m_gapping
				: data[idx].m_teeth_cleaning
					? data[idx].m_teeth_cleaning
					: data[idx].m_sealing
						? data[idx].m_sealing
						: data[idx].m_stopper,
			section: data[idx].m_gapping
				? 'm_gapping'
				: data[idx].m_teeth_cleaning
					? 'm_teeth_cleaning'
					: data[idx].m_sealing
						? 'm_sealing'
						: 'm_stopper',
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
