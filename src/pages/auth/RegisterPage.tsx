import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '@/contexts/AuthContext'
import { Eye, EyeOff, Loader2, CheckCircle } from 'lucide-react'
import { cn } from '@/utils/cn'

const registerSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  confirmPassword: z.string(),
  role: z.enum(['learner', 'instructor'], {
    required_error: 'Please select a role',
  }),
  terms: z.boolean().refine(val => val === true, 'You must accept the terms and conditions'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type RegisterFormData = z.infer<typeof registerSchema>

export function RegisterPage() {
  const { error, clearError } = useAuth()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const _password = watch('password')

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true)
      clearError()
      console.log('Registering user:', data.email, data.role)
      // Note: In a real app, you'd call the register function from auth context
      // await register(data)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      setIsSuccess(true)
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/auth/login')
      }, 3000)
    } catch (error) {
      // Error is handled by the auth context
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="card">
        <div className="card-content text-center">
          <CheckCircle className="h-16 w-16 text-success-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-secondary-900 mb-2">
            Account Created Successfully!
          </h2>
          <p className="text-secondary-600 mb-6">
            Your account has been created. You will be redirected to the login page shortly.
          </p>
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-secondary-200 border-t-primary-600 mx-auto"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Create your account</h2>
        <p className="card-description">
          Join thousands of students advancing their careers with KBS
        </p>
      </div>
      <div className="card-content">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <div className="alert alert-error">
              <div className="text-sm">{error}</div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-secondary-700 mb-1">
                First name
              </label>
              <input
                {...register('firstName')}
                type="text"
                id="firstName"
                autoComplete="given-name"
                className={cn(
                  'input',
                  errors.firstName && 'border-error-300 focus:ring-error-500 focus:border-error-500'
                )}
                placeholder="John"
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-error-600">{errors.firstName.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-secondary-700 mb-1">
                Last name
              </label>
              <input
                {...register('lastName')}
                type="text"
                id="lastName"
                autoComplete="family-name"
                className={cn(
                  'input',
                  errors.lastName && 'border-error-300 focus:ring-error-500 focus:border-error-500'
                )}
                placeholder="Doe"
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-error-600">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-secondary-700 mb-1">
              Email address
            </label>
            <input
              {...register('email')}
              type="email"
              id="email"
              autoComplete="email"
              className={cn(
                'input',
                errors.email && 'border-error-300 focus:ring-error-500 focus:border-error-500'
              )}
              placeholder="john.doe@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-error-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-secondary-700 mb-1">
              I am a
            </label>
            <select
              {...register('role')}
              id="role"
              className={cn(
                'input',
                errors.role && 'border-error-300 focus:ring-error-500 focus:border-error-500'
              )}
            >
              <option value="">Select your role</option>
              <option value="learner">Student/Learner</option>
              <option value="instructor">Instructor</option>
            </select>
            {errors.role && (
              <p className="mt-1 text-sm text-error-600">{errors.role.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-secondary-700 mb-1">
              Password
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
                placeholder="Create a strong password"
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
              Confirm password
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
                placeholder="Confirm your password"
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

          <div className="flex items-start">
            <input
              {...register('terms')}
              id="terms"
              type="checkbox"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded mt-1"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-secondary-700">
              I agree to the{' '}
              <Link to="/terms" className="text-primary-600 hover:text-primary-500">
                Terms and Conditions
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-primary-600 hover:text-primary-500">
                Privacy Policy
              </Link>
            </label>
          </div>
          {errors.terms && (
            <p className="text-sm text-error-600">{errors.terms.message}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary btn-lg w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating account...
              </>
            ) : (
              'Create account'
            )}
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-secondary-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-secondary-500">Already have an account?</span>
            </div>
          </div>

          <div className="mt-6">
            <Link
              to="/auth/login"
              className="btn btn-outline btn-lg w-full"
            >
              Sign in instead
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
