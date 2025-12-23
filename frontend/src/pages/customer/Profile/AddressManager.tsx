import { Plus, Trash2, MapPin } from "lucide-react";
import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

import { type ProfileFormValues } from "./Profile";

interface AddressManagerProps {
  selectedAddrIndex: string;
  setSelectedAddrIndex: React.Dispatch<React.SetStateAction<string>>;
  onProfileSubmit: (values: ProfileFormValues) => Promise<void>;
  loading: boolean;
}

const AddressManager: React.FC<AddressManagerProps> = ({
  selectedAddrIndex,
  setSelectedAddrIndex,
  onProfileSubmit,
}) => {
  // Lấy form context từ Profile.tsx
  const profileForm = useFormContext<ProfileFormValues>();

  const { fields, append, remove } = useFieldArray({
    control: profileForm.control,
    name: "addresses",
  });

  // --- HANDLERS (Đã chuyển từ Profile.tsx) ---

  const handleAddAddress = () => {
    const isFirst = fields.length === 0;
    append({
      street: "",
      ward: "",
      district: "",
      city: "",
      isDefault: isFirst,
    });

    setTimeout(() => {
      // Chuyển view sang index mới
      setSelectedAddrIndex(fields.length.toString());
    }, 0);
  };

  const handleRemoveAddress = async () => {
    const index = parseInt(selectedAddrIndex);

    if (fields.length <= 1) {
      toast.error("Không thể xóa!", {
        description: "Bạn cần phải có ít nhất một địa chỉ.",
      });
      return;
    }

    const isDefaultBeingRemoved = profileForm.getValues(
      `addresses.${index}.isDefault`
    );

    remove(index);
    setSelectedAddrIndex("0");

    // Xử lý logic chọn địa chỉ mặc định mới nếu địa chỉ cũ bị xóa
    if (isDefaultBeingRemoved) {
      const updatedAddresses = profileForm.getValues("addresses");
      if (updatedAddresses && updatedAddresses.length > 0) {
        profileForm.setValue(`addresses.0.isDefault`, true);
      }
    }

    // Gửi thay đổi lên Server
    const updatedValues = profileForm.getValues();
    await onProfileSubmit(updatedValues);
  };

  const handleSetDefaultAddress = (checked: boolean, currentIndex: number) => {
    if (checked) {
      fields.forEach((_, idx) => {
        profileForm.setValue(
          `addresses.${idx}.isDefault`,
          idx === currentIndex
        );
      });
    } else {
      profileForm.setValue(`addresses.${currentIndex}.isDefault`, false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <MapPin className="w-5 h-5 text-red-500" /> Địa chỉ giao hàng
        </h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddAddress}
          className="border-red-600 text-red-500 hover:bg-red-600 hover:text-white bg-transparent"
        >
          <Plus className="w-4 h-4 mr-2" /> Thêm địa chỉ mới
        </Button>
      </div>

      {/* HIỂN THỊ LỖI TỔNG (Nếu chưa có địa chỉ mặc định) */}
      {profileForm.formState.errors.addresses?.root && (
        <p className="text-red-500 text-sm font-medium bg-red-500/10 p-3 rounded-md border border-red-500/20">
          {profileForm.formState.errors.addresses.root.message}
        </p>
      )}

      {/* Trong trường hợp refine gắn lỗi vào chính field addresses */}
      {profileForm.formState.errors.addresses?.message && (
        <p className="text-red-500 text-sm font-medium bg-red-500/10 p-3 rounded-md border border-red-500/20">
          {profileForm.formState.errors.addresses.message as string}
        </p>
      )}

      {fields.length > 0 ? (
        <div className="bg-[#2a2a2c]/50 p-4 rounded-lg border border-neutral-800">
          {/* Address Selector */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center mb-6">
            <label className="text-neutral-400 md:text-right text-sm">
              Chọn địa chỉ sửa:
            </label>
            <div className="md:col-span-3 flex gap-2">
              <Select
                value={selectedAddrIndex}
                onValueChange={setSelectedAddrIndex}
              >
                <SelectTrigger className="w-full bg-[#2a2a2c] border-neutral-600 text-white">
                  <SelectValue placeholder="Chọn địa chỉ" />
                </SelectTrigger>
                <SelectContent className="bg-[#151517] border-neutral-700 text-white">
                  {fields.map((addr, index) => {
                    const currentAddress = profileForm.getValues(
                      `addresses.${index}`
                    );
                    const displayAddress = `${
                      currentAddress?.street || "..."
                    }, ${currentAddress?.ward || "..."}, ${
                      currentAddress?.district || "..."
                    }, ${currentAddress?.city || "..."}`;

                    return (
                      <SelectItem
                        key={addr.id}
                        value={index.toString()}
                        className="flex flex-col items-start px-2 py-2 focus:bg-neutral-800 hover:bg-neutral-800"
                      >
                        <div className="font-semibold text-white">
                          {`Địa chỉ ${index + 1} ${
                            currentAddress?.isDefault ? " (Mặc định)" : ""
                          }`}
                        </div>
                        <div className="text-xs text-neutral-400 truncate w-full">
                          {displayAddress}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>

              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={handleRemoveAddress}
                title="Xoá địa chỉ này"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Address Fields for Selected Index */}
          {fields.map((item, index) => {
            if (index.toString() !== selectedAddrIndex) return null;

            return (
              <div key={item.id} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={profileForm.control}
                    name={`addresses.${index}.street`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs text-neutral-400">
                          Số nhà / Tên đường
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="bg-[#1a1a1c] border-neutral-600 text-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name={`addresses.${index}.ward`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs text-neutral-400">
                          Phường / Xã
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="bg-[#1a1a1c] border-neutral-600 text-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={profileForm.control}
                    name={`addresses.${index}.district`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs text-neutral-400">
                          Quận / Huyện
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="bg-[#1a1a1c] border-neutral-600 text-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name={`addresses.${index}.city`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs text-neutral-400">
                          Tỉnh / Thành phố
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="bg-[#1a1a1c] border-neutral-600 text-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={profileForm.control}
                  name={`addresses.${index}.isDefault`}
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-neutral-700 p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          disabled={fields.length === 1}
                          onCheckedChange={(checked) => {
                            field.onChange(checked);
                            handleSetDefaultAddress(checked as boolean, index);
                          }}
                          className="data-[state=checked]:bg-red-600 border-neutral-500"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-white cursor-pointer">
                          Đặt làm địa chỉ mặc định
                        </FormLabel>
                        <FormDescription className="text-neutral-500">
                          Địa chỉ này sẽ được chọn tự động khi thanh toán.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 border border-dashed border-neutral-700 rounded-lg text-neutral-500">
          Bạn chưa có địa chỉ nào. Hãy thêm địa chỉ mới.
        </div>
      )}
    </div>
  );
};

export default AddressManager;
