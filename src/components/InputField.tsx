// InputField.tsx
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HiEye, HiEyeOff } from "react-icons/hi";

interface InputFieldProps {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showPasswordToggle?: boolean;
  toggleVisibility?: () => void;
  showPassword?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  id,
  label,
  type,
  placeholder,
  value,
  onChange,
  showPasswordToggle,
  toggleVisibility,
  showPassword,
}) => {
  return (
    <div>
      <Label className="block text-black dark:text-white mb-2">{label}</Label>
      <div className="relative">
        <Input
          id={id}
          placeholder={placeholder}
          type={showPasswordToggle && showPassword ? "text" : type}
          name={id}
          value={value}
          onChange={onChange}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
        />
        {showPasswordToggle && (
          <button
            type="button"
            onClick={toggleVisibility}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-black dark:text-white"
          >
            {showPassword ? <HiEyeOff size={24} /> : <HiEye size={24} />}
          </button>
        )}
      </div>
    </div>
  );
};

export default InputField;
