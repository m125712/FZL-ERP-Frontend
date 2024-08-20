import {
	ManagerUser,
	MarketingUser,
	PPCUser,
	ProcurementUser,
	SparePartsUser,
	Store,
	UserShield,
	Viewer,
} from '@/assets/icons';
import clsx from 'clsx';

// "admin", "viewer", "manager", "store", "ppc", "procurement";
const iconAndName = {
	admin: {
		icon: <UserShield className='w-5' />,
		name: 'Admin',
		bg: 'bg-red-200',
		text: 'text-red-800',
		style: 'bg-red-200 text-red-800',
	},
	viewer: {
		icon: <Viewer className='w-5' />,
		name: 'Viewer',
		bg: 'bg-purple-200',
		text: 'text-purple-800',
		style: 'bg-purple-200 text-purple-800',
	},
	store: {
		icon: <Store className='w-5' />,
		name: 'Store',
		bg: 'bg-yellow-200',
		text: 'text-yellow-800',
		style: 'bg-yellow-200 text-yellow-800',
	},
	ppc: {
		icon: <PPCUser className='w-5' />,
		name: 'PPC',
		bg: 'bg-blue-200',
		text: 'text-blue-800',
		style: 'bg-blue-200 text-blue-800',
	},
	procurement: {
		icon: <ProcurementUser className='w-5' />,
		name: 'Procurement',
		bg: 'bg-green-200',
		text: 'text-green-800',
		style: 'bg-green-200 text-green-800',
	},
	manager: {
		icon: <ManagerUser className='w-5' />,
		name: 'Manager',
		bg: 'bg-pink-200',
		text: 'text-pink-800',
		style: 'bg-pink-200 text-pink-800',
	},
	'spare-parts': {
		icon: <SparePartsUser className='w-5' />,
		name: 'Spare Parts',
		bg: 'bg-indigo-200',
		text: 'text-indigo-800',
		style: 'bg-indigo-200 text-indigo-800',
	},
	marketing: {
		icon: <MarketingUser className='w-5' />,
		name: 'Marketing',
		bg: 'bg-indigo-200',
		text: 'text-indigo-800',
		style: 'bg-indigo-200 text-indigo-800',
	},
};

const Base = ({ department, children }) => {
	const { text, bg } = iconAndName[department] || {};
	return (
		<span
			className={clsx(
				'flex w-fit items-center gap-1 rounded-md bg-opacity-30 px-1 text-xs font-medium uppercase tracking-wider',
				text,
				bg
			)}>
			{children}
		</span>
	);
};
const DepartmentShow = ({ department }) => {
	const { icon, name } = iconAndName[department] || {};
	return (
		<Base department={department}>
			{icon} {name}
		</Base>
	);
};

const UserName = ({ name, department }) => {
	return <Base department={department}>{name}</Base>;
};

export { DepartmentShow, UserName };
