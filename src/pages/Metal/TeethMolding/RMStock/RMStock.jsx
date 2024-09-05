import { Suspense } from '@/components/Feedback';
import ReactTable from '@/components/Table';
import { useAccess } from '@/hooks';

import { useMetalTMRM } from '@/state/Metal';
import { EditDelete, Transfer } from '@/ui';
import PageInfo from '@/util/PageInfo';
import { lazy, useEffect, useMemo, useState } from 'react';

const AddOrUpdate = lazy(() => import('./AddOrUpdate'));

export default function Index() {
	const { data, isLoading, url } = useMetalTMRM();

	const info = new PageInfo(
		'Teeth Molding RM Stock',
		url,
		'metal__teeth_molding_rm'
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
				accessorKey: 'm_teeth_molding',
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

	const [updateMetalTMStock, setUpdateMetalTMStock] = useState({
		uuid: null,
		unit: null,
		m_teeth_molding: null,
	});

	const handelUpdate = (idx) => {
		setUpdateMetalTMStock((prem) => ({
			...prem,
			uuid: data[idx].uuid,
			unit: data[idx].unit,
			m_teeth_molding: data[idx].m_teeth_molding,
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
						updateMetalTMStock,
						setUpdateMetalTMStock,
					}}
				/>
			</Suspense>
		</div>
	);
}
