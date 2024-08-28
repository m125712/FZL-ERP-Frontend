import { Suspense } from '@/components/Feedback';
import ReactTable from '@/components/Table';
import { useAuth } from '@/context/auth';
import { useAccess, useFetch } from '@/hooks';
import { useDyeingThreadBatch } from '@/state/Dyeing';
import {
	DateTime,
	EditDelete,
	LinkWithCopy,
	ReactSelect,
	StatusButton,
} from '@/ui';
import GetDateTime from '@/util/GetDateTime';
import PageInfo from '@/util/PageInfo';
import { lazy, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
const Yarn = lazy(() => import('../ThreadBatch/Yarn'));
const Dyeing = lazy(() => import('../ThreadBatch/Dyeing'));

export default function Index() {
	const { data, url, updateData, postData, deleteData, isLoading } =
		useDyeingThreadBatch();
	const info = new PageInfo('Thread Batch', url, 'dyeing__batch');
	const { value: machine } = useFetch('/other/machine/value/label');
	const { user } = useAuth();
	const haveAccess = useAccess('dyeing__batch');
	const navigate = useNavigate();
	const columns = useMemo(
		() => [
			// * batch_id
			{
				accessorKey: 'batch_id',
				header: 'Batch ID',
				enableColumnFilter: false,
				cell: (info) => (
					<LinkWithCopy
						title={info.getValue()}
						id={info.row.original.uuid}
						uri='/dyeing-and-iron/thread-batch/details'
					/>
				),
			},
			{
				accessorKey: 'add_actions',
				header: '',
				enableColumnFilter: false,
				enableSorting: false,
				hidden: !haveAccess.includes('create'),
				width: 'w-24',
				cell: (info) => {
					const { week } = info.row.original;
					return (
						<button
							className='btn btn-primary btn-xs'
							onClick={() =>
								navigate(
									`/dyeing-and-iron/batch/batch-production/${info.row.original.uuid}`
								)
							}>
							Add Production
						</button>
					);
				},
			},
			{
				accessorKey: 'coneing_actions',
				header: '',
				enableColumnFilter: false,
				enableSorting: false,
				hidden: !haveAccess.includes('create'),
				width: 'w-24',
				cell: (info) => {
					const { week } = info.row.original;
					return (
						<button
							className='btn btn-primary btn-xs'
							onClick={() =>
								navigate(
									`/dyeing-and-iron/batch/batch-conneing/${info.row.original.uuid}`
								)
							}>
							Add Conneing
						</button>
					);
				},
			},
			{
				accessorKey: 'machine_name',
				header: 'Machine',
				enableColumnFilter: false,
				cell: (info) => {
					const { machine_uuid } = info.row.original;

					return (
						<ReactSelect
							key={machine_uuid}
							placeholder='Select Machine'
							options={machine ?? []}
							value={machine?.filter(
								(item) => item.value === machine_uuid
							)}
							filterOption={null}
							onChange={(e) => handleMachine(e, info.row.index)}
							menuPortalTarget={document.body}
						/>
					);
				},
			},
			{
				accessorKey: 'yarn_actions',
				header: 'Yarn',
				enableColumnFilter: false,
				enableSorting: false,
				hidden: !haveAccess.includes('update'),
				width: 'w-24',
				cell: (info) => (
					<button
						className='btn btn-primary btn-xs'
						onClick={() => handelYarn(info.row.index)}>
						Yarn Issue
					</button>
				),
			},
			{
				accessorKey: 'dyeing_actions',
				header: 'Dyeing',
				enableColumnFilter: false,
				enableSorting: false,
				hidden: !haveAccess.includes('update'),
				width: 'w-24',
				cell: (info) => (
					<button
						className='btn btn-primary btn-xs'
						onClick={() => handelDyeing(info.row.index)}>
						Dyeing
					</button>
				),
			},
			{
				accessorKey: 'is_drying_complete',
				header: 'Drying Completed',
				enableColumnFilter: false,
				cell: (info) => (
					<StatusButton
						size='btn-sm'
						value={info.getValue() === 'true' ? 1 : 0}
						onClick={() => handelDryingComplete(info.row.index)}
					/>
				),
			},
			{
				accessorKey: 'created_by_name',
				header: 'Created By',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			,
			// * created_at
			{
				accessorKey: 'created_at',
				header: 'Created at',
				width: 'w-40',
				enableColumnFilter: false,
				cell: (info) => {
					return <DateTime date={info.getValue()} />;
				},
			},
			// * updated_at
			{
				accessorKey: 'updated_at',
				header: 'Updated at',
				width: 'w-24',
				enableColumnFilter: false,
				cell: (info) => <DateTime date={info.getValue()} />,
			},
			// * remarks
			{
				accessorKey: 'remarks',
				header: 'Remarks',
				width: 'w-24',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			// * actions
			{
				accessorKey: 'actions',
				header: 'Actions',
				enableColumnFilter: false,
				enableSorting: false,
				hidden: !haveAccess.includes('update'),
				width: 'w-24',
				cell: (info) => (
					<EditDelete
						idx={info.row.index}
						handelUpdate={handelUpdate}
						showEdit={haveAccess.includes('update')}
						showDelete={false}
					/>
				),
			},
		],
		[data, machine]
	);

	//Drying Completed
	const handelDryingComplete = async (idx) => {
		if (data[idx]?.is_drying_complete === null) {
			await updateData.mutateAsync({
				url: `${url}/${data[idx]?.uuid}`,
				updatedData: {
					is_drying_complete: true,
					drying_created_at: GetDateTime(),
				},
				isOnCloseNeeded: false,
			});
		} else {
			await updateData.mutateAsync({
				url: `${url}/${data[idx]?.uuid}`,
				updatedData: {
					is_drying_complete:
						data[idx]?.is_drying_complete === 'true' ? false : true,
					drying_updated_at: GetDateTime(),
				},
				isOnCloseNeeded: false,
			});
		}
	};
	// Machine
	const handleMachine = async (e, idx) => {
		if (data[idx]?.machine_uuid === null) {
			await updateData.mutateAsync({
				url: `${url}/${data[idx]?.uuid}`,
				updatedData: {
					machine_uuid: e.value,
					lab_created_by: user?.uuid,
					lab_created_at: GetDateTime(),
				},
				isOnCloseNeeded: false,
			});
		} else {
			await updateData.mutateAsync({
				url: `${url}/${data[idx]?.uuid}`,
				updatedData: {
					machine_uuid: e.value,
					lab_updated_at: GetDateTime(),
				},
				isOnCloseNeeded: false,
			});
		}
	};
	//Yarn

	const [yarn, setYarn] = useState({
		uuid: null,
		yarn_quantity: null,
	});
	const handelYarn = (idx) => {
		setYarn((prev) => ({
			...prev,
			uuid: data[idx].uuid,
			yarn_quantity: data[idx].yarn_quantity,
			batch_id: data[idx].batch_id,
		}));
		window['YarnModal'].showModal();
	};
	const [dyeing, setDyeing] = useState({
		uuid: null,
		dyeing_operator: null,
		batch_id: null,
	});
	const handelDyeing = (idx) => {
		console.log(data[idx], 'data');
		setDyeing((prev) => ({
			...prev,
			uuid: data[idx].uuid,
			batch_id: data[idx].batch_id,
			dyeing_operator: data[idx].dyeing_operator,
		}));
		window['DyeingModal'].showModal();
	};

	// Add
	const handelAdd = () => navigate('/dyeing-and-iron/thread-batch/entry');

	// Update
	const handelUpdate = (idx) => {
		const { uuid } = data[idx];

		navigate(`/dyeing-and-iron/thread-batch/update/${uuid}`);
	};

	// get tabname
	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;
	// if (error) return <h1>Error:{error}</h1>;

	return (
		<div className='container mx-auto px-2 md:px-4'>
			<ReactTable
				handelAdd={handelAdd}
				title={info.getTitle()}
				data={data}
				columns={columns}
				accessor={haveAccess.includes('create')}
				extraClass='py-2'
			/>
			{/* <Suspense>
				<AddOrUpdate
					modalId={info.getAddOrUpdateModalId()}
					{...{
						setSwatch,
						updateSwatch,
						setUpdateSwatch,
					}}
				/>
			</Suspense> */}
			<Suspense>
				<Yarn
					modalId={'YarnModal'}
					{...{
						yarn,
						setYarn,
					}}
				/>
			</Suspense>
			<Suspense>
				<Dyeing
					modalId={'DyeingModal'}
					{...{
						dyeing,
						setDyeing,
					}}
				/>
			</Suspense>
		</div>
	);
}
