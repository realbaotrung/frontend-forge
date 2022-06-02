import { Button } from "antd";
import { useCallback } from "react";

export default function ViewErrorDoor() {

  const showGroupDoorAtCurrentLevel = useCallback(() => {
    console.log('hello from here...')
  }, [])

  return (
    <Button onClick={showGroupDoorAtCurrentLevel}>Show error doors</Button>
  )
}