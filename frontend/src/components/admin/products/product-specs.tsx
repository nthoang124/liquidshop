import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function SpecificationsInput({
  specs,
  setSpecs,
}: {
  specs: Record<string, string>;
  setSpecs: (value: Record<string, string>) => void;
}) {
  const handleChange = (key: string, field: "key" | "value", newValue: string) => {
    const updated = { ...specs };

    if (field === "key") {
      // đổi key
      const value = updated[key];
      delete updated[key];
      updated[newValue] = value;
    } else {
      updated[key] = newValue;
    }

    setSpecs(updated);
  };

  const handleAdd = () => {
    setSpecs({ ...specs, [""]: "" });
  };

  const handleRemove = (key: string) => {
    const updated = { ...specs };
    delete updated[key];
    setSpecs(updated);
  };

  return (
    <div className="space-y-3">
      <p className="font-semibold">Thông số kỹ thuật</p>

      {Object.entries(specs).map(([key, value], idx) => (
        <div key={idx} className="flex gap-3 items-center">
          <Input
            className="flex-1"
            placeholder="Thuộc tính (vd: CPU)"
            value={key}
            onChange={(e) => handleChange(key, "key", e.target.value)}
          />
          <Input
            className="flex-1"
            placeholder="Giá trị (vd: Intel Core i7)"
            value={value}
            onChange={(e) => handleChange(key, "value", e.target.value)}
          />

          <Button
            variant="destructive"
            className="px-3"
            onClick={() => handleRemove(key)}
          >
            X
          </Button>
        </div>
      ))}

      <Button variant="outline" onClick={handleAdd}>
        + Thêm thông số
      </Button>
    </div>
  );
}

export {SpecificationsInput}