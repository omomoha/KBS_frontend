import { Outlet } from 'react-router-dom'
import { GraduationCap } from 'lucide-react'

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-100">
      <div className="flex min-h-screen">
        {/* Left side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 to-primary-800 text-white">
          <div className="flex flex-col justify-center px-12">
            <div className="flex items-center mb-8">
              <GraduationCap className="h-12 w-12 mr-4" />
              <div>
                <h1 className="text-3xl font-bold">KBS LMS</h1>
                <p className="text-primary-100">Kaduna Business School</p>
              </div>
            </div>
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">
                Welcome to the Future of Learning
              </h2>
              <p className="text-primary-100 text-lg leading-relaxed">
                Access your courses, submit assignments, track your progress, and earn
                certificates all in one place. Join thousands of students already
                advancing their careers with KBS.
              </p>
              <div className="grid grid-cols-2 gap-6 mt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold">1000+</div>
                  <div className="text-primary-200">Students</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">50+</div>
                  <div className="text-primary-200">Courses</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">95%</div>
                  <div className="text-primary-200">Success Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">24/7</div>
                  <div className="text-primary-200">Support</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Auth Form */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            {/* Mobile branding */}
            <div className="lg:hidden text-center">
              <div className="flex items-center justify-center mb-4">
                <GraduationCap className="h-10 w-10 text-primary-600 mr-3" />
                <div>
                  <h1 className="text-2xl font-bold text-secondary-900">KBS LMS</h1>
                  <p className="text-secondary-600">Kaduna Business School</p>
                </div>
              </div>
            </div>

            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}
