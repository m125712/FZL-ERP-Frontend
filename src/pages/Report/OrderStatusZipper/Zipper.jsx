import { useMemo, useState } from 'react';
import { useAuth } from '@/context/auth';
import { useZipperStatus } from '@/state/Report';
import { format } from 'date-fns';
import { useAccess } from '@/hooks';

import ReactTable from '@/components/Table';
import { CustomLink, DateTime, SimpleDatePicker, Status } from '@/ui';

import { REPORT_DATE_FORMATE, REPORT_DATE_TIME_FORMAT } from '../utils';

const getPath = (haveAccess, userUUID) => {
	if (haveAccess.includes('show_own_orders') && userUUID) {
		return `own_uuid=${userUUID}`;
	}

	return `all=true`;
};

export default function Index() {
	const haveAccess = useAccess('report__order_status_zipper');
	const { user } = useAuth();

	const [date, setDate] = useState(new Date());
	const [toDate, setToDate] = useState(new Date());

	const { data, isLoading } = useZipperStatus(
		format(date, 'yyyy-MM-dd'),
		format(toDate, 'yyyy-MM-dd'),
		getPath(haveAccess, user?.uuid),
		{ enabled: !!user?.uuid }
	);

	const columns = useMemo(
		() => [
			{
				accessorKey: 'order_number',
				header: 'O/N',
				enableColumnFilter: true,
				width: 'w-40',
				cell: (info) => {
					const order_uuid = info.row.original.order_info_uuid;
					const link = info.getValue().includes('ST')
						? `/thread/order-info/${order_uuid}`
						: `/order/details/${info.getValue()}`;
					return (
						<CustomLink
							label={info.getValue()}
							url={link}
							openInNewTab={true}
						/>
					);
				},
			},
			{
				accessorFn: (row) => {
					const { lc_numbers } = row;
					if (lc_numbers.length === 0) return '--';

					return lc_numbers.map((lc) => lc.lc_number).join(', ');
				},
				id: 'lc_numbers',
				header: 'LC No.',
				enableColumnFilter: false,
				cell: (info) => {
					const { lc_numbers } = info.row.original;

					if (lc_numbers.length === 0) return '--';

					return lc_numbers.map((lc) => (
						<CustomLink
							key={lc.lc_number}
							label={lc.lc_number}
							url={`/commercial/lc/details/${lc.lc_uuid}`}
							openInNewTab
						/>
					));
				},
			},
			{
				accessorFn: (row) => {
					const { pi_numbers } = row;

					if (pi_numbers.length === 0) return '--';

					return pi_numbers.map((pi) => pi.pi_number).join(', ');
				},
				id: 'pi_numbers',
				header: 'Pi No.',
				enableColumnFilter: false,
				cell: (info) => {
					const { pi_numbers } = info.row.original;
					if (pi_numbers.length === 0) return '--';

					return pi_numbers.map((pi) => (
						<CustomLink
							key={pi.pi_number}
							label={pi.pi_number}
							url={`/commercial/pi/${pi.pi_number}`}
							openInNewTab
						/>
					));
				},
			},
			{
				accessorKey: 'marketing_name',
				header: 'Marketing',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'party_name',
				header: 'Party',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},
			{
				accessorFn: (row) => (row.style ? row.style : '---'),
				id: 'style',
				header: 'Style',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},
			{
				accessorFn: (row) => (row.color ? row.color : '---'),
				id: 'color',
				header: 'Color',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'color_ref',
				header: 'Color Ref',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'color_ref_entry_date',
				header: (
					<>
						Color Ref <br /> Entry
					</>
				),
				filterFn: 'isWithinRange',
				enableColumnFilter: false,
				width: 'w-24',
				cell: (info) => {
					return <DateTime date={info.getValue()} />;
				},
			},
			{
				accessorKey: 'swatch_approval_received',
				header: (
					<>
						Swatch <br />
						App.
					</>
				),
				enableColumnFilter: false,
				cell: (info) => <Status status={info.getValue()} />,
			},
			{
				accessorFn: (row) =>
					row.swatch_approval_date &&
					REPORT_DATE_FORMATE(row.swatch_approval_date),
				id: 'swatch_approval_date',
				header: 'Swatch App. Date',
				enableColumnFilter: false,
				cell: (info) => (
					<DateTime
						date={info.row.original.swatch_approval_date}
						isTime={false}
						customizedDateFormate='dd MMM,yyyy'
					/>
				),
			},
			{
				accessorKey: 'item_description',
				header: 'Item',
				enableColumnFilter: true,
				width: 'w-32',
				cell: (info) => {
					const { order_description_uuid, order_number } =
						info.row.original;
					return (
						<CustomLink
							label={info.getValue()}
							url={`/order/details/${order_number}/${order_description_uuid}`}
							openInNewTab={true}
						/>
					);
				},
			},
			{
				accessorKey: 'item_name_with_stopper',
				header: 'Item & Stopper',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'zipper_number_name',
				header: (
					<>
						Zipper <br /> No.
					</>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'end_type_name',
				header: 'End Type',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'size',
				header: 'Size',
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
				accessorKey: 'quantity',
				header: 'QTY',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'not_approved_quantity',
				header: (
					<>
						Not App. <br /> QTY
					</>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'approved_quantity',
				header: (
					<>
						App. <br /> QTY
					</>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'recipe_name',
				header: 'Recipe',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'swatch_approval_date',
				header: (
					<>
						Setup <br />
						Date
					</>
				),
				filterFn: 'isWithinRange',
				enableColumnFilter: false,
				cell: (info) => {
					return <DateTime date={info.getValue()} />;
				},
			},

			{
				accessorKey: 'expected_kg',
				header: (
					<>
						Exp. <br /> KG
					</>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'total_slider_required',
				header: (
					<>
						Slider <br /> Req.
					</>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'total_slider_required_kg',
				header: (
					<>
						Total Slider <br /> KG
					</>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},

			{
				accessorFn: (row) => row.dyeing_batch_number,
				id: 'dyeing_batch_number',
				header: 'D/B',
				enableColumnFilter: false,
				cell: (info) => {
					const { dyeing_batch_uuid, dyeing_batch_number } =
						info.row.original;
					return (
						<CustomLink
							label={dyeing_batch_number}
							url={`/dyeing-and-iron/zipper-batch/${dyeing_batch_uuid}`}
							openInNewTab={true}
							showCopyButton={false}
						/>
					);
				},
			},
			{
				accessorFn: (row) =>
					row.batch_created_at &&
					REPORT_DATE_TIME_FORMAT(row.batch_created_at),
				id: 'batch_created_at',
				header: 'B/D',
				enableColumnFilter: false,
				cell: (info) => (
					<DateTime
						date={info.row.original.batch_created_at}
						customizedDateFormate='dd MMM,yyyy'
					/>
				),
			},
			{
				accessorFn: (row) =>
					row.production_date &&
					REPORT_DATE_FORMATE(row.production_date),
				id: 'production_date',
				header: 'P/D',
				enableColumnFilter: false,
				cell: (info) => (
					<DateTime
						date={info.row.original.production_date}
						isTime={false}
						customizedDateFormate='dd MMM,yyyy'
					/>
				),
			},
			{
				accessorKey: 'total_quantity',
				header: 'B/Qty',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'total_production_quantity',
				header: 'B/Kg',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'batch_expected_kg',
				header: 'EB/Kg',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'dyeing_machine',
				header: 'D/M',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'total_dyeing_quantity',
				header: (
					<>
						Dyeing <br /> QTY
					</>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'total_coloring_quantity',
				header: (
					<>
						Slider <br /> QTY
					</>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'total_finishing_quantity',
				header: (
					<>
						Finishing <br /> QTY
					</>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'delivered',
				header: (
					<>
						Delivered <br /> QTY
					</>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'balance_quantity',
				header: (
					<>
						Balance <br /> QTY
					</>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'party_price',
				header: (
					<>
						Party <br />
						Price
					</>
				),
				enableColumnFilter: false,
				hidden: !haveAccess.includes('show_price'),
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'company_price',
				header: (
					<>
						Comp. <br /> Price
					</>
				),
				enableColumnFilter: false,
				hidden: !haveAccess.includes('show_price'),
				cell: (info) => info.getValue(),
			},
			{
				accessorFn: (row) =>
					row.created_at && REPORT_DATE_FORMATE(row.created_at),
				id: 'created_at',
				header: 'Created',
				enableColumnFilter: false,
				cell: (info) => (
					<DateTime
						date={info.row.original.created_at}
						isTime={false}
						customizedDateFormate='dd MMM,yyyy'
					/>
				),
			},
			{
				accessorFn: (row) =>
					row.updated_at && REPORT_DATE_FORMATE(row.updated_at),
				id: 'updated_at',
				header: 'Updated',
				enableColumnFilter: false,
				cell: (info) => (
					<DateTime
						date={info.row.original.updated_at}
						isTime={false}
						customizedDateFormate='dd MMM,yyyy'
					/>
				),
			},
			{
				accessorKey: 'color_ref_update_date',
				header: (
					<>
						Color Ref <br /> Update
					</>
				),
				filterFn: 'isWithinRange',
				enableColumnFilter: false,
				width: 'w-24',
				cell: (info) => {
					return <DateTime date={info.getValue()} />;
				},
			},
		],
		[data]
	);

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<ReactTable
			key='zipper'
			showDateRange={false}
			title={'Zipper Status'}
			subtitle={
				<div className='flex flex-col'>
					<span>
						delivered = when the packing list is warehouse out
					</span>
					<span>balance = order qty - delivered</span>
				</div>
			}
			accessor={false}
			data={data}
			columns={columns}
			extraButton={
				<div className='flex items-center gap-2'>
					<SimpleDatePicker
						className='h-[2.34rem] w-32'
						key={'Date'}
						value={date}
						placeholder='Date'
						onChange={(data) => {
							setDate(data);
						}}
						selected={date}
					/>
					<SimpleDatePicker
						className='h-[2.34rem] w-32'
						key={'toDate'}
						value={toDate}
						placeholder='To'
						onChange={(data) => {
							setToDate(data);
						}}
						selected={toDate}
					/>
				</div>
			}
		/>
	);
}
