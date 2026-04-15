import { Link, useNavigate } from "react-router"

import { cn } from "@/lib/utils"
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
import { z } from "zod"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema } from "@/zod/auth"
import { useAuthLogin } from "@/hooks/api/use-auth"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { mutate: login, isPending } = useAuthLogin();
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    }
  });

  function onSubmit(data: z.infer<typeof loginSchema>) {
    login({
      data: data, callback: () => {
        navigate("/dashboard");
      }
    });
  }

  const { isValid, isDirty } = form.formState;
  const filledFieldsCount = Object.values(form.getValues()).filter(Boolean).length;

  const isSubmitDisabled = isPending || !isValid || !isDirty || filledFieldsCount !== 2;

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
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
                    <Input autoComplete="current-password" id="password" type="password" required {...field} />
                    <FieldError
                      errors={[form.formState.errors.password]}
                    />
                  </Field>
                )}
              />
              <Button disabled={isSubmitDisabled} type="submit">{isPending ? "Logging in..." : "Login"}</Button>
              <FieldDescription className="px-6 text-center">
                Don&apos;t have an account? <Link to="/register">Sign up</Link>
              </FieldDescription>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
