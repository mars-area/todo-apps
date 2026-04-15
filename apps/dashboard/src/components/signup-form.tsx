import { Link, useNavigate } from "react-router"
import { z } from "zod"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signupSchema } from "@/zod/auth"

import { useAuthSignup } from "@/hooks/api/use-auth"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const { mutate: signup, isPending } = useAuthSignup();
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    }
  });

  function onSubmit(data: z.infer<typeof signupSchema>) {
    const signupData = {
      name: data.name,
      email: data.email,
      password: data.password,
    };
    signup({
      data: signupData, callback: () => {
        navigate("/sign-in");
      }
    });
  }

  const { isValid, isDirty } = form.formState;
  const filledFieldsCount = Object.values(form.getValues()).filter(Boolean).length;

  const isSubmitDisabled = isPending || !isValid || !isDirty || filledFieldsCount !== 4;

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your information below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel htmlFor="name">Full Name</FieldLabel>
                  <Input autoComplete="name" id="name" type="text" placeholder="John Doe" required {...field} />
                  <FieldError
                    errors={[form.formState.errors.name]}
                  />
                </Field>
              )}
            />
            <Controller
              name="email"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input autoComplete="email" id="email" type="email" placeholder="m@example.com" required {...field} />
                  <FieldError
                    errors={[form.formState.errors.email]}
                  />
                </Field>
              )}
            />
            <Controller
              name="password"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Input autoComplete="new-password" id="password" type="password" placeholder="********" required {...field} />
                  <FieldError
                    errors={[form.formState.errors.password]}
                  />
                </Field>
              )}
            />
            <Controller
              name="confirmPassword"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
                  <Input autoComplete="new-password" id="confirmPassword" type="password" placeholder="********" required {...field} />
                  <FieldError
                    errors={[form.formState.errors.confirmPassword]}
                  />
                </Field>
              )}
            />
            <FieldGroup>
              <Field>
                <Button disabled={isSubmitDisabled} type="submit">{isPending ? "Creating account..." : "Create Account"}</Button>
              </Field>
              <FieldDescription className="px-6 text-center">
                Already have an account? <Link to="/sign-in">Sign in</Link>
              </FieldDescription>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
