import { useAuth } from '@/context/auth';
import {
	useAllZipperThreadOrderList,
	useOtherMarketing,
	useOtherParty,
} from '@/state/Other';
import { format, set } from 'date-fns';
import { useAccess } from '@/hooks';

import {
	FormField,
	ReactSelect,
	SectionEntryBody,
	SimpleDatePicker,
} from '@/ui';

const getPath = (haveAccess, userUUID) => {
	if (haveAccess.includes('show_own_orders') && userUUID) {
		return `own_uuid=${userUUID}`;
	}

	return ``;
};

export default function Header({
	from = '',
	setFrom = () => {},
	to = '',
	setTo = () => {},
	party = '',
	setParty = () => {},
	type = '',
	setType = () => {},
	marketing = '',
	setMarketing = () => {},
	order = '',
	setOrder = () => {},
	reportFor = '',
	setReportFor = () => {},
	priceFor = '',
	setPriceFor = () => {},
	isLoading,
}) {
	const haveAccess = useAccess('report__production_statement');
	const { user } = useAuth();

	const { data: marketings } = useOtherMarketing();
	const { data: parties } = useOtherParty(
		`${getPath(haveAccess, user?.uuid) ? `${getPath(haveAccess, user?.uuid)}` : ''}`
	);
	const { data: orders } = useAllZipperThreadOrderList(
		`from_date=${format(from, 'yyyy-MM-dd')}&to_date=${format(to, 'yyyy-MM-dd')}&page=production_statement${reportFor === 'accounts' ? '_accounts' : ''}${getPath(haveAccess, user?.uuid) ? `&${getPath(haveAccess, user?.uuid)}` : ''}`
	);
	const reportForOptions = [
		{ label: 'SNO', value: '' },
		{ label: 'Accounts', value: 'accounts' },
	];

	const types = [
		{ label: 'Nylon', value: 'Nylon' },
		{ label: 'Vislon', value: 'Vislon' },
		{ label: 'Metal', value: 'Metal' },
		{ label: 'Thread', value: 'Thread' },
		{ label: 'Zipper', value: 'Zipper' },
	];

	const priceForOptions = [
		{ label: 'Party', value: 'party' },
		{ label: 'Company ', value: 'company' },
		{ label: 'Both ', value: 'both' },
	];

	return (
		<div>
			<SectionEntryBody title={'Production Statement Report V2'}>
				<div className='flex gap-2'>
					<FormField label='' title='From'>
						<SimpleDatePicker
							key={'from'}
							value={from}
							placeholder='From'
							onChange={(data) => {
								setFrom(data);
							}}
							selected={from}
							disabled={isLoading}
						/>
					</FormField>
					<FormField label='' title='To'>
						<SimpleDatePicker
							key={'to'}
							value={to}
							placeholder='To'
							onChange={(data) => {
								setTo(data);
							}}
							selected={to}
							disabled={isLoading}
						/>
					</FormField>
				</div>
				<div className='flex gap-2'>
					<FormField label='' title='Party'>
						<ReactSelect
							placeholder='Select Party'
							options={parties}
							value={parties?.find((item) => item.value == party)}
							onChange={(e) => {
								setParty(e.value);
							}}
							isDisabled={isLoading}
						/>
					</FormField>
					<FormField label='' title='Price For'>
						<ReactSelect
							placeholder='Select Price For'
							options={priceForOptions}
							value={priceForOptions?.find(
								(item) => item.value == priceFor
							)}
							onChange={(e) => {
								setPriceFor(e.value);
							}}
							isDisabled={isLoading}
						/>
					</FormField>
					{!haveAccess.includes('show_own_orders') && (
						<FormField label='' title='Marketing'>
							<ReactSelect
								placeholder='Select Marketing'
								options={marketings}
								value={marketings?.find(
									(item) => item.value == marketing
								)}
								onChange={(e) => {
									setMarketing(e.value);
								}}
								isDisabled={isLoading}
							/>
						</FormField>
					)}
				</div>
				<div className='flex gap-2'>
					<FormField label='' title='Report For'>
						<ReactSelect
							placeholder='Select Report'
							options={reportForOptions}
							value={reportForOptions?.find(
								(item) => item.value == reportFor
							)}
							onChange={(e) => {
								setReportFor(e.value);
							}}
							isDisabled={isLoading}
						/>
					</FormField>
					<FormField label='' title='Type'>
						<ReactSelect
							placeholder='Select Type'
							options={types}
							value={types?.find((item) => item.value == type)}
							onChange={(e) => {
								setType(e.value);
							}}
							isDisabled={isLoading}
						/>
					</FormField>
					<FormField label='' title='Order'>
						<ReactSelect
							placeholder='Select Order'
							options={orders}
							value={orders?.find((item) => item.value == order)}
							onChange={(e) => {
								setOrder(e.value);
							}}
							isDisabled={isLoading}
						/>
					</FormField>
				</div>
			</SectionEntryBody>
		</div>
	);
}
