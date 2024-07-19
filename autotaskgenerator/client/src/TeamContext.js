import React, { createContext, useState, useContext, useEffect } from 'react';

const TeamContext = createContext();

export const TeamProvider = ({ children }) => {
	const [teamMembers, setTeamMembers] = useState(() => {
		const savedMembers = localStorage.getItem('teamMembers');
		return savedMembers
			? JSON.parse(savedMembers)
			: [
					{ name: 'John Doe', role: 'Developer', userId: '123456' },
					{ name: 'Jane Smith', role: 'Designer', userId: '789012' },
					// Add more default team members as needed
			  ];
	});

	useEffect(() => {
		localStorage.setItem('teamMembers', JSON.stringify(teamMembers));
	}, [teamMembers]);

	const addMember = (newMember) => {
		setTeamMembers([...teamMembers, newMember]);
	};

	const updateMember = (userId, updatedMember) => {
		setTeamMembers(
			teamMembers.map((member) =>
				member.userId === userId
					? { ...member, ...updatedMember }
					: member
			)
		);
	};

	const deleteMember = (userId) => {
		setTeamMembers(
			teamMembers.filter((member) => member.userId !== userId)
		);
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
