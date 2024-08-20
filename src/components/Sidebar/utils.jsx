import { LogoutIcon, MenuDown, MenuOpenClose } from '@/assets/icons';
import { FilteredRoutes } from '@/routes';
import { useAuth } from '@context/auth';
import cn from '@lib/cn';
import { Fragment, memo } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './index.css';

// Utility function to capitalize the first letter of each word and remove underscores and hyphens
const removeUnderscoresAndHyphens = (text) => {
	return text.replace(/_/g, ' ').replace(/-/g, ' ');
};

function truncateText(text = '', maxLength) {
	if (text.length > maxLength) return text.substring(0, maxLength) + '...';

	return text;
}

const LogoutButton = memo(() => {
	const history = useLocation();
	const { Logout, user } = useAuth();

	const handleLogout = () => {
		Logout();
		history.push('/login');
	};

	return (
		<li>
			<NavLink
				to='/login'
				className='btn btn-error flex w-full justify-start bg-error text-left font-normal'
				onClick={handleLogout}>
				<LogoutIcon className='h-6 w-6' />
				<div className='flex flex-col justify-around'>
					<span className='truncate capitalize text-error-content'>
						{truncateText(user?.name, 15)}
					</span>
					<span className='text-[.6rem] capitalize text-error-content'>
						{user?.user_department}
					</span>
				</div>
			</NavLink>
		</li>
	);
});

const BrandLink = ({ ...props }) => {
	const go = FilteredRoutes()[0];

	return (
		<NavLink to={go?.path} {...props}>
			FZL
		</NavLink>
	);
};

const SectionButton = ({ isOpened, setIsOpened, type, className }) => {
	return (
		<button
			type='button'
			className={cn(
				'group flex w-full justify-between rounded-md border-secondary px-2 py-1 text-primary-content',
				isOpened ? 'bg-secondary/10' : 'hover:bg-secondary/10',
				className
			)}
			onClick={() => setIsOpened(!isOpened)}>
			<div className='flex items-center gap-x-2 capitalize'>
				<span>{removeUnderscoresAndHyphens(type)}</span>
			</div>
			<MenuDown
				className={cn(
					'h-5 w-5 -rotate-90 transform duration-300 ease-in-out group-hover:scale-150',
					isOpened && 'rotate-0'
				)}
			/>
		</button>
	);
};

const Row = ({ item }) => {
	return (
		<li
			className='animate-slideIn opacity-0'
			style={{ '--delay': 0.5 * 0.25 + 's' }}>
			<NavLink
				to={item.path}
				className={({ isActive }) =>
					cn(
						'block border-l-[3.5px] border-secondary px-2 py-[.35rem] duration-500',
						{
							'thick-border-active rounded-r-md text-secondary-content':
								isActive,
							'thick-border hover:text-secondary-content':
								!isActive,
						}
					)
				}>
				{item.name}
			</NavLink>
		</li>
	);
};

const MobileMenu = ({ isHidden = false }) => {
	return (
		<Fragment>
			<input type='checkbox' id='menu-open' className='hidden' />
			<header
				id='mobile-menu-bar'
				className={cn(
					'flex items-center justify-between bg-primary px-2 text-primary-content md:hidden',
					isHidden && 'hidden'
				)}>
				<BrandLink className='block truncate whitespace-nowrap text-2xl font-bold text-primary-content' />
				<div className='flex items-center'>
					<label
						htmlFor='menu-open'
						id='mobile-menu-button'
						className='btn btn-circle btn-ghost cursor-pointer'>
						<MenuOpenClose
							id1='menu-open-icon'
							id2='menu-close-icon'
							className='h-6 w-6 transition duration-700 ease-in-out'
						/>
					</label>
				</div>
			</header>
		</Fragment>
	);
};

const MenuIcon = ({ id }) => {
	return (
		<div className='flex-none md:hidden'>
			<label htmlFor={id} className='btn btn-square btn-ghost'>
				<svg
					xmlns='http://www.w3.org/2000/svg'
					fill='none'
					viewBox='0 0 24 24'
					className='inline-block h-6 w-6 stroke-current'>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth='2'
						d='M4 6h16M4 12h16M4 18h16'></path>
				</svg>
			</label>
		</div>
	);
};

export { BrandLink, LogoutButton, MenuIcon, MobileMenu, Row, SectionButton };
