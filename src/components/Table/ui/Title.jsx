import { Add } from '@/assets/icons';
import cn from '@/lib/cn';

const AddButton = ({ onClick }) => {
	return (
		<button
			type='button'
			onClick={onClick}
			className='btn btn-primary btn-sm p-0 px-1.5'>
			<Add className='h-6 w-6' /> NEW
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

function Title({
	title,
	subtitle,
	handelAdd = () => {},
	accessor,
	indicatorValue,
}) {
	return (
		<div className='mb-4 flex items-start justify-between gap-2 md:justify-start'>
			<div className='flex flex-col'>
				<h1 className='text-2xl font-semibold capitalize leading-tight text-primary md:text-3xl'>
					{title}
				</h1>
				{subtitle && (
					<p className='-mt-1 text-[0.8rem] capitalize text-secondary-content'>
						{subtitle}
					</p>
				)}
			</div>
			{accessor && handelAdd && (
				<Indicator value={indicatorValue} onClick={handelAdd} />
			)}
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
					<p className='-mt-1 text-[0.8rem] capitalize text-secondary-content'>
						{subtitle}
					</p>
				)}
			</div>
		</div>
	);
}

export default Title;
export { AddButton, TitleOnly };
