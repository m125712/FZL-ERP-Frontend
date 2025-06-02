import { useEffect, useMemo } from 'react';
import { useAuth } from '@/context/auth';
import { useCommercialLCByQuery } from '@/state/Commercial';
import { useNavigate } from 'react-router';
import { useAccess } from '@/hooks';

import ReactTable from '@/components/Table';
import ReactTableTitleOnly from '@/components/Table/ReactTableTitleOnly';
import { CustomLink, DateTime, EditDelete, StatusButton } from '@/ui';

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
				accessorKey: 'file_number',
				header: 'File No',
				enableColumnFilter: true,
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
				accessorKey: 'lc_number',
				header: 'LC Number',
				enableColumnFilter: true,
				cell: (info) => {
					const { uuid } = info.row.original;
					const url = `/commercial/lc/details/${uuid}`;
					return (
						<CustomLink
							label={info.getValue()}
							url={url}
							openInNewTab={true}
						/>
					);
				},
			},

			{
				accessorKey: 'lc_date',
				header: 'LC Date',
				enableColumnFilter: false,
				cell: (info) => (
					<DateTime date={info.getValue()} isTime={false} />
				),
			},
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
				header: 'PI ID',
				width: 'w-28',
				enableColumnFilter: false,
				cell: (info) => {
					return info?.getValue()?.map((piId) => {
						if (piId === 'PI-') return '--';
						const url = `/commercial/pi/${piId}`;
						return (
							<CustomLink
								label={piId}
								url={url}
								openInNewTab={true}
							/>
						);
					});
				},
			},
			{
				accessorKey: 'export_lc_number',
				header: 'Export LC Number',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'export_lc_date',
				header: (
					<>
						Export LC <br />
						Date
					</>
				),
				enableColumnFilter: false,
				cell: (info) => (
					<DateTime date={info.getValue()} isTime={false} />
				),
			},

			{
				accessorKey: 'up_date',
				header: (
					<>
						Up <br />
						Date
					</>
				),
				enableColumnFilter: false,
				cell: (info) => (
					<DateTime date={info.getValue()} isTime={false} />
				),
			},
			{
				accessorKey: 'up_number',
				header: 'Up Number',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
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
				header: 'AMD Date',
				enableColumnFilter: false,
				cell: (info) => (
					<DateTime date={info.getValue()} isTime={false} />
				),
			},
			{
				accessorKey: 'amd_count',
				header: (
					<>
						AMD <br />
						Count
					</>
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
				header: <>Progression</>,
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
								accessorKey: 'received_date',
								header: 'Received',
								enableColumnFilter: false,
								cell: (info) => (
									<DateTime
										date={info.getValue()}
										isTime={false}
									/>
								),
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
								accessorKey: 'ldbc_fdbc',
								header: 'Value',
								enableColumnFilter: false,
							},
							{
								accessorKey: 'payment_date',
								header: 'Payment Date',
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
								header: 'Bank Forward Date',
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
								header: 'Acceptance Date',
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
								header: 'Payment Date',
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
								header: 'Payment Value',
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
