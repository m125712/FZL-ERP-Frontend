import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/context/auth';
import { useAdminGlobalLog } from '@/state/Admin';
import { useOtherSchema, useOtherTable } from '@/state/Other';
import { format } from 'date-fns';

import ReactTable from '@/components/Table';
import { DateTime, SimpleDatePicker, StatusSelect } from '@/ui';

import PageInfo from '@/util/PageInfo';

const operationsOptions = [
	{ value: 'UPDATE', label: 'Update' },
	{ value: 'DELETE', label: 'Delete' },
];

export default function Index() {
	const { user } = useAuth();

	const [date, setDate] = useState(() => new Date());
	const [toDate, setToDate] = useState(() => new Date());

	const [schema, setSchema] = useState('');
	const [table, setTable] = useState('');
	const [operation, setOperation] = useState('');

	const { data: schemaOptions } = useOtherSchema();
	const { data: tableOptions } = useOtherTable(`schema_name=${schema}`);

	const { data, isLoading } = useAdminGlobalLog(
		schema,
		table,
		operation,
		format(date, 'yyyy-MM-dd'),
		format(toDate, 'yyyy-MM-dd'),
		{ enabled: !!user?.uuid }
	);

	const info = new PageInfo(
		'Global Log',
		'/hr/global-log',
		'admin__global_log'
	);

	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	const columns = useMemo(
		() => [
			{
				accessorKey: 'id',
				header: 'Id',
				enableColumnFilter: false,
			},
			{
				accessorKey: 'schema_name',
				header: 'Schema',
				enableColumnFilter: false,
			},
			{
				accessorKey: 'table_name',
				header: 'Table',
				enableColumnFilter: false,
			},
			{
				accessorKey: 'record_id',
				header: 'Record',
				enableColumnFilter: false,
			},
			{
				accessorKey: 'operation',
				header: 'Operation',
				enableColumnFilter: false,
			},
			{
				accessorKey: 'column_name',
				header: 'Column',
				enableColumnFilter: false,
			},
			{
				accessorFn: (row) => {
					if (row.operation === 'DELETE') {
						const result = Object.entries(row.old_value).map(
							([key, value]) => `${key}: ${value}`
						);
						return result.join(', ');
					} else {
						return row.old_value;
					}
				},
				id: 'old_value',
				header: 'Old Value',
				width: 'w-10',
				enableColumnFilter: false,
				cell: (info) => {
					if (info.row.original.operation === 'DELETE') {
						const result = Object.entries(
							info.row.original.old_value
						).map(([key, value]) => `${key}: ${value}`);
						return (
							<ul>
								{result.map((item, index) => (
									<li key={index}>{item}</li>
								))}
							</ul>
						);
					} else {
						return info.getValue();
					}
				},
			},
			{
				accessorFn: (row) => {
					if (row.operation === 'DELETE') {
						return '---';
					} else {
						return row.new_value;
					}
				},
				id: 'new_value',
				header: 'New Value',
				width: 'w-10',
				enableColumnFilter: false,
				cell: (info) => {
					if (info.row.original.operation === 'DELETE') {
						return '---';
					} else {
						return info.getValue();
					}
				},
			},
			{
				accessorKey: 'changed_at',
				header: 'Changed At',
				enableColumnFilter: false,
				cell: (info) => (
					<DateTime date={info.getValue()} isTime={true} />
				),
			},
			{
				accessorKey: 'changed_by_name',
				header: 'Changed By',
				enableColumnFilter: false,
			},
			{
				accessorKey: 'remarks',
				header: 'Remarks',
				enableColumnFilter: false,
			},
		],
		[data]
	);

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<ReactTable
			showDateRange={false}
			title={'Global Log'}
			accessor={false}
			data={data}
			columns={columns}
			extraButton={
				<div className='flex items-center gap-2'>
					<StatusSelect
						status={schema}
						setStatus={setSchema}
						options={schemaOptions}
						placeholder='Select Schema'
					/>
					<StatusSelect
						status={table}
						setStatus={setTable}
						options={tableOptions}
						placeholder='Select Table'
					/>
					<StatusSelect
						status={operation}
						setStatus={setOperation}
						options={operationsOptions}
						placeholder='Select Operation'
					/>
					<SimpleDatePicker
						className='h-[2.34rem] w-32'
						key={'Date'}
						value={date}
						placeholder='Date'
						onChange={(data) => {
							setDate(data);
						}}
						selected={date}
					/>
					<SimpleDatePicker
						className='h-[2.34rem] w-32'
						key={'toDate'}
						value={toDate}
						placeholder='To'
						onChange={(data) => {
							setToDate(data);
						}}
						selected={toDate}
					/>
				</div>
			}
		/>
	);
}
