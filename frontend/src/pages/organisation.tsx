import React from 'react';

const OrganisationDetails: React.FC = () => {
    const organisation = {
        _id: "67b32110de308387d0beeb79",
        name: "angular minds",
        address: "pune",
        phone: "9764560354",
        email: "main@ngm.com",
    };

    return (
        <div>
            <h1>Organisation Details</h1>
            <div>
                <strong>ID:</strong> {organisation._id}
            </div>
            <div>
                <strong>Name:</strong> {organisation.name}
            </div>
            <div>
                <strong>Address:</strong> {organisation.address}
            </div>
            <div>
                <strong>Phone:</strong> {organisation.phone}
            </div>
            <div>
                <strong>Email:</strong> {organisation.email}
            </div>
        </div>
    );
};

export default OrganisationDetails;