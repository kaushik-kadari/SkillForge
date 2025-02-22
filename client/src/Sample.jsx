import React, { useState } from 'react';
import './App.css';

const CRUDApp = () => {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [data, setData] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({ name: '', email: '' });

  // Add new item through form
  const handleSubmit = (e) => {
    e.preventDefault();

    if(!formData.email || !formData.name) return;

    setData([...data, {...formData, id : Date.now()}]);
    setFormData({name : '', email : ''});
  };

  // Start editing a table row
  const handleEdit = (id) => {
   const item = data.find((user) => user.id === id);
   setEditId(id);
   setEditData(item);
  };

  // Save edited data
  const handleSave = () => {
    setData(data.map((item) => item.id === editId ? editData : item));
    setEditId(null);
  };

  // Cancel editing
  const handleCancel = () => {
   setEditId(null);
  };

  // Delete item
  const handleDelete = (id) => {
    setData(data.filter((user) => user.id !== id));
    if(id == editData) setEditId(null);
  };

  return (
    <div className="container">
      {/* Add Form */}
      <h2>Add New User</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name : e.target.value})}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email : e.target.value})}
            required
          />
        </div>
        <button type="submit">Add</button>
      </form>

      {/* Data Table with CRUD */}
      <div className="table-container">
        <h2>Users List</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map(item => (
              <tr key={item.id}>
                <td>
                  { editId == item.id ? (
                    <input
                    type='text'
                    value={editData.name}
                    onChange={(e) => setEditData({...editData, name : e.target.value})}
                    />
                  ) : (
                    item.name
                  )}
                </td>
                <td>
                  { editId == item.id ? (
                    <input
                      type='email'
                      value={editData.email}
                      onChange={(e) => setEditData({...formData, email : e.target.value})}
                    />
                  ) : (
                    item.email
                  )}
                </td>
                <td>
                  {editId === item.id ? (
                    <>
                      <button onClick={handleSave}>Save</button>
                      <button onClick={handleCancel}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleEdit(item.id)}>Edit</button>
                      <button onClick={() => handleDelete(item.id)}>Delete</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CRUDApp;