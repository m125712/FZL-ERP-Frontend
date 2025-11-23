import { useMemo, useState } from 'react';
import { useAuth } from '@/context/auth';
import { useDescriptionConsumption } from '@/state/Report';
import { format } from 'date-fns';
import numeral from 'numeral';
import { useAccess } from '@/hooks';

import ReactTable from '@/components/Table';
import { CustomLink, DateTime, ReactSelect, SimpleDatePicker } from '@/ui';

import { consumptionTypes, REPORT_DATE_FORMATE } from '../utils';

const getPath = (haveAccess, userUUID) => {
	if (haveAccess.includes('show_own_orders') && userUUID) {
		return `&own_uuid=${userUUID}`;
	}

	return ``;
};

export default function Index() {
	const dateFormat = 'yyyy-MM-dd';
	const haveAccess = useAccess('report__consumption');
	const { user } = useAuth();
	const [date, setDate] = useState(new Date());
	const [toDate, setToDate] = useState(new Date());
	const [type, setType] = useState('all');
	const { data, isLoading } = useDescriptionConsumption(
		format(date, dateFormat),
		format(toDate, dateFormat),
		type,
		getPath(haveAccess, user?.uuid),
		!!user?.uuid
	);
	// "": "Al Amin",
	//             "": "Z25-2624",
	//             "": "SPARTAN FASHION LIMITED",
	//             "factory_name": "SPARTAN FASHION LIMITED",
	//             "created_at": "2025-03-11 14:25:13",
	//             "item_description": "#1-M-4.5-CE-YG",
	//             "specification": "Auto Lock, teeth: Antique Brass, puller: Antique Brass, type: Electro-Plating, H Bottom",
	//             "styles": [
	//                 "1",
	//                 "1",
	//                 "1",
	//                 "1"
	//             ],
	//             "colors": [
	//                 "CYNDER GREY",
	//                 "CYNDER GREY",
	//                 "KHAKI",
	//                 "KHAKI"
	//             ],
	//             "sizes": "15 - 16",
	//             "total_quantity": 4680,
	//             "total_delivered_quantity": 4506,
	//             "total_cm": 72707,
	//             "total_dyeing_transaction_quantity": 7.5,
	//             "mtr_per_kg": 105,
	//             "top": 2,
	//             "bottom": 2,
	//             "total_coloring_production_quantity": 4684
	const columns = useMemo(
		() => [
			// {
			// 	accessorKey: 'mtr_per_kg',
			// 	header: 'mtr_per_kg',
			// },
			{
				accessorKey: 'marketing_name',
				header: 'Marketing',
			},
			{
				accessorKey: 'party_name',
				header: 'Party',
			},
			{
				accessorKey: 'factory_name',
				header: 'Factory',
			},
			{
				accessorFn: (row) => REPORT_DATE_FORMATE(row.created_at),
				id: 'created_at',
				header: 'Created At',
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
				header: 'Item',
				enableColumnFilter: true,
				width: 'w-36',
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
				accessorKey: 'specification',
				header: 'Specification',
				width: 'w-64',
			},
			{
				accessorFn: (row) => {
					const uniqueStyles = new Set(
						row.styles.map((style) => style)
					);

					return [...uniqueStyles].join(', ');
				},
				id: 'styles',
				header: 'Styles',
				enableColumnFilter: false,
				width: 'w-64',
			},
			{
				accessorFn: (row) => {
					const uniqueColors = new Set(
						row.colors.map((style) => style)
					);

					return [...uniqueColors].join(', ');
				},
				id: 'colors',
				header: 'Colors',
				enableColumnFilter: false,
				width: 'w-64',
			},
			{
				accessorFn: (row) => row.sizes,
				header: 'Sizes',
			},
			{
				accessorKey: 'total_quantity',
				header: (
					<>
						Order Qty <br />
						(PCS)
					</>
				),
				cell: (info) => numeral(info.getValue()).format('0,0'),
			},
			// {
			// 	accessorFn: (row) => {
			// 		const { total_cm, top, bottom, total_quantity } = row;
			// 		const top_bottom = (top + bottom) * total_quantity;
			// 		const total_size = total_cm + top_bottom;
			// 		const total_mtr = total_size / 100;
			// 		return total_mtr.toFixed(2);
			// 	},
			// 	id: 'total_mtr',
			// 	header: 'Total (MTR)',
			// },
			// {
			// 	accessorKey: 'mtr_per_kg',
			// 	header: 'MTR/KG',
			// },

			{
				accessorFn: (row) => {
					const top_bottom =
						(row.top + row.bottom) * row.total_quantity;
					const total_size = row.total_cm + top_bottom;
					const total_mtr = total_size / 100;
					return (total_mtr / row.mtr_per_kg).toFixed(2);
				},
				id: 'req_tape_qty',
				header: (
					<>
						Req. Tape <br />
						QTY (KG)
					</>
				),
			},
			{
				accessorKey: 'total_dyeing_transaction_quantity',
				header: (
					<>
						Prov. Tape <br />
						QTY (KG)
					</>
				),
			},

			{
				accessorKey: 'total_coloring_production_quantity',
				header: (
					<>
						Total Slider <br />
						Prod QTY
					</>
				),
				cell: (info) => numeral(info.getValue()).format('0,0'),
			},
			{
				accessorKey: 'total_delivered_quantity',
				header: (
					<>
						Total W/H <br />
						Out QTY
					</>
				),
				cell: (info) => numeral(info.getValue()).format('0,0'),
			},
		],
		[data]
	);
	if (!user?.uuid) return null;
	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<ReactTable
			key='desc-consumption'
			title={'Description Wise Consumption'}
			accessor={false}
			data={data}
			columns={columns}
			showDateRange={false}
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
					<ReactSelect
						className='h-4 min-w-36 text-sm'
						placeholder='Select Status'
						options={consumptionTypes}
						value={consumptionTypes?.filter(
							(item) => item.value == type
						)}
						onChange={(e) => {
							setType(e.value);
						}}
					/>
				</div>
			}
		/>
	);
}
