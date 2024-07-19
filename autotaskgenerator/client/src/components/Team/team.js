import React, { useState } from 'react';
import styled from 'styled-components';
import { useTeam } from '../../TeamContext';

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
	width: 100%;
	max-width: 600px;
`;

const TeamMember = styled.li`
	background-color: ${(props) => props.theme.white};
	border: 1px solid ${(props) => props.theme.deepBlue};
	border-radius: 4px;
	padding: 15px;
	margin-bottom: 10px;
	font-size: 16px;
	display: flex;
	justify-content: space-between;
	align-items: center;
`;

const Button = styled.button`
	background-color: ${(props) => props.theme.electricBlue};
	color: white;
	border: none;
	border-radius: 4px;
	padding: 5px 10px;
	cursor: pointer;
	margin-left: 10px;
`;

const Input = styled.input`
	padding: 5px;
	margin-right: 10px;
	border: 1px solid ${(props) => props.theme.deepBlue};
	border-radius: 4px;
`;

const AddMemberForm = styled.form`
	display: flex;
	justify-content: center;
	margin-bottom: 20px;
	width: 100%;
	max-width: 600px;
`;

const Team = () => {
	const { teamMembers, addMember, updateMember, deleteMember } = useTeam();
	const [newMember, setNewMember] = useState({
		name: '',
		role: '',
		userId: '',
	});
	const [editIndex, setEditIndex] = useState(null);

	const handleAddMember = (e) => {
		e.preventDefault();
		if (newMember.name && newMember.role && newMember.userId) {
			addMember(newMember);
			setNewMember({ name: '', role: '', userId: '' });
		}
	};

	const handleEditMember = (index) => {
		setEditIndex(index);
		setNewMember(teamMembers[index]);
	};

	const handleUpdateMember = () => {
		if (newMember.name && newMember.role && newMember.userId) {
			updateMember(editIndex, newMember);
			setEditIndex(null);
			setNewMember({ name: '', role: '', userId: '' });
		}
	};

	const handleDeleteMember = (index) => {
		deleteMember(index);
	};

	return (
		<TeamContainer>
			<Title>Our Team</Title>
			<AddMemberForm onSubmit={handleAddMember}>
				<Input
					type='text'
					placeholder='Name'
					value={newMember.name}
					onChange={(e) =>
						setNewMember({ ...newMember, name: e.target.value })
					}
				/>
				<Input
					type='text'
					placeholder='Role'
					value={newMember.role}
					onChange={(e) =>
						setNewMember({ ...newMember, role: e.target.value })
					}
				/>
				<Input
					type='text'
					placeholder='User ID'
					value={newMember.userId}
					onChange={(e) =>
						setNewMember({ ...newMember, userId: e.target.value })
					}
				/>
				<Button type='submit'>
					{editIndex !== null ? 'Update' : 'Add'} Member
				</Button>
			</AddMemberForm>
			<TeamMemberList>
				{teamMembers.map((member, index) => (
					<TeamMember key={index}>
						{editIndex === index ? (
							<>
								<Input
									type='text'
									value={newMember.name}
									onChange={(e) =>
										setNewMember({
											...newMember,
											name: e.target.value,
										})
									}
								/>
								<Input
									type='text'
									value={newMember.role}
									onChange={(e) =>
										setNewMember({
											...newMember,
											role: e.target.value,
										})
									}
								/>
								<Input
									type='text'
									value={newMember.userId}
									onChange={(e) =>
										setNewMember({
											...newMember,
											userId: e.target.value,
										})
									}
								/>
								<Button onClick={handleUpdateMember}>
									Save
								</Button>
							</>
						) : (
							<>
								<span>{`${member.name} - ${member.role} (${member.userId})`}</span>
								<div>
									<Button
										onClick={() => handleEditMember(index)}
									>
										Edit
									</Button>
									<Button
										onClick={() =>
											handleDeleteMember(index)
										}
									>
										Delete
									</Button>
								</div>
							</>
						)}
					</TeamMember>
				))}
			</TeamMemberList>
		</TeamContainer>
	);
};

export default Team;
