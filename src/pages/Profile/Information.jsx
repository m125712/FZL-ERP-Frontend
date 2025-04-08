import { lazy, useState } from 'react';
import { format } from 'date-fns';
import { useAccess } from '@/hooks';

import { Suspense } from '@/components/Feedback';
import SectionContainer from '@/ui/Others/SectionContainer';
import RenderTable from '@/ui/Others/Table/RenderTable';

const AddOrUpdate = lazy(() => import('./AddOrUpdate'));
const ResetPass = lazy(() => import('../Admin/User/ResetPass'));

export default function Information({ data }) {
	const {
		name,
		email,
		designation,
		department,
		phone,
		ext,
		created_at,
		updated_at,
		remarks,
	} = data;

	const haveAccess = useAccess('profile');
	const updateAccess = haveAccess.includes('update');
	const resetAccess = haveAccess.includes('reset_password');
	const [updateUser, setUpdateUser] = useState({
		uuid: null,
		department_designation: null,
	});

	const handelUpdate = () => {
		setUpdateUser({
			uuid: data.uuid,
			department_designation: data.department_designation,
		});

		window['update_profile_modal']?.showModal();
	};

	// Reset Password
	const [resPass, setResPass] = useState({
		uuid: null,
		name: null,
	});
	const handelResetPass = async () => {
		setResPass((prev) => ({
			...prev,
			uuid: data.uuid,
			name: data.name,
		}));

		window['reset_pass_modal'].showModal();
	};
	const renderItems = () => {
		return [
			{
				label: 'Name',
				value: name,
			},
			{
				label: 'Email',
				value: email,
			},
			{
				label: 'Designation',
				value: designation,
			},
			{
				label: 'Department',
				value: department,
			},
			{
				label: 'Phone',
				value: phone,
			},
			{
				label: 'Ext',
				value: ext,
			},
			{
				label: 'Created',
				value: format(new Date(created_at), 'dd/MM/yy'),
			},
			{
				label: 'Updated',
				value: format(new Date(updated_at), 'dd/MM/yy'),
			},
			{ label: 'Remarks', value: remarks },
			{
				label: 'Edit',
				value: (
					<button className='btn bg-black/10' onClick={handelUpdate}>
						Edit
					</button>
				),
			},
			{
				label: 'Reset Password',
				value: (
					<button
						className='btn bg-black/10'
						onClick={handelResetPass}
					>
						Reset Password
					</button>
				),
			},
		];
	};

	return (
		<SectionContainer title={'Information'}>
			<div>
				<RenderTable
					items={renderItems()}
					className={'border-secondary/30 lg:border-r'}
				/>
			</div>
			<Suspense>
				<AddOrUpdate
					modalId={'update_profile_modal'}
					{...{
						updateUser,
						setUpdateUser,
					}}
				/>
			</Suspense>
			<Suspense>
				<ResetPass
					modalId='reset_pass_modal'
					{...{
						resPass,
						setResPass,
					}}
				/>
			</Suspense>
		</SectionContainer>
	);
}
