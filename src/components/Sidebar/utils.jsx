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
				className='btn btn-accent flex w-full justify-start text-left font-normal'
				onClick={handleLogout}>
				<LogoutIcon className='h-6 w-6' />
				<div className='flex flex-col justify-around'>
					<span className='text-error-content truncate capitalize'>
						{truncateText(user?.name, 15)}
					</span>
					<span className='text-error-content text-[.6rem] capitalize'>
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
				'text-primary-content group flex w-full justify-between px-6 py-2',
				isOpened
					? 'rounded-r-md bg-secondary/10'
					: 'rounded-md hover:bg-secondary/10',
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
						'block rounded-r-md border-l-[2px] px-4 py-2 font-normal duration-500',
						{
							'thick-border-active border-accent font-medium':
								isActive,
							'thick-border text-primary-content/70 hover:text-primary-content border-secondary':
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
					'text-primary-content flex items-center justify-between bg-primary px-2 md:hidden',
					isHidden && 'hidden'
				)}>
				<BrandLink className='text-primary-content block truncate whitespace-nowrap text-2xl font-bold' />
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
