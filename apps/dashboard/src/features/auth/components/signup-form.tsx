import { Button } from "@dv/ui/components/button"
import { Input } from "@dv/ui/components/input"
import { Label } from "@dv/ui/components/label"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate } from "@tanstack/react-router"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import * as m from "@/paraglide/messages.js"

import { authClient } from "../auth-client"

const signupSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  password: z.string().min(8),
})

export function SignupForm() {
  const navigate = useNavigate()
  const [serverError, setServerError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(signupSchema) })

  const onSubmit = handleSubmit(async ({ name, email, password }) => {
    setServerError(null)
    const { error } = await authClient.signUp.email({ name, email, password })
    if (error) {
      setServerError(error.message ?? null)
      return
    }
    await navigate({ to: "/verify-email" })
  })

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name">{m.signupNameLabel()}</Label>
        <Input id="name" autoComplete="name" {...register("name")} />
        {errors.name && (
          <p className="text-xs text-destructive">{errors.name.message}</p>
        )}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">{m.signupEmailLabel()}</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-xs text-destructive">{errors.email.message}</p>
        )}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="password">{m.signupPasswordLabel()}</Label>
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          {...register("password")}
        />
        {errors.password && (
          <p className="text-xs text-destructive">{errors.password.message}</p>
        )}
      </div>
      {serverError && <p className="text-xs text-destructive">{serverError}</p>}
      <Button type="submit" disabled={isSubmitting} className="mt-2 w-full">
        {isSubmitting ? m.commonLoading() : m.signupSubmit()}
      </Button>
    </form>
  )
}
