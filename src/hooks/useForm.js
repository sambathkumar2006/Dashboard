
import { useState } from "react";

function useForm(initialValues, validate) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;

    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleBlur = (event) => {
    const { name } = event.target;

    setTouched((prevTouched) => ({
      ...prevTouched,
      [name]: true,
    }));

    const validationErrors = validate(values);

    setErrors(validationErrors);
  };

  const handleSubmit = (callback) => (event) => {
    event.preventDefault();

    const validationErrors = validate(values);

    setErrors(validationErrors);

    setTouched(
      Object.keys(values).reduce((result, key) => {
        result[key] = true;
        return result;
      }, {})
    );

    if (Object.keys(validationErrors).length === 0) {
      callback(values);
    }
  };

  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  };

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
  };
}

export default useForm;
