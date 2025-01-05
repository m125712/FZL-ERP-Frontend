import { lazy, useEffect, useMemo, useState } from 'react';
import { useSliderColoringRM } from '@/state/Slider';
import { useAccess } from '@/hooks';

import { Suspense } from '@/components/Feedback';
import ReactTable from '@/components/Table';
import { EditDelete, Transfer } from '@/ui';

import PageInfo from '@/util/PageInfo';

const AddOrUpdate = lazy(() => import('./AddOrUpdate'));

export default function Index() {
	const { data, isLoading, url } = useSliderColoringRM();

	const info = new PageInfo('Coloring RM Stock', url, 'slider__coloring_rm');
	const hameAccess = useAccess(info.getTab());

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
				accessorKey: 'coloring',
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
				hidden: !hameAccess.includes('click_used'),
				width: 'w-24',
				cell: (info) => (
					<Transfer onClick={() => handelUpdate(info.row.index)} />
				),
			},
		],
		[data]
	);

	const [updateSliderColoringStock, setUpdateSliderColoringStock] = useState({
		uuid: null,
		unit: null,
		coloring: null,
	});

	const handelUpdate = (idx) => {
		setUpdateSliderColoringStock((prem) => ({
			...prem,
			uuid: data[idx].uuid,
			unit: data[idx].unit,
			coloring: data[idx].coloring,
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
						updateSliderColoringStock,
						setUpdateSliderColoringStock,
					}}
				/>
			</Suspense>
		</div>
	);
}
