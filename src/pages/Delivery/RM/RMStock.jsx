import { Suspense } from '@/components/Feedback';
import ReactTable from '@/components/Table';
import { useAccess } from '@/hooks';
import { useDeliveryRM } from '@/state/Delivery';
import { EditDelete, Transfer } from '@/ui';
import PageInfo from '@/util/PageInfo';
import { lazy, useEffect, useMemo, useState } from 'react';

const AddOrUpdate = lazy(() => import('./AddOrUpdate'));

export default function Index() {
	const { data, isLoading, url } = useDeliveryRM();
	const info = new PageInfo('Delivery RM', url, 'delivery__rm');
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
				accessorKey: 'm_qc_and_packing',
				header: 'Metal',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},

			{
				accessorKey: 'n_qc_and_packing',
				header: 'Nylon',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'v_qc_and_packing',
				header: 'Vislon',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},

			{
				accessorKey: 's_qc_and_packing',
				header: 'Slider',
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
				hidden: !haveAccess.includes('used'),
				width: 'w-24',
				cell: (info) => (
					<Transfer onClick={() => handelUpdate(info.row.index)} />
				),
			},
		],
		[data]
	);

	const [updateStock, setUpdateStock] = useState({
		uuid: null,
		unit: null,
		stock: null,
	});

	const handelUpdate = (idx) => {
		setUpdateStock((prev) => ({
			...prev,
			uuid: data[idx].uuid,
			unit: data[idx].unit,
			stock: data[idx].m_qc_and_packing
				? data[idx].m_qc_and_packing
				: data[idx].n_qc_and_packing
					? data[idx].n_qc_and_packing
					: data[idx].v_qc_and_packing
						? data[idx].v_qc_and_packing
						: data[idx].s_qc_and_packing,
			section: data[idx].m_qc_and_packing
				? 'm_qc_and_packing'
				: data[idx].n_qc_and_packing
					? 'n_qc_and_packing'
					: data[idx].v_qc_and_packing
						? 'v_qc_and_packing'
						: 's_qc_and_packing',
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
						updateStock,
						setUpdateStock,
					}}
				/>
			</Suspense>
		</div>
	);
}
