
import React, { useState, useEffect } from "react";
import DashboardLayout from "../Admin/Layout";
import {
  Activity,
  Building2,
  Database,
  Edit3,
  MonitorCog,
  Plus,
  RefreshCw,
  Save,
  Trash2,
  Truck,
  UserRound,
  X,
} from "lucide-react";

const getToken = () => localStorage.getItem("token");
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const INITIAL_DEVICE_STATE = {
  device_id: "",
  device_name: "",
  status: "active",
  accessories: [{ accessory_name: "" }], // UI only – will be converted to string[]
};

const INITIAL_CARE_STATE = {
  carecenter_id: "",
  carecenter_name: "",
  address: "",
  mobile_number: "",
  alternative_mobile_number: "",
  status: "active",
};

const INITIAL_REFERENCE_STATE = {
  reference_id: "",
  doctor_name: "",
  specialist: "",
  mobile_number: "",
  alternative_number: "",
  hospital_name: "",
  status: "active",
};

const INITIAL_DELIVERY_STATE = {
  delivery_executive_id: "",
  delivery_name: "",
  mobile_number: "",
  status: "active",
};

const TABS = [
  { id: "device", label: "Devices", icon: MonitorCog },
  { id: "care", label: "Care Centers", icon: Building2 },
  { id: "reference", label: "References", icon: UserRound },
  { id: "delivery", label: "Delivery Execs", icon: Truck },
];

export default function App() {
  const [activeTab, setActiveTab] = useState("device");
  const [assets, setAssets] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const [deviceForm, setDeviceForm] = useState(INITIAL_DEVICE_STATE);
  const [careForm, setCareForm] = useState(INITIAL_CARE_STATE);
  const [referenceForm, setReferenceForm] = useState(INITIAL_REFERENCE_STATE);
  const [deliveryForm, setDeliveryForm] = useState(INITIAL_DELIVERY_STATE);

  // ---------- helpers ----------
  const getModuleConfig = (tab) => {
    switch (tab) {
      case "device":
        return { endpoint: `${BASE_URL}/api/devices`, idKey: "device_id" };
      case "care":
        return {
          endpoint: `${BASE_URL}/api/carecenters`,
          idKey: "carecenter_id",
        };
      case "reference":
        return {
          endpoint: `${BASE_URL}/api/references`,
          idKey: "reference_id",
        };
      case "delivery":
        return {
          endpoint: `${BASE_URL}/api/delivery-executives`,
          idKey: "delivery_executive_id",
        };
      default:
        return { endpoint: `${BASE_URL}/api/devices`, idKey: "device_id" };
    }
  };

  const getRequestHeaders = () => {
    const token = getToken();
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  };

  const safeJson = async (res) => {
    const text = await res.text();
    if (!text) return null;
    try {
      return JSON.parse(text);
    } catch {
      console.warn("Non-JSON response:", text.slice(0, 200));
      return null;
    }
  };

  const handleApiError = (res, fallbackMessage) => {
    if (res.status === 401) {
      localStorage.removeItem("token");
      throw new Error(
        "Session expired. Please log back into your admin portal.",
      );
    }
    throw new Error(fallbackMessage);
  };

  // ---------- form helpers ----------
  const getCurrentForm = () => {
    switch (activeTab) {
      case "device":
        return deviceForm;
      case "care":
        return careForm;
      case "reference":
        return referenceForm;
      case "delivery":
        return deliveryForm;
      default:
        return deviceForm;
    }
  };

  const setCurrentForm = (value) => {
    switch (activeTab) {
      case "device":
        setDeviceForm(value);
        break;
      case "care":
        setCareForm(value);
        break;
      case "reference":
        setReferenceForm(value);
        break;
      case "delivery":
        setDeliveryForm(value);
        break;
      default:
        break;
    }
  };

  const resetCurrentForm = () => {
    switch (activeTab) {
      case "device":
        setDeviceForm(INITIAL_DEVICE_STATE);
        break;
      case "care":
        setCareForm(INITIAL_CARE_STATE);
        break;
      case "reference":
        setReferenceForm(INITIAL_REFERENCE_STATE);
        break;
      case "delivery":
        setDeliveryForm(INITIAL_DELIVERY_STATE);
        break;
      default:
        break;
    }
  };

  // ---------- accessory row helpers ----------
  const addAccessoryRow = () => {
    setDeviceForm((prev) => ({
      ...prev,
      accessories: [...(prev.accessories || []), { accessory_name: "" }],
    }));
  };

  const updateAccessoryRow = (index, value) => {
    setDeviceForm((prev) => ({
      ...prev,
      accessories: (prev.accessories || []).map((accessory, rowIndex) =>
        rowIndex === index ? { accessory_name: value } : accessory
      ),
    }));
  };

  const removeAccessoryRow = (index) => {
    setDeviceForm((prev) => {
      const rows = prev.accessories || [];
      if (rows.length <= 1) {
        return {
          ...prev,
          accessories: [{ accessory_name: "" }],
        };
      }
      return {
        ...prev,
        accessories: rows.filter((_, rowIndex) => rowIndex !== index),
      };
    });
  };

  // ---------- API ----------
  const fetchAssets = async () => {
    try {
      setIsLoading(true);
      setErrorMsg(null);
      const { endpoint } = getModuleConfig(activeTab);

      const res = await fetch(endpoint, { headers: getRequestHeaders() });

      if (!res.ok) {
        const errData = await safeJson(res);
        handleApiError(
          res,
          errData?.message || `Failed to load ${activeTab} records.`,
        );
      }

      const result = await safeJson(res);
      const dataPayload = Array.isArray(result) ? result : (result?.data ?? []);
      setAssets(dataPayload);
    } catch (err) {
      setErrorMsg(err.message);
      setAssets([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, [activeTab]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const { endpoint, idKey } = getModuleConfig(activeTab);
    const currentForm = getCurrentForm();
    const targetId = currentForm[idKey];
    const isEditMode = !!targetId;

    const url = isEditMode ? `${endpoint}/${targetId}` : endpoint;
    const method = isEditMode ? "PUT" : "POST";

    const bodyPayload = { ...currentForm };
    delete bodyPayload[idKey];

    // ===== CRITICAL: Convert accessories objects → string array for backend =====
    if (activeTab === "device") {
      bodyPayload.accessories = (currentForm.accessories || [])
        .map((acc) => String(acc.accessory_name || "").trim())
        .filter(Boolean); // remove empty strings
    }

    try {
      setIsSubmitting(true);
      const res = await fetch(url, {
        method,
        headers: getRequestHeaders(),
        body: JSON.stringify(bodyPayload),
      });

      const data = await safeJson(res);

      if (!res.ok) {
        handleApiError(
          res,
          data?.message || "Unable to modify configuration record.",
        );
      }

      alert(
        isEditMode
          ? "Configuration record updated."
          : "Record created successfully.",
      );
      handleCloseModal();
      fetchAssets();
    } catch (err) {
      alert(`Operation failed: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Permanently delete this entry from ledger instance?"))
      return;

    const { endpoint } = getModuleConfig(activeTab);

    try {
      const res = await fetch(`${endpoint}/${id}`, {
        method: "DELETE",
        headers: getRequestHeaders(),
      });

      const data = await safeJson(res);

      if (!res.ok) {
        handleApiError(
          res,
          data?.message || "Failed to eliminate targeted entity node.",
        );
      }

      alert("Entry removed successfully.");
      fetchAssets();
    } catch (err) {
      alert(`Delete error: ${err.message}`);
    }
  };

  // ---------- UI helpers ----------
  const handleOpenModal = (item = null) => {
    if (item) {
      if (activeTab === "device") {
        // Backend returns accessories as string[] → convert to form rows
        const accessoryRows =
          Array.isArray(item.accessories) && item.accessories.length > 0
            ? item.accessories.map((name) => ({
                accessory_name: typeof name === "string" ? name : "",
              }))
            : [{ accessory_name: "" }];

        setDeviceForm({
          ...item,
          accessories: accessoryRows,
        });
      } else {
        setCurrentForm({ ...item });
      }
    } else {
      resetCurrentForm();
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetCurrentForm();
  };

  const availableCount = assets.filter((a) => a.status === "active").length;
  const criticalCount = assets.filter((a) => a.status === "inactive").length;

  const getStatusBadge = (status) => {
    if (status === "inactive") {
      return (
        <span className="inline-flex items-center gap-2 rounded-full border border-rose-200/80 bg-rose-50 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.08em] text-rose-700">
          <span className="h-1.5 w-1.5 rounded-full bg-rose-500"></span>
          Inactive
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-2 rounded-full border border-[#CDE9DD] bg-[#EEF8F3] px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.08em] text-[#087A57]">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40"></span>
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
        </span>
        Active
      </span>
    );
  };

  const tabActions = {
    device: { label: "Add Device", icon: MonitorCog },
    care: { label: "Add Care Center", icon: Building2 },
    reference: { label: "Add Reference", icon: UserRound },
    delivery: { label: "Add Delivery Exec", icon: Truck },
  };

  const modalTitles = {
    device: {
      create: "Register Device Asset",
      edit: "Modify Device Asset",
    },
    care: {
      create: "Register Care Center",
      edit: "Modify Care Center",
    },
    reference: {
      create: "Link External Reference",
      edit: "Modify Reference Record",
    },
    delivery: {
      create: "Onboard Delivery Executive",
      edit: "Modify Delivery Executive",
    },
  };

  const isEditMode = () => {
    const form = getCurrentForm();
    const { idKey } = getModuleConfig(activeTab);
    return !!form[idKey];
  };

  const inputClass =
    "w-full rounded-[14px] border border-[#DCE9E3] bg-[#FBFDFC] px-4 py-3 text-sm font-semibold text-[#263E34] placeholder:font-medium placeholder:text-[#A5B3AD] outline-none transition-all duration-200 hover:border-[#BDD7CB] focus:border-[#0A8A60] focus:bg-white focus:ring-4 focus:ring-[#0A8A60]/[0.08]";
  const labelClass =
    "mb-2 block text-[10px] font-extrabold uppercase tracking-[0.11em] text-[#657A70]";

  // ---------- render ----------
  const ActiveTabIcon =
    TABS.find((tab) => tab.id === activeTab)?.icon || Database;
  const ActiveActionIcon = tabActions[activeTab]?.icon || Plus;

  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-[1450px] space-y-6">
        {/* ===== PREMIUM PAGE HEADER ===== */}
        <section className="relative overflow-hidden rounded-[24px] border border-[#DDEBE5] bg-white shadow-[0_12px_35px_rgba(33,84,61,0.06)]">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -right-16 -top-24 h-64 w-64 rounded-full bg-[#0A9668]/[0.06] blur-3xl" />
            <div className="absolute -bottom-20 left-[28%] h-44 w-44 rounded-full bg-[#087A57]/[0.035] blur-3xl" />
          </div>

          <div className="relative px-5 py-5 sm:px-6 lg:px-7">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex items-start gap-4">
                <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-[15px] bg-gradient-to-br from-[#087A57] to-[#0A9668] text-white shadow-[0_10px_24px_rgba(8,122,87,0.22)] sm:flex">
                  <Database size={22} strokeWidth={2.1} />
                </div>

                <div>
                  <h1 className="text-[22px] font-extrabold tracking-[-0.025em] text-[#183A2F] sm:text-[26px]">
                    Equipment & Support Master
                  </h1>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <div className="flex items-center gap-2 rounded-[12px] border border-[#D7EDE3] bg-[#F2FAF6] px-3.5 py-2.5">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.06em] text-[#4D6B5F]">
                    Active
                  </span>
                  <span className="text-sm font-extrabold text-[#087A57]">
                    {availableCount}
                  </span>
                </div>

                <div className="flex items-center gap-2 rounded-[12px] border border-rose-100 bg-rose-50/80 px-3.5 py-2.5">
                  <span className="h-2 w-2 rounded-full bg-rose-400" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.06em] text-rose-600">
                    Inactive
                  </span>
                  <span className="text-sm font-extrabold text-rose-700">
                    {criticalCount}
                  </span>
                </div>

                <button
                  onClick={() => handleOpenModal()}
                  className="group ml-auto inline-flex min-h-[42px] items-center gap-2 rounded-[13px] bg-gradient-to-r from-[#087A57] to-[#0A9668] px-4 py-2.5 text-[12px] font-extrabold text-white shadow-[0_9px_22px_rgba(8,122,87,0.2)] transition-all duration-200 hover:-translate-y-[1px] hover:shadow-[0_12px_28px_rgba(8,122,87,0.26)] active:translate-y-0 sm:ml-0"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-white/12">
                    <Plus size={15} strokeWidth={2.5} />
                  </span>
                  {tabActions[activeTab]?.label}
                </button>
              </div>
            </div>
          </div>

          {/* ===== PREMIUM MODULE TABS ===== */}
          <div className="relative border-t border-[#E8F0EC] bg-[#F8FBF9] px-4 py-2.5 sm:px-6">
            <div className="flex gap-1.5 overflow-x-auto scrollbar-none">
              {TABS.map((tab) => {
                const TabIcon = tab.icon;
                const selected = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`group flex shrink-0 items-center gap-2 rounded-[12px] px-3.5 py-2.5 text-[11px] font-bold transition-all duration-200 ${
                      selected
                        ? "bg-white text-[#087A57] shadow-[0_4px_14px_rgba(32,79,57,0.08)] ring-1 ring-[#D9E9E2]"
                        : "text-[#71847B] hover:bg-white/70 hover:text-[#315647]"
                    }`}
                  >
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-[9px] transition-colors ${
                        selected
                          ? "bg-[#EAF6F0] text-[#087A57]"
                          : "bg-[#EEF3F0] text-[#87988F] group-hover:text-[#087A57]"
                      }`}
                    >
                      <TabIcon size={14} strokeWidth={2} />
                    </span>
                    {tab.label}
                    {selected && (
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* ===== ERROR ===== */}
        {errorMsg && (
          <div className="flex items-center gap-3 rounded-[16px] border border-rose-200 bg-rose-50 px-4 py-3.5 text-sm font-semibold text-rose-700 shadow-[0_6px_18px_rgba(190,24,93,0.05)]">
            <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-white text-rose-500 shadow-sm">
              !
            </div>
            <span className="flex-1">{errorMsg}</span>
            <button
              onClick={() => setErrorMsg(null)}
              className="flex h-8 w-8 items-center justify-center rounded-[10px] text-rose-400 transition hover:bg-white hover:text-rose-600"
              aria-label="Dismiss error"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* ===== PREMIUM TABLE CARD ===== */}
        <section className="overflow-hidden rounded-[22px] border border-[#E0EBE6] bg-white shadow-[0_10px_30px_rgba(32,79,57,0.055)]">
          <div className="flex flex-col gap-3 border-b border-[#E8F0EC] bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-[11px] border border-[#DDEBE5] bg-[#F2F8F5] text-[#087A57]">
                <ActiveTabIcon size={17} strokeWidth={2} />
              </div>

              <div>
                <p className="text-[11px] font-extrabold text-[#304E41]">
                  {TABS.find((t) => t.id === activeTab)?.label}
                </p>
                <p className="mt-0.5 text-[9.5px] font-medium text-[#98A7A0]">
                  {assets.length} total record{assets.length === 1 ? "" : "s"}
                </p>
              </div>
            </div>

            <button
              onClick={fetchAssets}
              disabled={isLoading}
              className="inline-flex items-center gap-2 self-start rounded-[10px] border border-[#DCE9E3] bg-[#FAFCFB] px-3 py-2 text-[10px] font-bold text-[#587167] transition hover:border-[#BFD7CC] hover:bg-[#F2F8F5] hover:text-[#087A57] disabled:opacity-40 sm:self-auto"
            >
              <RefreshCw
                size={13}
                className={isLoading ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] border-collapse text-left">
              <thead>
                <tr className="border-b border-[#E6EEE9] bg-[#F7FAF8] text-[9.5px] font-extrabold uppercase tracking-[0.12em] text-[#7C8E85]">
                  {activeTab === "device" && (
                    <>
                      <th className="w-24 px-6 py-3.5">ID</th>
                      <th className="px-6 py-3.5">Device Name</th>
                      <th className="px-6 py-3.5">Accessories</th>
                      <th className="w-32 px-6 py-3.5">Status</th>
                    </>
                  )}
                  {activeTab === "care" && (
                    <>
                      <th className="px-6 py-3.5">Center Name</th>
                      <th className="px-6 py-3.5">Address</th>
                      <th className="px-6 py-3.5">Contact</th>
                      <th className="w-32 px-6 py-3.5">Status</th>
                    </>
                  )}
                  {activeTab === "reference" && (
                    <>
                      <th className="px-6 py-3.5">Doctor / Specialist</th>
                      <th className="px-6 py-3.5">Hospital</th>
                      <th className="px-6 py-3.5">Contact</th>
                      <th className="w-32 px-6 py-3.5">Status</th>
                    </>
                  )}
                  {activeTab === "delivery" && (
                    <>
                      <th className="px-6 py-3.5">Executive Name</th>
                      <th className="px-6 py-3.5">Mobile</th>
                      <th className="w-32 px-6 py-3.5">Status</th>
                    </>
                  )}
                  <th className="w-28 px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#EEF3F0]">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="py-24 text-center">
                      <div className="inline-flex flex-col items-center gap-3">
                        <div className="h-9 w-9 rounded-full border-[3px] border-[#D7EAE1] border-t-[#087A57] animate-spin" />
                        <div>
                          <p className="text-[12px] font-bold text-[#60746A]">
                            Loading master records
                          </p>
                          <p className="mt-1 text-[10px] font-medium text-[#A0ADA7]">
                            Syncing operational data…
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : assets.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-24 text-center">
                      <div className="mx-auto flex max-w-xs flex-col items-center">
                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-[15px] border border-[#DFECE6] bg-[#F3F9F6] text-[#7D9489]">
                          <Database size={21} />
                        </div>
                        <p className="text-[13px] font-extrabold text-[#3C564B]">
                          No records available
                        </p>
                        <p className="mt-1 text-[10.5px] leading-5 text-[#93A29B]">
                          Create the first {TABS.find((t) => t.id === activeTab)?.label?.toLowerCase()} record to begin.
                        </p>
                        <button
                          onClick={() => handleOpenModal()}
                          className="mt-4 inline-flex items-center gap-1.5 rounded-[10px] bg-[#EDF7F2] px-3 py-2 text-[10px] font-extrabold text-[#087A57] transition hover:bg-[#E1F1E9]"
                        >
                          <Plus size={13} />
                          Create first entry
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  assets.map((item, index) => {
                    const idValue = item[getModuleConfig(activeTab).idKey];

                    return (
                      <tr
                        key={idValue ?? `row-${index}`}
                        className="group transition-colors duration-150 hover:bg-[#F9FCFA]"
                      >
                        {activeTab === "device" && (
                          <>
                            <td className="px-6 py-4">
                              <span className="rounded-[7px] border border-[#E4ECE8] bg-[#F5F8F6] px-2 py-1 font-mono text-[10px] font-bold text-[#8B9A93]">
                                #{item.device_id}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#EDF7F2] text-[#087A57]">
                                  <MonitorCog size={15} />
                                </span>
                                <span className="text-[12.5px] font-bold text-[#2D463B]">
                                  {item.device_name}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex flex-wrap gap-1.5">
                                {Array.isArray(item.accessories) && item.accessories.length > 0 ? (
                                  item.accessories.map((acc, i) => (
                                    <span
                                      key={i}
                                      className="inline-flex rounded-full border border-[#D7E9E0] bg-[#F0F9F4] px-2.5 py-0.5 text-[10px] font-semibold text-[#087A57]"
                                    >
                                      {typeof acc === "string" ? acc : acc?.accessory_name || "—"}
                                    </span>
                                  ))
                                ) : (
                                  <span className="text-[11px] text-[#9AA8A1]">No accessories</span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              {getStatusBadge(item.status)}
                            </td>
                          </>
                        )}

                        {activeTab === "care" && (
                          <>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#EDF7F2] text-[#087A57]">
                                  <Building2 size={15} />
                                </span>
                                <span className="text-[12.5px] font-bold text-[#2D463B]">
                                  {item.carecenter_name}
                                </span>
                              </div>
                            </td>
                            <td className="max-w-[230px] px-6 py-4 text-[11.5px] font-medium text-[#6E8077]">
                              <span className="line-clamp-2">{item.address || "—"}</span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="space-y-0.5 font-mono text-[10.5px] font-semibold text-[#587067]">
                                <div>{item.mobile_number || "—"}</div>
                                {item.alternative_mobile_number && (
                                  <div className="text-[#9AA8A1]">
                                    {item.alternative_mobile_number}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              {getStatusBadge(item.status)}
                            </td>
                          </>
                        )}

                        {activeTab === "reference" && (
                          <>
                            <td className="px-6 py-4">
                              <div className="flex items-start gap-3">
                                <span className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#F1F7F4] text-[#587A6A]">
                                  <UserRound size={15} />
                                </span>
                                <div>
                                  <p className="text-[12.5px] font-bold text-[#2D463B]">
                                    {item.doctor_name}
                                  </p>
                                  <p className="mt-0.5 text-[10px] font-medium text-[#94A49D]">
                                    {item.specialist || "—"}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-[11.5px] font-semibold text-[#60746A]">
                              {item.hospital_name || "—"}
                            </td>
                            <td className="px-6 py-4">
                              <div className="space-y-0.5 font-mono text-[10.5px] font-semibold text-[#587067]">
                                <div>{item.mobile_number || "—"}</div>
                                {item.alternative_number && (
                                  <div className="text-[#9AA8A1]">
                                    {item.alternative_number}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              {getStatusBadge(item.status)}
                            </td>
                          </>
                        )}

                        {activeTab === "delivery" && (
                          <>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#EDF7F2] text-[#087A57]">
                                  <Truck size={15} />
                                </span>
                                <span className="text-[12.5px] font-bold text-[#2D463B]">
                                  {item.delivery_name}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 font-mono text-[10.5px] font-semibold text-[#60746A]">
                              {item.mobile_number || "—"}
                            </td>
                            <td className="px-6 py-4">
                              {getStatusBadge(item.status)}
                            </td>
                          </>
                        )}

                        {/* ICON-ONLY ACTIONS */}
                        <td className="px-6 py-4 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleOpenModal(item)}
                              className="group/edit relative flex h-8 w-8 items-center justify-center rounded-[9px] border border-[#DCEAE3] bg-[#F5FAF7] text-[#087A57] transition-all hover:border-[#A9D4C1] hover:bg-[#E8F5EF] hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0A8A60]/20"
                              title="Edit record"
                              aria-label="Edit record"
                            >
                              <Edit3 size={14} strokeWidth={2.1} />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDelete(idValue)}
                              className="group/delete relative flex h-8 w-8 items-center justify-center rounded-[9px] border border-rose-100 bg-rose-50 text-rose-600 transition-all hover:border-rose-200 hover:bg-rose-100 hover:text-rose-700 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-200"
                              title="Delete record"
                              aria-label="Delete record"
                            >
                              <Trash2 size={14} strokeWidth={2.1} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* ===== PREMIUM MODAL ===== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-[#112C22]/55 backdrop-blur-[4px]"
            onClick={handleCloseModal}
          />

          <div className="relative max-h-[92vh] w-full max-w-lg overflow-hidden rounded-[24px] border border-white/50 bg-white shadow-[0_30px_90px_rgba(8,66,46,0.28)] animate-in fade-in zoom-in-95 duration-150">
            <div className="relative overflow-hidden bg-gradient-to-r from-[#075F46] via-[#087A57] to-[#0A9668] px-6 py-5">
              <div className="pointer-events-none absolute -right-12 -top-14 h-40 w-40 rounded-full border border-white/10" />
              <div className="pointer-events-none absolute right-7 top-3 h-24 w-24 rounded-full border border-white/5" />

              <div className="relative flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-[12px] border border-white/10 bg-white/10 text-white">
                    {isEditMode() ? (
                      <Edit3 size={18} />
                    ) : (
                      <ActiveActionIcon size={18} />
                    )}
                  </div>

                  <div>
                    <p className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-emerald-100/65">
                      {isEditMode() ? "Edit Master Record" : "Create Master Record"}
                    </p>
                    <h3 className="mt-0.5 text-[17px] font-bold tracking-tight text-white">
                      {isEditMode()
                        ? modalTitles[activeTab]?.edit
                        : modalTitles[activeTab]?.create}
                    </h3>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] border border-white/10 bg-white/[0.08] text-white/70 transition hover:bg-white/[0.14] hover:text-white"
                  aria-label="Close modal"
                >
                  <X size={17} />
                </button>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="max-h-[calc(92vh-84px)] space-y-5 overflow-y-auto bg-white p-6"
            >
              {/* DEVICE + MULTIPLE ACCESSORIES */}
              {activeTab === "device" && (
                <>
                  <div>
                    <label className={labelClass}>Device Model Name *</label>
                    <input
                      type="text"
                      required
                      value={deviceForm.device_name}
                      onChange={(e) =>
                        setDeviceForm({
                          ...deviceForm,
                          device_name: e.target.value,
                        })
                      }
                      className={inputClass}
                      placeholder="e.g. Oxygen Concentrator X1"
                    />
                  </div>

                  <div className="rounded-[16px] border border-[#DDEBE5] bg-[#F8FBF9] p-4">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <div>
                        <label className={labelClass}>Accessories</label>
                        <p className="text-[10px] text-[#8A9B93]">
                          Optional – leave empty if none
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={addAccessoryRow}
                        className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-[10px] bg-[#087A57] px-3 py-2 text-[10px] font-extrabold text-white shadow-sm transition hover:bg-[#076B4D]"
                        title="Add accessory"
                        aria-label="Add accessory"
                      >
                        <Plus size={14} strokeWidth={2.5} />
                        
                      </button>
                    </div>

                    <div className="space-y-2.5">
                      {(deviceForm.accessories || []).map((accessory, index) => (
                        <div
                          key={`accessory-row-${index}`}
                          className="flex items-end gap-2 rounded-[12px] border border-[#E1ECE7] bg-white p-2.5"
                        >
                          <div className="min-w-0 flex-1">
                            <label className={labelClass}>
                              Accessory {index + 1}
                            </label>
                            <input
                              type="text"
                              value={accessory.accessory_name || ""}
                              onChange={(e) =>
                                updateAccessoryRow(index, e.target.value)
                              }
                              className={inputClass}
                              placeholder="e.g. Nasal Cannula"
                            />
                          </div>

                          <button
                            type="button"
                            onClick={() => removeAccessoryRow(index)}
                            className="flex h-[45px] w-[45px] shrink-0 items-center justify-center rounded-[11px] border border-rose-100 bg-rose-50 text-rose-600 transition hover:border-rose-200 hover:bg-rose-100"
                            title="Remove accessory"
                            aria-label={`Remove accessory ${index + 1}`}
                          >
                            <Trash2 size={15} strokeWidth={2.1} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Operational Status</label>
                    <select
                      value={deviceForm.status}
                      onChange={(e) =>
                        setDeviceForm({
                          ...deviceForm,
                          status: e.target.value,
                        })
                      }
                      className={inputClass}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </>
              )}

              {/* CARE */}
              {activeTab === "care" && (
                <>
                  <div>
                    <label className={labelClass}>Care Center Name *</label>
                    <input
                      type="text"
                      required
                      value={careForm.carecenter_name}
                      onChange={(e) =>
                        setCareForm({
                          ...careForm,
                          carecenter_name: e.target.value,
                        })
                      }
                      className={inputClass}
                      placeholder="e.g. Lifeline Central Medical"
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Address *</label>
                    <textarea
                      required
                      rows={3}
                      value={careForm.address}
                      onChange={(e) =>
                        setCareForm({
                          ...careForm,
                          address: e.target.value,
                        })
                      }
                      className={`${inputClass} resize-none`}
                      placeholder="Full operational address"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className={labelClass}>Mobile *</label>
                      <input
                        type="text"
                        required
                        value={careForm.mobile_number}
                        onChange={(e) =>
                          setCareForm({
                            ...careForm,
                            mobile_number: e.target.value,
                          })
                        }
                        className={`${inputClass} font-mono`}
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Alt Mobile</label>
                      <input
                        type="text"
                        value={careForm.alternative_mobile_number || ""}
                        onChange={(e) =>
                          setCareForm({
                            ...careForm,
                            alternative_mobile_number: e.target.value,
                          })
                        }
                        className={`${inputClass} font-mono`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Status</label>
                    <select
                      value={careForm.status}
                      onChange={(e) =>
                        setCareForm({
                          ...careForm,
                          status: e.target.value,
                        })
                      }
                      className={inputClass}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </>
              )}

              {/* REFERENCE */}
              {activeTab === "reference" && (
                <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className={labelClass}>Doctor Name *</label>
                      <input
                        type="text"
                        required
                        value={referenceForm.doctor_name}
                        onChange={(e) =>
                          setReferenceForm({
                            ...referenceForm,
                            doctor_name: e.target.value,
                          })
                        }
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Specialist *</label>
                      <input
                        type="text"
                        required
                        value={referenceForm.specialist}
                        onChange={(e) =>
                          setReferenceForm({
                            ...referenceForm,
                            specialist: e.target.value,
                          })
                        }
                        className={inputClass}
                        placeholder="e.g. Pulmonologist"
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Hospital Name *</label>
                    <input
                      type="text"
                      required
                      value={referenceForm.hospital_name}
                      onChange={(e) =>
                        setReferenceForm({
                          ...referenceForm,
                          hospital_name: e.target.value,
                        })
                      }
                      className={inputClass}
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className={labelClass}>Mobile *</label>
                      <input
                        type="text"
                        required
                        value={referenceForm.mobile_number}
                        onChange={(e) =>
                          setReferenceForm({
                            ...referenceForm,
                            mobile_number: e.target.value,
                          })
                        }
                        className={`${inputClass} font-mono`}
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Alt Number</label>
                      <input
                        type="text"
                        value={referenceForm.alternative_number || ""}
                        onChange={(e) =>
                          setReferenceForm({
                            ...referenceForm,
                            alternative_number: e.target.value,
                          })
                        }
                        className={`${inputClass} font-mono`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Status</label>
                    <select
                      value={referenceForm.status}
                      onChange={(e) =>
                        setReferenceForm({
                          ...referenceForm,
                          status: e.target.value,
                        })
                      }
                      className={inputClass}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </>
              )}

              {/* DELIVERY */}
              {activeTab === "delivery" && (
                <>
                  <div>
                    <label className={labelClass}>Executive Name *</label>
                    <input
                      type="text"
                      required
                      value={deliveryForm.delivery_name}
                      onChange={(e) =>
                        setDeliveryForm({
                          ...deliveryForm,
                          delivery_name: e.target.value,
                        })
                      }
                      className={inputClass}
                      placeholder="Full legal name"
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Mobile Number *</label>
                    <input
                      type="text"
                      required
                      value={deliveryForm.mobile_number}
                      onChange={(e) =>
                        setDeliveryForm({
                          ...deliveryForm,
                          mobile_number: e.target.value,
                        })
                      }
                      className={`${inputClass} font-mono`}
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Status</label>
                    <select
                      value={deliveryForm.status}
                      onChange={(e) =>
                        setDeliveryForm({
                          ...deliveryForm,
                          status: e.target.value,
                        })
                      }
                      className={inputClass}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </>
              )}

              <div className="flex items-center justify-end gap-2.5 border-t border-[#E9F0EC] pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={isSubmitting}
                  className="rounded-[11px] border border-[#DCE7E2] bg-white px-4 py-2.5 text-[11px] font-bold text-[#60746A] transition hover:bg-[#F6F9F7] disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex min-w-[124px] items-center justify-center gap-2 rounded-[11px] bg-gradient-to-r from-[#087A57] to-[#0A9668] px-5 py-2.5 text-[11px] font-extrabold text-white shadow-[0_8px_20px_rgba(8,122,87,0.2)] transition hover:-translate-y-[1px] hover:shadow-[0_11px_24px_rgba(8,122,87,0.25)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Saving…
                    </>
                  ) : (
                    <>
                      <Save size={14} />
                      {isEditMode() ? "Update Entry" : "Save Entry"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}