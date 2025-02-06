import { useEffect, useMemo } from 'react';
import { useSliderDashboardInfo } from '@/state/Slider';
import { differenceInDays, subDays } from 'date-fns';

import ReactTable from '@/components/Table';
import { CustomLink, DateTime, StatusButton } from '@/ui';

import PageInfo from '@/util/PageInfo';

export default function Index() {
	const { data, isLoading, url } = useSliderDashboardInfo();
	const info = new PageInfo('Info', url, 'slider__dashboard');

	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	const columns = useMemo(
		() => [
			{
				accessorKey: 'batch_number',
				header: 'Batch No.',
				enableColumnFilter: true,
				cell: (info) => (
					<CustomLink
						label={info.getValue()}
						url={`/planning/finishing-batch/${info.row.original.finishing_batch_uuid}`}
						openInNewTab={true}
					/>
				),
			},
			{
				accessorKey: 'order_number',
				header: 'O/N',
				enableColumnFilter: true,
				cell: (info) => (
					<CustomLink
						label={info.getValue()}
						url={`/order/details/${info.getValue()}`}
						openInNewTab={true}
					/>
				),
			},
			{
				accessorKey: 'item_description',
				header: 'Item Description',
				enableColumnFilter: true,
				cell: (info) => (
					<CustomLink
						label={info.getValue()}
						url={`/order/details/${info.row.original.order_number}/${info.row.original.order_description_uuid}`}
						openInNewTab={true}
					/>
				),
			},
			{
				accessorKey: 'order_type',
				header: 'Type',
				enableColumnFilter: true,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'party_name',
				header: 'Party',
				enableColumnFilter: true,
				width: 'w-40',
				cell: (info) => info.getValue(),
			},

			{
				accessorKey: 'production_date',
				header: (
					<>
						Production <br />
						Date
					</>
				),
				enableColumnFilter: false,

				cell: (info) => (
					<DateTime date={info.getValue()} isTime={false} />
				),
			},
			// {
			// 	accessorKey: 'slider_lead_time',
			// 	header: (
			// 		<div>
			// 			Finishing Slider <br />
			// 			Lead Time
			// 		</div>
			// 	),
			// 	enableColumnFilter: false,
			//
			// 	cell: (info) => info.getValue(),
			// },
			// {
			// 	accessorFn: (row) => {
			// 		const { production_date, slider_lead_time } = row;
			// 		const slider_day = subDays(
			// 			production_date,
			// 			Number(slider_lead_time)
			// 		);
			// 		const remainingDays = differenceInDays(
			// 			slider_day,
			// 			new Date()
			// 		);

			// 		return remainingDays < 0 ? 0 : remainingDays;
			// 	},
			// 	id: 'remaining_slider_lead_time',
			// 	header: <>Remaining Date</>,
			// 	enableColumnFilter: false,
			// 	cell: (info) => {
			// 		const { production_date, slider_lead_time } =
			// 			info.row.original;
			// 		const slider_day = subDays(
			// 			production_date,
			// 			Number(slider_lead_time)
			// 		);

			// 		return (
			// 			<div>
			// 				<span className='text-sm font-bold text-gray-600'>
			// 					{info.getValue()} days
			// 				</span>
			// 				<DateTime date={slider_day} isTime={false} />
			// 			</div>
			// 		);
			// 	},
			// },
			{
				accessorKey: 'remaining_slider_lead_time',
				header: (
					<>
						Remaining Date <br />
						Slider
					</>
				),
				enableColumnFilter: false,
				cell: (info) => {
					const { production_date, slider_lead_time } =
						info.row.original;
					const slider_day = subDays(
						production_date,
						Number(slider_lead_time)
					);
					const remainingDays = differenceInDays(
						slider_day,
						new Date()
					);
					return (
						<div>
							<span className='font-bold text-gray-600'>
								{remainingDays < 0 ? 0 : remainingDays} days
							</span>
							<DateTime
								date={slider_day}
								customizedDateFormate='dd MMM, yy'
								isTime={false}
							/>
						</div>
					);
				},
			},
			{
				accessorKey: 'item_name',
				header: 'Item',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'zipper_number_name',
				header: 'Zipper',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'end_type_name',
				header: 'End',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'lock_type_name',
				header: 'Lock',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorFn: (row) => row.color.join(', '),
				id: 'color',
				header: 'Tape Color',
				width: 'w-44',
				enableColumnFilter: false,
				// cell: (info) => info.getValue()?.join(', '),
			},
			{
				accessorKey: 'puller_type_name',
				header: 'Puller',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'puller_color_name',
				header: 'Color',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'teeth_color_name',
				header: 'Teeth Color',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'slider_name',
				header: 'Material',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'slider_body_shape_name',
				header: 'Body Shape',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'slider_link_name',
				header: 'Link',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'coloring_type_name',
				header: 'Coloring',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'is_waterproof',
				header: 'Waterproof',
				enableColumnFilter: false,
				cell: (info) => (
					<StatusButton size='btn-sm' value={info.getValue()} />
				),
			},
			{
				accessorFn: (row) => {
					let logo = row.logo_type_name;

					if (row.is_logo_body === 1 && row.is_logo_puller === 1) {
						logo += ' (Body, Puller)';
					} else if (row.is_logo_body === 1) {
						logo += ' (Body)';
					} else if (row.is_logo_puller === 1) {
						logo += ' (Puller)';
					}

					return logo;
				},
				id: 'logo_type_name',
				header: 'Logo',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'batch_quantity',
				header: 'Batch',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorFn: (row) => {
					const { swatch_approved_quantity, trx_to_finishing } = row;

					return swatch_approved_quantity - trx_to_finishing;
				},
				header: 'Balance',
				id: 'balance',
				enableColumnFilter: false,
			},
			{
				accessorKey: 'body_quantity',
				header: 'Body',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'cap_quantity',
				header: 'Cap',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'puller_quantity',
				header: 'Puller',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'link_quantity',
				header: 'Link',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'sa_prod',
				header: 'SA Prod',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'coloring_stock',
				header: (
					<>
						Coloring <br />
						Stock
					</>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'coloring_prod',
				header: (
					<>
						Coloring <br />
						Prod
					</>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'trx_to_finishing',
				header: 'Finishing',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'u_top_quantity',
				header: 'U Top',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'h_bottom_quantity',
				header: 'H Bottom',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'box_pin_quantity',
				header: 'Box Pin',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'two_way_pin_quantity',
				header: '2-Way Pin',
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

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<>
			<ReactTable
				title={info.getTitle()}
				accessor={false}
				data={data}
				columns={columns}
				extraClass={'py-0.5'}
			/>
		</>
	);
}
