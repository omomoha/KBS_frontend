import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Loader2, CheckCircle } from 'lucide-react'
import { cn } from '@/utils/cn'

const resetPasswordSchema = z.object({
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const [isSuccess, setIsSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  })

  const _password = watch('password')

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      return
    }

    try {
      setIsLoading(true)
      console.log('Resetting password for token:', token)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      setIsSuccess(true)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="card">
        <div className="card-content text-center">
          <h2 className="text-2xl font-semibold text-error-600 mb-2">
            Invalid Reset Link
          </h2>
          <p className="text-secondary-600 mb-6">
            This password reset link is invalid or has expired. Please request a new one.
          </p>
          <Link
            to="/auth/forgot-password"
            className="btn btn-primary btn-lg w-full"
          >
            Request New Reset Link
          </Link>
        </div>
      </div>
    )
  }

  if (isSuccess) {
    return (
      <div className="card">
        <div className="card-content text-center">
          <CheckCircle className="h-16 w-16 text-success-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-secondary-900 mb-2">
            Password Reset Successfully!
          </h2>
          <p className="text-secondary-600 mb-6">
            Your password has been updated. You can now sign in with your new password.
          </p>
          <Link
            to="/auth/login"
            className="btn btn-primary btn-lg w-full"
          >
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Reset your password</h2>
        <p className="card-description">
          Enter your new password below. Make sure it's strong and secure.
        </p>
      </div>
      <div className="card-content">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-secondary-700 mb-1">
              New password
            </label>
            <div className="relative">
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="new-password"
                className={cn(
                  'input pr-10',
                  errors.password && 'border-error-300 focus:ring-error-500 focus:border-error-500'
                )}
                placeholder="Enter your new password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-secondary-400" />
                ) : (
                  <Eye className="h-5 w-5 text-secondary-400" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-error-600">{errors.password.message}</p>
            )}
            <div className="mt-2 text-xs text-secondary-500">
              Must be at least 8 characters with uppercase, lowercase, and number
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-secondary-700 mb-1">
              Confirm new password
            </label>
            <div className="relative">
              <input
                {...register('confirmPassword')}
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                autoComplete="new-password"
                className={cn(
                  'input pr-10',
                  errors.confirmPassword && 'border-error-300 focus:ring-error-500 focus:border-error-500'
                )}
                placeholder="Confirm your new password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5 text-secondary-400" />
                ) : (
                  <Eye className="h-5 w-5 text-secondary-400" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-error-600">{errors.confirmPassword.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary btn-lg w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Updating password...
              </>
            ) : (
              'Update password'
            )}
          </button>
        </form>

        <div className="mt-6">
          <Link
            to="/auth/login"
            className="btn btn-ghost btn-md w-full"
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}
