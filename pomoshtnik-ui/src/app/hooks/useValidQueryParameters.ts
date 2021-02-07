import {useLocation} from "react-router-dom";
import * as svt from "simple-validation-tools";

function useValidQueryParameters<T>(validator: svt.Validator<T>): svt.ValidationResult<T> {
  const parametersAsObject: unknown = {};
  useQueryParameters().forEach((v, k) => {
    // @ts-ignore
    parametersAsObject[k] = decodeURIComponent(v);
  });

  return validator(parametersAsObject);
}

export default useValidQueryParameters;

function useQueryParameters(): URLSearchParams {
  return new URLSearchParams(useLocation().search);
}
