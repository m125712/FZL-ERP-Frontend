import { useEffect, useMemo, useState } from 'react';
import { MarketingUser } from '@/assets/icons';
import { useAuth } from '@/context/auth';
import { ProductionStatus, REPORT_DATE_FORMATE } from '@/pages/Report/utils';
import { useOrderPrice } from '@/state/Order';
import { useZipperProduction } from '@/state/Report';
import { format } from 'date-fns';
import { ChartNoAxesCombined, Handshake, Info, Ruler } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useAccess, useRHF } from '@/hooks';

import ReactTable from '@/components/Table';
import JoinMultiInputButton from '@/components/ui/join-multi-input-buton';
import { CustomLink, DateTime, JoinInput, Status, StatusButton } from '@/ui';

import { cn } from '@/lib/utils';
import PageInfo from '@/util/PageInfo';
import { MD_PRICE_NULL, MD_PRICE_SCHEMA } from '@/util/Schema';

import { MarketingPriceForm } from './MarketingPriceForm';
import { MDPriceForm } from './MdPriceForm';

const getPath = (haveAccess, userUUID) => {
	if (haveAccess.includes('show_own_orders') && userUUID) {
		return `own_uuid=${userUUID}`;
	}
	return `all=true`;
};

export default function Index() {
	const haveAccess = useAccess('order__order_pricing');
	const { user } = useAuth();
	const {
		data,
		isLoading,
		url,
		updateData,
		invalidateQuery: invalidateOrderPricing,
	} = useOrderPrice(`${getPath(haveAccess, user?.uuid)}`, {
		enabled: !!user?.uuid,
	});

	const info = new PageInfo(
		'Zipper Production Status',
		url,
		'report__zipper_production'
	);

	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	const columns = useMemo(
		() => [
			{
				accessorFn: (row) => row.marketing_name + ', ' + row.party_name,
				header: 'Marketing & Party',
				enableColumnFilter: false,
				width: 'w-48',
				cell: (info) => {
					const { marketing_name, party_name } = info.row.original;
					return (
						<div className='flex flex-col gap-1'>
							<span className='flex gap-1'>
								<span className='flex gap-1 font-semibold'>
									Mkt:{' '}
								</span>
								{marketing_name}
							</span>{' '}
							<span className='flex gap-1'>
								<span className='flex gap-1 font-semibold'>
									Party:{' '}
								</span>{' '}
								{party_name}
							</span>
						</div>
					);
				},
			},
			{
				accessorKey: 'order_number',
				header: 'O/N',
				enableColumnFilter: true,
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
				accessorFn: (row) =>
					row.item_details +
					', ' +
					row.slider_details +
					', ' +
					row.other_details,
				header: 'Description',
				enableColumnFilter: false,
				width: 'w-64',
				cell: (info) => {
					const { item_details, slider_details, other_details } =
						info.row.original;
					return (
						<div className='flex flex-col gap-1'>
							<span className='flex gap-1'>
								<span className='flex gap-1 font-semibold'>
									Tape:{' '}
								</span>
								{item_details}
							</span>{' '}
							<span className='flex gap-1'>
								<span className='flex gap-1 font-semibold'>
									Slider:{' '}
								</span>{' '}
								{slider_details}
							</span>
							{other_details && (
								<span className='flex gap-1'>
									<span className='flex gap-1 font-semibold'>
										Other:{' '}
									</span>{' '}
									{other_details}
								</span>
							)}
						</div>
					);
				},
			},
			{
				accessorFn: (row) => row.colors.join(' -- '),
				id: 'colors',
				header: 'Colors',
				enableColumnFilter: false,
				width: 'w-16',
				cell: (info) => (
					<div
						className='tooltip-multiline tooltip tooltip-right flex gap-1'
						data-tip={`${info.getValue()}`}
					>
						<span>{info.getValue().split(' -- ').length}</span>
						<Info size={17} />
					</div>
				),
			},
			{
				accessorFn: (row) => row.sizes + ' (' + row.size_count + ')',
				id: 'sizes',
				header: 'Size',
				width: 'w-20',
				enableColumnFilter: false,
				cell: (info) => {
					const { sizes, size_count, unit } = info.row.original;
					return (
						<div className='flex flex-col'>
							<div className='flex gap-1'>
								<span>{sizes}</span>
								<span>{unit}</span>
							</div>
							<span className='font-semibold'>#{size_count}</span>
						</div>
					);
				},
			},
			{
				accessorKey: 'total_quantity',
				header: 'QTY',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'md_price',
				header: 'MD Price',
				enableColumnFilter: false,
				cell: (info) => (
					<MDPriceForm
						rowData={info.row.original}
						updateData={updateData}
						invalidQuery={invalidateOrderPricing}
					/>
				),
			},
			{
				accessorFn: (row) =>
					row.mkt_party_price + ', ' + row.mkt_party_price,
				header: 'MKT Party & Comp./ Price',
				enableColumnFilter: false,
				cell: (info) => (
					<MarketingPriceForm
						rowData={info.row.original}
						updateData={updateData}
						invalidQuery={invalidateOrderPricing}
					/>
				),
			},
			{
				accessorKey: 'remarks',
				header: 'Remarks',
				width: 'w-64',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
		],
		[data]
	);

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<ReactTable
			title={info.getTitle()}
			accessor={false}
			data={data}
			columns={columns}
			extraClass={'py-0.5'}
		/>
	);
}
