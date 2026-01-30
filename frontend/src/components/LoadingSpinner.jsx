import { useEffect, useState } from "react";

export default function LoadingSpinner() {
	const [isVisible, setIsVisible] = useState(true);

	useEffect(() => {
		const timer = setTimeout(() => {
			setIsVisible(false);
		}, 2000);

		return () => clearTimeout(timer);
	}, []);

	if (!isVisible) return null;

	return (
		<div className='fixed inset-0 bg-[#0a0a0a] z-50 flex items-center justify-center'>
			<div className='relative flex flex-col items-center'>
				{/* Logo Image */}
				<div className='mb-6'>
					<img
						src='/yugantha-logo.png'
						alt='YuganthaAI'
						className='w-24 h-24 object-contain'
					/>
				</div>

<<<<<<< HEAD
				{/* Loading Text */}
				<div className='flex items-center space-x-2'>
					<span className='text-2xl font-bold text-white animate-pulse'>
						Yuganta
					</span>
					<span className='text-2xl font-bold text-[#A855F7] animate-pulse'>
						AI
					</span>
				</div>
=======
			{/* Loading Text */}
			<div className='flex items-center space-x-2'>
				<span className='text-2xl font-bold text-white animate-pulse'>
					Yuganta
				</span>
			</div>
>>>>>>> b18afb273f9730a9cf8a52f348eaf048001b6cf7

			{/* Animated Dots */}
				<div className='mt-8 flex space-x-2'>
					<div
						className='w-2 h-2 bg-blue-500 rounded-full animate-bounce'
						style={{ animationDelay: "0ms" }}></div>
					<div
						className='w-2 h-2 bg-purple-500 rounded-full animate-bounce'
						style={{ animationDelay: "150ms" }}></div>
					<div
						className='w-2 h-2 bg-pink-500 rounded-full animate-bounce'
						style={{ animationDelay: "300ms" }}></div>
				</div>
			</div>
		</div>
	);
}
