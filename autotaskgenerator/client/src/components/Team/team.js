import React from 'react';
import styled from 'styled-components';

const TeamContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
`;

const Title = styled.h1`
	color: ${(props) => props.theme.navy};
	font-size: 24px;
	margin-bottom: 20px;
`;

const TeamMemberList = styled.ul`
	list-style-type: none;
	padding: 0;
`;

const TeamMember = styled.li`
	background-color: ${(props) => props.theme.white};
	border: 1px solid ${(props) => props.theme.deepBlue};
	border-radius: 4px;
	padding: 15px;
	margin-bottom: 10px;
	font-size: 16px;
`;

const Team = () => {
	const teamMembers = [
		'John Doe - Developer',
		'Jane Smith - Designer',
		'Mike Johnson - Project Manager',
		'Emily Brown - QA Specialist',
	];

	return (
		<TeamContainer>
			<Title>Our Team</Title>
			<TeamMemberList>
				{teamMembers.map((member, index) => (
					<TeamMember key={index}>{member}</TeamMember>
				))}
			</TeamMemberList>
		</TeamContainer>
	);
};

export default Team;
