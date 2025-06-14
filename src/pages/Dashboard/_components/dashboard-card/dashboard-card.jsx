import React from 'react';
import numeral from 'numeral';

import {
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';

const DashboardCard = ({
	title,
	subtitle,
	totalValue = 0,
	pendingValue = 0,
}) => {
	return (
		<Card className='flex flex-col justify-between overflow-hidden'>
			<CardHeader className='px-3 py-2'>
				<CardDescription>{title}</CardDescription>
				<CardTitle className='text-3xl font-medium'>
					{numeral(totalValue).format('$ 0,0[.]00')}
				</CardTitle>
			</CardHeader>

			<CardFooter className='flex items-center bg-neutral-100 px-3 py-2'>
				<CardDescription>
					{subtitle}:{' '}
					{/* {numeral(pendingValue).format('$ 0,0[.]00')} */}
					{pendingValue}
				</CardDescription>
			</CardFooter>
		</Card>
	);
};

export default DashboardCard;
