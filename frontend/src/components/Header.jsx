import { checkHealth } from "../hooks/useCheckHealth";

const connected = "bg-emerald-500";
const disconnected = "bg-red-500";

function StatusDot({ serverHealthy }) {
  const isDisconnected = serverHealthy === false;
  return (
    <span
      className="
            relative
            flex
            h-3
            w-3"
    >
      <span
        className={`
                animate-ping
                absolute
                h-full
                w-full
                rounded-full
                opacity-75 
                ${isDisconnected ? disconnected : connected}`}
      />

      <span
        className={`
                relative
                h-3
                w-3
                rounded-full
                ${isDisconnected ? disconnected : connected}`}
      />
    </span>
  );
}

function Header() {
  const isHealthy = checkHealth();
  return (
    <div className="bg-[#1E1E1E] text-white p-4 h-15 items-center justify-end flex flex-row gap-2 border-b-2 border-[#adadad]">
      <StatusDot serverHealthy={isHealthy} />
      <h1 className="font-medium">{isHealthy ? "System online" : "System offline"}</h1>
    </div>
  );
}

export default Header;
