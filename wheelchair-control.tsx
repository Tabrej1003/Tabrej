"use client"

import { useState, useEffect } from "react"
import {
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Bluetooth,
  BluetoothOff,
  Battery,
  AlertCircle,
  Power,
  Gauge,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"

export default function WheelchairControl() {
  const [isConnected, setIsConnected] = useState(false)
  const [batteryLevel, setBatteryLevel] = useState(100)
  const [speed, setSpeed] = useState(50)
  const [movement, setMovement] = useState<string | null>(null)
  const [isPoweredOn, setIsPoweredOn] = useState(false)
  const [emergencyStop, setEmergencyStop] = useState(false)

  // Simulate battery drain
  useEffect(() => {
    if (isPoweredOn && !emergencyStop) {
      const interval = setInterval(() => {
        setBatteryLevel((prev) => Math.max(0, prev - 0.1))
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [isPoweredOn, emergencyStop])

  // Simulate Bluetooth connection
  const toggleConnection = () => {
    if (!isPoweredOn) return
    setIsConnected(!isConnected)
  }

  // Handle movement controls
  const handleMove = (direction: string) => {
    if (!isConnected || !isPoweredOn || emergencyStop) return
    setMovement(direction)
  }

  const stopMovement = () => {
    setMovement(null)
  }

  // Handle emergency stop
  const toggleEmergencyStop = () => {
    setEmergencyStop(!emergencyStop)
    setMovement(null)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
      <Card className="w-full max-w-2xl p-6 space-y-8">
        {/* Header Section */}
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Wheelchair Control System</h2>
            <p className="text-muted-foreground">Arduino-based Remote Control</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={isPoweredOn ? "default" : "secondary"}
              size="icon"
              onClick={() => setIsPoweredOn(!isPoweredOn)}
            >
              <Power className={isPoweredOn ? "text-green-500" : "text-gray-500"} />
            </Button>
            <Button
              variant={isConnected ? "default" : "secondary"}
              size="icon"
              onClick={toggleConnection}
              disabled={!isPoweredOn}
            >
              {isConnected ? <Bluetooth /> : <BluetoothOff />}
            </Button>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <Badge variant={isConnected ? "default" : "secondary"}>{isConnected ? "Connected" : "Disconnected"}</Badge>
            <Badge
              variant={emergencyStop ? "destructive" : "secondary"}
              className={emergencyStop ? "animate-pulse" : ""}
            >
              {emergencyStop ? "EMERGENCY STOP" : "Ready"}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Battery
              className={`
              ${batteryLevel > 50 ? "text-green-500" : ""}
              ${batteryLevel <= 50 && batteryLevel > 20 ? "text-yellow-500" : ""}
              ${batteryLevel <= 20 ? "text-red-500" : ""}
            `}
            />
            <span className="text-sm font-medium">{Math.round(batteryLevel)}%</span>
          </div>
        </div>

        {/* Wheelchair Visualization */}
        <div className="relative h-64 border-2 rounded-lg overflow-hidden bg-gray-50">
          <div
            className={`
              absolute w-32 h-40 bg-blue-500 rounded-lg left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2
              transition-transform duration-300
              ${movement === "forward" ? "-translate-y-[60%]" : ""}
              ${movement === "backward" ? "-translate-y-[40%]" : ""}
              ${movement === "left" ? "-translate-x-[60%]" : ""}
              ${movement === "right" ? "-translate-x-[40%]" : ""}
            `}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-20 bg-blue-600 rounded-t-full" />
            </div>
          </div>
        </div>

        {/* Speed Control */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Gauge className="w-5 h-5" />
            <span className="font-medium">Speed Control</span>
          </div>
          <Slider
            value={[speed]}
            onValueChange={(value) => setSpeed(value[0])}
            max={100}
            step={1}
            disabled={!isPoweredOn || !isConnected || emergencyStop}
          />
          <div className="text-right text-sm text-muted-foreground">{speed}%</div>
        </div>

        {/* Control Pad */}
        <div className="grid grid-cols-3 gap-2 max-w-[240px] mx-auto">
          <div />
          <Button
            variant="outline"
            size="icon"
            className="h-12 w-12"
            onMouseDown={() => handleMove("forward")}
            onMouseUp={stopMovement}
            onMouseLeave={stopMovement}
            disabled={!isPoweredOn || !isConnected || emergencyStop}
          >
            <ArrowUp />
          </Button>
          <div />
          <Button
            variant="outline"
            size="icon"
            className="h-12 w-12"
            onMouseDown={() => handleMove("left")}
            onMouseUp={stopMovement}
            onMouseLeave={stopMovement}
            disabled={!isPoweredOn || !isConnected || emergencyStop}
          >
            <ArrowLeft />
          </Button>
          <Button
            variant="destructive"
            size="icon"
            className="h-12 w-12"
            onClick={toggleEmergencyStop}
            disabled={!isPoweredOn}
          >
            <AlertCircle />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-12 w-12"
            onMouseDown={() => handleMove("right")}
            onMouseUp={stopMovement}
            onMouseLeave={stopMovement}
            disabled={!isPoweredOn || !isConnected || emergencyStop}
          >
            <ArrowRight />
          </Button>
          <div />
          <Button
            variant="outline"
            size="icon"
            className="h-12 w-12"
            onMouseDown={() => handleMove("backward")}
            onMouseUp={stopMovement}
            onMouseLeave={stopMovement}
            disabled={!isPoweredOn || !isConnected || emergencyStop}
          >
            <ArrowDown />
          </Button>
          <div />
        </div>
      </Card>
    </div>
  )
}

