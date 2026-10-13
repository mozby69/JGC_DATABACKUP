



"use client";

import { useState, type FormEvent } from "react";
import {
  UserRound,
  Landmark,
  MapPin,
  Save,
  Loader2,
} from "lucide-react";

interface PensionerFormData {
  firstname: string;
  lastname: string;
  middlename: string;
  suffix: string;
  nickname: string;
  birth_date: string;
  birth_place: string;
  bank_name: string;
  bank_account_number: string;
  gender: string;
  civil_status: string;
  contact_number: string;
  status: string;
  grouping: string;
  atm_branch: string;
  PLP: string;
  branch: string;
  pension_amount: string;
  room_floor_unit_building: string;
  house_lot_block_no: string;
  street_name: string;
  village: string;
  barangay_district: string;
  city_municipality: string;
  province: string;
  zip_code: string;
  contingency_date:string;
}

interface AddPensionerModalProps {
  onCancel?: () => void;
  onSubmit?: (data: PensionerFormData) => void | Promise<void>;
}

const initialForm: PensionerFormData = {
  firstname: "",
  lastname: "",
  middlename: "",
  suffix: "",
  nickname: "",
  birth_date: "",
  birth_place: "",
  bank_name: "",
  bank_account_number: "",
  gender: "",
  civil_status: "",
  contact_number: "",
  status: "Active",
  grouping: "",
  atm_branch: "",
  PLP: "",
  branch: "",
  pension_amount: "",
  room_floor_unit_building: "",
  house_lot_block_no: "",
  street_name: "",
  village: "",
  barangay_district: "",
  city_municipality: "",
  province: "",
  zip_code: "",
  contingency_date:"",
};

type FormField = keyof PensionerFormData;

const inputClass =
  "h-10 w-full rounded-[9px] border border-[#DCE0D9] " +
  "bg-white px-3 text-[12px] text-[#26342F] " +
  "placeholder:text-[#A4ACA5] outline-none " +
  "transition focus:border-[#8BA194] " +
  "focus:ring-2 focus:ring-[#DDE7DE]";

const labelClass =
  "mb-1.5 block text-[11px] font-medium text-[#34453B]";

const fieldGroups = {
  personal: [
    { name: "firstname", label: "First Name", required: true },
    { name: "middlename", label: "Middle Name" },
    { name: "lastname", label: "Last Name", required: true },
    { name: "suffix", label: "Suffix", type: "select",
      options: ["Jr.", "Sr.", "II", "III", "IV"] },
    { name: "nickname", label: "Nickname" },
    { name: "birth_date", label: "Birth Date", type: "date", required: true },
    { name: "birth_place", label: "Birth Place" },
    { name: "gender", label: "Gender", type: "select",
      options: ["Male", "Female", "Other"], required: true },
    { name: "civil_status", label: "Civil Status", type: "select",
      options: ["Single", "Married", "Widowed", "Separated", "Divorced"],
      required: true },
    { name: "contact_number", label: "Contact Number", type: "tel" },
  ],
  banking: [
    { name: "bank_name", label: "Bank Name", required: true },
    { name: "bank_account_number", label: "Bank Account Number",
      required: true },
    { name: "atm_branch", label: "ATM Branch" },
    // { name: "PLP", label: "PLP" },
     { name: "PLP", label: "PLP", type: "select",
      options: ["Yes", "No"], required: true },
    { name: "branch", label: "Branch", required: true },
    { name: "pension_amount", label: "Pension Amount", type: "number",
      required: true },
    { name: "status", label: "Status", type: "select",
      options: ["Active", "Inactive", "Pending"], required: true },
    { name: "grouping", label: "Grouping" },
    { name: "contingency_date", type:"date", label: "Contingency Date" },
  ],
  address: [
    { name: "room_floor_unit_building",
      label: "Room / Floor / Unit / Building" },
    { name: "house_lot_block_no", label: "House / Lot / Block No." },
    { name: "street_name", label: "Street Name" },
    { name: "village", label: "Village / Subdivision" },
    { name: "barangay_district", label: "Barangay / District" },
    { name: "city_municipality", label: "City / Municipality" },
    { name: "province", label: "Province" },
    { name: "zip_code", label: "ZIP Code" },
  ],
} satisfies Record<
  string,
  {
    name: FormField;
    label: string;
    type?: string;
    required?: boolean;
    options?: string[];
  }[]
>;

type FieldConfig = (typeof fieldGroups)[keyof typeof fieldGroups][number];

export default function AddPensionerModal({
  onCancel,
  onSubmit,
}: AddPensionerModalProps) {
  const [form, setForm] = useState<PensionerFormData>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (name: FormField, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const renderField = (field: FieldConfig) => {
    const id = `pensioner-${field.name}`;
    const type = "type" in field ? field.type : "text";
    const required = "required" in field ? field.required : false;
    const options = "options" in field ? field.options : undefined;

    return (
      <div key={field.name} className="min-w-0">
        <label htmlFor={id} className={labelClass}>
          {field.label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>

        {type === "select" ? (
          <select
            id={id}
            name={field.name}
            required={required}
            value={form[field.name]}
            onChange={(e) => updateField(field.name, e.target.value)}
            className={inputClass}
          >
            <option value="">Select {field.label.toLowerCase()}</option>
            {options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : (
          <div className="relative">
            {field.name === "pension_amount" && (
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[12px] text-[#87918B]">
                ₱
              </span>
            )}
            <input
              id={id}
              name={field.name}
              type={type}
              required={required}
              min={
                field.name === "pension_amount"
                  ? "0.01"
                  : undefined
              }
              max={
                field.name === "birth_date"
                  ? new Date().toISOString().slice(0, 10)
                  : undefined
              }
              step={
                field.name === "pension_amount"
                  ? "0.01"
                  : undefined
              }
              inputMode={
                field.name === "bank_account_number" ||
                field.name === "contact_number" ||
                field.name === "zip_code"
                  ? "numeric"
                  : undefined
              }
              value={form[field.name]}
              onChange={(e) => updateField(field.name, e.target.value)}
              placeholder={
                type === "date"
                  ? undefined
                  : `Enter ${field.label.toLowerCase()}`
              }
              className={`${inputClass} ${
                field.name === "pension_amount" ? "pl-7" : ""
              }`}
            />
          </div>
        )}
      </div>
    );
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!onSubmit || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await onSubmit(form);
    } catch (error: unknown) {
      console.error("Failed to save pensioner:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={(event) => void handleSubmit(event)}
      className="flex max-h-[75vh] flex-col bg-white"
    >
      {/* Scrollable content */}
      <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
        <p className="text-[12px] text-[#929A93]">
          Complete the information below to register a new pensioner.
          Fields marked with <span className="text-red-500">*</span> are required.
        </p>

        {/* Personal Information */}
        <section className="rounded-[14px] border border-[#E0E2DC] bg-[#FAFBF9] p-5">
          <SectionHeading
            icon={UserRound}
            title="Personal Information"
            description="Basic information about the pensioner."
          />

          <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
            {fieldGroups.personal.map(renderField)}
          </div>
        </section>

        {/* Pension and Banking */}
        <section className="rounded-[14px] border border-[#E0E2DC] bg-[#FAFBF9] p-5">
          <SectionHeading
            icon={Landmark}
            title="Pension & Banking Information"
            description="Bank account and pension-related details."
          />

          <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
            {fieldGroups.banking.map(renderField)}
          </div>
        </section>

        {/* Address */}
        <section className="rounded-[14px] border border-[#E0E2DC] bg-[#FAFBF9] p-5">
          <SectionHeading
            icon={MapPin}
            title="Address Information"
            description="Complete residential address of the pensioner."
          />

          <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
            {fieldGroups.address.map(renderField)}
          </div>
        </section>
      </div>

      {/* Sticky footer */}
      <div className="flex shrink-0 items-center justify-between gap-3 border-t border-[#E0E2DC] bg-white px-6 py-4">
        <button
          type="button"
          onClick={onCancel}
          className="h-10 rounded-[9px] border border-[#DCE0D9] px-5 text-[12px] font-medium text-[#526459] transition hover:bg-[#F1F3EF]"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting || !onSubmit}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-[9px] bg-[#26342F] px-5 text-[12px] font-medium text-white transition hover:bg-[#374B40] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Save size={16} />
          )}
          {isSubmitting ? "Saving..." : "Save Pensioner"}
        </button>
      </div>
    </form>
  );
}

interface SectionHeadingProps {
  icon: typeof UserRound;
  title: string;
  description: string;
}

function SectionHeading({
  icon: Icon,
  title,
  description,
}: SectionHeadingProps) {
  return (
    <div className="mb-5 flex items-center gap-3 border-b border-[#E4E7E1] pb-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[#E5ECE5] text-[#526B5D]">
        <Icon size={18} strokeWidth={1.8} />
      </div>

      <div>
        <h3 className="text-[13px] font-semibold text-[#26342F]">
          {title}
        </h3>
        <p className="mt-0.5 text-[11px] text-[#929A93]">
          {description}
        </p>
      </div>
    </div>
  );
}
