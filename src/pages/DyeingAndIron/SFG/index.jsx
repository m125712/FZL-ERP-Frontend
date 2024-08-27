import { Suspense } from '@/components/Feedback';
import ReactTable from '@/components/Table';
import { useAccess, useFetchFunc } from '@/hooks';
import { LinkWithCopy, Transfer } from '@/ui';
import PageInfo from '@/util/PageInfo';
import { lazy, useEffect, useMemo, useState } from 'react';

const Production = lazy(() => import('./Production'));
const Transaction = lazy(() => import('./Transaction'));

export default function Index() {
	const info = new PageInfo(
		'Dyeing SFG Stock',
		'sfg/by/dying_and_iron_prod',
		'dyeing__dyeing_and_iron_sfg'
	);
	const haveAccess = useAccess('dyeing__dyeing_and_iron_sfg');

	const [dyeingAndIronProd, setDyeingAndIronProd] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		document.title = info.getTabName();
		useFetchFunc(
			info.getFetchUrl(),
			setDyeingAndIronProd,
			setLoading,
			setError
		);
	}, []);

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
					const { order_description_uuid, order_number } =
						info.row.original;
					return (
						<LinkWithCopy
							title={info.getValue()}
							id={order_description_uuid}
							uri={`/order/details/${order_number}`}
						/>
					);
				},
			},
			{
				accessorKey: 'order_description',
				header: 'Style / Color / Size',
				enableColumnFilter: false,
				width: 'w-48',
				cell: (info) => (
					<span className='capitalize'>{info.getValue()}</span>
				),
			},
			{
				accessorKey: 'stopper_type_name',
				header: 'Stopper',
				enableColumnFilter: false,
				cell: (info) => {
					const { item_name, stopper_type_name } = info.row.original;
					if (item_name === 'nylon')
						return (
							<span className='capitalize'>
								{stopper_type_name}
							</span>
						);
					return '-';
				},
			},
			{
				accessorKey: 'dying_and_iron_stock',
				header: (
					<span>
						Stock <br /> (KG)
					</span>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'action_production',
				header: '',
				enableColumnFilter: false,
				enableSorting: false,
				hidden: !haveAccess.includes('click_production'),
				width: 'w-24',
				cell: (info) => {
					const { dying_and_iron_stock } = info.row.original;
					return (
						dying_and_iron_stock > 0 && (
							<Transfer
								onClick={() => handelProduction(info.row.index)}
							/>
						)
					);
				},
			},
			{
				accessorKey: 'dying_and_iron_prod',
				header: (
					<span>
						Production <br /> (KG)
					</span>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'action_transaction',
				header: '',
				enableColumnFilter: false,
				enableSorting: false,
				hidden: !haveAccess.includes('click_transaction'),
				width: 'w-24',
				cell: (info) => {
					const { dying_and_iron_prod } = info.row.original;
					return (
						dying_and_iron_prod > 0 && (
							<Transfer
								onClick={() =>
									handelTransaction(info.row.index)
								}
							/>
						)
					);
				},
			},
			{
				accessorKey: 'total_trx_quantity',
				header: (
					<span>
						Total Transaction
						<br />
						(KG)
					</span>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'remarks',
				header: 'Remarks',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
		],
		[dyeingAndIronProd]
	);

	const [updateDyeingAndIronProd, setUpdateDyeingAndIronProd] = useState({
		id: null,
		dying_and_iron_stock: null,
		dying_and_iron_prod: null,
		order_entry_id: null,
		total_trx_quantity: null,
		order_number: null,
		order_description: '',
		item_description: '',
		item_name: '',
	});

	const handelProduction = (idx) => {
		const selectedProd = dyeingAndIronProd[idx];
		setUpdateDyeingAndIronProd((prev) => ({
			...prev,
			...selectedProd,
		}));
		window['DyeingAndIronProdModal'].showModal();
	};

	const handelTransaction = (idx) => {
		const selectedTrx = dyeingAndIronProd[idx];
		setUpdateDyeingAndIronProd((prev) => ({
			...prev,
			...selectedTrx,
		}));
		window['DyeingAndIronTrxModal'].showModal();
	};

	if (loading)
		return <span className='loading loading-dots loading-lg z-50' />;
	// if (error) return <h1>Error:{error}</h1>;

	return (
		<div className=''>
			<ReactTable
				title={info.getTitle()}
				data={dyeingAndIronProd}
				columns={columns}
				extraClass='py-2'
			/>
			<Suspense>
				<Production
					modalId='DyeingAndIronProdModal'
					{...{
						setDyeingAndIronProd,
						updateDyeingAndIronProd,
						setUpdateDyeingAndIronProd,
					}}
				/>
			</Suspense>
			<Suspense>
				<Transaction
					modalId='DyeingAndIronTrxModal'
					{...{
						setDyeingAndIronProd,
						updateDyeingAndIronProd,
						setUpdateDyeingAndIronProd,
					}}
				/>
			</Suspense>
		</div>
	);
}
