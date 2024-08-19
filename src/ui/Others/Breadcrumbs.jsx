import { RightArrow } from '@/assets/icons';
import cn from '@/lib/cn';
import { Link } from 'react-router-dom';

const Breadcrumbs = ({ items }) => {
	return (
		<div className='flex gap-1 text-sm'>
			<div className='flex items-center'>
				<Link to='/dashboard' className=''>
					Dashboard
				</Link>
				{items?.length > 0 && (
					<span className='ml-1'>
						<RightArrow />
					</span>
				)}
			</div>
			{items.map((item, index) => (
				<div
					key={index}
					className={cn(
						'flex items-center',
						index === items?.length - 1 && 'font-medium'
					)}>
					{item.isDisabled ? (
						<span className='opacity-00'>{item?.label}</span>
					) : (
						<Link to={item.href} className=''>
							{item.label}
						</Link>
					)}

					{index !== items?.length - 1 && (
						<span className={cn('ml-1')}>
							<RightArrow />
						</span>
					)}
				</div>
			))}
		</div>
	);
};

export default Breadcrumbs;
