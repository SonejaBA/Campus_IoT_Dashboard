import LogInCard from "../components/cards/LogInCard";

function Login() {

  return (
    <div
      className="w-screen h-dvh bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: "url('/src/assets/loginBackground.jpg')" }}
    >
        <div className="absolute inset-0 bg-black/30"></div>
        <LogInCard />
    </div>
  );
}

export default Login;
