import { PRIVATE_ROUTES } from '@/routes';
import { useAuth } from '@context/auth';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import FilesystemItem from './filesystem-item';
import './index.css';
import { BrandLink, LogoutButton, MenuIcon, Row, SectionButton } from './utils';
import cn from '@/lib/cn';

const ThirdChildMenu = ({ items, type }) => {
	const [isOpened, setIsOpened] = useState(true);

	return (
		<li key={type} className={`${!isOpened && 'mb-2'}`}>
			<SectionButton {...{ isOpened, setIsOpened, type }} />
			{isOpened && (
				<ul className='text-md pl-2 text-primary-content transition-all duration-500 ease-in-out md:pl-4'>
					{items.map((item) => (
						<Row key={item.path} {...{ item }} />
					))}
				</ul>
			)}
		</li>
	);
};

const SecondChildMenu = ({ items }) => {
	return Object.entries(items).map(([type, items]) => (
		<ThirdChildMenu key={type} {...{ items, type }} />
	));
};

function FirstChildMenu(items) {
	if (showingColumns.includes(items.type)) {
		return <SecondChildMenu key={items.type} items={items.items} />;
	}
	return <Row key={items.path} {...{ item: items }} />;
}

const Menu = ({ items, type }) => {
	const [isOpened, setIsOpened] = useState(false);

	let { obj, parentObj } = items.reduce(
		(acc, item) => {
			if (Array.isArray(item.type)) {
				acc.obj[item.type[1]] = [
					...(acc.obj[item.type[1]] || []),
					item,
				];
				acc.parentObj[item.type[0]] = acc.obj;
			}
			return acc;
		},
		{ obj: {}, parentObj: {} }
	);

	const finalItems = [
		...items.filter((item) => !Array.isArray(item.type)),
		...Object.entries(parentObj).map(([key, value]) => ({
			type: key,
			items: value,
		})),
	];

	return (
		<li
			className={cn(
				'border-l-[2px]',
				isOpened ? 'border-secondary' : 'border-transparent'
			)}>
			<SectionButton {...{ isOpened, setIsOpened, type }} />
			{isOpened && (
				<ul className='text-md pl-4 text-primary-content transition-all duration-500 ease-in-out md:pl-6'>
					{finalItems.map((item) => ({ ...FirstChildMenu(item) }))}
				</ul>
			)}
		</li>
	);
};

const SingleMenu = ({ items }) => {
	const cls = `block border-l-[2px]  px-6 py-2 duration-500 `;
	return (
		<ul className='text-md text-primary-content transition-all duration-500 ease-in-out'>
			{items.map((item) => (
				<NavLink
					key={item.path}
					to={item.path}
					className={(nav) =>
						nav.isActive
							? `thick-border-active w-full rounded-r border-accent bg-opacity-10 text-white ${cls}`
							: `w-full rounded border-transparent hover:bg-secondary/10 hover:text-primary-content ${cls}`
					}>
					{item.name}
				</NavLink>
			))}
		</ul>
	);
};

const getRoutes = () => {
	const { can_access } = useAuth();

	return (
		PRIVATE_ROUTES.filter(
			({ page_name, hidden }) =>
				page_name === 'admin__public' ||
				(!hidden &&
					page_name !== undefined &&
					can_access?.[page_name]?.includes('read'))
		) || {}
	);
};

// for testing
// const FilteredRoutes = (can_access) =>
// 	PRIVATE_ROUTES.filter((item) => !item.hidden);

// Rest of the code remains the same
const showingColumns = ['common', 'metal', 'vislon', 'nylon', 'slider'];
const Sidebar = () => {
	const routes = getRoutes();

	function filterRoutes(type) {
		return routes.filter(
			(item) =>
				(Array.isArray(item.type) ? item.type[0] : item.type) === type
		);
	}

	function filterRoutesIndividual(type) {
		return routes.filter((item) => item?.view === 'individual');
	}

	const pages = {
		// if it is a nested route, then the parent name should be in ⇾ showingColumns
		order: filterRoutes('order'),
		lab_dip: filterRoutes('lab_dip'),
		thread: filterRoutes('thread'),
		commercial: filterRoutes('commercial'),
		delivery: filterRoutes('delivery'),
		store: filterRoutes('store'),
		common: filterRoutes('common'),
		dashboard: filterRoutes('dashboard'),
		dyeing: filterRoutes('dyeing'),
		nylon: filterRoutes('nylon'),
		vislon: filterRoutes('vislon'),
		metal: filterRoutes('metal'),
		slider: filterRoutes('slider'),
		hr: filterRoutes('hr'),
		library: filterRoutes('library'),
		report: filterRoutes('report'),
	};

	const individualPages = {
		// if it is a nested route, then the parent name should be in ⇾ showingColumns
		dashboard: filterRoutesIndividual('dashboard'),
	};

	return (
		<div className='min-h-full bg-primary'>
			<div className='border-b border-secondary px-4 py-6'>
				<BrandLink className='flex items-center justify-center text-2xl font-bold text-primary-content md:text-4xl' />
			</div>

			<div className='flex flex-col justify-between gap-8 overflow-auto p-4'>
				<ul className='flex-1 space-y-1 text-sm font-normal'>
					{Object.entries(individualPages).map(
						([type, items]) =>
							items.length > 0 && (
								<SingleMenu key={type} {...{ items }} />
							)
					)}
					{Object.entries(pages).map(
						([type, items]) =>
							items.length > 0 && (
								<Menu key={type} {...{ items, type }} />
							)
					)}
				</ul>

				<div className='py-4'>
					<LogoutButton />
				</div>
			</div>
		</div>
	);
};

const MobileHeader = ({ id }) => {
	return (
		<header className='flex items-center justify-between bg-primary px-2 text-primary-content md:hidden'>
			<BrandLink className='block truncate whitespace-nowrap text-2xl font-bold text-primary-content' />
			<div className='flex items-center'>
				<MenuIcon id={id} />
			</div>
		</header>
	);
};

let node = [
	{
		name: 'Home',
		nodes: [
			{
				name: 'Movies',
				nodes: [
					{
						name: 'Action',
						nodes: [
							{
								name: '2000s',
								nodes: [
									{ name: 'Gladiator.mp4' },
									{ name: 'The-Dark-Knight.mp4' },
								],
							},
							{ name: '2010s', nodes: [] },
						],
					},
					{
						name: 'Comedy',
						nodes: [
							{
								name: '2000s',
								nodes: [{ name: 'Superbad.mp4' }],
							},
						],
					},
					{
						name: 'Drama',
						nodes: [
							{
								name: '2000s',
								nodes: [{ name: 'American-Beauty.mp4' }],
							},
						],
					},
				],
			},
			{
				name: 'Music',
				nodes: [
					{ name: 'Rock', nodes: [] },
					{ name: 'Classical', nodes: [] },
				],
			},
			{ name: 'Pictures', nodes: [] },
			{
				name: 'Documents',
				nodes: [],
			},
			{ name: 'passwords.txt' },
		],
	},
];

const Aside = ({ id }) => {
	return (
		<aside className='drawer-side min-w-[17rem]'>
			<label
				htmlFor={id}
				aria-label='close sidebar'
				className='drawer-overlay'
			/>
			<Sidebar />
			{/* <FilesystemItem /> */}
		</aside>
	);
};

export { Aside, MobileHeader, Sidebar };
