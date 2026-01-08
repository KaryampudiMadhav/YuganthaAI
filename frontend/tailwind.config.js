/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {
			colors: {
				'bg-primary': '#0B0614',
				'bg-secondary': '#160B2E',
				'bg-card': '#12091F',
				'accent-primary': '#8B5CF6',
				'accent-primary-light': '#A855F7',
				'accent-secondary': '#EC4899',
				'accent-secondary-dark': '#D946EF',
				'text-primary': '#FFFFFF',
				'text-secondary': '#C7C3D6',
				'text-muted': '#9A93B5',
			},
		},
	},
	plugins: [],
};
