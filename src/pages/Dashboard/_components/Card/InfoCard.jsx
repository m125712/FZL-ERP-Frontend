import numeral from 'numeral';

const Body = ({ title, value, cls = 'text-error' }) => {
	const formatNumber = (number) => numeral(number).format('0.0a');

	return (
		<div>
			<h4 className='text-2xl font-bold'>{formatNumber(value)}</h4>
			<span className={`stat-desc font-bold ${cls}`}>{title}</span>
		</div>
	);
};

export default function InfoCard({ title, notapproved, approved }) {
	return (
		<div className='flex flex-col flex-wrap rounded-md bg-secondary shadow-md'>
			<div className='rounded-t-md py-1 text-center text-primary-content'>
				{title}
			</div>
			<div className='flex items-center justify-around gap-4 rounded-md bg-base-200 px-2.5 py-2'>
				<Body title='Not Approved' value={notapproved} />
				<Body title='Approved' value={approved} cls='text-primary' />
			</div>
		</div>
	);
}
