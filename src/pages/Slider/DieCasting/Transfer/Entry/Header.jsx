import { CheckBox } from '@/ui';

const Header = ({ register, errors }) => {
	const cbClass =
		'h-fit w-fit rounded border border-primary/30 bg-primary/5 px-2';
	return (
		<div className='flex gap-4'>
			<CheckBox
				label='is_body'
				title='Body'
				height='h-[2.9rem] '
				className={cbClass}
				{...{ register, errors }}
			/>
			<CheckBox
				label='is_cap'
				title='Cap'
				height='h-[2.9rem] '
				className={cbClass}
				{...{ register, errors }}
			/>
			<CheckBox
				label='is_puller'
				title='Puller'
				height='h-[2.9rem] '
				className={cbClass}
				{...{ register, errors }}
			/>
			<CheckBox
				label='is_link'
				title='Link'
				height='h-[2.9rem] '
				className={cbClass}
				{...{ register, errors }}
			/>
		</div>
	);
};

export default Header;
