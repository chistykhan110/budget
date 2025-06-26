"use client";
import Link from "next/link";
import Spinner from "@/components/elements/Spinner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "@/helper/client-side/validator";
import { Button } from "@/components/ui/button";
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
import { PasswordInput } from "@/components/ui/password-input";
import axiosInstance from "@/helper/client-side/axiosInstance";
import { signupApi } from "@/helper/client-side/apiEndpoint";
import { useRouter } from "next/navigation";


export default function SignupForm() {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
    },
  });
  //finding other things
  const {
    formState: { isSubmitting, errors },
    setError,
  } = form;
  ///onsubmit function
  const onSubmit = async (values) => {
    try {
      const response = await axiosInstance.post(signupApi, values);
      if (response.data.success) {
        router.push("/dashboard");
      }
    } catch (err) {
      const messageFromServer = err.response.data.message;
      setError("email", { message: messageFromServer });
    }
  };
  // handle values
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-7 w-full mx-auto py-5"
      >
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-6">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First name</FormLabel>
                  <FormControl>
                    <Input placeholder="John" type="text" {...field} />
                  </FormControl>
                  {!errors.firstName && (
                    <FormDescription>Enter your First name</FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-6">
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last name</FormLabel>
                  <FormControl>
                    <Input placeholder="Doe" type="text" {...field} />
                  </FormControl>
                  {!errors.lastName && (
                    <FormDescription>Enter your Last name</FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="email@example.com"
                  type="email"
                  {...field}
                />
              </FormControl>
              {!errors.email && (
                <FormDescription>Enter your email address</FormDescription>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder="Min 6 character." {...field} />
              </FormControl>
              {!errors.password && (
                <FormDescription>
                  Must include a number, an uppercase, a lowercase and a special
                  character
                </FormDescription>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm password</FormLabel>
              <FormControl>
                <PasswordInput placeholder="Again password" {...field} />
              </FormControl>
              {!errors.confirmPassword && (
                <FormDescription>Enter your password again</FormDescription>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={isSubmitting} className="w-full" type="submit">
          {isSubmitting ? <Spinner /> : "Create an account"}
        </Button>
      </form>
      <div className="flex justify-center items-center px-4 text-sm text-muted-foreground">
        <p>
          Already have an account?{" "}
          <Link
            href="/signin"
            className="text-primary hover:underline font-medium"
          >
            Sign in
          </Link>
        </p>
      </div>
    </Form>
  );
}
