import React, { useState } from 'react';

export const CookingMethodologySection: React.FC = () => {
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const questions = [
    { id: 'q1', text: '1. What cooking method do you commonly use at home?', type: 'select', options: ['Boiling', 'Steaming', 'Frying', 'Roasting', 'Grilling', 'Other'] },
    { id: 'q2', text: '2. How many times do you cook at home per day?', type: 'input' },
    { id: 'q3', text: '3. How do you wash vegetables before cooking?', type: 'input' },
    { id: 'q4', text: '4. Do you wash vegetables before or after cutting them?', type: 'select', options: ['Before', 'After'] },
    { id: 'q5', text: '5. Do you soak vegetables in water before cooking?', type: 'select', options: ['Yes', 'No'] },
    { id: 'q6', text: '6. Do you usually overcook vegetables?', type: 'select', options: ['Yes', 'No', 'Sometimes'] },
    { id: 'q7', text: '7. What do you do with the water left after boiling vegetables?', type: 'input' },
    { id: 'q8', text: '8. How often do you use a pressure cooker?', type: 'select', options: ['Never', 'Sometimes', 'Often', 'Daily'] },
    { id: 'q9', text: '9. Do you reheat cooked food before eating?', type: 'select', options: ['Never', 'Sometimes', 'Often'] },
    { id: 'q10', text: '10. Which cooking method do you use most often?', type: 'select', options: ['Boiling', 'Steaming', 'Frying', 'Roasting', 'Grilling', 'Other'] },
    { id: 'q11', text: '11. Which type of cooking oil do you commonly use?', type: 'input' },
    { id: 'q12', text: '12. Approximately how much cooking oil do you use per week?', type: 'input' },
    { id: 'q13', text: '13. Do you reuse oil after frying food?', type: 'select', options: ['Yes', 'No', 'Sometimes'] },
    { id: 'q14', text: '14. When do you usually add salt while cooking?', type: 'select', options: ['Beginning', 'During Cooking', 'At the End'] },
    { id: 'q15', text: '15. How often do you use sugar or jaggery while cooking?', type: 'select', options: ['Never', 'Sometimes', 'Often', 'Daily'] },
    { id: 'q16', text: '16. How do you store rice, pulses, and other dry ingredients?', type: 'select', options: ['Plastic', 'Steel', 'Glass', 'Original Packet', 'Other'] },
    { id: 'q17', text: '17. Are your dry-food storage containers airtight?', type: 'select', options: ['Yes', 'No', 'Some are'] },
    { id: 'q18', text: '18. How long do you usually store grains, pulses, or flour?', type: 'input' },
    { id: 'q19', text: '19. Do you use older stock before opening a new stock?', type: 'select', options: ['Yes', 'No', 'Sometimes'] },
    { id: 'q20', text: '20. Do you check stored grains and pulses for insects or fungal growth?', type: 'select', options: ['Yes', 'No', 'Sometimes'] },
    { id: 'q21', text: '21. How do you store spices and spice powders?', type: 'input' },
    { id: 'q22', text: '22. What type of container do you use to store cooking oil?', type: 'select', options: ['Plastic', 'Steel', 'Glass', 'Original Bottle', 'Other'] },
    { id: 'q23', text: '23. Is cooking oil stored away from direct sunlight and heat?', type: 'select', options: ['Yes', 'No'] },
    { id: 'q24', text: '24. How do you store fruits and vegetables?', type: 'select', options: ['Refrigerator', 'Room Temperature', 'Both'] },
    { id: 'q25', text: '25. How do you store cut fruits and vegetables?', type: 'select', options: ['Open Container', 'Covered Container', 'Airtight Container', 'Other'] },
    { id: 'q26', text: '26. What type of container do you use to store cooked food?', type: 'select', options: ['Steel', 'Glass', 'Plastic', 'Other'] },
    { id: 'q27', text: '27. Do you store hot food directly in plastic containers?', type: 'select', options: ['Yes', 'No', 'Sometimes'] },
    { id: 'q28', text: '28. Do you use separate containers for raw and cooked foods?', type: 'select', options: ['Yes', 'No', 'Sometimes'] },
    { id: 'q29', text: '29. Do you use separate chopping boards or knives for raw and cooked foods?', type: 'select', options: ['Yes', 'No', 'Sometimes'] },
    { id: 'q30', text: '30. Do you check stored food for freshness, smell, colour, and expiry before eating?', type: 'select', options: ['Yes', 'No', 'Sometimes'] },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-black text-[#0F172A] uppercase tracking-wider">Cooking Methodology</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {questions.map((q) => (
          <div key={q.id} className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
            <label className="block text-sm font-bold text-slate-800 mb-2">{q.text}</label>
            {q.type === 'select' && (
              <select
                className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 text-sm font-bold"
                value={answers[q.id] || ''}
                onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
              >
                <option value="">Select...</option>
                {q.options?.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            )}
            {q.type === 'input' && (
              <input
                type="text"
                className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 text-sm font-bold"
                value={answers[q.id] || ''}
                onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
