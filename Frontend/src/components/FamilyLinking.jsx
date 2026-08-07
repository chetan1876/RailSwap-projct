import { useState } from "react";
import {
  FaUsers,
  FaUserPlus,
  FaTrash,
  FaUserGroup,
} from "react-icons/fa6";

import "../styles/familyLinking.css";

const FamilyLinking = () => {
  const [name, setName] = useState("");
  const [relation, setRelation] = useState("");

  const [members, setMembers] = useState([
    {
      name: "Raj Kumar",
      relation: "Father",
    },
  ]);

  const addMember = () => {
    if (!name || !relation) {
      alert("Please fill all fields");
      return;
    }

    setMembers([
      ...members,
      {
        name,
        relation,
      },
    ]);

    setName("");
    setRelation("");
  };

  const removeMember = (index) => {
    setMembers(
      members.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="family-page">

      <div className="family-header">
        <h1>Family Linking</h1>
        <p>
          Link family members for better seat allocation
          and a smoother travel experience.
        </p>
      </div>

      <div className="family-stat-card">

        <div>
          <p>Total Linked Members</p>
          <h2>{members.length}</h2>
        </div>

        <div className="stat-icon">
          <FaUsers />
        </div>

      </div>

      <div className="family-form-card">

        <div className="form-header">
          <FaUserPlus />
          <h3>Add Family Member</h3>
        </div>

        <input
          type="text"
          placeholder="Enter Full Name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
        />

        <select
          value={relation}
          onChange={(e) =>
            setRelation(e.target.value)
          }
        >
          <option value="">
            Select Relation
          </option>

          <option>Father</option>
          <option>Mother</option>
          <option>Brother</option>
          <option>Sister</option>
          <option>Spouse</option>
          <option>Child</option>
        </select>

        <button onClick={addMember}>
          Add Member
        </button>

      </div>

      <div className="member-list">

        <h2>
          <FaUserGroup />
          Linked Family Members
        </h2>

        {members.map((member, index) => (

          <div
            className="member-card"
            key={index}
          >

            <div className="member-info">

              <div className="avatar">
                {member.name.charAt(0)}
              </div>

              <div>
                <h3>{member.name}</h3>
                <p>{member.relation}</p>
              </div>

            </div>

            <button
              className="remove-btn"
              onClick={() =>
                removeMember(index)
              }
            >
              <FaTrash />
              Remove
            </button>

          </div>

        ))}

      </div>

    </div>
  );
};

export default FamilyLinking;