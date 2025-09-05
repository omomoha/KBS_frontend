import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Video, Mic, MicOff, VideoOff, Phone, Users, Calendar, Clock } from 'lucide-react'
import { cn } from '@/utils/cn'

interface VideoConferenceProps {
  meetingId: string
  meetingTitle: string
  startTime: string
  endTime: string
  joinUrl: string
  password?: string
  provider: 'zoom' | 'teams' | 'google'
  onJoin?: () => void
  onLeave?: () => void
  className?: string
}

export function VideoConference({
  meetingId,
  meetingTitle,
  startTime,
  endTime,
  joinUrl,
  password,
  provider,
  onJoin,
  onLeave,
  className
}: VideoConferenceProps) {
  const [isJoined, setIsJoined] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [isVideoOn, setIsVideoOn] = useState(false)
  const [participants, setParticipants] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState('')
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (isJoined) {
      // Simulate participant count updates
      const interval = setInterval(() => {
        setParticipants(prev => prev + Math.floor(Math.random() * 3) - 1)
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [isJoined])

  useEffect(() => {
    if (isJoined) {
      // Calculate time remaining
      const end = new Date(endTime).getTime()
      const now = new Date().getTime()
      const remaining = end - now

      if (remaining > 0) {
        const hours = Math.floor(remaining / (1000 * 60 * 60))
        const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60))
        setTimeRemaining(`${hours}h ${minutes}m`)
      } else {
        setTimeRemaining('Meeting ended')
      }
    }
  }, [isJoined, endTime])

  const handleJoin = () => {
    setIsJoined(true)
    onJoin?.()
  }

  const handleLeave = () => {
    setIsJoined(false)
    setIsMuted(true)
    setIsVideoOn(false)
    onLeave?.()
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn)
  }

  const getProviderIcon = () => {
    switch (provider) {
      case 'zoom':
        return '🔵'
      case 'teams':
        return '🔷'
      case 'google':
        return '🔴'
      default:
        return '📹'
    }
  }

  const getProviderName = () => {
    switch (provider) {
      case 'zoom':
        return 'Zoom'
      case 'teams':
        return 'Microsoft Teams'
      case 'google':
        return 'Google Meet'
      default:
        return 'Video Conference'
    }
  }

  if (!isJoined) {
    return (
      <Card className={cn('w-full max-w-md', className)}>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span className="text-2xl">{getProviderIcon()}</span>
            <span>{getProviderName()}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg">{meetingTitle}</h3>
            <div className="flex items-center space-x-4 text-sm text-secondary-600 mt-2">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{new Date(startTime).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{new Date(startTime).toLocaleTimeString()}</span>
              </div>
            </div>
          </div>

          {password && (
            <div className="bg-secondary-50 p-3 rounded-lg">
              <p className="text-sm font-medium">Meeting Password:</p>
              <p className="text-lg font-mono">{password}</p>
            </div>
          )}

          <div className="flex space-x-2">
            <Button onClick={handleJoin} className="flex-1">
              <Video className="h-4 w-4 mr-2" />
              Join Meeting
            </Button>
            <Button variant="outline" onClick={() => window.open(joinUrl, '_blank')}>
              Open in App
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <span className="text-2xl">{getProviderIcon()}</span>
            <span>{meetingTitle}</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="flex items-center space-x-1">
              <Users className="h-3 w-3" />
              <span>{participants}</span>
            </Badge>
            <Badge variant="outline" className="flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>{timeRemaining}</span>
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Video Area */}
        <div className="relative bg-black rounded-lg aspect-video flex items-center justify-center">
          {isVideoOn ? (
            <video
              ref={videoRef}
              className="w-full h-full object-cover rounded-lg"
              autoPlay
              muted={isMuted}
            />
          ) : (
            <div className="text-center text-white">
              <VideoOff className="h-16 w-16 mx-auto mb-2" />
              <p>Camera is off</p>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center space-x-4">
          <Button
            variant={isMuted ? "destructive" : "outline"}
            size="lg"
            onClick={toggleMute}
            className="rounded-full w-12 h-12"
          >
            {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </Button>

          <Button
            variant={isVideoOn ? "outline" : "destructive"}
            size="lg"
            onClick={toggleVideo}
            className="rounded-full w-12 h-12"
          >
            {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
          </Button>

          <Button
            variant="destructive"
            size="lg"
            onClick={handleLeave}
            className="rounded-full w-12 h-12"
          >
            <Phone className="h-5 w-5" />
          </Button>
        </div>

        {/* Meeting Info */}
        <div className="text-center text-sm text-secondary-600">
          <p>Meeting ID: {meetingId}</p>
          {password && <p>Password: {password}</p>}
        </div>
      </CardContent>
    </Card>
  )
}
