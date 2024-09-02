import ReactTable from '@/components/Table';

const ReactTableWithTitle = ({ title, data, columns }) => {
	return (
		<ReactTable
			title={title}
			titleClassName='text-primary-content'
			headerClassName='px-4 py-3 bg-primary border border-secondary/30 border-b-0 mb-0 rounded-t-md'
			containerClassName='mb-0 rounded-t-none'
			data={data}
			columns={columns}
			showTitleOnly
		/>
	);
};

export default ReactTableWithTitle;
