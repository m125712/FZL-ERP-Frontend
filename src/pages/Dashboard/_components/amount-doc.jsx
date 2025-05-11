import React from 'react';

import Loader from '@/components/layout/loader';

import { useDashboardAmountAndDoc } from '../query';
import DashboardCard from './dashboard-card/dashboard-card';

const AmountAndDoc = () => {
	const { data: amount_and_doc, isLoading } = useDashboardAmountAndDoc();

	if (isLoading) return <Loader />;

	return (
		<div className='grid grid-cols-1 gap-2 lg:grid-cols-2'>
			<DashboardCard
				title='Payment Due'
				subtitle='# Pending'
				totalValue={amount_and_doc?.total_payment_due}
				pendingValue={amount_and_doc?.number_of_pending_payment_due}
			/>
			<DashboardCard
				title='Maturity Due'
				subtitle='# Pending'
				totalValue={amount_and_doc?.total_maturity_due}
				pendingValue={amount_and_doc?.number_of_pending_maturity_due}
			/>
			<DashboardCard
				title='Acceptance Due'
				subtitle='# Pending'
				totalValue={amount_and_doc?.total_acceptance_due}
				pendingValue={amount_and_doc?.number_of_pending_acceptance_due}
			/>
			<DashboardCard
				title='Document Receive Due'
				subtitle='# Pending'
				totalValue={amount_and_doc?.total_doc_rcv_due}
				pendingValue={amount_and_doc?.number_of_pending_doc_rcv}
			/>
		</div>
	);
};

export default AmountAndDoc;
