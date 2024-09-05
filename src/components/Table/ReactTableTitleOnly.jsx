import ReactTable from '@/components/Table';

const ReactTableTitleOnly = ({ title, data, columns, children }) => {
	return (
		<ReactTable
			title={title}
			containerClassName='mb-0 rounded-t-none'
			data={data}
			columns={columns}
			showTitleOnly>
			{children}
		</ReactTable>
	);
};

export default ReactTableTitleOnly;
