import { useAuth } from '@/context/auth';
import { firstRoute } from '@/routes';
import { CircleX } from 'lucide-react';
import { Navigate, useNavigate } from 'react-router';

export default function NotFound() {
	const { signed } = useAuth();
	const navigate = useNavigate();

	if (!signed) return <Navigate to={`/login`} replace />;

	return (
		<div className='flex h-screen flex-col items-center justify-center gap-12 py-8'>
			<CircleX className='size-60 animate-pulse text-error' />

			<div className='flex flex-col items-center gap-4'>
				<div className='inline-block animate-pulse px-2 py-1 text-5xl md:text-8xl'>
					Not Found 404
				</div>

				<p className='text-center text-xl'>
					You tried to access a page that does not exist.
				</p>
				<button
					className='btn btn-primary w-64 rounded-full px-6 py-2 uppercase text-white transition-all duration-500 ease-in-out'
					onClick={() => {
						if (signed) {
							navigate(firstRoute?.path);
						} else {
							navigate('/login');
						}
					}}
				>
					{signed ? 'Go To Home' : 'Go To Login'}
				</button>
			</div>
		</div>
	);
}
