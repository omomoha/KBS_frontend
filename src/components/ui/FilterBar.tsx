import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Search, Filter, X, ChevronDown } from 'lucide-react'

export interface FilterOption {
  value: string
  label: string
  count?: number
}

export interface FilterConfig {
  key: string
  label: string
  type: 'select' | 'multiselect' | 'date' | 'dateRange' | 'search'
  options?: FilterOption[]
  placeholder?: string
  fromKey?: string
  toKey?: string
}

interface FilterBarProps {
  filters: FilterConfig[]
  onFiltersChange: (filters: Record<string, any>) => void
  searchPlaceholder?: string
  className?: string
}

export function FilterBar({ 
  filters, 
  onFiltersChange, 
  searchPlaceholder = "Search...",
  className = ""
}: FilterBarProps) {
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({})
  const [showAdvanced, setShowAdvanced] = useState(false)

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...activeFilters, [key]: value }
    setActiveFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const clearFilter = (key: string) => {
    const newFilters = { ...activeFilters }
    delete newFilters[key]
    setActiveFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const clearAllFilters = () => {
    setActiveFilters({})
    onFiltersChange({})
  }

  const getActiveFilterCount = () => {
    return Object.keys(activeFilters).filter(key => {
      const value = activeFilters[key]
      if (Array.isArray(value)) return value.length > 0
      return value !== '' && value !== null && value !== undefined
    }).length
  }

  const renderFilter = (filter: FilterConfig) => {
    const value = activeFilters[filter.key] || (filter.type === 'multiselect' ? [] : '')

    switch (filter.type) {
      case 'search':
        return (
          <div key={filter.key} className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-secondary-400" />
              <Input
                placeholder={filter.placeholder || searchPlaceholder}
                value={value}
                onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        )

      case 'select':
        return (
          <div key={filter.key} className="sm:w-48">
            <select
              value={value}
              onChange={(e) => handleFilterChange(filter.key, e.target.value)}
              className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">{filter.placeholder || `All ${filter.label}`}</option>
              {filter.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label} {option.count !== undefined && `(${option.count})`}
                </option>
              ))}
            </select>
          </div>
        )

      case 'multiselect':
        return (
          <div key={filter.key} className="sm:w-48">
            <div className="relative">
              <select
                multiple
                value={value}
                onChange={(e) => {
                  const selectedValues = Array.from(e.target.selectedOptions, option => option.value)
                  handleFilterChange(filter.key, selectedValues)
                }}
                className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                size={3}
              >
                {filter.options?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label} {option.count !== undefined && `(${option.count})`}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )

      case 'date':
        return (
          <div key={filter.key} className="sm:w-48">
            <Input
              type="date"
              value={value}
              onChange={(e) => handleFilterChange(filter.key, e.target.value)}
              className="w-full"
            />
          </div>
        )

      case 'dateRange':
        return (
          <div key={filter.key} className="sm:w-64">
            <div className="flex gap-2">
              <Input
                type="date"
                placeholder="From"
                value={value?.from || ''}
                onChange={(e) => handleFilterChange(filter.key, { ...value, from: e.target.value })}
                className="flex-1"
              />
              <Input
                type="date"
                placeholder="To"
                value={value?.to || ''}
                onChange={(e) => handleFilterChange(filter.key, { ...value, to: e.target.value })}
                className="flex-1"
              />
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
            {getActiveFilterCount() > 0 && (
              <Badge variant="secondary">{getActiveFilterCount()}</Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            {getActiveFilterCount() > 0 && (
              <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                Clear All
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              <ChevronDown className={`h-4 w-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
              Advanced
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {/* Basic filters - always visible */}
          <div className="flex flex-col sm:flex-row gap-4">
            {filters.filter(f => f.type === 'search' || f.type === 'select').map(renderFilter)}
          </div>

          {/* Advanced filters - collapsible */}
          {showAdvanced && (
            <div className="space-y-4 pt-4 border-t">
              <div className="flex flex-col sm:flex-row gap-4">
                {filters.filter(f => f.type !== 'search' && f.type !== 'select').map(renderFilter)}
              </div>
            </div>
          )}

          {/* Active filters display */}
          {getActiveFilterCount() > 0 && (
            <div className="flex flex-wrap gap-2 pt-4 border-t">
              {Object.entries(activeFilters).map(([key, value]) => {
                const filter = filters.find(f => f.key === key)
                if (!filter || (!value || (Array.isArray(value) && value.length === 0))) return null

                const displayValue = Array.isArray(value) 
                  ? value.map(v => filter.options?.find(o => o.value === v)?.label || v).join(', ')
                  : filter.options?.find(o => o.value === value)?.label || value

                return (
                  <Badge key={key} variant="secondary" className="flex items-center gap-1">
                    <span className="text-xs">
                      {filter.label}: {displayValue}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-transparent"
                      onClick={() => clearFilter(key)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
