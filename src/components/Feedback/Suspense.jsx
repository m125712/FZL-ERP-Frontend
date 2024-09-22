import { Suspense } from 'react';

import Loader from './Loader';

export default function Index({ children }) {
	return <Suspense fallback={<Loader />}>{children}</Suspense>;
}
