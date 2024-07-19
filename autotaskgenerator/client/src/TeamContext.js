import React, { createContext, useState, useContext, useEffect } from 'react';

const TeamContext = createContext();

export const TeamProvider = ({ children }) => {
	const [teamMembers, setTeamMembers] = useState(() => {
		const savedMembers = localStorage.getItem('teamMembers');
		return savedMembers
			? JSON.parse(savedMembers)
			: [
					{ id: 'JD001', name: 'John Doe' },
					{ id: 'JS002', name: 'Jane Smith' },
					// Add more default team members as needed
			  ];
	});

	useEffect(() => {
		localStorage.setItem('teamMembers', JSON.stringify(teamMembers));
	}, [teamMembers]);

	const addMember = (newMember) => {
		setTeamMembers([...teamMembers, newMember]);
	};

	const updateMember = (id, updatedMember) => {
		setTeamMembers(
			teamMembers.map((member) =>
				member.id === id ? { ...member, ...updatedMember } : member
			)
		);
	};

	const deleteMember = (id) => {
		setTeamMembers(teamMembers.filter((member) => member.id !== id));
	};

	return (
		<TeamContext.Provider
			value={{ teamMembers, addMember, updateMember, deleteMember }}
		>
			{children}
		</TeamContext.Provider>
	);
};

export const useTeam = () => useContext(TeamContext);
