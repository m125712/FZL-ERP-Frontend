import { lazy, useEffect, useMemo, useState } from 'react';
import { useNylonMetallicFinishingRM } from '@/state/Nylon';
import { useAccess } from '@/hooks';

import { Suspense } from '@/components/Feedback';
import ReactTable from '@/components/Table';
import { EditDelete, Transfer } from '@/ui';

import PageInfo from '@/util/PageInfo';

const AddOrUpdate = lazy(() => import('./AddOrUpdate'));

export default function Index() {
	const { data, isLoading, url } = useNylonMetallicFinishingRM();
	const info = new PageInfo(
		'Finishing RM Stock',
		url,
		'nylon__plastic_finishing_rm'
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
				accessorKey: 'n_t_cutting',
				header: 'T Cutting',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'n_stopper',
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
			stock: data[idx].n_t_cutting
				? data[idx].n_t_cutting
				: data[idx].n_stopper,
			section: data[idx].n_t_cutting ? 'n_t_cutting' : 'n_stopper',
		}));
		window[info.getAddOrUpdateModalId()].showModal();
	};

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;
	// if (error) return <h1>Error:{error}</h1>;

	return (
		<div>
			<ReactTable title={info.getTitle()} data={data} columns={columns} />
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
