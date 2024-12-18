import img from "./error.gif";
import "./errorMessage.scss";

const ErrorMessage = () => {
  return (
    <>
      <img className="error-message" src={img} alt="error img" />
      {/* <img src={process.env.PUBLIC_URL + "/error.gif"} /> */}
    </>
  );
};

export default ErrorMessage;
