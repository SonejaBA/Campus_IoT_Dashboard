import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {BatteryMedium, Lock, LogOut, RotateCcw, SlidersHorizontal,Unlock, } from "lucide-react";
import { useAuth } from "../components/context/AuthContext.jsx";

// default settings
const defaultSettings = {
    fillWarning: 50,
    fillCritical: 80,
    batteryWarning: 20,
};

// this gives each settings section the same card layout
function SettingsCard({ icon: Icon, title, description, children }) {
    return (
        <section className="rounded-2xl border border-white/10 bg-slate-900/75 p-5 shadow-xl shadow-black/20 backdrop-blur-xl sm:p-6">
            <div className="mb-6 flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
                    <Icon size={21} />
                </div>

                <div>
                    <h2 className="text-lg font-semibold text-white">
                        {title}
                    </h2>
                    <p className="mt-1 text-sm leading-6 text-slate-400">
                        {description}
                    </p>
                </div>
            </div>

            {children}
        </section>
    );
}

// this stores alert preferences and provides the account actions
function Settings() {
    const { logOut } = useAuth();
    const navigate = useNavigate();
    // start with the fill controls locked until the user unlocks them
    const [thresholdsLocked, setThresholdsLocked] = useState(true);

    // load this browser's saved settings before the page first renders
    const [settings, setSettings] = useState(() => {
        const savedSettings = localStorage.getItem("garbageBinSettings");

        if (!savedSettings) {
            return { ...defaultSettings };
        }

        try {
            // merge defaults so older saved profiles get any new settings
            return {
                ...defaultSettings,
                ...JSON.parse(savedSettings),
            };
        } catch {
            // use defaults if the saved value is not valid json
            return { ...defaultSettings };
        }
    });

    // keep the saved copy in sync whenever a setting changes
    useEffect(() => {
        localStorage.setItem("garbageBinSettings", JSON.stringify(settings));
    }, [settings]);

    // update one preference while keeping the other settings
    const updateSetting = (name, value) => {
        setSettings((previousSettings) => ({
            ...previousSettings,
            [name]: value,
        }));
    };

    // keep warningat least one percentage point below critical
    const handleWarningChange = (event) => {
        const value = Number(event.target.value);

        setSettings((previousSettings) => ({
            ...previousSettings,
            fillWarning: Math.min(value, previousSettings.fillCritical - 1),
        }));
    };

    // keep critical at least one percentage point above warning
    const handleCriticalChange = (event) => {
        const value = Number(event.target.value);

        setSettings((previousSettings) => ({
            ...previousSettings,
            fillCritical: Math.max(value, previousSettings.fillWarning + 1),
        }));
    };

    // put all three preferences back to their starting values
    const handleReset = () => {
        setSettings({ ...defaultSettings });
    };

    // log out before sending the user back to the login page
    const handleLogOut = async () => {
        try {
            await logOut();
            navigate("/login");
        } catch (error) {
            console.error("Logout failed:", error.message);
        }
    };

    return (
        <main className="min-h-full flex-1 overflow-auto bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 px-5 py-8 text-white sm:px-8 lg:px-10">
            <div className="mx-auto max-w-5xl">

                {/* page title and logout action */}
                <header className="mb-7 flex flex-col gap-5 border-b border-white/10 pb-7 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
                            Operations control center
                        </p>
                        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                            Settings
                        </h1>
                    </div>

                    <button
                        type="button"
                        onClick={handleLogOut}
                        className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-2.5 text-sm font-medium transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
                    >
                        <LogOut size={17} />
                        Log out
                    </button>
                </header>

                {/* quick summary of the three fill alert states */}

                <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{/* make it better for ipad */}

                    <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4">
                        <p className="text-xs font-semibold uppercase tracking-wider text-emerald-300">
                            Standard Operations
                        </p>
                        <p className="mt-2 text-lg font-semibold">
                            Normal
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                            Below Warning Threshold
                        </p>
                    </div>

                    <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4">
                        <p className="text-xs font-semibold uppercase tracking-wider text-amber-300">
                            Warning Threshold
                        </p>
                        <p className="mt-2 text-2xl font-bold">
                            {settings.fillWarning}%
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                           Warning begins at this level
                        </p>
                    </div>

                    <div className="rounded-2xl border border-red-400/20 bg-red-400/10 p-4">
                        <p className="text-xs font-semibold uppercase tracking-wider text-red-300">
                            Critical threshold
                        </p>
                        <p className="mt-2 text-2xl font-bold">
                            {settings.fillCritical}%
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                            Requires immediate attention
                        </p>
                    </div>
                </div>
                <div className="space-y-5">
                    {/* adjust the two fill thresholds together */}
                    <SettingsCard
                        icon={SlidersHorizontal}
                        title="Fill-level alerts"
                        description="Set the capacity levels that control normal, warning, and critical bin status."
                    >
                        <div className="rounded-xl border border-white/10 bg-slate-950/30 p-4 sm:p-5">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <h3 className="font-semibold">
                                        Capacity thresholds
                                    </h3>
                                    <p className="mt-1 text-sm text-slate-400">
                                        Warning must remain below critical.
                                    </p>
                                </div>

                                <div className="flex flex-wrap items-center gap-3">
                                    <div className="flex gap-4 text-sm font-semibold">
                                        <span className="text-amber-300">
                                            Warning {settings.fillWarning}%
                                        </span>

                                        <span className="text-red-300">
                                            Critical {settings.fillCritical}%
                                        </span>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => setThresholdsLocked(!thresholdsLocked)}
                                        className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/10 px-2.5 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-white/20"
                                    >
                                        {thresholdsLocked ? (
                                            <Lock size={14} />
                                        ) : (
                                            <Unlock size={14} />
                                        )}

                                        {thresholdsLocked ? "Unlock" : "Lock"}
                                    </button>
                                </div>
                            </div>

                            <div className="relative mt-8 h-10">
                                <div className="absolute left-3 right-3 top-3 flex h-3 overflow-hidden rounded-full">
                                    <div
                                        className="bg-emerald-400"
                                        style={{
                                            width: `${settings.fillWarning}%`,
                                        }}
                                    />
                                    <div
                                        className="bg-amber-400"
                                        style={{
                                            width: `${settings.fillCritical - settings.fillWarning}%`,
                                        }}
                                    />
                                    <div className="flex-1 bg-red-400" />
                                </div>

                                <input
                                    id="fillWarning"
                                    type="range"
                                    min="0"
                                    max="99"
                                    value={settings.fillWarning}
                                    onChange={handleWarningChange}
                                    disabled={thresholdsLocked}
                                    aria-label="Fill warning threshold"
                                    className="threshold-slider warning-slider"
                                />

                                <input
                                    id="fillCritical"
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={settings.fillCritical}
                                    onChange={handleCriticalChange}
                                    disabled={thresholdsLocked}
                                    aria-label="Fill critical threshold"
                                    className="threshold-slider critical-slider"
                                />
                            </div>

                            <div className="mt-3 flex justify-between text-xs font-medium">
                                <span className="text-emerald-300">Normal</span>
                                <span className="text-amber-300">Warning</span>
                                <span className="text-red-300">Critical</span>
                            </div>
                        </div>
                    </SettingsCard>

                    <div className="rounded-xl border border-white/5 bg-slate-900/40 px-4 py-3">
                        <div className="flex items-center gap-3">
                            <BatteryMedium
                                size={17}
                                className="shrink-0 text-blue-300"
                            />

                            <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-3">
                                    <h2 className="text-sm font-semibold text-slate-200">
                                        Battery warning
                                    </h2>

                                    <span className="text-sm font-bold text-blue-300">
                                        {settings.batteryWarning}%
                                    </span>
                                </div>

                                <p className="mt-1 text-xs text-slate-500">
                                    Alert when sensor battery needs attention.
                                </p>

                                <input
                                    id="batteryWarning"
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={settings.batteryWarning}
                                    onChange={(event) =>
                                        updateSetting(
                                            "batteryWarning",
                                            Number(event.target.value)
                                        )
                                    }
                                    aria-label="Battery warning threshold"
                                    className="mt-2 h-1.5 w-full cursor-pointer accent-blue-400"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <footer className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs text-slate-500">
                        Preferences are saved locally on this device.
                    </p>

                    <button
                        type="button"
                        onClick={handleReset}
                        className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-2.5 text-sm font-medium transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
                    >
                        <RotateCcw size={15} />
                        Reset all defaults
                    </button>
                </footer>
            </div>
        </main>
    );
}

export default Settings;
