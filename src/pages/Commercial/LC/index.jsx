import { useEffect, useMemo } from 'react';
import { useAuth } from '@/context/auth';
import { useCommercialLCByQuery } from '@/state/Commercial';
import { useNavigate } from 'react-router';
import { useAccess } from '@/hooks';

import ReactTable from '@/components/Table';
import ReactTableTitleOnly from '@/components/Table/ReactTableTitleOnly';
import { CustomLink, DateTime, EditDelete, StatusButton } from '@/ui';

import { cn } from '@/lib/utils';
import PageInfo from '@/util/PageInfo';

const getPath = (haveAccess, userUUID) => {
	if (haveAccess.includes('show_own_orders') && userUUID) {
		return `?own_uuid=${userUUID}`;
	}

	return ``;
};

const StatusValueLabel = ({ value, label }) => (
	<div className='flex gap-2'>
		<StatusButton size='btn-xs' value={value} />
		{label}
	</div>
);

export default function Index() {
	const navigate = useNavigate();
	const haveAccess = useAccess('commercial__lc');
	const { user } = useAuth();

	const { data, isLoading, url } = useCommercialLCByQuery(
		getPath(haveAccess, user?.uuid),
		{ enabled: !!user?.uuid }
	);

	const info = new PageInfo('LC', url, 'commercial__lc');

	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	const columns = useMemo(
		() => [
			{
				accessorKey: 'actions',
				header: 'Actions',
				enableColumnFilter: false,
				enableSorting: false,
				hidden: !haveAccess.includes('update'),
				width: 'w-24',
				cell: (info) => (
					<EditDelete
						idx={info.row.index}
						handelUpdate={handelUpdate}
						showDelete={false}
					/>
				),
			},

			// {
			// 	accessorKey: 'is_old_pi',
			// 	header: 'Old LC',
			// 	enableColumnFilter: false,
			// 	cell: (info) => (
			// 		<StatusButton size='btn-xs' value={info.getValue()} />
			// 	),
			// },
			// {
			// 	accessorKey: 'is_rtgs',
			// 	header: 'RTGS',
			// 	enableColumnFilter: false,
			// 	cell: (info) => (
			// 		<StatusButton size='btn-xs' value={info.getValue()} />
			// 	),
			// },
			// {
			// 	accessorKey: 'problematical',
			// 	header: 'Problematic',
			// 	enableColumnFilter: false,
			// 	cell: (info) => (
			// 		<StatusButton size='btn-xs' value={info.getValue()} />
			// 	),
			// },
			// {
			// 	accessorKey: 'epz',
			// 	header: 'EPZ',
			// 	enableColumnFilter: false,
			// 	cell: (info) => (
			// 		<StatusButton size='btn-xs' value={info.getValue()} />
			// 	),
			// },
			// {
			// 	accessorKey: 'production_complete',
			// 	header: (
			// 		<>
			// 			Production <br />
			// 			Complete
			// 		</>
			// 	),
			// 	enableColumnFilter: false,
			// 	cell: (info) => (
			// 		<StatusButton size='btn-xs' value={info.getValue()} />
			// 	),
			// },
			// {
			// 	accessorKey: 'lc_cancel',
			// 	header: (
			// 		<>
			// 			LC <br />
			// 			Canceled
			// 		</>
			// 	),
			// 	enableColumnFilter: false,
			// 	cell: (info) => (
			// 		<StatusButton size='btn-xs' value={info.getValue()} />
			// 	),
			// },
			{
				id: 'status',
				header: 'Status',
				cell: (info) => {
					const {
						is_old_pi,
						is_rtgs,
						problematical,
						epz,
						production_complete,
						lc_cancel,
					} = info.row.original;

					return (
						<div className='flex flex-col gap-1'>
							<StatusValueLabel
								value={is_old_pi}
								label='Old LC'
							/>
							<StatusValueLabel value={is_rtgs} label='RTGS' />
							<StatusValueLabel
								value={problematical}
								label='Problematic'
							/>
							<StatusValueLabel value={epz} label='EPZ' />
							<StatusValueLabel
								value={production_complete}
								label='Prod Complete'
							/>
							<StatusValueLabel
								value={lc_cancel}
								label='LC Canceled'
							/>
						</div>
					);
				},
			},
			{
				accessorKey: 'lc_number',
				header: 'LC',
				enableColumnFilter: true,
				cell: (info) => {
					const { uuid, lc_date } = info.row.original;
					const url = `/commercial/lc/details/${uuid}`;
					return (
						<div className='flex flex-col gap-1'>
							<CustomLink
								label={info.getValue()}
								url={url}
								openInNewTab={true}
							/>
							<DateTime date={lc_date} isTime={false} />
						</div>
					);
				},
			},
			{
				accessorKey: 'file_number',
				header: 'File No',
				enableColumnFilter: true,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'party_name',
				header: 'Party',
				width: 'w-32',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'marketing_name',
				header: 'Marketing',
				width: 'w-32',
				enableColumnFilter: false,
				cell: (info) => info.getValue()[0] ?? '--',
			},
			// {
			// 	accessorKey: 'lc_date',
			// 	header: 'LC Date',
			// 	enableColumnFilter: false,
			// 	cell: (info) => (
			// 		<DateTime date={info.getValue()} isTime={false} />
			// 	),
			// },
			{
				accessorFn: (row) => {
					if (row.is_old_pi === 1) {
						return row.lc_value;
					} else {
						return row.total_value;
					}
				},
				header: 'LC Value ($)',
				enableColumnFilter: false,
				cell: (info) => info.getValue() && info.getValue().toFixed(2),
			},
			{
				accessorKey: 'pi_ids',
				header: 'PI No.',
				width: 'w-28',
				enableColumnFilter: false,
				cell: (info) => {
					const { is_old_pi } = info.row.original;
					return info?.getValue()?.map((piId) => {
						if (piId === 'PI-') return '--';
						const url = `/commercial/pi/${piId}`;
						return is_old_pi == 0 ? (
							<CustomLink
								key={piId}
								label={piId}
								url={url}
								openInNewTab={true}
							/>
						) : (
							<span key={piId}>{piId}</span>
						);
					});
				},
			},
			{
				accessorFn: (row) => {
					const { order_numbers, thread_order_numbers } = row;
					const zipper =
						order_numbers
							?.map((order) => order?.order_number)
							?.join(', ') || '';
					const thread =
						thread_order_numbers
							?.map((order) => order?.thread_order_number)
							?.join(', ') || '';

					if (zipper?.length > 0 && thread?.length > 0)
						return `${zipper}, ${thread}`;

					if (zipper?.length > 0) return zipper;

					if (thread?.length > 0) return thread;

					return '--';
				},
				id: 'zipper',
				header: 'O/N & Status',
				enableColumnFilter: false,
				cell: (info) => {
					const { zipper, thread } = info.row.original;

					let links = [];

					zipper
						?.filter((order) => order.order_info_uuid)
						?.forEach((order) => {
							links.push({
								quantity: order.quantity,
								delivered: order.delivered,
								packing_list: order.packing_list,
								label: order.order_number,
								url: `/order/details/${order.order_number}`,
							});
						});

					thread
						?.filter((order) => order.thread_order_info_uuid)
						?.forEach((order) => {
							links.push({
								quantity: order.quantity,
								delivered: order.delivered,
								packing_list: order.packing_list,
								label: order.thread_order_number,
								url: `/thread/order-info/${order.thread_order_info_uuid}`,
							});
						});

					return (
						<table
							className={cn(
								'table table-xs rounded-md border-2 border-primary/20 align-top'
							)}
						>
							<thead>
								<tr>
									<th>O/N</th>
									<th>P/Q</th>
									<th>D/Q</th>
								</tr>
							</thead>
							<tbody>
								{links?.map((item, index) => {
									const getPercentage = (qty) =>
										Number(
											(qty / item.quantity) * 100 || 0
										).toFixed(1);
									return (
										<tr key={index}>
											<td>
												<CustomLink
													label={item.label}
													url={item.url}
													showCopyButton={false}
													openInNewTab
												/>
											</td>
											<td>
												{getPercentage(
													item.packing_list
												)}
												%
											</td>
											<td>
												{getPercentage(item.delivered)}%
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					);
				},
			},
			{
				accessorKey: 'export_lc_number',
				header: 'Export LC',
				enableColumnFilter: false,
				width: 'w-28',
				cell: (info) => {
					const { export_lc_number, export_lc_date } =
						info.row.original;
					if (!export_lc_number) return '--';
					return (
						<div className='flex flex-col gap-1'>
							{export_lc_number}
							<DateTime date={export_lc_date} isTime={false} />
						</div>
					);
				},
			},
			// {
			// 	accessorKey: 'export_lc_date',
			// 	header: (
			// 		<>
			// 			Export LC <br />
			// 			Date
			// 		</>
			// 	),
			// 	enableColumnFilter: false,
			// 	cell: (info) => (
			// 		<DateTime date={info.getValue()} isTime={false} />
			// 	),
			// },

			{
				accessorKey: 'up_number',
				header: 'Up',
				enableColumnFilter: false,
				cell: (info) => {
					const { up_number, up_date } = info.row.original;
					if (!up_number) return '--';
					return (
						<div className='flex flex-col gap-1'>
							{up_number}
							<DateTime date={up_date} isTime={false} />
						</div>
					);
				},
			},
			// {
			// 	accessorKey: 'up_date',
			// 	header: (
			// 		<>
			// 			Up <br />
			// 			Date
			// 		</>
			// 	),
			// 	enableColumnFilter: false,
			// 	cell: (info) => (
			// 		<DateTime date={info.getValue()} isTime={false} />
			// 	),
			// },
			{
				accessorKey: 'commercial_executive',
				header: (
					<>
						Commercial <br />
						Executive
					</>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'bank_name',
				header: 'Own Bank',
				width: 'w-32',
				enableColumnFilter: false,
				cell: (info) => info.getValue()[0] ?? '--',
			},
			{
				accessorKey: 'party_bank',
				header: 'Party Bank',
				width: 'w-32',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'shipment_date',
				header: (
					<>
						Shipment <br />
						Date
					</>
				),
				enableColumnFilter: false,
				cell: (info) => (
					<DateTime date={info.getValue()} isTime={false} />
				),
			},
			{
				accessorKey: 'expiry_date',
				header: (
					<>
						Expiry <br />
						Date
					</>
				),
				enableColumnFilter: false,
				cell: (info) => (
					<DateTime date={info.getValue()} isTime={false} />
				),
			},
			{
				accessorKey: 'at_sight',
				header: 'At Sight',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'amd_date',
				header: 'Amendment',
				enableColumnFilter: false,
				cell: (info) => {
					if (!info.getValue()) return '--';

					const { amd_count } = info.row.original;
					return (
						<div className='flex flex-col gap-1'>
							<DateTime date={info.getValue()} isTime={false} />
							<span>#{amd_count}</span>
						</div>
					);
				},
			},
			// {
			// 	accessorKey: 'amd_count',
			// 	header: (
			// 		<>
			// 			AMD <br />
			// 			Count
			// 		</>
			// 	),
			// 	enableColumnFilter: false,
			// 	cell: (info) => info.getValue(),
			// },

			// {
			// 	accessorKey: 'payment_value',
			// 	header: 'Payment Value',
			// 	enableColumnFilter: false,
			// 	cell: (info) => info.getValue(),
			// },
			// {
			// 	accessorKey: 'payment_date',
			// 	header: 'Payment Date',
			// 	enableColumnFilter: false,
			// 	cell: (info) => (
			// 		<DateTime date={info.getValue()} isTime={false} />
			// 	),
			// },
			// {
			// 	accessorKey: 'ldbc_fdbc',
			// 	header: 'LDBC/FDBC',
			// 	enableColumnFilter: false,
			// 	cell: (info) => info.getValue(),
			// },
			// {
			// 	accessorKey: 'acceptance_date',
			// 	header: (
			// 		<>
			// 			Acceptance <br />
			// 			Date
			// 		</>
			// 	),
			// 	enableColumnFilter: false,
			// 	cell: (info) => (
			// 		<DateTime date={info.getValue()} isTime={false} />
			// 	),
			// },
			// {
			// 	accessorKey: 'maturity_date',
			// 	header: (
			// 		<>
			// 			Maturity <br />
			// 			Date
			// 		</>
			// 	),
			// 	enableColumnFilter: false,
			// 	cell: (info) => (
			// 		<DateTime date={info.getValue()} isTime={false} />
			// 	),
			// },

			// {
			// 	accessorKey: 'pi_number',
			// 	header: 'PI Number',
			// 	enableColumnFilter: false,
			// 	cell: (info) => info.getValue(),
			// },
			// // {
			// // 	accessorKey: 'lc_value',
			// // 	header: 'LC Value',
			// // 	enableColumnFilter: false,
			// // 	cell: (info) => info.getValue(),
			// // },

			// // {
			// // 	accessorKey: 'commercial_executive',
			// // 	header: (
			// // 		<>
			// // 			Commercial <br />
			// // 			Executive
			// // 		</>
			// // 	),
			// // 	enableColumnFilter: false,
			// // 	cell: (info) => info.getValue(),
			// // },
			// // {
			// // 	accessorKey: 'party_bank',
			// // 	header: 'Party Bank',
			// // 	enableColumnFilter: false,
			// // 	width: 'w-32',
			// // 	cell: (info) => info.getValue(),
			// // },

			// {
			// 	accessorKey: 'handover_date',
			// 	header: (
			// 		<>
			// 			Handover <br />
			// 			Date
			// 		</>
			// 	),
			// 	enableColumnFilter: false,
			// 	cell: (info) => (
			// 		<DateTime date={info.getValue()} isTime={false} />
			// 	),
			// },

			// {
			// 	accessorKey: 'ud_no',
			// 	header: 'UD No',
			// 	enableColumnFilter: false,
			// 	cell: (info) => info.getValue(),
			// },
			// {
			// 	accessorKey: 'ud_received',
			// 	header: 'UD Received',
			// 	enableColumnFilter: false,
			// 	cell: (info) => info.getValue(),
			// },
			{
				accessorKey: 'lc_entry',
				header: 'Progression',
				enableColumnFilter: false,
				cell: (info) => {
					const value = info.getValue();

					// Check if value is an object or array
					if (Array.isArray(value)) {
						// Define columns for the nested table
						const nestedColumns = [
							{
								accessorKey: 'amount',
								header: 'Amount',
								enableColumnFilter: false,
							},
							{
								accessorKey: 'ldbc_fdbc',
								header: 'Value',
								enableColumnFilter: false,
							},
							{
								accessorKey: 'handover_date',
								header: 'Handover',
								enableColumnFilter: false,
								cell: (info) => (
									<DateTime
										date={info.getValue()}
										isTime={false}
									/>
								),
							},
							{
								accessorKey: 'payment_date',
								header: 'Payment',
								enableColumnFilter: false,
								cell: (info) => (
									<DateTime
										date={info.getValue()}
										isTime={false}
									/>
								),
							},
							{
								accessorKey: 'document_submission_date',
								header: 'Doc Submit',
								enableColumnFilter: false,
								cell: (info) => (
									<DateTime
										date={info.getValue()}
										isTime={false}
									/>
								),
							},
							{
								accessorKey: 'document_receive_date',
								header: 'Doc Receive',
								enableColumnFilter: false,
								cell: (info) => (
									<DateTime
										date={info.getValue()}
										isTime={false}
									/>
								),
							},
							{
								accessorKey: 'bank_forward_date',
								header: 'Bank Forward ',
								enableColumnFilter: false,
								cell: (info) => (
									<DateTime
										date={info.getValue()}
										isTime={false}
									/>
								),
							},

							{
								accessorKey: 'acceptance_date',
								header: 'Bank Acceptance',
								enableColumnFilter: false,
								cell: (info) => (
									<DateTime
										date={info.getValue()}
										isTime={false}
									/>
								),
							},

							{
								accessorKey: 'maturity_date',
								header: 'Maturity',
								enableColumnFilter: false,
								cell: (info) => (
									<DateTime
										date={info.getValue()}
										isTime={false}
									/>
								),
							},
							{
								accessorKey: 'payment_date',
								header: 'Payment',
								enableColumnFilter: false,
								cell: (info) => (
									<DateTime
										date={info.getValue()}
										isTime={false}
									/>
								),
							},
							{
								accessorKey: 'payment_value',
								header: 'Value',
								enableColumnFilter: false,
							},
						];

						return (
							<div>
								<ReactTableTitleOnly
									data={value}
									columns={nestedColumns}
									// showColumnsHeader={false}
								/>
							</div>
						);
					}

					// Handle non-array values
					return typeof value === 'object' && value !== null
						? JSON.stringify(value) // Convert object to string for display
						: value;
				},
			},
			{
				accessorKey: 'remarks',
				header: 'Remarks',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'created_by_name',
				header: 'Created By',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'created_at',
				header: 'Created At',
				enableColumnFilter: false,
				filterFn: 'isWithinRange',
				cell: (info) => <DateTime date={info.getValue()} />,
			},
			{
				accessorKey: 'updated_at',
				header: 'Updated At',
				enableColumnFilter: false,
				cell: (info) => <DateTime date={info.getValue()} />,
			},
		],
		[data]
	);

	const handelAdd = () => navigate('/commercial/lc/entry');

	const handelUpdate = (idx) => {
		const uuid = data[idx]?.uuid;
		navigate(`/commercial/lc/${uuid}/update`); // /commercial/lc/:lc_uuid/update
	};

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<ReactTable
			title={info.getTitle()}
			data={data}
			columns={columns}
			accessor={haveAccess.includes('create')}
			handelAdd={handelAdd}
		/>
	);
}
