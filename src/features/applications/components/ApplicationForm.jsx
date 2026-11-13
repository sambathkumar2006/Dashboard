
import useForm from "../../../hooks/useForm";

const initialValues = {
  company: "",
  role: "",
  jobUrl: "",
  status: "wishlist",
  dateApplied: "",
  salaryMin: "",
  salaryMax: "",
  currency: "USD",
  locationType: "remote",
  location: "",
  notes: "",
};

function validate(values) {
  const errors = {};

  if (!values.company.trim()) {
    errors.company = "Company name is required";
  }

  if (!values.role.trim()) {
    errors.role = "Job role is required";
  }

  if (values.jobUrl) {
    try {
      new URL(values.jobUrl);
    } catch {
      errors.jobUrl = "Please enter a valid URL";
    }
  }

  if (
    values.salaryMin !== "" &&
    values.salaryMax !== "" &&
    Number(values.salaryMin) > Number(values.salaryMax)
  ) {
    errors.salaryMax =
      "Maximum salary must be greater than minimum salary";
  }

  if (values.dateApplied) {
    const today = new Date().toISOString().split("T")[0];

    if (values.dateApplied > today) {
      errors.dateApplied = "Date cannot be in the future";
    }
  }

  if (values.status !== "wishlist" && !values.dateApplied) {
    errors.dateApplied = "Application date is required";
  }

  return errors;
}

function ApplicationForm({
  onSubmit,
  isSaving = false,
  submitLabel = "Save Application",
  initialValues: providedInitialValues,
}) {
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useForm(providedInitialValues || initialValues, validate);

  const submitForm = (formValues) => {
    onSubmit(formValues);
  };

  const inputClass =
    "w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:ring-blue-950";

  const labelClass =
    "mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300";

  const errorClass = "mt-1.5 text-xs text-red-600 dark:text-red-400";

  return (
    <form onSubmit={handleSubmit(submitForm)} className="space-y-7">

      {/* Basic information */}
      <section className="space-y-5">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Basic Information
          </h2>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Enter the company and job details.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

          {/* Company */}
          <div>
            <label className={labelClass}>
              Company Name *
            </label>

            <input
              type="text"
              name="company"
              value={values.company}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="e.g. Google"
              className={inputClass}
            />

            {touched.company && errors.company && (
              <p className={errorClass}>{errors.company}</p>
            )}
          </div>

          {/* Role */}
          <div>
            <label className={labelClass}>
              Job Role *
            </label>

            <input
              type="text"
              name="role"
              value={values.role}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="e.g. Frontend Developer"
              className={inputClass}
            />

            {touched.role && errors.role && (
              <p className={errorClass}>{errors.role}</p>
            )}
          </div>

        </div>

        {/* Job URL */}
        <div>
          <label className={labelClass}>
            Job URL
          </label>

          <input
            type="url"
            name="jobUrl"
            value={values.jobUrl}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="https://example.com/job"
            className={inputClass}
          />

          {touched.jobUrl && errors.jobUrl && (
            <p className={errorClass}>{errors.jobUrl}</p>
          )}
        </div>
      </section>

      <div className="border-t border-gray-100 dark:border-gray-800" />

      {/* Application status */}
      <section className="space-y-5">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Application Status
          </h2>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Track your current application progress.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

          <div>
            <label className={labelClass}>
              Status
            </label>

            <select
              name="status"
              value={values.status}
              onChange={handleChange}
              onBlur={handleBlur}
              className={inputClass}
            >
              <option value="wishlist">Wishlist</option>
              <option value="applied">Applied</option>
              <option value="interview">Interview</option>
              <option value="offer">Offer</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>
              Date Applied
            </label>

            <input
              type="date"
              name="dateApplied"
              value={values.dateApplied}
              onChange={handleChange}
              onBlur={handleBlur}
              className={inputClass}
            />

            {touched.dateApplied && errors.dateApplied && (
              <p className={errorClass}>{errors.dateApplied}</p>
            )}
          </div>

        </div>
      </section>

      <div className="border-t border-gray-100 dark:border-gray-800" />

      {/* Salary details */}
      <section className="space-y-5">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Salary Details
          </h2>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Add the expected salary range.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">

          <div>
            <label className={labelClass}>
              Minimum Salary
            </label>

            <input
              type="number"
              name="salaryMin"
              min="0"
              value={values.salaryMin}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Minimum"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>
              Maximum Salary
            </label>

            <input
              type="number"
              name="salaryMax"
              min="0"
              value={values.salaryMax}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Maximum"
              className={inputClass}
            />

            {touched.salaryMax && errors.salaryMax && (
              <p className={errorClass}>{errors.salaryMax}</p>
            )}
          </div>

          <div>
            <label className={labelClass}>
              Currency
            </label>

            <select
              name="currency"
              value={values.currency}
              onChange={handleChange}
              onBlur={handleBlur}
              className={inputClass}
            >
              <option value="USD">USD ($)</option>
              <option value="INR">INR (₹)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="JPY">JPY (¥)</option>
            </select>
          </div>

        </div>
      </section>

      <div className="border-t border-gray-100 dark:border-gray-800" />

      {/* Location details */}
      <section className="space-y-5">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Location Details
          </h2>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Specify where the job is based.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

          <div>
            <label className={labelClass}>
              Location Type
            </label>

            <select
              name="locationType"
              value={values.locationType}
              onChange={handleChange}
              onBlur={handleBlur}
              className={inputClass}
            >
              <option value="remote">Remote</option>
              <option value="hybrid">Hybrid</option>
              <option value="onsite">Onsite</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>
              Location
            </label>

            <input
              type="text"
              name="location"
              value={values.location}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="e.g. Bangalore"
              className={inputClass}
            />
          </div>

        </div>
      </section>

      <div className="border-t border-gray-100 dark:border-gray-800" />

      {/* Notes */}
      <section>
        <h2 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">
          Additional Notes
        </h2>

        <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
          Add interview notes, contact details, or reminders.
        </p>

        <textarea
          name="notes"
          value={values.notes}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Write your notes here..."
          rows={5}
          className={inputClass}
        />
      </section>

      {/* Submit */}
      <div className="flex flex-wrap justify-end gap-3 border-t border-gray-100 pt-5 dark:border-gray-800">
        <button
          type="button"
          onClick={() => window.history.back()}
          disabled={isSaving}
          className="rounded-xl border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSaving}
          className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSaving ? "Saving..." : submitLabel}
        </button>
      </div>

    </form>
  );
}

export default ApplicationForm;
