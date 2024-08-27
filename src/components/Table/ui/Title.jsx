import { Add } from '@/assets/icons';
import cn from '@/lib/cn';

const AddButton = ({ onClick }) => {
	return (
		<button type='button' onClick={onClick} className='btn-filter-accent'>
			<Add className='size-5' />

			<span>Add New</span>
		</button>
	);
};

const Indicator = ({ value = -1, onClick }) => {
	if (value === -1) return <AddButton onClick={onClick} />;
	return (
		<div className='indicator'>
			<span className='badge indicator-item badge-error'>{value}</span>
			<AddButton onClick={onClick} />
		</div>
	);
};

function Title({ title, subtitle }) {
	return (
		<div className='flex items-start justify-between gap-2 md:justify-start'>
			<div className='flex flex-col'>
				<h1 className='text-xl font-semibold capitalize leading-tight text-primary md:text-2xl'>
					{title}
				</h1>
				<p className='mt-0.5 text-sm capitalize text-secondary'>
					{subtitle || 'See all records in one place'}
				</p>
			</div>
		</div>
	);
}

function TitleOnly({ title, subtitle, className = '' }) {
	return (
		<div
			className={cn(
				'mb-1 flex items-center justify-between gap-2 md:justify-start',
				className
			)}>
			<div className='flex flex-col'>
				<h1 className='text-2xl font-semibold capitalize leading-tight text-primary md:text-3xl'>
					{title}
				</h1>
				{subtitle && (
					<p className='text-secondary-content -mt-1 text-[0.8rem] capitalize'>
						{subtitle}
					</p>
				)}
			</div>
		</div>
	);
}

export default Title;
export { AddButton, TitleOnly, Indicator };
