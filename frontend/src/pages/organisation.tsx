import React, { useState, useEffect } from "react";
import { org } from "../interfaces/org.interfaces";
import OrgService from "./../services/org.service";
import { getToast } from "../services/toasts.service";
import ConfirmationDialog from "./employees/confirmationDialogueBox";
import AuthService from "../services/auth.service";

const OrganisationDetails: React.FC = () => {
  const [org, setOrg] = useState<org | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const authService: AuthService= new AuthService();
  const [formData, setFormData] = useState<org>({
    _id: "",
    name: "",
    address: "",
    phone: "",
    email: "",
  });

  const orgService = new OrgService();

  useEffect(() => {
    fetchOrgDetails();
    authService.isAdmin().then((response)=>{
      console.log(response);
      
      setIsAdmin(response);
    })
  }, []);

  const fetchOrgDetails = async () => {
    const response = await orgService.getOrgDetails();
    if (response.success) {
      console.log(response);

      setOrg(response?.data?.organisation);
      setFormData(...[response?.data?.organisation]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (org) {
      const response = await orgService.updateOrgDetails(formData);
      if (response.success) {
        setOrg(response?.data?.organisation);
        setIsEditing(false);
        getToast("success", response.message);
      } else {
        getToast("error", response.message);
      }
    } else {
      const response = await orgService.createOrg(formData);
      if (response.success) {
        setOrg(response?.data?.organisation);
        setIsEditing(false);
        getToast("success", response.message);
      } else {
        getToast("error", response.message);
      }
    }
  };

  const handleDelete = async () => {
    const response = await orgService.deleteOrg();
    if (response.success) {
      setOrg(null);
      setFormData({
        _id: "",
        name: "",
        address: "",
        phone: "",
        email: "",
      });
    }
  };

  const renderForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleInputChange}
        placeholder="Organization Name"
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="text"
        name="address"
        value={formData.address}
        onChange={handleInputChange}
        placeholder="Address"
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="tel"
        name="phone"
        value={formData.phone}
        onChange={handleInputChange}
        placeholder="Phone"
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleInputChange}
        placeholder="Email"
        className="w-full p-2 border rounded"
        required
      />
      {org && (
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="px-4 py-2 text-gray-600 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            {org ? "Update" : "Add"}
          </button>
        </div>
      )}
      {!org && (
        <button
          type="submit"
          className="w-full px-4 py-2 mt-4 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          {org ? "Update" : "Add"}
        </button>
      )}
    </form>
  );

  const renderOrgDetails = () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">{org?.name}</h2>
      <p>
        <strong>Address:</strong> {org?.address}
      </p>
      <p>
        <strong>Phone:</strong> {org?.phone}
      </p>
      <p>
        <strong>Email:</strong> {org?.email}
      </p>
      {isAdmin && <div className="flex justify-end space-x-2">
        <button
          onClick={() => setIsEditing(true)}
          className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
        >
          Edit
        </button>
        <button
          onClick={() => setShowDeleteConfirmation(true)}
          className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
        >
          Delete
        </button>
      </div>}
    </div>
  );

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6">Organization Details</h1>
      {org && !isEditing ? renderOrgDetails() : renderForm()}

      {showDeleteConfirmation && (
        <ConfirmationDialog
          message="Are you sure you want to delete organisation ? All the employees will also be deleted."
          onCancel={() => {
            setShowDeleteConfirmation(false);
          }}
          onConfirm={() => {
            handleDelete();
            setShowDeleteConfirmation(false);
          }}
        />
      )}
    </div>
  );
};

export default OrganisationDetails;
