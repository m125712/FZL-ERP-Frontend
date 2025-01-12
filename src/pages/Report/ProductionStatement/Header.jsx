import { useState } from 'react';
import { useOtherMarketing, useOtherParty } from '@/state/Other';
import { format, set } from 'date-fns';

import { ReactSelect, SectionEntryBody, SimpleDatePicker } from '@/ui';

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
}) {
	const { data: marketings } = useOtherMarketing();
	const { data: parties } = useOtherParty();
	const types = [
		{ label: 'Nylon', value: 'Nylon' },
		{ label: 'Vislon', value: 'Vislon' },
		{ label: 'Metal', value: 'Metal' },
		{ label: 'Thread', value: 'Thread' },
	];

	return (
		<div>
			<SectionEntryBody title={'Production Statement Report'}>
				<SimpleDatePicker
					key={'from'}
					value={from}
					placeholder='From'
					onChange={(data) => {
						setFrom(format(data, 'yyyy-MM-dd'));
					}}
				/>
				<SimpleDatePicker
					key={'to'}
					value={to}
					placeholder='To'
					onChange={(data) => {
						setTo(format(data, 'yyyy-MM-dd'));
					}}
				/>

				<ReactSelect
					placeholder='Select Party'
					options={parties}
					value={parties?.find((item) => item.value == party)}
					onChange={(e) => {
						setParty(e.value);
					}}
				/>

				<ReactSelect
					placeholder='Select Marketing'
					options={marketings}
					value={marketings?.find((item) => item.value == marketing)}
					onChange={(e) => {
						setMarketing(e.value);
					}}
				/>
				<ReactSelect
					placeholder='Select Type'
					options={types}
					value={types?.find((item) => item.value == type)}
					onChange={(e) => {
						setType(e.value);
					}}
				/>
			</SectionEntryBody>
		</div>
	);
}
