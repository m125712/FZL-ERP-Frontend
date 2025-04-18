import ReactTable from '@/components/Table';

const ReactTableTitleOnly = ({
	title,
	data,
	columns,
	showColumnsHeader,
	children,
}) => {
	return (
		<ReactTable
			title={title}
			containerClassName='mb-0 rounded-t-none'
			data={data}
			columns={columns}
			showColumnsHeader={showColumnsHeader}
			showTitleOnly>
			{children}
		</ReactTable>
	);
};

export default ReactTableTitleOnly;
