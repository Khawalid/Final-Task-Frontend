"use client";
import { foodCategories } from "../constants/Foods";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import { Checkbox } from "../components/ui/checkbox";
import { Button } from "../components/ui/button";
import { useRouter } from "next/navigation";

// Zod schema for form validation
const createEventSchema = z.object({
  title: z.string().min(1, { message: "Event title is required" }),
  numberOfPeople: z.preprocess(
    (val) => Number(val),
    z.number().min(1, { message: "Attendees must be at least 1" })
  ),
  budget: z.preprocess(
    (val) => Number(val),
    z.number().min(1, { message: "Budget must be at least 1" })
  ),
  foodPreferences: z
    .array(z.string())
    .min(1, { message: "Select at least one food item" }),
  photography: z.string().min(1, { message: "Select a photography package" }),
  soundSystem: z.string().min(1, { message: "Select a sound system package" }),
});

export default function CreateEvent() {
  const router = useRouter();
  const [message, setMessage] = useState("");

  const form = useForm({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      title: "",
      numberOfPeople: 0,
      budget: 0,
      foodPreferences: [], // Initialize as an array
      photography: "",
      soundSystem: "",
    },
  });

  const onSubmit = async (data) => {
    // Parsing food preferences into the correct structure
    const foodPreferences = {
      starters:
        foodCategories
          .find((category) => category.category === "Starters")
          ?.items.filter((item) => data.foodPreferences.includes(item.id))
          .map((item) => item.label) || [],
      mainDishes:
        foodCategories
          .find((category) => category.category === "Main Dishes")
          ?.items.filter((item) => data.foodPreferences.includes(item.id))
          .map((item) => item.label) || [],
      desserts:
        foodCategories
          .find((category) => category.category === "Desserts")
          ?.items.filter((item) => data.foodPreferences.includes(item.id))
          .map((item) => item.label) || [],
    };

    const parsedData = {
      numberOfPeople: data.numberOfPeople,
      foodPreferences: foodPreferences,
      photographyPackage: data.photography,
      soundSystemPackage: data.soundSystem,
      budget: data.budget,
    };

    console.log(parsedData);

    try {
      const response = await fetch("http://localhost:5000/v1/create-event", {
        method: "POST",
        body: JSON.stringify(parsedData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const result = await response.json();
        setMessage("Event created successfully!");
        // Pass the result to the package page
        router.push(
          `/package?packageData=${encodeURIComponent(JSON.stringify(result))}`
        );
      } else {
        const error = await response.json();
        setMessage(error.message || "Failed to create event budget exceeded!");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg p-8 bg-white shadow-md rounded">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Create Event
        </h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Event Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="numberOfPeople"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Attendees</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Number of Attendees"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="foodPreferences"
              render={() => (
                <FormItem>
                  <FormLabel>Food Preferences</FormLabel>
                  <div className="space-y-6">
                    {foodCategories.map((category) => (
                      <div key={category.category}>
                        <h3 className="font-semibold mb-2">
                          {category.category}
                        </h3>
                        <div className="space-y-4 ml-6">
                          {category.items.map((item) => (
                            <FormField
                              key={item.id}
                              control={form.control}
                              name="foodPreferences"
                              render={({ field }) => (
                                <FormItem className="flex items-center space-x-4">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value.includes(item.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([
                                              ...field.value,
                                              item.id,
                                            ])
                                          : field.onChange(
                                              field.value.filter(
                                                (value) => value !== item.id
                                              )
                                            );
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel>{item.label}</FormLabel>
                                </FormItem>
                              )}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="photography"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Photography Package</FormLabel>
                  <div className="space-y-4 ml-6">
                    {["Basic", "Basic Plus", "Premium"].map((label) => (
                      <FormItem
                        key={label}
                        className="flex items-center space-x-4"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value === label}
                            onCheckedChange={(checked) =>
                              field.onChange(checked ? label : "")
                            }
                          />
                        </FormControl>
                        <FormLabel>{label}</FormLabel>
                      </FormItem>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="soundSystem"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sound System Package</FormLabel>
                  <div className="space-y-4 ml-6">
                    {["Basic", "Basic Plus", "Premium"].map((label) => (
                      <FormItem
                        key={label}
                        className="flex items-center space-x-4"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value === label}
                            onCheckedChange={(checked) =>
                              field.onChange(checked ? label : "")
                            }
                          />
                        </FormControl>
                        <FormLabel>{label}</FormLabel>
                      </FormItem>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="budget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Budget</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Budget" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded"
            >
              Submit
            </Button>
          </form>
        </Form>
        {message && (
          <p
            className={`mt-6 text-center ${
              message.includes("successful") ? "text-green-500" : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
