
const API_BASE_URL = "http://localhost:3001";

// Fetch all job applications
export const getApplications = async () => {
  const response = await fetch(`${API_BASE_URL}/applications`);

  if (!response.ok) {
    throw new Error("Failed to fetch applications");
  }

  return await response.json();
};
export const getApplicationById = async (id) => {
  const response = await fetch(
    `${API_BASE_URL}/applications/${id}`
  );

  if (response.status === 404) {
  throw new Error("Application not found");
}

if (!response.ok) {
  throw new Error("Failed to fetch application details");
}

  return await response.json();
};

export const createApplication = async (applicationData) => {
  const response = await fetch(`${API_BASE_URL}/applications`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(applicationData),
  });
  

  if (!response.ok) {
    throw new Error("Failed to create application");
  }

  return await response.json();
};

 // Update an existing application
export const updateApplication = async (id, applicationData) => {
  const response = await fetch(`${API_BASE_URL}/applications/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(applicationData),
  });

  if (!response.ok) {
    throw new Error("Failed to update application");
  }

  return await response.json();
};
// Delete an existing application
export const deleteApplication = async (id) => {
  const response = await fetch(
    `${API_BASE_URL}/applications/${id}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete application");
  }

  return id;
};
