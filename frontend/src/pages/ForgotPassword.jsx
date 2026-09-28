import ForgotPassCard from "../components/cards/ForgotPassCard.jsx";

function ForgotPassword() {

  return (
    <div
      className="w-screen h-dvh bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: "url('/src/assets/forgotPasswordBackground.jpg')" }}
    >
        <div className="absolute inset-0 bg-black/30"></div>
        <ForgotPassCard/>
    </div>
  );
}

export default ForgotPassword;
