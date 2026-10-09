import React, { useState, useEffect } from 'react';
import {
  Save,
  Copy,
  Edit2,
  Send,
  Printer,
  Plus,
  Trash2,
  Check,
  Share2,
} from 'lucide-react';

export interface PrescriptionMedicineItem {
  id: string;
  name: string;
  formulation?: string; // e.g. "Tablet", "Capsule", "Syrup"
  genericName?: string; // e.g. "Thyroxine (100mcg)", "Metformin (500mg)"
  dose: string;         // e.g. "1 tablet", "1 capsule"
  frequency: string;    // e.g. "1-0-0 Empty Stomach", "1-0-1 After Meal"
  duration: string;     // e.g. "30 Days", "4 Weeks"
  remarks: string;      // e.g. "Take 1 tablet - in the morning, with empty stomach, for 30 days. Morning"
}

export interface OfficialClinicalPrescriptionTableProps {
  initialMedicines?: PrescriptionMedicineItem[];
  onUpdateMedicines?: (meds: PrescriptionMedicineItem[]) => void;
  onPrint?: () => void;
  onSendSmsWhatsApp?: () => void;
  patientName?: string;
  readOnly?: boolean;
}

export const DEFAULT_CLINICAL_MEDICINES: PrescriptionMedicineItem[] = [
  {
    id: 'med-1',
    name: 'Thyronorm 100mcg Tablet',
    formulation: 'tablet',
    genericName: 'Thyroxine (100mcg)',
    dose: '1 tablet',
    frequency: '1-0-0 Empty Stomach',
    duration: '30 Days',
    remarks: 'Take 1 tablet - in the morning, with empty stomach, for 30 days. Morning',
  },
  {
    id: 'med-2',
    name: 'Prizibiome',
    formulation: 'capsule',
    genericName: 'Probiotic & Prebiotic Matrix',
    dose: '1 capsule',
    frequency: '1-0-1 After Meal',
    duration: '30 Days',
    remarks: 'Take 1 capsule - Twice a day, after breakfast and after dinner, for 30 days. Morning + Evening',
  },
  {
    id: 'med-3',
    name: 'Heal O Joint',
    formulation: 'capsule',
    genericName: 'Glucosamine, Chondroitin & MSM',
    dose: '1 capsule',
    frequency: '1-0-1 After Meal',
    duration: '4 Weeks',
    remarks: 'Take 1 capsule - Twice a day, after breakfast and after dinner, for 4 weeks. Morning + Evening',
  },
  {
    id: 'med-4',
    name: 'Metformin 500mg Tablet',
    formulation: 'tablet',
    genericName: 'Metformin Hydrochloride (500mg)',
    dose: '1 tablet',
    frequency: '1-0-1 After Meal',
    duration: '30 Days',
    remarks: 'Take 1 tablet - Twice a day, after breakfast and after dinner, for 30 days. Morning + Evening',
  },
  {
    id: 'med-5',
    name: 'Wellwoman Health Supplement Capsule',
    formulation: 'capsule',
    genericName: 'Essential Micronutrient & Bioactive Botanical Blend',
    dose: '1 capsule',
    frequency: '1-0-0 After Meal',
    duration: '30 Days',
    remarks: 'Take 1 capsule - after breakfast, for 30 days. Morning',
  },
];

export const OfficialClinicalPrescriptionTable: React.FC<OfficialClinicalPrescriptionTableProps> = ({
  initialMedicines,
  onUpdateMedicines,
  onPrint,
  onSendSmsWhatsApp,
  patientName = 'Patient',
  readOnly = false,
}) => {
  const [medicines, setMedicines] = useState<PrescriptionMedicineItem[]>(() => {
    if (initialMedicines && initialMedicines.length > 0) return initialMedicines;
    try {
      const saved = localStorage.getItem('ZIATHLON_RX_TABLE_MEDS');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_CLINICAL_MEDICINES;
  });

  const [isEditing, setIsEditing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    if (onUpdateMedicines && medicines.length > 0) {
      onUpdateMedicines(medicines);
    }
  }, []);

  const handleFieldChange = (id: string, field: keyof PrescriptionMedicineItem, value: string) => {
    const updated = medicines.map((m) => (m.id === id ? { ...m, [field]: value } : m));
    setMedicines(updated);
    if (onUpdateMedicines) onUpdateMedicines(updated);
    try {
      localStorage.setItem('ZIATHLON_RX_TABLE_MEDS', JSON.stringify(updated));
    } catch {}
  };

  const handleAddRow = () => {
    const newRow: PrescriptionMedicineItem = {
      id: `med-${Date.now()}`,
      name: 'New Medication',
      formulation: 'tablet',
      genericName: 'Active Formulation',
      dose: '1 tablet',
      frequency: '1-0-1 After Meal',
      duration: '30 Days',
      remarks: 'Take as clinically directed by physician.',
    };
    const updated = [...medicines, newRow];
    setMedicines(updated);
    if (onUpdateMedicines) onUpdateMedicines(updated);
    setIsEditing(true);
  };

  const handleDeleteRow = (id: string) => {
    const updated = medicines.filter((m) => m.id !== id);
    setMedicines(updated);
    if (onUpdateMedicines) onUpdateMedicines(updated);
    try {
      localStorage.setItem('ZIATHLON_RX_TABLE_MEDS', JSON.stringify(updated));
    } catch {}
  };

  return (
    <div className="w-full space-y-3 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-2.5 rounded-lg bg-[#EBF2F7] border border-[#2563EB] text-[#1E3A8A] text-xs font-bold flex items-center gap-2 shadow-sm animate-in fade-in no-print">
          <Check className="w-4 h-4 text-[#2563EB]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Prescription Table Container */}
      <div className="overflow-x-auto rounded-lg border border-[#CBD5E1] shadow-sm bg-white">
        <table className="w-full text-left text-xs border-collapse min-w-[760px]">
          {/* Header Row: Muted Ice Blue-Gray Header with Sharp Black Letters */}
          <thead>
            <tr className="bg-[#E2EAF2] border-b border-[#CBD5E1] text-[#0F172A] font-black text-xs uppercase tracking-wider">
              <th className="py-3 px-3.5 border-r border-[#CBD5E1] w-[35%] font-extrabold text-[#0F172A]">
                Medications
              </th>
              <th className="py-3 px-3 border-r border-[#CBD5E1] w-[14%] text-center font-extrabold text-[#0F172A]">
                Dose
              </th>
              <th className="py-3 px-3 border-r border-[#CBD5E1] w-[18%] text-center font-extrabold text-[#0F172A]">
                Frequency
              </th>
              <th className="py-3 px-3 border-r border-[#CBD5E1] w-[13%] text-center font-extrabold text-[#0F172A]">
                Duration
              </th>
              <th className="py-3 px-3.5 w-[20%] font-extrabold text-[#0F172A]">
                Remarks
              </th>
              {isEditing && !readOnly && (
                <th className="py-3 px-2 text-center w-10 no-print border-l border-[#CBD5E1]">
                  Act
                </th>
              )}
            </tr>
          </thead>

          {/* Table Body Rows matching user photograph */}
          <tbody className="divide-y divide-[#CBD5E1]">
            {medicines.map((med, idx) => (
              <tr key={med.id} className="transition-colors hover:bg-slate-50/80">
                {/* 1. Medications: Clean White Cell */}
                <td className="py-3 px-3.5 bg-white border-r border-[#CBD5E1] align-top">
                  <div className="flex items-start gap-2">
                    <span className="font-extrabold text-[#0F172A] text-xs shrink-0 select-none">
                      {idx + 1}.
                    </span>
                    <div className="flex-1 space-y-0.5">
                      {isEditing && !readOnly ? (
                        <div className="space-y-1">
                          <input
                            type="text"
                            value={med.name}
                            onChange={(e) => handleFieldChange(med.id, 'name', e.target.value)}
                            className="w-full bg-white border border-[#CBD5E1] rounded px-2 py-1 text-xs text-[#0F172A] font-bold"
                            placeholder="Medicine name"
                          />
                          <input
                            type="text"
                            value={med.genericName || ''}
                            onChange={(e) => handleFieldChange(med.id, 'genericName', e.target.value)}
                            className="w-full bg-white border border-[#CBD5E1] rounded px-2 py-0.5 text-[11px] text-[#475569]"
                            placeholder="Generic / composition"
                          />
                        </div>
                      ) : (
                        <>
                          <div className="font-black text-[#0F172A] text-[13px] leading-tight">
                            {med.name}
                            {med.formulation && (
                              <span className="text-gray-500 font-normal text-[11px] ml-1.5">
                                ({med.formulation})
                              </span>
                            )}
                          </div>
                          {med.genericName && (
                            <div className="text-[11px] text-[#475569] font-medium leading-tight">
                              {med.genericName}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </td>

                {/* 2. Dose: Soft Ice-Blue/Slate Tinted Cell */}
                <td className="py-3 px-3 bg-[#F1F5F9] border-r border-[#CBD5E1] text-center align-top font-bold text-[#0F172A]">
                  {isEditing && !readOnly ? (
                    <input
                      type="text"
                      value={med.dose}
                      onChange={(e) => handleFieldChange(med.id, 'dose', e.target.value)}
                      className="w-full bg-white border border-[#CBD5E1] rounded px-1.5 py-1 text-center text-xs font-bold text-[#0F172A]"
                    />
                  ) : (
                    <span className="text-xs font-bold text-[#0F172A] block">{med.dose}</span>
                  )}
                </td>

                {/* 3. Frequency: Soft Ice-Blue/Slate Tinted Cell */}
                <td className="py-3 px-3 bg-[#F1F5F9] border-r border-[#CBD5E1] text-center align-top font-bold text-[#0F172A]">
                  {isEditing && !readOnly ? (
                    <input
                      type="text"
                      value={med.frequency}
                      onChange={(e) => handleFieldChange(med.id, 'frequency', e.target.value)}
                      className="w-full bg-white border border-[#CBD5E1] rounded px-1.5 py-1 text-center text-xs font-bold text-[#0F172A]"
                    />
                  ) : (
                    <span className="text-xs font-bold text-[#0F172A] block">{med.frequency}</span>
                  )}
                </td>

                {/* 4. Duration: Soft Ice-Blue/Slate Tinted Cell */}
                <td className="py-3 px-3 bg-[#F1F5F9] border-r border-[#CBD5E1] text-center align-top font-bold text-[#0F172A]">
                  {isEditing && !readOnly ? (
                    <input
                      type="text"
                      value={med.duration}
                      onChange={(e) => handleFieldChange(med.id, 'duration', e.target.value)}
                      className="w-full bg-white border border-[#CBD5E1] rounded px-1.5 py-1 text-center text-xs font-bold text-[#0F172A]"
                    />
                  ) : (
                    <span className="text-xs font-bold text-[#0F172A] block">{med.duration}</span>
                  )}
                </td>

                {/* 5. Remarks: Clean White Cell */}
                <td className="py-3 px-3.5 bg-white align-top text-xs text-[#0F172A] leading-relaxed">
                  {isEditing && !readOnly ? (
                    <textarea
                      value={med.remarks}
                      onChange={(e) => handleFieldChange(med.id, 'remarks', e.target.value)}
                      rows={2}
                      className="w-full bg-white border border-[#CBD5E1] rounded px-2 py-1 text-xs text-[#0F172A]"
                    />
                  ) : (
                    <span className="text-[12px] text-[#0F172A] font-medium">{med.remarks}</span>
                  )}
                </td>

                {/* Action Delete (when in editing mode) */}
                {isEditing && !readOnly && (
                  <td className="py-3 px-2 bg-white text-center align-top no-print border-l border-[#CBD5E1]">
                    <button
                      type="button"
                      onClick={() => handleDeleteRow(med.id)}
                      className="p-1 text-rose-500 hover:text-rose-700 cursor-pointer"
                      title="Delete medication row"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Action Buttons Toolbar Underneath the Table (As seen in photograph) */}
      <div className="pt-2 flex flex-wrap items-center justify-between gap-3 no-print">
        {/* Left Action Buttons: Outline Buttons with Icons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Explicit Save Prescription Button */}
          <button
            type="button"
            onClick={() => {
              try {
                localStorage.setItem('ZIATHLON_RX_TABLE_MEDS', JSON.stringify(medicines));
                const converted = medicines.map((m) => ({
                  id: m.id,
                  medicine: m.name + (m.genericName ? ` (${m.genericName})` : ''),
                  dosage: m.dose || '1 dose',
                  duration: m.duration || '30 Days',
                  timing: m.frequency || 'As directed',
                  instructions: m.remarks || '',
                }));
                localStorage.setItem('ELSHA_MEDICINAL_PRESCRIPTIONS', JSON.stringify(converted));
                if (onUpdateMedicines) onUpdateMedicines(medicines);
                showToast('✓ Prescription table saved! Synced automatically to 3-Part Preview Paper.');
              } catch {
                showToast('Error saving prescription');
              }
            }}
            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
            title="Save prescription and immediately update preview"
          >
            <Save className="w-3.5 h-3.5 text-white" />
            <span>Save Prescription</span>
          </button>

          {/* Edit / Done Toggle */}
          {!readOnly && (
            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className={`px-3.5 py-2 rounded-lg border text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm transition-all ${
                isEditing
                  ? 'bg-[#EBF2F7] border-[#2563EB] text-[#2563EB]'
                  : 'bg-white border-[#CBD5E1] hover:border-[#94A3B8] text-[#0F172A]'
              }`}
            >
              {isEditing ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span>Done Editing</span>
                </>
              ) : (
                <>
                  <Edit2 className="w-3.5 h-3.5 text-[#475569]" />
                  <span>Edit</span>
                </>
              )}
            </button>
          )}

          {/* Add Medicine Row (visible in edit mode) */}
          {isEditing && !readOnly && (
            <button
              type="button"
              onClick={handleAddRow}
              className="px-3 py-2 rounded-lg bg-[#F5EFEB] border border-[#E0D2C0] hover:bg-[#EADDCB] text-[#7E22CE] text-xs font-bold flex items-center gap-1 cursor-pointer transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Drug</span>
            </button>
          )}
        </div>

        {/* Right Action Buttons: Royal Blue Solid Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Print */}
          <button
            type="button"
            onClick={onPrint || (() => window.print())}
            className="px-4 py-2 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-sm transition-all transform hover:scale-[1.01] active:scale-[0.99]"
            title="Download/Print Clinical Prescription Sheet"
          >
            <Printer className="w-3.5 h-3.5 text-white" />
            <span>Download / Print Prescription</span>
          </button>
        </div>
      </div>
    </div>
  );
};
