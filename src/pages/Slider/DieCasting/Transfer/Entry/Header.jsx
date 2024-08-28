import { CheckBox } from '@/ui';

const Header = ({ register, errors }) => {
	const node = [
		{
			label: 'is_body',
			title: 'Body',
		},
		{
			label: 'is_cap',
			title: 'Cap',
		},
		{
			label: 'is_puller',
			title: 'Puller',
		},
		{
			label: 'is_link',
			title: 'Link',
		},
	];

	return (
		<div className='flex gap-4'>
			{node.map((item) => {
				return (
					<CheckBox
						key={item.label}
						label={item.label}
						title={item.title}
						height='h-[2.9rem] '
						className='h-fit w-fit rounded border border-primary/30 bg-primary/5 px-2'
						{...{ register, errors }}
					/>
				);
			})}
		</div>
	);
};

export default Header;
