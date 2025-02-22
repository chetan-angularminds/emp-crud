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
  const [isLoading, setIsLoading] = useState(false);
  const authService: AuthService = new AuthService();
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
    authService.isAdmin().then((response) => {
      console.log(response);

      setIsAdmin(response);
    });
  }, []);

  const fetchOrgDetails = async () => {
    setIsLoading(true)
    const response = await orgService.getOrgDetails();
    
    if (response.success) {
      console.log(response);

      setOrg(response?.data?.organisation);
      setFormData(...[response?.data?.organisation]);
    }
    setIsLoading(false)
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true)
    if (org) {
      const response = await orgService.updateOrgDetails(formData);
      if (response.success) {
        setOrg(response?.data?.organisation);
        setIsEditing(false);
        getToast("success", response.message);
        await fetchOrgDetails();
      } else {
        getToast("error", response.message);
      }
    } else {
      const response = await orgService.createOrg(formData);
      if (response.success) {
        setOrg(response?.data?.organisation);
        setIsEditing(false);
        getToast("success", response.message);
        await  fetchOrgDetails();
      } else {
        getToast("error", response.message);
      }
    }
    setIsLoading(false)
  };

  const handleDelete = async () => {
    setIsLoading(true)
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
    setIsLoading(false)
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
      {isAdmin && (
        <div className="flex justify-end space-x-2">
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
        </div>
      )}
    </div>
  );
const loader = ()=>(
  <div className="w-full flex justify-center items-center mt-50">
        <svg
          aria-hidden="true"
          className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
        </div>
)
  return (<>
    {!isLoading && <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md dark:bg-slate-600 dark:text-white">
      <h1 className="text-3xl font-bold mb-6">Organization Details</h1>
      {org && !isEditing  ? renderOrgDetails() : renderForm()}

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
    </div>}
    {isLoading && loader()}
    </>
  );
};

export default OrganisationDetails;
