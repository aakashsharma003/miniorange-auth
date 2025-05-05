import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-hot-toast";  // Importing toast from react-hot-toast

const formSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters" }),
  phone: z.string().optional(),
});

export function ProfileForm({ profile }: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: profile.username,
      phone: profile.phone || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Not authenticated");
      }

      const response = await fetch(`${import.meta.env.VITE_APP_BACKEND_API}/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      toast.success("Profile updated successfully");  // Using toaster for success notification
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update profile");  // Using toaster for error notification
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* Render form fields for username, phone, etc. */}
    </form>
  );
}

