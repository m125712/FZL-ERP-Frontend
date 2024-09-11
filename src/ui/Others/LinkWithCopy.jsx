import { ShowLocalToast } from '@/components/Toast';
import { Clipboard } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

const CopyButton = ({ id }) => {
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
			aria-label='Copy ID to clipboard'>
			<Clipboard className='h-4 w-4 transition-transform duration-200 hover:scale-110' />
		</div>
	);
};

const BaseBody = ({ value, to, showCopyButton = true }) => {
	return (
		<button className='flex items-center gap-2 text-left font-semibold underline underline-offset-2 transition-colors duration-300 hover:text-info hover:decoration-info'>
			{showCopyButton && <CopyButton id={value} />}

			<Link to={to} target='_blank'>
				{value}
			</Link>
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

export { LinkCopyOnly, LinkOnly, LinkWithCopy };
