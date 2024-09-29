import { useEffect, useState } from 'react';
import { PDF } from '@/assets/icons';
import { format } from 'date-fns';

import PiPdf from '@/components/Pdf/PI';
import SectionContainer from '@/ui/Others/SectionContainer';
import RenderTable from '@/ui/Others/Table/RenderTable';

import { DollarToWord } from '@/lib/NumToWord';

export default function Information({ pi }) {
	const {
		uuid,
		id,
		lc_uuid,
		lc_number,
		order_info_uuids,
		marketing_uuid,
		marketing_name,
		party_uuid,
		party_name,
		merchandiser_uuid,
		merchandiser_name,
		factory_uuid,
		factory_name,
		bank_uuid,
		bank_name,
		bank_swift_code,
		bank_address,
		bank_routing_no,
		factory_address,
		validity,
		payment,
		created_by,
		created_by_name,
		created_at,
		updated_at,
		remarks,
		pi_cash_entry,
		pi_cash_entry_thread,
	} = pi;

	const getUniqueValues = (field, arr = []) =>
		Array.from(new Set(arr?.map((item) => item[field]))).join(', ');

	const buyers = getUniqueValues('buyer_name', pi_cash_entry);
	const orderNumbersZipper = getUniqueValues('order_number', pi_cash_entry);
	const orderNumbersThread = getUniqueValues(
		'order_number',
		pi_cash_entry_thread
	);
	const countLengthThreads = getUniqueValues(
		'count_length_name',
		pi_cash_entry_thread
	);

	const stylesZipper = getUniqueValues('style', pi_cash_entry);
	const stylesThread = getUniqueValues('style', pi_cash_entry_thread);

	const [data, setData] = useState('');

	const pi_info = {
		...pi,
		pi_number: id,
		date: format(new Date(created_at), 'dd/MM/yy'),
		total_quantity: pi_cash_entry.reduce((a, b) => a + b.pi_quantity, 0),
		total_value: pi_cash_entry.reduce((a, b) => a + Number(b.value), 0),
		total_value_in_words: DollarToWord(
			pi_cash_entry.reduce((a, b) => Number(a) + Number(b.value), 0)
		),
		buyer_names: buyers,
		order_numbers: orderNumbersZipper,
		styles: stylesZipper,
	};

	useEffect(() => {
		PiPdf(pi_info).then((res) => setData(res));
	}, [pi]);

	const renderItems = () => {
		const basicInfo = [
			{
				label: 'PI No',
				value: id,
			},
			{
				label: 'LC No',
				value: lc_number,
			},
			{
				label: 'O/N',
				value: (
					<div className='flex flex-wrap gap-2'>
						{orderNumbersZipper
							.split(',')
							.filter(Boolean)
							.map((e) => (
								<span
									key={e}
									className='badge badge-secondary badge-sm h-5'>
									{e}
								</span>
							))}

						{orderNumbersThread
							.split(',')
							.filter(Boolean)
							.map((e) => (
								<span
									key={e}
									className='badge badge-secondary badge-sm h-5'>
									{e}
								</span>
							))}
					</div>
				),
			},

			{
				label: 'Styles',
				value: (
					<div className='flex flex-wrap gap-2'>
						{stylesZipper
							.split(',')
							.filter(Boolean)
							.map((e) => (
								<span
									key={e}
									className='badge badge-secondary badge-sm h-5'>
									{e}
								</span>
							))}

						{stylesThread
							.split(',')
							.filter(Boolean)
							.map((e) => (
								<span
									key={e}
									className='badge badge-secondary badge-sm h-5'>
									{e}
								</span>
							))}
					</div>
				),
			},
			{
				label: 'Count Length',
				value: (
					<div className='flex flex-wrap gap-2'>
						{countLengthThreads
							.split(',')
							.filter(Boolean)
							.map((e) => (
								<span
									key={e}
									className='badge badge-secondary badge-sm h-5'>
									{e}
								</span>
							))}
					</div>
				),
			},
			{
				label: 'Value ($)',
				value:
					pi_cash_entry.reduce(
						(a, b) => Number(a) + Number(b.value),
						0
					) +
					pi_cash_entry_thread.reduce(
						(a, b) => Number(a) + Number(b.value),
						0
					),
			},
			{
				label: 'Payment',
				value: payment + ' Days',
			},
			{
				label: 'Validity',
				value: validity + ' Days',
			},

			{
				label: 'Created By',
				value: created_by_name,
			},
			{
				label: 'Remarks',
				value: remarks,
			},
			{
				label: 'Created At',
				value: format(new Date(created_at), 'dd/MM/yy'),
			},
			{
				label: 'Updated At',
				value: format(new Date(updated_at), 'dd/MM/yy'),
			},
		];

		const bankDetails = [
			{
				label: 'Bank',
				value: bank_name,
			},

			{
				label: 'Bank Routing No',
				value: bank_routing_no,
			},
			{
				label: 'Bank Swift Code',
				value: bank_swift_code,
			},
			{
				label: 'Bank Address',
				value: bank_address,
			},
		];

		const otherInfo = [
			{
				label: 'Buyers',
				value: buyers,
			},
			{
				label: 'Party',
				value: party_name,
			},
			{
				label: 'Merchandiser',
				value: merchandiser_name,
			},
			{
				label: 'Marketing',
				value: marketing_name,
			},
			{
				label: 'Factory',
				value: factory_name,
			},
			{
				label: 'Factory Address',
				value: factory_address,
			},
		];

		return {
			basicInfo,
			bankDetails,
			otherInfo,
		};
	};

	const renderButtons = () => {
		return [
			<button
				key='pdf'
				type='button'
				className='btn btn-accent btn-sm rounded-badge'
				onClick={() => PiPdf(pi_info).download(pi_info.pi_number)}>
				<PDF className='w-4' /> PDF
			</button>,
		];
	};

	return (
		<SectionContainer buttons={renderButtons()} title={'Information'}>
			<div className='grid grid-cols-1 lg:grid-cols-3 lg:gap-8'>
				<RenderTable
					className={'border-secondary/30 lg:border-r'}
					title={'Basic Info'}
					items={renderItems().basicInfo}
				/>
				<RenderTable
					className={'border-secondary/30 lg:border-l lg:border-r'}
					title={'Party Details'}
					items={renderItems().otherInfo}
				/>
				<RenderTable
					className={'border-secondary/30 lg:border-l'}
					title={'Bank Details'}
					items={renderItems().bankDetails}
				/>
			</div>
		</SectionContainer>
	);
}
