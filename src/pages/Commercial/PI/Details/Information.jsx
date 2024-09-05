import { PDF } from '@/assets/icons';
import PiPdf from '@/components/Pdf/PI';
import { DollarToWord } from '@/lib/NumToWord';
import SectionContainer from '@/ui/Others/SectionContainer';
import RenderTable from '@/ui/Others/Table/RenderTable';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';

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
		factory_address,
		validity,
		payment,
		created_by,
		created_by_name,
		created_at,
		updated_at,
		remarks,
		pi_entry,
	} = pi;

	const getUniqueValues = (field) =>
		Array.from(new Set(pi_entry?.map((item) => item[field]))).join(', ');
	const buyers = getUniqueValues('buyer_name');
	const orderNumbers = getUniqueValues('order_number');
	const styles = getUniqueValues('style');

	const [data, setData] = useState('');

	const pi_info = {
		...pi,
		pi_number: id,
		date: format(new Date(created_at), 'dd/MM/yy'),
		total_quantity: pi_entry.reduce((a, b) => a + b.pi_quantity, 0),
		total_value: pi_entry.reduce((a, b) => a + Number(b.value), 0),
		total_value_in_words: DollarToWord(
			pi_entry.reduce((a, b) => Number(a) + Number(b.value), 0)
		),
		buyer_names: buyers,
		order_numbers: orderNumbers,
		styles: styles,
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
						{orderNumbers
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
						{styles
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
				value: pi_entry.reduce(
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

		const bankDetails = [];

		const otherInfo = [
			{
				label: 'Bank',
				value: bank_name,
			},
			{
				label: 'Bank Swift Code',
				value: bank_swift_code,
			},
			{
				label: 'Bank Address',
				value: bank_address,
			},

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
			<div className='grid grid-cols-1 lg:grid-cols-2 lg:gap-8'>
				<RenderTable
					className={'border-secondary/30 lg:border-r'}
					title={'Basic Info'}
					items={renderItems().basicInfo}
				/>
				<RenderTable
					className={'border-secondary/30 lg:border-l'}
					title={'Other Details'}
					items={renderItems().otherInfo}
				/>
			</div>
		</SectionContainer>
	);
}
