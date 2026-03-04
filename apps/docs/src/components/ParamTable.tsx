type Param = {
  name: string;
  type: string;
  required?: boolean;
  description: string;
};

export function ParamTable({ params }: { params: Param[] }) {
  if (!params.length) return null;

  return (
    <div className="mt-4 overflow-hidden rounded-xl border border-border-subtle bg-bg-elevated/95 text-xs">
      <table className="w-full border-collapse">
        <thead className="bg-bg-subtle/60 text-[11px] uppercase tracking-wide text-fg-soft">
          <tr>
            <th className="px-3 py-2 text-left font-semibold">Name</th>
            <th className="px-3 py-2 text-left font-semibold">Type</th>
            <th className="px-3 py-2 text-left font-semibold">Required</th>
            <th className="px-3 py-2 text-left font-semibold">Description</th>
          </tr>
        </thead>
        <tbody>
          {params.map((param) => (
            <tr key={param.name} className="border-t border-border-subtle/60">
              <td className="px-3 py-2 font-mono text-[11px] text-fg">
                {param.name}
              </td>
              <td className="px-3 py-2 font-mono text-[11px] text-fg-soft">
                {param.type}
              </td>
              <td className="px-3 py-2 text-[11px] text-fg-muted">
                {param.required ? "Yes" : "No"}
              </td>
              <td className="px-3 py-2 text-xs text-fg-muted">
                {param.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

