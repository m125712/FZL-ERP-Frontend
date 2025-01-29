import {
	useAllZipperThreadOrderList,
	useOtherMarketing,
	useOtherParty,
} from '@/state/Other';
import { format, set } from 'date-fns';

import {
	FormField,
	ReactSelect,
	SectionEntryBody,
	SimpleDatePicker,
} from '@/ui';

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
}) {
	const { data: marketings } = useOtherMarketing();
	const { data: parties } = useOtherParty();
	const { data: orders } = useAllZipperThreadOrderList(
		`from_date=${from}&to_date=${to}&page=production_statement${reportFor === 'accounts' ? '_accounts' : ''}`
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

	return (
		<div>
			<SectionEntryBody title={'Production Statement Report'}>
				<div className='flex gap-2'>
					<FormField label='' title='From'>
						<SimpleDatePicker
							key={'from'}
							value={from}
							placeholder='From'
							onChange={(data) => {
								setFrom(format(data, 'yyyy-MM-dd'));
							}}
						/>
					</FormField>
					<FormField label='' title='To'>
						<SimpleDatePicker
							key={'to'}
							value={to}
							placeholder='To'
							onChange={(data) => {
								setTo(format(data, 'yyyy-MM-dd'));
							}}
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
						/>
					</FormField>
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
						/>
					</FormField>
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
						/>
					</FormField>
				</div>
			</SectionEntryBody>
		</div>
	);
}
