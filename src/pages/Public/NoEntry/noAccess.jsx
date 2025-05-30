import { useAuth } from '@/context/auth';
import { CircleX } from 'lucide-react';

export default function NoAccess() {
	const { signed } = useAuth();

	if (!signed) return <Navigate to={`/login`} replace />;

	return (
		<div className='flex h-screen flex-col items-center justify-center gap-12 py-8'>
			<CircleX className='size-60 animate-pulse text-error' />
			<div className='flex flex-col items-center gap-4'>
				<h1 className='text-center text-3xl font-medium capitalize'>
					You are not authorized
				</h1>
				<p className='text-center text-xl'>
					You tried to access a page you did not have prior
					authorization for.
				</p>
				<button
					className='btn btn-primary rounded-full px-6 py-2 uppercase text-white transition-all duration-500 ease-in-out'
					onClick={() => window.history.back()}
				>
					Go Back
				</button>
			</div>
		</div>
	);
}
