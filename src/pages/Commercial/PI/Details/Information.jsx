import { PDF } from '@/assets/icons';
import PiPdf from '@/components/Pdf/PI';
import { DollarToWord } from '@/lib/NumToWord';
import { DateTime, TitleValue } from '@/ui';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';

const BuyerAndFactory = (pi) => {
	return (
		<div>
			<TitleValue title='PI No' value={pi?.uuid} />
			<TitleValue
				title='Value ($)'
				value={pi?.pi_entry.reduce((a, b) => a + b.value, 0)}
			/>
			<TitleValue title='Payment' value={pi?.payment + ' Days'} />
			<TitleValue title='Validity' value={pi?.validity + ' Days'} />
		</div>
	);
};

function OthersInfo(pi) {
	return (
		<div>
			<TitleValue title='Marketing' value={pi?.marketing_name} />
			<TitleValue title='Factory' value={pi?.factory_name} />
			<TitleValue title='Address' value={pi?.factory_address} />
			<TitleValue title='Party' value={pi?.party_name} />
			<TitleValue title='Merchandiser' value={pi?.merchandiser_name} />
		</div>
	);
}
function BankInfo(pi) {
	return (
		<div>
			<TitleValue title='Bank' value={pi?.bank_name} />
			<TitleValue title='Bank Address' value={pi?.bank_address} />
			<TitleValue title='Swift Code' value={pi?.bank_swift_code} />
			<TitleValue
				title='Date'
				value={<DateTime date={pi?.created_at} isTime={false} />}
			/>
		</div>
	);
}
function OrderNumbersAndStyles(pi) {
	const getUniqueValues = (field) =>
		Array.from(new Set(pi.pi_entry.map((item) => item[field]))).join(', ');
	const buyers = getUniqueValues('buyer_name');
	const orderNumbers = getUniqueValues('order_number');
	const styles = getUniqueValues('style');
	return (
		<div>
			<TitleValue title='Buyers' value={buyers} />
			<TitleValue title='O/N' value={orderNumbers} />
			<TitleValue title='Styles' value={styles} />
		</div>
	);
}

export default function Information({ pi }) {
	const getUniqueValues = (field) =>
		Array.from(new Set(pi.pi_entry.map((item) => item[field]))).join(', ');
	const buyers = getUniqueValues('buyer_name');
	const orderNumbers = getUniqueValues('order_number');
	const styles = getUniqueValues('style');
	const pi_info = {
		...pi,
		pi_number: pi?.uuid,
		date: format(new Date(pi?.created_at), 'dd/MM/yy'),
		total_quantity: pi?.pi_entry.reduce((a, b) => a + b.pi_quantity, 0),
		total_value: pi?.pi_entry.reduce((a, b) => a + Number(b.value), 0),
		total_value_in_words: DollarToWord(
			pi?.pi_entry.reduce((a, b) => Number(a) + Number(b.value), 0)
		),
		buyer_names: buyers,
		order_numbers: orderNumbers,
		styles: styles,
	};

	const [data, setData] = useState('');
	useEffect(() => {
		PiPdf(pi_info).then((res) => setData(res));
	}, [pi]);

	console.log({
		data,
	});

	return (
		<div className='my-2 flex flex-col rounded-md px-2 shadow-md'>
			<iframe
				src={data}
				className='h-[40rem] w-full rounded-md border-none'
			/>
			<span className='flex items-center gap-2 text-2xl font-semibold capitalize leading-tight text-primary md:text-3xl'>
				Information
				<button
					type='button'
					className='btn btn-primary btn-sm rounded-badge'
					onClick={() => PiPdf(pi_info).download(pi_info.pi_number)}>
					<PDF className='w-4' /> PDF
				</button>
			</span>
			<hr className='border-1 my-2 border-secondary-content' />

			<div className='flex flex-col items-baseline justify-start text-sm md:flex-row'>
				<BuyerAndFactory {...pi} />
				<hr className='divider divider-primary divider-vertical md:divider-horizontal' />
				<OthersInfo {...pi} />
				<hr className='divider divider-primary divider-vertical md:divider-horizontal' />
				<BankInfo {...pi} />
				<hr className='divider divider-primary divider-vertical md:divider-horizontal' />
				<OrderNumbersAndStyles {...pi} />
			</div>
		</div>
	);
}
