import { useEffect, useMemo } from 'react';
import { useAuth } from '@/context/auth';
import { useOrderPrice } from '@/state/Order';
import { format } from 'date-fns';
import { Info } from 'lucide-react';
import { Link } from 'react-router';
import { useAccess } from '@/hooks';

import ReactTable from '@/components/Table';
import SwitchToggle from '@/ui/Others/SwitchToggle';
import { CustomLink } from '@/ui';

import { cn } from '@/lib/utils';
import GetDateTime from '@/util/GetDateTime';
import PageInfo from '@/util/PageInfo';

import SimpleTooltip from '../../../components/simpleToolpit';
import { MarketingPriceForm } from './MarketingPriceForm';
import { MDPriceForm } from './MdPriceForm';

const getPath = (haveAccess, userUUID) => {
	if (haveAccess.includes('show_own_orders') && userUUID) {
		return `own_uuid=${userUUID}&price_lock=false`;
	}
	return `all=true&marketing_price=true&price_lock=false`;
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

	const info = new PageInfo('Order Pricing', url, 'order__order_pricing');
	const handlePriceLock = async (index) => {
		const is_price_confirmed = data[index].is_price_confirmed
			? false
			: true;
		await updateData.mutate({
			url: `/zipper/order/description/update-md-mkt-cmp-party-price-is-price-confirmed/by/${data[index]?.order_description_uuid}`,
			updatedData: {
				is_price_confirmed,
				updated_at: GetDateTime(),
				updated_by: user.uuid,
			},
			isOnCloseNeeded: false,
		});
	};

	const edit_md_price = haveAccess.includes('edit_md_price');
	const edit_mkt_price = haveAccess.includes('edit_mkt_price');
	const click_price_lock = haveAccess.includes('click_price_lock');

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
					const order_uuid = info.row.original.order_info_uuid;
					const link = info.getValue().includes('ST')
						? `/thread/order-info/${order_uuid}`
						: `/order/details/${info.row.original.order_number}/${info.row.original.order_description_uuid}`;
					return (
						<Link
							to={link}
							className={cn(
								'transition-colors duration-300 hover:text-info hover:decoration-info',
								link !== null
									? 'cursor-pointer'
									: 'pointer-events-none cursor-not-allowed'
							)}
							target={'_blank'}
						>
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
						</Link>
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
					<div className='flex gap-2'>
						<span>{info.getValue().split(' -- ').length}</span>
						<SimpleTooltip
							content={info
								.getValue()
								.split(' -- ')
								.map((value, index) => (
									<p
										className='text-start text-sm'
										key={value}
									>
										{index + 1}. {value}
									</p>
								))}
							placement='right'
							delay={300}
						>
							<Info className='mt-0.5' size={18} />
						</SimpleTooltip>
					</div>
				),
			},
			{
				accessorFn: (row) =>
					row.sizes +
					' (' +
					row.size_count +
					')' +
					' ' +
					Object.keys(row.size_wise_quantity)
						.map((key) => `${key}: ${row.size_wise_quantity[key]}`)
						.join(', '),
				id: 'sizes',
				header: 'Size',
				width: 'w-24',
				enableColumnFilter: false,
				cell: (info) => {
					const { sizes, size_count, unit } = info.row.original;
					return (
						<div className='flex flex-col'>
							<div className='flex gap-1'>
								<span>{sizes + ' (' + unit + ')'}</span>
							</div>
							<div className='flex gap-1'>
								<span className='font-semibold'>
									#{size_count}
								</span>
								<SimpleTooltip
									content={Object.keys(
										info.row.original.size_wise_quantity
									).map((key) => (
										<p
											className='text-start text-sm'
											key={key}
										>
											{key} ({unit}):{' '}
											{
												info.row.original
													.size_wise_quantity[key]
											}
										</p>
									))}
									placement='right'
									delay={300}
								>
									<Info className='mt-0.5' size={18} />
								</SimpleTooltip>
							</div>
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
				header: 'MD (Price/ Dzn)',
				enableColumnFilter: false,
				cell: (info) => {
					const filterOutMdPriceHistory =
						info.row.original?.md_price_history?.filter(
							(item, index) => {
								if (
									index === 0 &&
									item?.md_price ===
										info.row.original?.md_price
								) {
									return false;
								}
								return true;
							}
						);
					return (
						<div className='flex flex-col gap-2'>
							<MDPriceForm
								rowData={info.row.original}
								updateData={updateData}
								disabled={
									!edit_md_price ||
									info.row.original.is_price_confirmed
								}
							/>
							<div className='flex items-center justify-center gap-2'>
								<span className='font-semibold'>
									#{filterOutMdPriceHistory?.length}
								</span>
								<SimpleTooltip
									content={filterOutMdPriceHistory?.map(
										(item, index) => (
											<p
												className='text-start text-sm'
												key={index}
											>
												(
												{format(
													info.row.original
														.md_price_history[index]
														?.created_at,
													'dd-MM-yyyy'
												)}
												): {item?.md_price}
											</p>
										)
									)}
									position='left'
									delay={300}
								>
									<Info className='mt-0.5' size={18} />
								</SimpleTooltip>
							</div>
						</div>
					);
				},
			},
			{
				accessorFn: (row) =>
					row.mkt_party_price + ', ' + row.mkt_party_price,
				id: 'mkt_price',

				header: () => (
					<>
						MKT (Comp. - Party) <br /> (Price/ Dzn)
					</>
				),
				enableColumnFilter: false,
				cell: (info) => {
					const filterOutMktPriceHistory =
						info.row.original?.mkt_price_history?.filter(
							(item, index) => {
								if (
									index === 0 &&
									item?.mkt_company_price ===
										info.row.original?.mkt_company_price &&
									item?.mkt_party_price ===
										info.row.original?.mkt_party_price
								) {
									return false;
								}
								return true;
							}
						);
					return (
						<div className='flex flex-col gap-2'>
							<MarketingPriceForm
								rowData={info.row.original}
								updateData={updateData}
								disabled={
									!edit_mkt_price ||
									info.row.original.is_price_confirmed
								}
							/>
							<div className='flex items-center justify-center gap-2'>
								<span className='font-semibold'>
									#{filterOutMktPriceHistory?.length}
								</span>
								<SimpleTooltip
									content={filterOutMktPriceHistory?.map(
										(item, index) => (
											<p
												className='text-start text-sm'
												key={index}
											>
												(
												{format(
													item?.created_at,
													'dd-MM-yyyy'
												)}
												): {item?.mkt_company_price} |{' '}
												{item?.mkt_party_price}
											</p>
										)
									)}
									position='bottom'
									delay={300}
								>
									<Info className='mt-0.5' size={18} />
								</SimpleTooltip>
							</div>
						</div>
					);
				},
			},
			{
				accessorFn: (row) => (row.is_price_confirmed ? 'Yes' : 'No'),
				header: 'Price Lock',
				enableColumnFilter: false,
				cell: (info) => (
					<SwitchToggle
						checked={info.getValue() === 'Yes'}
						onChange={() => handlePriceLock(info.row.index)}
						disabled={!click_price_lock}
					/>
				),
			},
		],
		[data]
	);
	if (!user?.uuid) return null;
	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<ReactTable
			title={info.getTitle()}
			accessor={false}
			data={data}
			columns={columns}
			extraClass={'py-0.5'}
			autoResetPageIndex={false}
		/>
	);
}
