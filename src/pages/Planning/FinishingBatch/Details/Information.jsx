import { useState } from 'react';
import { format } from 'date-fns';
import { useAccess } from '@/hooks';

import SectionContainer from '@/ui/Others/SectionContainer';
import SwitchToggle from '@/ui/Others/SwitchToggle';
import RenderTable from '@/ui/Others/Table/RenderTable';
import { LinkWithCopy } from '@/ui';

import GetDateTime from '@/util/GetDateTime';

export default function Information({ data, updateData }) {
	const {
		uuid,
		batch_number,
		order_number,
		order_description_uuid,
		item_description,
		slider_lead_time,
		dyeing_lead_time,
		status,
		is_completed,
		production_date,
		created_by_name,
		created_at,
		updated_at,
		remarks,
	} = data;
	const [completedStatus, setCompletedStatus] = useState(is_completed);
	const haveAccess = useAccess('planning__finishing_batch');
	const renderItems = () => {
		const basicInfo = [
			{
				label: 'Batch ID',
				value: batch_number,
			},
			{
				label: 'Order No.',
				value: (
					<LinkWithCopy
						title={order_number}
						id={order_number}
						uri={`/order/details`}
					/>
				),
			},
			{
				label: 'Item',
				value: (
					<LinkWithCopy
						title={item_description}
						id={order_description_uuid}
						uri={`/order/details/${order_number}`}
					/>
				),
			},
			{
				label: 'Status',
				value: status,
			},
			{
				label: 'Slider Lead Time',
				value: slider_lead_time,
			},
			{
				label: 'dyeing Lead Time',
				value: dyeing_lead_time,
			},
			{
				label: 'Production Date',
				value: format(new Date(production_date), 'dd/MM/yy'),
			},
		];

		const createdDetails = [
			{
				label: 'Created By',
				value: created_by_name,
			},
			{
				label: 'Remarks',
				value: remarks,
			},
			{
				label: 'Created At',
				value: format(new Date(created_at), 'dd/MM/yy'),
			},
			{
				label: 'Updated At',
				value: updated_at
					? format(new Date(updated_at), 'dd/MM/yy')
					: '',
			},
		];

		return {
			basicInfo,
			createdDetails,
		};
	};
	const handelCompleteStatus = async () => {
		await updateData.mutateAsync({
			url: `/zipper/finishing-batch/update-is-completed/by/${uuid}`,
			updatedData: {
				is_completed: completedStatus === true ? false : true,
				updated_at: GetDateTime(),
			},
			isOnCloseNeeded: false,
		});
	};
	const renderButtons = () => {
		const permission = haveAccess.includes('click_status_complete');
		return [
			<div className='flex items-center gap-2'>
				<SwitchToggle
					onChange={() => {
						handelCompleteStatus();
						setCompletedStatus(!completedStatus);
					}}
					checked={completedStatus}
					disabled={!permission}
				/>
			</div>,
		];
	};
	return (
		<SectionContainer title={'Information'} buttons={renderButtons()}>
			<div className='grid grid-cols-2'>
				<RenderTable
					className={'border-secondary/30 lg:border-r'}
					title={'Basic Info'}
					items={renderItems().basicInfo}
				/>
				<RenderTable
					className={'border-secondary/30 lg:border-r'}
					title={'Created Details'}
					items={renderItems().createdDetails}
				/>
			</div>
		</SectionContainer>
	);
}
