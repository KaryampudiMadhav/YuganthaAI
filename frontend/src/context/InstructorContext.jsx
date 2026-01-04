import { createContext, useState, useContext, useEffect } from "react";

const InstructorContext = createContext();

// Static instructor credentials
const INSTRUCTOR_CREDENTIALS = {
	email: "instructor@merosphere.com",
	password: "instructor123",
};

export const InstructorProvider = ({ children }) => {
	const [instructor, setInstructor] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Check if instructor is logged in on mount
		const storedInstructor = localStorage.getItem("instructor");
		if (storedInstructor) {
			setInstructor(JSON.parse(storedInstructor));
			// Backfill shared token if it wasn't stored before
			if (!localStorage.getItem("instructorToken")) {
				localStorage.setItem("instructorToken", "instructor-admin");
			}
		}
		setLoading(false);
	}, []);

	const login = (email, password) => {
		if (
			email === INSTRUCTOR_CREDENTIALS.email &&
			password === INSTRUCTOR_CREDENTIALS.password
		) {
			const instructorData = {
				email: email,
				name: "Instructor",
				role: "instructor",
			};
			localStorage.setItem("instructor", JSON.stringify(instructorData));
			localStorage.setItem("instructorToken", "instructor-admin");
			setInstructor(instructorData);
			return { success: true };
		}
		return { success: false, error: "Invalid credentials" };
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
