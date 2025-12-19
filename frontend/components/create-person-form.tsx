"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createEventPerson, type PersonType, type CreateEventPersonInput } from "@/lib/people";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

const createPersonSchema = z.object({
  person_type: z.enum(["volunteer", "mentor", "judge", "sponsor", "partner"]),
  full_name: z.string().min(1, "Name is required").max(200),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().optional(),
  company: z.string().optional(),
  role_title: z.string().optional(),
  bio: z.string().optional(),
  skills: z.string().optional(), // Comma-separated, will be split
  notes: z.string().optional(),
});

type CreatePersonFormValues = z.infer<typeof createPersonSchema>;

interface CreatePersonFormProps {
  personType: PersonType;
  orgId?: string;
  buttonText?: string;
}

export function CreatePersonForm({
  personType,
  orgId,
  buttonText = "Add Person",
}: CreatePersonFormProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<CreatePersonFormValues>({
    resolver: zodResolver(createPersonSchema),
    defaultValues: {
      person_type: personType,
      full_name: "",
      email: "",
      phone: "",
      company: "",
      role_title: "",
      bio: "",
      skills: "",
      notes: "",
    },
  });

  const onSubmit = async (values: CreatePersonFormValues) => {
    setIsSubmitting(true);
    try {
      const skillsArray =
        values.skills && values.skills.trim()
          ? values.skills.split(",").map((s) => s.trim()).filter(Boolean)
          : undefined;

      const input: CreateEventPersonInput = {
        person_type: values.person_type,
        full_name: values.full_name,
        email: values.email || undefined,
        phone: values.phone || undefined,
        company: values.company || undefined,
        role_title: values.role_title || undefined,
        bio: values.bio || undefined,
        skills: skillsArray,
        notes: values.notes || undefined,
      };

      const result = await createEventPerson(input, orgId);

      if (result.success) {
        toast.success(`${values.person_type} added successfully`);
        form.reset();
        setOpen(false);
        router.refresh();
      } else {
        toast.error(result.error || "Failed to add person");
      }
    } catch (error) {
      toast.error("An error occurred while adding the person");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="rounded-full">
          <Plus className="mr-2 h-4 w-4" />
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add {personType.charAt(0).toUpperCase() + personType.slice(1)}</DialogTitle>
          <DialogDescription>
            Add a new {personType} to your event. All fields except name are optional.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="john@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="+1 (555) 123-4567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company</FormLabel>
                    <FormControl>
                      <Input placeholder="Acme Corp" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role_title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role/Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Senior Developer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief bio or description..."
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="skills"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Skills/Tags</FormLabel>
                  <FormControl>
                    <Input placeholder="React, Python, ML (comma-separated)" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter skills, tracks, or tags separated by commas
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Internal notes..."
                      className="resize-none"
                      rows={2}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add Person"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
