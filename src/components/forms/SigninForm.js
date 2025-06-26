"use client";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signinSchema } from "@/helper/client-side/validator";
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
import { signinApi } from "@/helper/client-side/apiEndpoint";
import Spinner from "@/components/elements/Spinner";
import { useRouter } from "next/navigation";

//cookie reading
function getCookie(name) {
  const cookies = document.cookie.split("; ");
  const cookie = cookies.find((c) => c.startsWith(name + "="));
  return cookie ? decodeURIComponent(cookie.split("=")[1]) : null;
}

export default function SigninForm() {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: "",
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
      const cookieName = `suspended-${encodeURIComponent(values.email.trim())}`;
      const suspendedTill = getCookie(cookieName);
      if (!suspendedTill) {
        const response = await axiosInstance.post(signinApi, values);
        if (response.data.success) {
          router.push("/dashboard");
        }
        return;
      }
      //Not sending request handling using frontend
      const msRemaining = new Date(Number(suspendedTill)) - new Date();
      const mins = Math.floor(msRemaining / 60000);
      const secs = Math.floor((msRemaining % 60000) / 1000);
      setError("password", {
        message: `Too many attempts. Try again in ${mins} minute(s) and ${secs} second(s).`,
      });
      //Not sending request handling using frontend
    } catch (err) {
      setError(err.response.data.code, { message: err.response.data.message });
    }
  };
  // handle values
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-7 w-full mx-auto py-5 "
      >
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
              <div>
                <FormLabel>Password</FormLabel>
              </div>
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
        <Button disabled={isSubmitting} className="w-full" type="submit">
          {isSubmitting ? <Spinner /> : "Sign in to your account"}
        </Button>
      </form>
      <div className="flex justify-between items-center px-4 text-sm text-muted-foreground">
        <p>
          <Link
            href="/signup"
            className="text-primary hover:underline font-medium"
          >
            Create an account
          </Link>
        </p>

        <Link
          href="/reset-password"
          className="text-primary hover:underline font-medium"
        >
          Forgot password?
        </Link>
      </div>
    </Form>
  );
}
