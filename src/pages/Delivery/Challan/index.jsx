import ReactTable from '@/components/Table';
import { useAccess, useFetch, useFetchFunc, useUpdateFunc } from '@/hooks';
import { DateTime, EditDelete, LinkWithCopy, StatusButton } from '@/ui';
import GetDateTime from '@/util/GetDateTime';
import PageInfo from '@/util/PageInfo';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Index() {
	const navigate = useNavigate();
	const info = new PageInfo(
		'Challan',
		'challan-details',
		'delivery__challan'
	);
	const haveAccess = useAccess('delivery__challan');
	const [challan, setChallan] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const [deliveryUser, setDeliveryUser] = useState();

	useEffect(() => {
		document.title = info.getTabName();
		useFetchFunc(info.getFetchUrl(), setChallan, setLoading, setError);
		useFetchFunc(
			'/delivery-user/value/label',
			setDeliveryUser,
			setLoading,
			setError
		);
	}, []);

	const columns = useMemo(
		() => [
			{
				accessorKey: 'challan_number',
				header: 'Challan ID',
				cell: (info) => {
					return (
						<LinkWithCopy
							title={info.getValue()}
							id={info.getValue()}
							uri='details'
						/>
					);
				},
			},
			{
				accessorKey: 'order_number',
				header: 'O/N',
				cell: (info) => (
					<LinkWithCopy
						title={info.getValue()}
						id={info.getValue()}
						uri='/order/details'
					/>
				),
			},
			{
				accessorKey: 'carton_quantity',
				header: (
					<span>
						Carton QTY
						<br />
						(Pcs)
					</span>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'receive_status',
				header: 'Received',
				enableColumnFilter: false,
				hidden: !haveAccess.includes('click_receive_status'),
				cell: (info) => {
					return (
						info.row.original.assigned_to && (
							<StatusButton
								size='btn-sm'
								value={info.getValue()}
								onClick={() =>
									handelReceiveStatus(info.row.index)
								}
							/>
						)
					);
				},
			},
			{
				accessorKey: 'assigned_to',
				header: 'Assign',
				enableColumnFilter: false,
				cell: (info) => {
					if (loading) {
						return <span className='loading loading-dots' />;
					} else {
						return (
							<select
								className='select select-bordered select-primary select-sm'
								name='challan_assign'
								defaultValue={info.getValue()}
								onChange={(e) =>
									handleAssign(e, info.row.index)
								}>
								<option>--</option>
								{deliveryUser?.map((item) => (
									<option
										key={item?.value}
										value={item?.value}>
										{item?.label}
									</option>
								))}
							</select>
						);
					}
				},
			},
			{
				accessorKey: 'created_at',
				header: 'Created',
				enableColumnFilter: false,
				cell: (info) => {
					return <DateTime date={info.getValue()} />;
				},
			},
			{
				accessorKey: 'updated_at',
				header: 'Updated',
				enableColumnFilter: false,
				cell: (info) => {
					return <DateTime date={info.getValue()} />;
				},
			},
			{
				accessorKey: 'remarks',
				header: 'Remarks',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'actions',
				header: 'Actions',
				enableColumnFilter: false,
				enableSorting: false,
				hidden: !haveAccess.includes('update'),
				width: 'w-24',
				cell: (info) => {
					return (
						<EditDelete
							idx={info.row.index}
							handelUpdate={handelUpdate}
							showDelete={false}
						/>
					);
				},
			},
		],
		[challan]
	);

	const handelAdd = () => navigate('/delivery/challan/entry');

	const handelUpdate = (idx) =>
		navigate(
			`/delivery/challan/update/${challan[idx].challan_number}/${challan[idx].challan_uuid}`
		);

	const handleAssign = async (e, idx) => {
		const updatedData = {
			id: challan[idx].id,
			assigned_to: parseInt(e.currentTarget.value),
			updated_at: GetDateTime(),
		};

		console.log(updatedData);

		await useUpdateFunc({
			// replace space, #, other special characters in style
			uri: `/challan/assign-user/${updatedData?.id}/${updatedData?.assigned_to}/${updatedData?.updated_at}/${challan[idx]?.challan_number}`,
			itemId: updatedData?.id,
			data: challan[idx],
			updatedData: updatedData,
			setItems: setChallan((prev) => {
				prev[idx] = {
					...prev[idx],
					...updatedData,
				};
				return [...prev];
			}),
		});
	};

	const handelReceiveStatus = async (idx) => {
		const challan_info = challan[idx];
		const receive_status = challan_info?.receive_status == 1 ? 0 : 1;
		const updated_at = GetDateTime();

		await useUpdateFunc({
			uri: `/challan/receive-status/${challan_info?.id}/${receive_status}/${updated_at}/${challan_info?.id}`,
			data: challan_info,
			itemId: challan_info?.id,
			updatedData: { receive_status, updated_at },
			setItems: setChallan,
		});
	};

	if (loading)
		return <span className='loading loading-dots loading-lg z-50' />;
	// if (error) return <h1>Error:{error}</h1>;

	return (
		<div className=''>
			<ReactTable
				title={info.getTitle()}
				data={challan}
				columns={columns}
				accessor={haveAccess.includes('create')}
				handelAdd={handelAdd}
			/>
		</div>
	);
}
