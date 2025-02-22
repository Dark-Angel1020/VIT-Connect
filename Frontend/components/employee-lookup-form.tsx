"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { CustomRadio } from "./custom-radio";
import { CustomInput } from "./custom-input";
import { CustomLoading } from "./custom-loading";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { AlertCircle } from "lucide-react";

interface FormData {
  idType: "empo" | "reg";
  id: string;
}

interface EmployeeData {
  name: string;
  email: string;
  phone: string;
}

export function EmployeeLookupForm() {
  const [idType, setIdType] = useState<"empo" | "reg">("empo");
  const [loading, setLoading] = useState(false);
  const [employeeData, setEmployeeData] = useState<EmployeeData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { handleSubmit, watch, setValue, reset } = useForm<FormData>();

  const handleIdTypeChange = (type: "empo" | "reg") => {
    setIdType(type);
    reset(); // Reset form when switching ID types
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError(null);
    setEmployeeData(null);

    try {
      const response = await fetch(
        `https://vit-deepak-georges-projects.vercel.app/api/search/${data.id}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Request failed");
      }

      const result = await response.json();
      setEmployeeData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[800px] p-12 bg-white rounded-lg relative border-4 border-dashed border-blue-200">
      <div className="space-y-10">
        <h1 className="text-4xl font-bold text-center text-gray-800">VIT-CC Searcher</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
          <div className="flex justify-center space-x-12">
            <CustomRadio id="empo" label="Employee ID" checked={idType === "empo"} onChange={() => handleIdTypeChange("empo")} />
            <CustomRadio id="reg" label="Reg ID" checked={idType === "reg"} onChange={() => handleIdTypeChange("reg")} />
          </div>

          <div className="space-y-2">
            <label className="text-gray-600 text-lg">{idType === "empo" ? "Employee ID" : "Registration ID"}</label>
            <CustomInput
              id={idType}
              placeholder={idType === "empo" ? "Enter Employee ID" : "Enter Reg ID (21XXX1415)"}
              value={watch("id") || ""}
              onChange={(value) =>
                setValue(
                  "id",
                  idType === "reg" ? value.toUpperCase() : value.replace(/\D/g, "").slice(0, 5) // Restrict Emp ID to 5 digits
                )
              }
              pattern={idType === "empo" ? "^[0-9]{1,5}$" : "^21[A-Z]{3}[0-9]{4}$"}
            />
            <p className="text-sm text-gray-500">
              {idType === "empo" ? "Must be a valid ID" : "Only for 2021 - Batch"}
            </p>
          </div>

          <div className="pt-4">
            <Button type="submit" className="w-full text-xl py-8 bg-blue-600 hover:bg-blue-700">
              Submit
            </Button>
          </div>
        </form>
      </div>

      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <CustomLoading />
        </div>
      )}

      {/* Success Dialog */}
      <Dialog open={!!employeeData} onOpenChange={() => setEmployeeData(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-2xl">Information of: {watch("id")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-lg">
            <p>
              <strong>Name:</strong> {employeeData?.name}
            </p>
            <p>
              <strong>Email:</strong> {employeeData?.email}
            </p>
            <p>
              <strong>Phone:</strong> {employeeData?.phone}
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Error Dialog */}
      <Dialog open={!!error} onOpenChange={() => setError(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center text-red-500 text-2xl">
              <AlertCircle className="mr-2 h-8 w-8" />
              Error
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-lg">{error}</DialogDescription>
        </DialogContent>
      </Dialog>
    </div>
  );
}
