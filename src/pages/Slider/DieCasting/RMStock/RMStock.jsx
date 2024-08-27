import { Suspense } from '@/components/Feedback';
import ReactTable from '@/components/Table';
import { useAccess } from '@/hooks';

import { useSliderDieCastingRM } from '@/state/Slider';
import { EditDelete, Transfer } from '@/ui';
import PageInfo from '@/util/PageInfo';
import { lazy, useEffect, useMemo, useState } from 'react';

const AddOrUpdate = lazy(() => import('./AddOrUpdate'));

export default function Index() {
	const { data, isLoading, url } = useSliderDieCastingRM();

	const info = new PageInfo(
		'Die Casting RM Stock',
		url,
		'slider__die_casting_rm'
	);
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
				accessorKey: 'die_casting',
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

	const [updateSliderDieCastingStock, setUpdateSliderDieCastingStock] =
		useState({
			uuid: null,
			unit: null,
			die_casting: null,
		});

	const handelUpdate = (idx) => {
		setUpdateSliderDieCastingStock((prem) => ({
			...prem,
			uuid: data[idx].uuid,
			unit: data[idx].unit,
			die_casting: data[idx].die_casting,
		}));
		window[info.getAddOrUpdateModalId()].showModal();
	};

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;
	// if (error) return <h1>Error:{error}</h1>;

	return (
		<div>
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
						updateSliderDieCastingStock,
						setUpdateSliderDieCastingStock,
					}}
				/>
			</Suspense>
		</div>
	);
}
