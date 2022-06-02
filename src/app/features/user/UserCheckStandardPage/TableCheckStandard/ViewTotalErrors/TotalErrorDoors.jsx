import { Button } from "antd"
import { useCallback } from "react"

export default function TotalErrorDoors() {
  const showAllErrorOnViewer = useCallback(() => {
    console.log('hello from here...')
  }, [])

  return (
    <Button onClick={showAllErrorOnViewer}>Show all errors</Button>
  )
}