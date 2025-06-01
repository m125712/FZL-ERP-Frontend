import { Clipboard } from 'lucide-react';
import { Link } from 'react-router';

import { ShowLocalToast } from '@/components/Toast';

import { cn } from '@/lib/utils';

const CopyButton = ({ id, className }) => {
	const handleOnClick = () => {
		navigator.clipboard.writeText(id);

		ShowLocalToast({
			type: 'create',
			message: `${id} copied`,
		});
	};

	return (
		<div
			type='button'
			onClick={() => handleOnClick()}
			aria-label='Copy ID to clipboard'
		>
			<Clipboard
				className={cn(
					'h-4 w-4 transition-transform duration-200 hover:scale-110',
					className
				)}
			/>
		</div>
	);
};

const BaseBody = ({ value, to, showCopyButton = true }) => {
	if (!value) return '--';
	return (
		<button className='flex items-center gap-2 text-left font-semibold underline underline-offset-2 transition-colors duration-300 hover:text-info hover:decoration-info'>
			{showCopyButton && <CopyButton id={value} />}

			<Link to={to}>{value}</Link>
		</button>
	);
};

const LinkWithCopy = ({ title = '', id, uri = '' }) => {
	const value = title ? title : id;
	const to = `${uri}/${id}`;

	return <BaseBody value={value} to={to} />;
};

const LinkOnly = ({ title = '', id, uri = '' }) => {
	const value = title ? title : id;
	const to = `${uri}/${id}`;

	return <BaseBody value={value} to={to} showCopyButton={false} />;
};

const LinkCopyOnly = ({ id }) => (
	<button className='flex items-center gap-2 text-left font-semibold'>
		<CopyButton id={id} />
		<span>{id}</span>
	</button>
);

const CustomLink = ({
	label = null,
	url = null,
	showCopyButton = true,
	openInNewTab = false,
	className = '',
}) => {
	if (!label) return '--';

	return (
		<div key={label} className={cn('flex items-center gap-2', className)}>
			{showCopyButton && (
				<CopyButton
					id={label}
					className='transition-colors duration-300 hover:text-info hover:decoration-info'
				/>
			)}

			{url === null ? (
				<span>{label}</span>
			) : (
				<Link
					to={url}
					className={cn(
						'font-semibold underline underline-offset-2 transition-colors duration-300 hover:text-info hover:decoration-info',
						url !== null
							? 'cursor-pointer'
							: 'pointer-events-none cursor-not-allowed'
					)}
					target={openInNewTab ? '_blank' : '_self'}
				>
					{label}
				</Link>
			)}
		</div>
	);
};

export { LinkCopyOnly, LinkOnly, LinkWithCopy, CustomLink };
