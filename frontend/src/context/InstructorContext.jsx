import { createContext, useState, useContext, useEffect } from "react";

const InstructorContext = createContext();

export const InstructorProvider = ({ children }) => {
	const [instructor, setInstructor] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Check if instructor is logged in on mount
		const storedInstructor = localStorage.getItem("instructor");
		if (storedInstructor) {
			setInstructor(JSON.parse(storedInstructor));
		}
		setLoading(false);
	}, []);

	const login = async (email, password) => {
		try {
			const response = await fetch(
				"http://localhost:5000/api/instructor-auth/login",
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ email, password }),
				}
			);

			if (!response.ok) {
				const errorData = await response.json();
				return {
					success: false,
					error: errorData.message || "Login failed",
				};
			}

			const data = await response.json();
			const instructorData = {
				_id: data._id,
				name: data.name,
				email: data.email,
				expertise: data.expertise,
				approved: data.approved,
				role: "instructor",
			};

			localStorage.setItem("instructor", JSON.stringify(instructorData));
			localStorage.setItem("instructorToken", data.token);
			setInstructor(instructorData);
			return { success: true };
		} catch (error) {
			console.error("Login error:", error);
			return {
				success: false,
				error: "Network error or server unavailable",
			};
		}
	};

	const logout = () => {
		setInstructor(null);
		localStorage.removeItem("instructor");
		localStorage.removeItem("instructorToken");
	};

	const value = {
		instructor,
		loading,
		login,
		logout,
		isAuthenticated: !!instructor,
	};

	return (
		<InstructorContext.Provider value={value}>
			{children}
		</InstructorContext.Provider>
	);
};

export const useInstructor = () => {
	const context = useContext(InstructorContext);
	if (!context) {
		throw new Error(
			"useInstructor must be used within an InstructorProvider"
		);
	}
	return context;
};
