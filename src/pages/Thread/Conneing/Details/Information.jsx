import SectionContainer from '@/ui/Others/SectionContainer';
import RenderTable from '@/ui/Others/Table/RenderTable';

export default function Information({ batch }) {
	const {
		batch_id,

		coning_created_at,
		coning_updated_at,
		coning_supervisor_name,
		coning_operator_name,
		coning_machines,
		coning_created_by_name,
	} = batch;

	const renderItems = () => {
		const conneing = [
			{
				label: 'Batch ID',
				value: batch_id,
			},
			{
				label: 'Machine',
				value: coning_machines,
			},
			{
				label: 'Operator',
				value: coning_operator_name,
			},
			{
				label: 'Supervisor',
				value: coning_supervisor_name,
			},
			{
				label: 'Created By',
				value: coning_created_by_name,
			},

			{
				label: 'Created At',
				value: coning_created_at,
			},

			{
				label: 'Updated At',
				value: coning_updated_at,
			},
		];

		return {
			conneing,
		};
	};

	return (
		<SectionContainer title={'Information'}>
			<div>
				<RenderTable
					className={'border-secondary/30 lg:border-r'}
					title={'Coning'}
					items={renderItems().conneing}
				/>
			</div>
		</SectionContainer>
	);
}
