import { ClipboardDocumentListIcon } from '@heroicons/react/24/outline';

type PropertyRulesProps = {
  houseRules?: string[];
};

export default function PropertyRules({ houseRules }: PropertyRulesProps) {
  if (!houseRules || houseRules.length === 0) {
    return null;
  }

  return (
    <section>
      <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <ClipboardDocumentListIcon className="h-5 w-5 text-gray-500" />
        House Rules
      </h2>
      <ul className="list-disc pl-5 space-y-2">
        {houseRules.map((rule, index) => (
          <li key={index} className="text-gray-700">{rule}</li>
        ))}
      </ul>
    </section>
  );
}
