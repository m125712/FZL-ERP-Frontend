import { Suspense } from '@/components/Feedback';
import ReactTable from '@/components/Table';
import { useAccess, useFetchFunc, useFetchFuncForReport } from '@/hooks';
import { useCommonCoilRM } from '@/state/Common';
import { EditDelete, Transfer } from '@/ui';
import PageInfo from '@/util/PageInfo';
import { lazy, useEffect, useMemo, useState } from 'react';

const AddOrUpdate = lazy(() => import('./AddOrUpdate'));

export default function Index() {
	const { data, isLoading, url } = useCommonCoilRM();
	const info = new PageInfo('Coil Stock', url, 'common__coil_rm');
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
				accessorKey: 'coil_forming',
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
				hidden: !haveAccess.includes('click_used'),
				width: 'w-24',
				cell: (info) => (
					<Transfer onClick={() => handelUpdate(info.row.index)} />
				),
			},
		],
		[data]
	);

	const [updateCoilStock, setUpdateCoilStock] = useState({
		uuid: null,
		unit: null,
		coil_forming: null,
	});

	const handelUpdate = (idx) => {
		setUpdateCoilStock((prev) => ({
			...prev,
			uuid: data[idx].uuid,
			unit: data[idx].unit,
			coil_forming: data[idx].coil_forming,
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
						updateCoilStock,
						setUpdateCoilStock,
					}}
				/>
			</Suspense>
		</div>
	);
}
