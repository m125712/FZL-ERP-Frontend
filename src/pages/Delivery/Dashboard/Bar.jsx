import React from 'react';
import { BarChartHorizontal } from '@/pages/Dashboard/_components/BarChartHorizontal';
import { BarChartVertical } from '@/pages/Dashboard/_components/BarChartVertical';

const Bar = () => {
	return (
		<>
			<div className='flex flex-col gap-2 md:flex-row'>
				<BarChartHorizontal
					title='Warehouse: Status'
					url='/dashboard/goods-in-warehouse'
					time={false}
					total={true}
					total_title='Carton Count'
					label1='amount'
					label2='number_of_carton'
				/>
				<BarChartHorizontal
					title='Challan: Outstanding'
					url='/dashboard/challan-register'
					time={false}
					total={true}
					total_title='Challan Count'
					label1='amount'
					label2='number_of_challan'
				/>
			</div>
			<div className='flex flex-col gap-2 md:flex-row'>
				<BarChartHorizontal
					title='Challan: Issued'
					url='/dashboard/challan-register'
					total={true}
					time={true}
					total_title='Challan Count'
					label1='amount'
					label2='number_of_challan'
				/>
				<BarChartVertical />
			</div>
		</>
	);
};

export default Bar;
