type PropertyStatusBadgeProps = {
  status: 'draft' | 'published';
};

export default function PropertyStatusBadge({ status }: PropertyStatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        status === 'published'
          ? 'bg-green-100 text-green-800'
          : 'bg-gray-100 text-gray-800'
      }`}
    >
      {status === 'published' ? 'Published' : 'Draft'}
    </span>
  );
}
