import { createSelector } from "@reduxjs/toolkit";
export const selectApplications = (state) =>
  state.applications.items;

export const selectApplicationsStatus = (state) =>
  state.applications.status;

export const selectApplicationsError = (state) =>
  state.applications.error;

export const selectSelectedApplication = (state) =>
  state.applications.selectedApplication;

export const selectDetailsStatus = (state) =>
  state.applications.detailsStatus;

export const selectDetailsError = (state) =>
  state.applications.detailsError;
export const selectDashboardStats = createSelector(
  [selectApplications],
  (applications) => ({
    total: applications.length,

    wishlist: applications.filter(
      (app) => app.status === "wishlist"
    ).length,

    applied: applications.filter(
      (app) => app.status === "applied"
    ).length,

    interview: applications.filter(
      (app) => app.status === "interview"
    ).length,

    offer: applications.filter(
      (app) => app.status === "offer"
    ).length,

    rejected: applications.filter(
      (app) => app.status === "rejected"
    ).length,
  })
);