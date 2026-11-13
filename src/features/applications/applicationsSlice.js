import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getApplications,
  getApplicationById,
  createApplication,
  updateApplication,
  deleteApplication,
} from "../../api/applicationsApi";

export const fetchApplications = createAsyncThunk(
  "applications/fetchApplications",
  async (_, { rejectWithValue }) => {
    try {
      return await getApplications();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const fetchApplicationById = createAsyncThunk(
  "applications/fetchApplicationById",
  async (id, { rejectWithValue }) => {
    try {
      return await getApplicationById(id);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
 
export const addApplication = createAsyncThunk(
  "applications/addApplication",
  async (applicationData) => {
    return await createApplication(applicationData);
  }
);

export const editApplication = createAsyncThunk(
  "applications/editApplication",
  async ({ id, applicationData }) => {
    return await updateApplication(id, applicationData);
  }
);
export const updateApplicationStatus = createAsyncThunk(
  "applications/updateApplicationStatus",
  async ({ id, applicationData }) => {
    const chaosMode = import.meta.env.VITE_CHAOS_MODE === "true";

    if (chaosMode && Math.random() < 0.2) {
      throw new Error("Simulated API failure");
    }

    return await updateApplication(id, applicationData);
  }
);
export const removeApplication = createAsyncThunk(
  "applications/removeApplication",
  async (id) => {
    return await deleteApplication(id);
  }
);
const applicationsSlice = createSlice({
  name: "applications",

  initialState: {
  items: [],
  status: "idle",
  error: null,

  selectedApplication: null,
  detailsStatus: "idle",
  detailsError: null,

  createStatus: "idle",
  createError: null,

  updateStatus: "idle",
  updateError: null,

  deleteStatus: "idle",
  deleteError: null,

  pendingStatusUpdates: {},
},
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchApplications.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchApplications.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchApplications.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchApplicationById.pending, (state) => {
        state.detailsStatus = "loading";
        state.detailsError = null;
        state.selectedApplication = null;
        })
        .addCase(fetchApplicationById.fulfilled, (state, action) => {
        state.detailsStatus = "succeeded";
        state.selectedApplication = action.payload;
        })
        .addCase(fetchApplicationById.rejected, (state, action) => {
        state.detailsStatus = "failed";
        state.detailsError = action.payload || action.error.message;
        })
        builder
  .addCase(addApplication.pending, (state) => {
    state.createStatus = "loading";
    state.createError = null;
  })
  .addCase(addApplication.fulfilled, (state, action) => {
    state.createStatus = "succeeded";
    state.items.unshift(action.payload);
  })
  .addCase(addApplication.rejected, (state, action) => {
    state.createStatus = "failed";
    state.createError = action.error.message;
  })
  .addCase(editApplication.pending, (state) => {
  state.updateStatus = "loading";
  state.updateError = null;
})
.addCase(editApplication.fulfilled, (state, action) => {
  state.updateStatus = "succeeded";

  const updatedApplication = action.payload;

  const index = state.items.findIndex(
    (item) => item.id === updatedApplication.id
  );

  if (index !== -1) {
    state.items[index] = updatedApplication;
  }

  state.selectedApplication = updatedApplication;
})
.addCase(editApplication.rejected, (state, action) => {
  state.updateStatus = "failed";
  state.updateError = action.error.message;
})
.addCase(removeApplication.pending, (state) => {
  state.deleteStatus = "loading";
  state.deleteError = null;
})
.addCase(removeApplication.fulfilled, (state, action) => {
  state.deleteStatus = "succeeded";

  const deletedId = action.payload;

  state.items = state.items.filter(
    (item) => item.id !== deletedId
  );

  if (state.selectedApplication?.id === deletedId) {
    state.selectedApplication = null;
  }
})
.addCase(removeApplication.rejected, (state, action) => {
  state.deleteStatus = "failed";
  state.deleteError = action.error.message;
})
.addCase(updateApplicationStatus.pending, (state, action) => {
  const { id, applicationData } = action.meta.arg;

  const existingApplication = state.items.find(
    (item) => item.id === id
  );

  if (existingApplication) {
    state.pendingStatusUpdates[id] = { ...existingApplication };

    Object.assign(existingApplication, applicationData);
  }
})
.addCase(updateApplicationStatus.fulfilled, (state, action) => {
  const updatedApplication = action.payload;

  const index = state.items.findIndex(
    (item) => item.id === updatedApplication.id
  );

  if (index !== -1) {
    state.items[index] = updatedApplication;
  }

  delete state.pendingStatusUpdates[updatedApplication.id];
})
.addCase(updateApplicationStatus.rejected, (state, action) => {
  const id = action.meta.arg.id;

  const previousApplication = state.pendingStatusUpdates[id];

  if (previousApplication) {
    const index = state.items.findIndex(
      (item) => item.id === id
    );

    if (index !== -1) {
      state.items[index] = previousApplication;
    }
  }

  delete state.pendingStatusUpdates[id];
});
      
  },
});

export default applicationsSlice.reducer;